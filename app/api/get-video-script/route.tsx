import { chatSession } from "@/configs/AiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    console.log(prompt);

    const result = await chatSession.sendMessage(prompt);
    console.log("video script", result.response.text());

    return NextResponse.json({ result: JSON.parse(result.response.text()) });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ "Error:": e });
  }
}
