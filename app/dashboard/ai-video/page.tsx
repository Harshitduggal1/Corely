"use client";

import { Button } from "@/components/ui/button";
import { getUsersVideos } from "@/configs/queries";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Thumbnail } from "@remotion/player";
import { useEffect, useState, useReducer } from "react";
import { VideoDataType } from "./create-new/page";
import RemotionVideo from "@/app/_components/RemotionVideo";
import PlayerDialog from "@/app/_components/PlayerDialog";

export type PlayDialogStateType = {
  videoId: number | null;
  openDialog: boolean;
};

export type ActionType =
  | { type: "open"; payload: PlayDialogStateType }
  | { type: "close" };

function reducer(
  state: PlayDialogStateType,
  action: ActionType
): PlayDialogStateType {
  if (action.type === "open") {
    return {
      ...action.payload,
    };
  } else if (action.type === "close") {
    return initialState;
  }

  return initialState;
}

const initialState = {
  videoId: null,
  openDialog: false,
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [playDialogState, dispatch] = useReducer(reducer, initialState);
  const [videoList, setVideoList] = useState<VideoDataType[]>([]);

  useEffect(() => {
    if (isLoaded && user?.emailAddresses[0]?.emailAddress) {
      getVideoList(user.emailAddresses[0].emailAddress);
    }
  }, [isLoaded, user]);

  const getVideoList = async (email: string) => {
    const res = await getUsersVideos(email);
    setVideoList(res);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-pink-500 p-10 w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 font-bold text-3xl text-transparent text-white">Dashboard</h2>
        <Link href="/dashboard/create-new">
          <Button className="bg-gradient-to-r from-purple-500 hover:from-pink-500 to-pink-500 hover:to-purple-500 transition-all duration-300">+ Create New</Button>
        </Link>
      </div>
      {videoList.length === 0 && (
        <div className="flex flex-col items-center border-2 border-white bg-white bg-opacity-20 mt-10 py-24 p-5 border-dashed rounded-lg">
          <h2 className="text-lg text-white">You don&apos;t have any short video created</h2>
          <Link href="/dashboard/ai-video/create-new">
            <Button className="bg-gradient-to-r from-purple-500 hover:from-pink-500 to-pink-500 hover:to-purple-500 mt-4 transition-all duration-300">Create New Short Video</Button>
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-8 mt-12">
        {videoList.map((video, idx) => (
          <div
            key={idx}
            onClick={() => {
              dispatch({
                type: "open",
                payload: {
                  videoId: video.id,
                  openDialog: true,
                },
              });
            }}
            className="transform transition-transform duration-300 hover:scale-105"
          >
            <Thumbnail
              component={RemotionVideo}
              compositionWidth={250}
              compositionHeight={390}
              frameToDisplay={30}
              durationInFrames={120}
              fps={30}
              inputProps={{
                ...video,
                setDurationInFrames: () => {},
              }}
              style={{ borderRadius: "15px" }}
              className="border-4 border-transparent hover:border-blue-300 transition-all cursor-pointer"
            />
          </div>
        ))}

        {playDialogState.openDialog && (
          <PlayerDialog videoId={playDialogState.videoId} onClose="close" />
        )}
      </div>
    </div>
  );
}
