import { AssemblyAI } from "assemblyai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { audioFileUrl } = await req.json();

  const client = new AssemblyAI({
    apiKey: process.env.CAPTION_API!,
  });

  const data = {
    audio: audioFileUrl,
  };

  const audioUrl =
  'https://assembly.ai/sports_injuries.mp3';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const config = {
    audio_url: audioUrl
  }

  try {
    const transcript = await client.transcripts.transcribe(data);
    
    // Enhanced logging for better debugging and monitoring
    console.log("🎤 Transcript Generation Successful");
    console.log("📥 Audio File URL:", audioFileUrl);
    console.log("📝 Generated Transcript:", transcript.words);
    console.log("🔍 Transcript Details:", {
      id: transcript.id,
      status: transcript.status,
      // createdAt and updatedAt properties do not exist on Transcript type
    });
    
    return NextResponse.json({
      result: transcript.words,
    });
  } catch (e) {
    console.error("❌ Error during transcription:", {
      message: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
    });
    return NextResponse.json({
      error: e,
    });
  }
}
