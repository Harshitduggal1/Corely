"use server";

import { VideoDataType } from "@/app/dashboard/ai-video/create-new/page";
import { db } from "@/utils/db/dbConfig";
import { videoData } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function insertVideo(data: VideoDataType, email: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db
        .insert(videoData)
        .values({
          script: data.script,
          audioFileUrl: data.audioFileUrl,
          captions: data.captions,
          imageList: data.imageList,
          createdBy: email,
        })
        .returning({ id: videoData.id });

      console.log(result);
      resolve(result);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

export async function getVideo(videoId: number) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db
        .select()
        .from(videoData)
        .where(eq(videoData.id, videoId));

      console.log(result);
      resolve(result[0]);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

export async function getUsersVideos(email: string): Promise<VideoDataType[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db
        .select()
        .from(videoData)
        .where(eq(videoData.createdBy, email));
      console.log(result);

      // Ensure the result matches the VideoDataType[] structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedResult: VideoDataType[] = result.map((item: any) => ({
        id: item.id,
        script: item.script,
        audioFileUrl: item.audioFileUrl,
        captions: item.captions,
        imageList: item.imageList,
        createdBy: item.createdBy
      }));

      resolve(typedResult);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}
