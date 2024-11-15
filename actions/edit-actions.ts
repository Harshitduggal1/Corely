"use server";
// For server only
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface UpdatePostData {
  postId: string;
  content: string;
}

export async function updatePostAction(data: UpdatePostData) {
  const { postId, content } = data;

  // Ensure user is authenticated
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
    return; // Ensure function exits after redirect
  }

  // Validate input
  if (!postId || !content) {
    console.error("Post ID and content are required.");
    return { success: false, message: "Post ID and content are required." };
  }

  try {
    const [title] = content.split("\n\n");
    const updatedTitle = title.split("#")[1]?.trim() || "Untitled";

    // Update post in the database
    await prisma.post.update({
      where: { id: postId },
      data: { content, title: updatedTitle },
    });
    
    // Revalidate the path to ensure the latest data is served
    revalidatePath(`/posts/${postId}`);
    
    return { success: true };
    
  } catch (error) {
    console.error("Error occurred while updating the post:", error);
    return {
      success: false,
      message: "An error occurred while updating the post.",
    };
  }
}
