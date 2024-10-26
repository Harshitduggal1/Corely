"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getVideo } from "@/configs/queries";
import { VideoDataType } from "@/app/dashboard/ai-video/create-new/page";

export default function PlayerDialog({
  videoId,
  onClose,
}: {
  videoId: number | null;
  onClose: string;
}) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoData, setVideoData] = useState<VideoDataType>();
  const [durationInFrames, setDurationInFrames] = useState(100);

  useEffect(() => {
    const getVideoData = async () => {
      if (videoId) {
        const results = (await getVideo(videoId)) as VideoDataType;
        setVideoData(results);
        setVideoLoaded(true);
      }
    };

    getVideoData();
  }, [videoId]);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(onClose));
    }
  };

  return (
    <Dialog open={videoLoaded}>
      <DialogContent
        className="flex flex-col items-center"
        onEscapeKeyDown={handleClose}
        onInteractOutside={handleClose}
      >
        <DialogHeader>
          <DialogTitle className="my-5 font-bold text-3xl">
            Your video is ready
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {videoData && (
          <Player
            component={RemotionVideo}
            durationInFrames={Number(durationInFrames.toFixed(0))}
            compositionWidth={300}
            compositionHeight={450}
            fps={30}
            inputProps={{
              ...videoData,
              setDurationInFrames: (frameValue: number) =>
                setDurationInFrames(frameValue),
            }}
            controls={true}
          />
        )}
        <div className="flex gap-12 mt-4">
          <Button variant={"ghost"} onClick={handleClose}>
            Cancel
          </Button>
          <Button>Export</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}