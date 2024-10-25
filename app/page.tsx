

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  ArrowRightIcon,

  SparklesIcon,
  TrendingUpIcon,
  ZapIcon,
  RocketIcon,
  BrainIcon,
  CodeIcon,
  PenToolIcon,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { SignUpButton } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const { userId } = auth();

  return (
    <div className="bg-gradient-to-b from-blue-900/40 via-purple-950/80 to-sky-700 pt-20 min-h-screen text-gray-100 overflow-hidden">
      <Navbar />

      <main className="relative mx-auto px-4 sm:px-6 lg:px-8 container">
        {/* Decorative elements */}
        <div className="top-20 left-10 absolute">
          <SparklesIcon className="opacity-70 w-12 h-12 text-yellow-400" />
        </div>
        <div className="top-40 right-20 absolute">
          <ZapIcon className="opacity-70 w-16 h-16 text-blue-400" />
        </div>
        <div className="bottom-20 left-1/4 absolute">
          <TrendingUpIcon className="opacity-70 w-20 h-20 text-green-400" />
        </div>

        {/* Hero Section */}
        <div className="relative py-32 lg:py-48 text-center">
          <div>
            <RocketIcon className="mx-auto mb-8 w-24 h-24 text-blue-700 animate-bounce" />
          </div>
          <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-pink-500 mb-8 font-extrabold text-6xl text-transparent sm:text-6xl lg:text-7xl leading-tight tracking-tighter">
            Revolutionize Your Content Creation
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-2xl text-gray-300 leading-relaxed">
            Harness the power of AI to generate captivating content for Twitter, Instagram, and LinkedIn. Elevate your social media presence with our cutting-edge CMS platform.
          </p>
          <div className="flex justify-center space-x-6">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 hover:shadow-lg px-10 py-4 rounded-full font-bold text-white text-xl transform transition duration-300 ease-in-out hover:scale-105"
            >
              <Link href="/generate">Unleash AI Magic</Link>
            </Button>
            <Button
              asChild
              className="border-2 border-purple-500 bg-transparent hover:bg-purple-500 px-10 py-4 rounded-full font-bold text-purple-500 text-xl hover:text-white transform transition duration-300 ease-in-out hover:scale-105"
            >
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-32" id="features">
          <h2 className="mb-20 font-bold text-4xl text-center text-white">
            Supercharge Your Social Media Presence
          </h2>
          <div className="gap-12 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-6xl">
            {[
              {
                title: "AI-Powered Twitter Threads",
                icon: <TwitterIcon className="mb-6 w-16 h-16 text-blue-400" />,
                description:
                  "Generate compelling Twitter threads that captivate your audience and skyrocket your engagement rates.",
              },
              {
                title: "Instagram Caption Genius",
                icon: <InstagramIcon className="mb-6 w-16 h-16 text-pink-400" />,
                description:
                  "Craft irresistible captions for your Instagram posts that will have your followers double-tapping and commenting in droves.",
              },
              {
                title: "LinkedIn Thought Leadership",
                icon: <LinkedinIcon className="mb-6 w-16 h-16 text-blue-600" />,
                description:
                  "Establish yourself as an industry leader with AI-generated professional content tailored for your LinkedIn network.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl hover:shadow-3xl p-10 rounded-3xl transform transition hover:-translate-y-2 duration-500 ease-in-out hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="mb-4 font-semibold text-3xl text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 my-32 py-32 rounded-3xl overflow-hidden">
          <div className="top-0 left-0 absolute w-full h-full overflow-hidden">
            <svg
              className="absolute opacity-10 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 L100,0 L100,100 L0,100 Z"
                fill="url(#grid-gradient)"
              />
            </svg>
          </div>
          <div className="relative z-10 mx-auto px-6 max-w-5xl">
            <h2 className="mb-16 font-bold text-4xl text-center text-white">
              Unleash the Power of AI-Driven Content
            </h2>
            <div className="gap-12 grid grid-cols-1 md:grid-cols-2">
              {[
                {
                  icon: <BrainIcon className="w-10 h-10 text-blue-400" />,
                  title: "AI-Powered Creativity",
                  description: "Harness the power of advanced AI algorithms to generate unique and engaging content tailored to your brand.",
                },
                {
                  icon: <CodeIcon className="w-10 h-10 text-green-400" />,
                  title: "Seamless Integration",
                  description: "Effortlessly integrate our AI content generator into your existing workflow and content management systems.",
                },
                {
                  icon: <PenToolIcon className="w-10 h-10 text-yellow-400" />,
                  title: "Customizable Output",
                  description: "Fine-tune the AI-generated content to match your brand voice and style with easy-to-use customization tools.",
                },
                {
                  icon: <TrendingUpIcon className="w-10 h-10 text-pink-400" />,
                  title: "Data-Driven Insights",
                  description: "Gain valuable insights into content performance and audience engagement to continuously improve your strategy.",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 bg-white bg-opacity-10 p-3 rounded-full">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-white text-xl">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-32 text-center">
          <div className="top-10 right-10 absolute">
            <svg
              className="opacity-20 w-32 h-32 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="mb-10 font-bold text-5xl text-white leading-tight">
            Ready to revolutionize your<br />social media strategy?
          </h2>
          <div>
            {userId ? (
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 hover:shadow-lg px-12 py-5 rounded-full font-bold text-white text-xl transform transition duration-300 ease-in-out hover:scale-105"
              >
                <Link href="/generate">
                  Generate Content Now <ArrowRightIcon className="ml-2 w-6 h-6" />
                </Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 hover:shadow-lg px-12 py-5 rounded-full font-bold text-white text-xl transform transition duration-300 ease-in-out hover:scale-105">
                  Get Started Free <ArrowRightIcon className="ml-2 w-6 h-6" />
                </Button>
              </SignUpButton>
            )}
          </div>
          <p className="mt-6 text-gray-400 text-lg">
            No credit card required • Free trial available
          </p>
        </div>
      </main>
    </div>
  );
}