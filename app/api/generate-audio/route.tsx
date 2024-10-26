import { storage } from "@/configs/FirebaseConfig";
import * as PlayHT from 'playht';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';

// Retrieve and validate environment variables
const apiKey = process.env.PLAYHT_API_KEY;
const userId = process.env.PLAYHT_USER_ID;

if (!apiKey || !userId) {
  throw new Error("PLAYHT_API_KEY and PLAYHT_USER_ID must be defined");
}

// Initialize PlayHT client
PlayHT.init({
  apiKey: apiKey, // Your PlayHT API Key
  userId: userId, // Your PlayHT User ID
  defaultVoiceEngine: 'Play3.0-mini', // Set default voice engine
});

// Function to log file system information (to use 'fs')
function logFileSystemInfo() {
  const filePath = './example.txt'; // Example file path
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error('Error retrieving file stats:', err);
    } else {
      console.log('File stats:', stats);
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const { text, id } = await req.json();
    console.log("text", text);
    const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);

    // Generate audio from text using PlayHT
    const generated = await PlayHT.generate(text);
    const audioUrl = generated.audioUrl;

    // Download the audio file from the generated URL
    const response = await fetch(audioUrl);
    const audioBuffer = await response.arrayBuffer();

    // Upload the audio buffer to Firebase Storage
    await uploadBytes(storageRef, new Uint8Array(audioBuffer));

    const downloadUrl = await getDownloadURL(storageRef);
    console.log("downloadUrl", downloadUrl);
    
    // Call the function to log file system info
    logFileSystemInfo();

    return NextResponse.json({ result: downloadUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ "Error:": e instanceof Error ? e.message : String(e) });
  }
}
