/* eslint-disable @next/next/no-async-client-component */
"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/utils/uploadthing";
import {
  generateBlogPostAction,
  transcribeUploadedFile,
} from "@/actions/upload-actions";


//updated error handlings and added toast notifications!!!
//updated and fix bugs significantly 

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must not exceed 20MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/"),
      "File must be an audio or a video file"
    ),
});

export default function UploadForm() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { startUpload } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: () => {
      toast({ title: "Uploaded successfully!" });
    },
    onUploadError: (err) => {
      console.error("Error occurred", err);
      toast({ title: "Upload Error", description: err.message, variant: "destructive" });
    },
    onUploadBegin: () => {
      toast({ title: "Upload has begun 🚀!" });
    },
  });

  const handleTranscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File | null;

    if (!file) {
      toast({
        title: "❌ Something went wrong",
        variant: "destructive",
        description: "No file selected",
      });
      setIsProcessing(false);
      return;
    }

    const validatedFields = schema.safeParse({ file });

    if (!validatedFields.success) {
      toast({
        title: "❌ Something went wrong",
        variant: "destructive",
        description: validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file",
      });
      setIsProcessing(false);
      return;
    }

    try {
      const uploadResp = await startUpload([file]);

      if (!uploadResp || uploadResp.length === 0) {
        throw new Error("File upload failed");
      }

      toast({
        title: "🎙️ Transcription is in progress...",
        description: "Hang tight! Our digital wizards are sprinkling magic dust on your file! ✨",
      });

      const transcriptionResult = await transcribeUploadedFile([{
        serverData: {
          userId: "placeholder-user-id", // Replace with actual user ID if available
          file: {
            url: uploadResp[0].url,
            name: uploadResp[0].name
          }
        }
      }]);

      if (!transcriptionResult.success || !transcriptionResult.data) {
        throw new Error(transcriptionResult.message || "Transcription failed");
      }

      toast({
        title: "🤖 Generating AI blog post...",
        description: "Please wait while we generate your blog post.",
      });

      const blogPostResult = await generateBlogPostAction({
        transcriptions: transcriptionResult.data.transcriptions,
        userId: transcriptionResult.data.userId,
      });

      if (!blogPostResult.success) {
        throw new Error(blogPostResult.message || "Blog post generation failed");
      }

      toast({
        title: "🎉 Woohoo! Your AI blog is created! 🎊",
        description: "Time to put on your editor hat! Click the post to edit it.",
      });

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error occurred",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleTranscribe}>
      <div className="flex justify-end items-center gap-1.5">
        <Input id="file" name="file" type="file" accept="audio/*,video/*" required />
        <Button type="submit" className="bg-purple-600" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Transcribe"}
        </Button>
      </div>
    </form>
  );
}
