"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePostAction(data: {
  postId: string;
  content: string;
}) {
  const { postId, content } = data;

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  try {
    const [title] = content?.split("\n\n") || [];
    const updatedTitle = title.split("#")[1].trim();

    await prisma.post.update({
      where: { id: postId },
      data: { content, title: updatedTitle },
    });
  } catch (error) {
    console.error("Error occurred in updating the post", postId);
    return {
      success: false,
    };
  }

  revalidatePath(`/posts/${postId}`);
  return {
    success: true,
  };
}
