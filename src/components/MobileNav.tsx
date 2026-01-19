"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, GraduationCap, BookOpen } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useState } from "react";

export function MobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b">
                        <Logo />
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-medium hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                        >
                            <LayoutDashboard size={20} />
                            Overview
                        </Link>
                        <Link
                            href="/dashboard/add"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-medium hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                        >
                            <PlusCircle size={20} />
                            Add Concepts
                        </Link>
                        <Link
                            href="/dashboard/learn"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-medium hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                        >
                            <GraduationCap size={20} />
                            Study Mode
                        </Link>
                        <Link
                            href="/dashboard/guide"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-medium hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                        >
                            <BookOpen size={20} />
                            User Guide
                        </Link>
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}
