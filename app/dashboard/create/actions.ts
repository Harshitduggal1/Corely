"use server";

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const lessonPlanSchema = z.object({
  topic: z.string(),
  subtopic: z.string(),
  duration: z.string(),
  studentLevel: z.string(),
  objective: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      duration: z.string(),
    })
  ),
});

interface LessonPlanInput {
  topic: string;
  subtopic: string;
  duration: string;
  studentLevel: string;
  objective: string;
}

export async function CreateLessonPlan(formData: LessonPlanInput) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const userDB = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userDB) {
      return { success: false, error: "User not found" };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      As an expert in education and curriculum development, create a comprehensive and detailed lesson plan for teachers, professionals, and PhD-level educators. The lesson plan should be structured as follows:

      Topic: ${formData.topic}
      Subtopic: ${formData.subtopic}
      Total Duration: ${formData.duration} minutes
      Student Level: ${formData.studentLevel}
      Primary Objective: ${formData.objective}

      Please provide a lesson plan that includes:
      1. Introduction (2-3 sentences)
      2. Learning outcomes (3-5 bullet points)
      3. Materials and resources
      4. Lesson breakdown into sections:
         - Section title
         - Duration
         - Content
         - Methods
      5. Assessment strategies
      6. Summary
      Ensure that the total duration does not exceed ${formData.duration} minutes.

      **Instructions:**
      - Format the response strictly as a valid JSON object.
      - Do **not** include any explanations, comments, or additional text outside the JSON.
      - Example format:
        {
          "topic": "Topic Name",
          "subtopic": "Subtopic Name",
          ...
        }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    console.log("Gemini API full response:", JSON.stringify(result, null, 2));

    if (!result.response) {
      return { success: false, error: "No response from Gemini" };
    }

    const response = result.response;
    if (!response.candidates || response.candidates.length === 0) {
      return { success: false, error: "No valid response from Gemini" };
    }

    const candidate = response.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      return { success: false, error: "Invalid response structure from Gemini" };
    }

    const lessonPlanText = candidate.content.parts[0].text;
    if (!lessonPlanText) {
      return { success: false, error: "Empty response from Gemini" };
    }

    let lessonPlan;
    try {
      lessonPlan = JSON.parse(lessonPlanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      const jsonMatch = lessonPlanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          lessonPlan = JSON.parse(jsonMatch[0]);
        } catch {
          return { success: false, error: "Failed to extract valid JSON from Gemini response" };
        }
      } else {
        return { success: false, error: "Invalid JSON format in Gemini response" };
      }
    }

    try {
      const validatedLessonPlan = lessonPlanSchema.parse(lessonPlan);

      const lessonPlanDB = await prisma.lessonPlan.create({
        data: {
          ...validatedLessonPlan,
          userId: userDB.id,
          title: validatedLessonPlan.topic,
          subject: validatedLessonPlan.subtopic,
          duration: parseInt(validatedLessonPlan.duration, 10),
          sections: {
            create: validatedLessonPlan.sections.map((section) => ({
              ...section,
              duration: parseInt(section.duration, 10),
            })),
          },
        },
      });

      revalidatePath("/dashboard/course");
      return { success: true, lessonPlan: lessonPlanDB };
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return { success: false, error: "Failed to validate lesson plan structure" };
    }
  } catch (error) {
    console.error("Error in CreateLessonPlan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

