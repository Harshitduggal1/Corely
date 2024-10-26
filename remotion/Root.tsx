import React from "react";
import { Composition } from "remotion";
import RemotionVideo from "@/app/_components/RemotionVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={RemotionVideo}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
