import { storage } from "@/configs/FirebaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    console.log(prompt);
    const input = {
      prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1,
    };

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      { input }
    ) as string[];
    console.log("images", output);

    // save to Firebase
    const base64Image = `data:image/png;base64,${await convertImage(
      output[0]
    )}`;
    const fileName = `ai-short-video-files/${Date.now()}.png`;
    const storageRef = ref(storage, fileName);

    await uploadString(storageRef, base64Image, "data_url");

    const downloadUrl = await getDownloadURL(storageRef);
    console.log("downloadUrl", downloadUrl);

    return NextResponse.json({ result: downloadUrl });
    //=> ["https://replicate.delivery/yhqm/VyD24fDyzM2nQSg0nQc58W2...
  } catch (e) {
    console.log(e);
  }
}

const convertImage = async (imageUrl: string) => {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    return base64Image;
  } catch (e) {
    console.log(e);
  }
};
