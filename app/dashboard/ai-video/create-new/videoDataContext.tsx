"use client";

import { createContext, ReactNode, useState } from "react";
import { VideoDataType } from "../create-new/page";

export const VideoDataContext = createContext({});

export default function VideoDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [videoData, setVideoData] = useState<VideoDataType>();

  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoDataContext.Provider>
  );
}
