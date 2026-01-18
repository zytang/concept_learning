import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, BookOpen, BarChart3 } from "lucide-react";

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
                    <h1 className="text-2xl font-heading font-black tracking-tighter bg-gradient-to-br from-primary to-violet-600 bg-clip-text text-transparent">
                        MIS Master
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-medium hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
                    >
                        <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                        Overview
                    </Link>
                    <Link
                        href="/dashboard/add"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-medium hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
                    >
                        <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
                        Add Concepts
                    </Link>
                    <Link
                        href="/dashboard/learn"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-medium hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
                    >
                        <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
                        Study Mode
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 px-4">
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm font-medium text-gray-600">My Profile</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b px-8 py-4 flex items-center justify-between md:hidden">
                    <span className="font-bold text-gray-800">MIS Master</span>
                    <UserButton afterSignOutUrl="/" />
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
