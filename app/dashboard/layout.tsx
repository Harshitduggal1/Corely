import { Inter } from "next/font/google";
import ModernSidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex min-h-screen bg-black text-white`}>
       <ModernSidebar />
      <main className="flex-1 ml-20 p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
