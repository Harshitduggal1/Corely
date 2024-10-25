import { Badge } from "@/components/ui/badge";
import UploadForm from "@/components/upload/upload-form";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return redirect("/sign-in");
  }

  // Hardcoded values for demonstration
  const planTypeName = "Pro";
  const isProPlan = true;

  return (
    <div className="bg-black mx-auto px-6 lg:px-8 py-24 sm:py-32 max-w-7xl min-h-screen">
      <div className="flex flex-col justify-center items-center gap-8 text-center">
        <Badge className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg hover:shadow-xl px-6 py-2 rounded-full font-bold text-white text-xl capitalize transform transition-all duration-300 hover:scale-105">
          {planTypeName} Plan
        </Badge>

        <h2 className="bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-green-400 font-extrabold text-4xl text-transparent sm:text-5xl md:text-6xl capitalize leading-tight tracking-tight">
          Start creating amazing content
        </h2>

        <p className="bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mt-4 max-w-2xl font-extrabold text-4xl text-center text-transparent sm:text-5xl leading-8">
          Upload your audio or video file and let our AI do the magic!
        </p>

        {isProPlan && (
          <p className="mt-4 max-w-2xl text-center text-gray-300 text-lg sm:text-xl leading-8">
            You get{" "}
            <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-800 px-4 py-2 rounded-full font-extrabold text-white transform hover:scale-110 transition-transform duration-200">
              Unlimited blog posts
            </span>{" "}
            as part of the{" "}
            <span className="bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-extrabold text-2xl text-transparent capitalize">
              {planTypeName}
            </span>{" "}
            Plan.
          </p>
        )}

        <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 shadow-2xl hover:shadow-3xl mt-8 p-8 rounded-3xl w-full max-w-4xl transition-all duration-300">
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
