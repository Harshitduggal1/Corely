import { Inter } from "next/font/google";
import ModernSidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex min-h-screen bg-blue-950/30 text-white`}>
      <ModernSidebar />
      <div className="flex-1 ml-20 p-8 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
