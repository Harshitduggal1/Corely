/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import CustomLoader from "../CustomLoader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { VideoDataContext } from "./videoDataContext";
import { useUser } from "@clerk/nextjs";
import { insertVideo } from "@/configs/queries";
import PlayerDialog from "@/app/_components/PlayerDialog";

const FormDataSchema = z.object({
  topic: z.string().optional(),
  duration: z.string().optional(),
  imageStyle: z.string().optional(),
});
const VideoScriptSchema = z.array(
  z.object({ imagePrompt: z.string(), contextText: z.string() })
);
const AudioFileUrlSchema = z.string();
const CaptionSchema = z.array(
  z.object({
    text: z.string(),
    start: z.number(),
    end: z.number(),
    confidence: z.number(),
    speaker: z.string().nullable(),
  })
);
const ImageListSchema = z.array(z.string());

type VideoScript = z.infer<typeof VideoScriptSchema>;
type FormDataType = z.infer<typeof FormDataSchema>;
type AudioFileUrl = z.infer<typeof AudioFileUrlSchema>;
type Caption = z.infer<typeof CaptionSchema>;
type ImageList = z.infer<typeof ImageListSchema>;

export type VideoDataType = {
  id: number;
  script: VideoScript;
  audioFileUrl: AudioFileUrl;
  captions: Caption;
  imageList: ImageList;
  createdBy?: string;
};

export default function CreateNew() {
  const { user } = useUser();

  const [selectedOption, setSelectedOption] = useState("Custom Prompt");
  const [formData, setFormData] = useState<FormDataType>({});
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("15 Seconds");
  const [isLoading, setIsLoading] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [captions, setCaptions] = useState<Caption | null>(null);
  const [images, setImages] = useState<ImageList | null>(null);

  const { videoData, setVideoData } = useContext(VideoDataContext) as {
    videoData: VideoDataType | null;
    setVideoData: React.Dispatch<React.SetStateAction<VideoDataType | null>>;
  };

  const options = [
    "Custom Prompt",
    "Random AI Story",
    "Scary Story",
    "Historical Facts",
    "Bed Time Story",
    "Motivational",
    "Fun Facts",
  ];

  const styleOptions = [
    {
      name: "Realistic",
      image: "/realistic.webp",
    },
    {
      name: "Cartoon",
      image: "/cartoon.jpeg",
    },
    {
      name: "Comic",
      image: "/comic.jpeg",
    },
    {
      name: "Watercolor",
      image: "/watercolor.jpeg",
    },
    {
      name: "GTA",
      image: "/gta.jpeg",
    },
  ];

  const saveVideoData = async (videoData: VideoDataType) => {
    try {
      setIsLoading(true);
      const res = await insertVideo(videoData, user?.emailAddresses[0]?.emailAddress || '');

      if (Array.isArray(res) && res.length > 0 && 'id' in res[0]) {
        setVideoId(res[0].id);
        setPlayVideo(true);
      } else {
        console.error('Unexpected response format from insertVideo');
      }
    } catch (e) {
      console.error('Error inserting video:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("videoData", videoData);
    if (videoData && Object.keys(videoData).length === 4)
      saveVideoData(videoData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoData]);

  const onHandleInputChange = (fieldName: string, fieldValue: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const GetVideoScript = async (): Promise<VideoScript> => {
    const prompt = `write a script to generate a ${formData.duration} video on topic: ${formData.topic} along with an AI image prompt in realistic format for each scene and give me the result in JSON format with image prompt in ${formData.imageStyle} and ContextText as field, no plain text`;

    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/get-video-script", {
          method: "POST",
          body: JSON.stringify({
            prompt,
          }),
        });
        const data = await res.json();
        const validatedVideoScript = VideoScriptSchema.parse(data.result);
        setVideoData((prev) => prev ? ({
          ...prev,
          script: validatedVideoScript,
        }) : null);
        resolve(validatedVideoScript);
      } catch (e) {
        console.log("error", e);
        reject(e);
      }
    });
  };

  const GenerateAudioFile = async (
    videoScript: VideoScript
  ): Promise<AudioFileUrl> => {
    let script = "";
    const id = uuidv4();
    videoScript?.forEach((item) => {
      script += `${item.contextText} `;
    });

    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/generate-audio", {
          method: "POST",
          body: JSON.stringify({
            text: script,
            id,
          }),
        });
        const data = await res.json();
        const audioFileUrl = AudioFileUrlSchema.parse(data.result);
        setVideoData((prev) => prev ? ({
          ...prev,
          audioFileUrl,
        }) : null);
        resolve(audioFileUrl);
      } catch (e) {
        console.log("error", e);
        reject(e);
      }
    });
  };

  const GenerateAudioCaptions = async (
    audioFileUrl: string
  ): Promise<Caption> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/generate-caption", {
          method: "POST",
          body: JSON.stringify({
            audioFileUrl,
          }),
        });
        const data = await res.json();
        const captions = CaptionSchema.parse(data.result);
        setVideoData((prev) => prev ? ({
          ...prev,
          captions,
        }) : null);
        setCaptions(captions); // Store captions in state
        resolve(captions);
      } catch (e) {
        console.log("error", e);
        reject(e);
      }
    });
  };

  const GenerateImages = (videoScript: VideoScript): Promise<ImageList> => {
    return new Promise(async (resolve, reject) => {
      const promises: Promise<Response>[] = [];
      try {
        videoScript?.forEach(async (element) => {
          promises.push(
            fetch("/api/generate-image", {
              method: "POST",
              body: JSON.stringify({
                prompt: element?.imagePrompt,
              }),
            })
          );
        });
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map((res) => res.json()));
        const imageList = ImageListSchema.parse(data.map((d) => d.result));

        setVideoData((prev) => prev ? ({
          ...prev,
          imageList,
        }) : null);
        setImages(imageList); // Store images in state
        resolve(imageList);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  };

  return (
    <div className="bg-transparent p-12 w-full">
      <h2 className="mb-8 font-bold text-6xl text-center text-white">Create New</h2>
      <div className="flex flex-col gap-8">
        <div className="space-y-16 mx-auto max-w-4xl">
          {/* Content */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 shadow-2xl hover:shadow-purple-500/20 p-8 rounded-3xl transform transition-all duration-500 hover:scale-105">
            <h2 className="bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 font-extrabold text-4xl text-transparent">Content</h2>
            <p className="mb-6 text-blue-200 text-lg">Whats the topic of your video?</p>
            <Select
              onValueChange={(value) => {
                setSelectedOption(value);
                if (value !== "CustomPrompt") onHandleInputChange("topic", value);
              }}
            >
              <SelectTrigger className="border-2 border-pink-500/30 bg-gradient-to-r from-blue-800/50 to-purple-800/50 p-4 rounded-xl focus:ring-4 focus:ring-purple-500/30 w-full text-lg transition-all duration-300">
                <SelectValue placeholder="Choose your content type" />
              </SelectTrigger>
              <SelectContent className="border-2 border-pink-500/30 bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-lg rounded-xl">
                {options.map((option, idx) => (
                  <SelectItem key={idx} value={option} className="hover:bg-gradient-to-r hover:from-blue-700/50 hover:to-purple-700/50 p-3 rounded-lg transition-all duration-300">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedOption === "Custom Prompt" && (
              <Textarea
                className="border-2 border-pink-500/30 bg-gradient-to-r from-blue-800/30 to-purple-800/30 mt-6 p-4 rounded-xl focus:ring-4 focus:ring-purple-500/30 w-full text-lg transition-all duration-300 placeholder-blue-300"
                placeholder="Describe your video concept..."
                onChange={(e) => onHandleInputChange("topic", e.target.value)}
              />
            )}
          </div>

          {/* Style */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-2xl hover:shadow-pink-500/20 p-8 rounded-3xl transform transition-all duration-500 hover:scale-105">
            <h2 className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6 font-extrabold text-4xl text-transparent">Style</h2>
            <p className="mb-6 text-lg text-purple-200">Choose your videos visual aesthetic</p>
            <div className="gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {styleOptions.map((item, idx) => (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                    selectedStyle === item.name ? "ring-4 ring-pink-500 shadow-lg shadow-pink-500/50" : "hover:shadow-lg hover:shadow-purple-500/30"
                  }`}
                  onClick={() => {
                    setSelectedStyle(item.name);
                    onHandleInputChange("imageStyle", item.name);
                  }}
                >
                  <Image
                    src={item.image}
                    width={200}
                    height={200}
                    alt={item.name}
                    className="group-hover:scale-110 w-full h-48 transition-all duration-500 object-cover"
                  />
                  <div className="absolute inset-0 flex justify-center items-end bg-gradient-to-t from-purple-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="p-4 font-semibold text-lg text-white">{item.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="bg-gradient-to-br from-pink-900/30 to-blue-900/30 shadow-2xl hover:shadow-blue-500/20 p-8 rounded-3xl transform transition-all duration-500 hover:scale-105">
            <h2 className="bg-clip-text bg-gradient-to-r from-pink-400 to-blue-500 mb-6 font-extrabold text-4xl text-transparent">Duration</h2>
            <p className="mb-6 text-lg text-pink-200">How long should your video be?</p>
            <Select
              onValueChange={(value) => {
                setSelectedDuration(value);
                onHandleInputChange("duration", value);
              }}
            >
              <SelectTrigger className="border-2 bg-gradient-to-r from-pink-800/50 to-blue-800/50 p-4 border-blue-500/30 rounded-xl focus:ring-4 focus:ring-blue-500/30 w-full text-lg transition-all duration-300">
                <SelectValue placeholder="Select video duration" />
              </SelectTrigger>
              <SelectContent className="border-2 bg-gradient-to-br from-pink-900/95 to-blue-900/95 backdrop-blur-lg border-blue-500/30 rounded-xl">
                {["15 second", "30 second", "60 second"].map((duration) => (
                  <SelectItem key={duration} value={duration} className="hover:bg-gradient-to-r hover:from-pink-700/50 hover:to-blue-700/50 p-3 rounded-lg transition-all duration-300">
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-4 text-blue-300 text-lg">Selected Duration: <span className="font-semibold text-pink-300">{selectedDuration}</span></p>
          </div>

          {/* Create Button */}
          <Button
            className="bg-gradient-to-r from-blue-600 hover:from-blue-700 via-purple-600 hover:via-purple-700 to-pink-600 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 py-6 rounded-full w-full font-bold text-white text-xl transform transition-all duration-500 hover:scale-105"
            onClick={async () => {
              try {
                setIsLoading(true);
                const videoScript = await GetVideoScript();
                const audioFile = await GenerateAudioFile(videoScript);
                const captions = await GenerateAudioCaptions(audioFile);
                const images = await GenerateImages(videoScript);
              } catch (e) {
                console.log(e);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Create Your Masterpiece
          </Button>
        </div>

        <CustomLoader loading={isLoading} />
        {playVideo && <PlayerDialog videoId={videoId} onClose="close" />}
        
        {/* Render Captions and Images */}
        {captions && (
          <div className="bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 shadow-2xl hover:shadow-purple-500/20 mt-16 p-8 rounded-3xl transform transition-all duration-500 hover:scale-105">
            <h2 className="bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-8 font-extrabold text-4xl text-transparent">Generated Captions</h2>
            <div className="space-y-4">
              {captions.map((caption, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-800/20 hover:from-pink-800/20 to-purple-800/20 hover:to-purple-800/20 p-4 rounded-xl transition-all duration-300">
                  <p className="text-lg">
                    <span className="font-semibold text-pink-300">{caption.text}</span>
                    <span className="ml-2 text-blue-300 text-sm">(Start: {caption.start}s, End: {caption.end}s)</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {images && (
          <div className="bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-blue-900/30 shadow-2xl hover:shadow-pink-500/20 mt-16 p-8 rounded-3xl transform transition-all duration-500 hover:scale-105">
            <h2 className="bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 mb-8 font-extrabold text-4xl text-transparent">Generated Visuals</h2>
            <div className="gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div key={index} className="relative shadow-lg hover:shadow-xl hover:shadow-purple-500/30 rounded-xl transform transition-all duration-500 overflow-hidden group hover:scale-105">
                  <Image src={image} alt={`Generated Image ${index + 1}`} width={300} height={300} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex justify-center items-end bg-gradient-to-t from-purple-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="p-4 font-semibold text-lg text-white">Scene {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}