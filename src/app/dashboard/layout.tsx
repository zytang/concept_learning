import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, BookOpen, BarChart3, GraduationCap } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { SidebarNav } from "./_components/SidebarNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 border-r hidden md:flex flex-col bg-white/80 backdrop-blur-md sticky top-0 h-screen z-10">
                <div className="p-6 border-b border-border/50">
                    <Logo />
                </div>

                <SidebarNav />

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 px-4">
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm font-medium text-gray-600">My Profile</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <MobileNav />
                        <Logo />
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
