"use client";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedOut,
  SignedIn,
  useAuth,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

export function Navbar() {
  const { userId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? "bg-gray-900/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto px-4 sm:px-8 py-4 sm:py-6 container">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-6xl">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <Zap className="group-hover:text-purple-500 w-8 h-8 text-blue-500 transition-colors duration-300" />
              <span className="group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-blue-400 bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 font-extrabold text-transparent text-xl sm:text-2xl transition-all duration-300">
                Corely⚡️
              </span>
            </Link>
          </div>
          <button
            className="sm:hidden text-white focus:outline-none transform hover:scale-110 transition-transform duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 hover:text-pink-500" />
            ) : (
              <Menu className="w-6 h-6 hover:text-blue-500" />
            )}
          </button>
          <div
            className={`w-full sm:w-auto ${
              isMenuOpen ? "block" : "hidden"
            } sm:block mt-4 sm:mt-0`}
          >
            <div className="flex sm:flex-row flex-col sm:items-center sm:space-x-8">
              {["Features", "Pricing", "Docs"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="relative py-2 sm:py-0 text-gray-300 hover:text-white transition-colors overflow-hidden group"
                >
                  <span className="relative z-10 font-medium">{item}</span>
                  <span className="group-hover:scale-x-100 bottom-0 left-0 absolute bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full h-0.5 transform origin-left transition-transform duration-300 scale-x-0"></span>
                </Link>
              ))}
              {userId && (
                <Link
                  href="/generate"
                  className="relative py-2 sm:py-0 text-gray-300 hover:text-white transition-colors overflow-hidden group"
                >
                  <span className="relative z-10 font-medium">Dashboard</span>
                  <span className="group-hover:scale-x-100 bottom-0 left-0 absolute bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full h-0.5 transform origin-left transition-transform duration-300 scale-x-0"></span>
                </Link>
              )}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 mt-2 sm:mt-0 font-medium text-gray-300 hover:text-white hover:text-transparent transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-gradient-to-r from-blue-600 hover:from-pink-500 to-purple-600 hover:to-blue-500 hover:shadow-lg mt-2 sm:mt-0 px-6 py-2 rounded-full font-bold text-white transform transition-all duration-300 hover:scale-105">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-purple-500 hover:ring-pink-500 transition-all duration-300",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
