import ContentEditor from "@/components/content/content-editor";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PostsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const post = await prisma.post.findFirst({
    where: {
      id: id,
      userId: user.id
    }
  });

  // If no post is found, you might want to handle this case
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-0 mb-12 mt-28">
      <ContentEditor posts={[post]} />
    </div>
  );
}
