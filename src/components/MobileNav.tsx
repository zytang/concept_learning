"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, GraduationCap, BookOpen, Library } from "lucide-react";

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const params = useParams();
    const libraryId = params.libraryId as string | undefined;

    const navRoutes = [];

    if (libraryId) {
        navRoutes.push({
            href: `/dashboard/${libraryId}`,
            label: "Library Home",
            icon: LayoutDashboard,
            active: pathname === `/dashboard/${libraryId}`
        });
        navRoutes.push({
            href: `/dashboard`,
            label: "Switch Library",
            icon: Library,
            active: pathname === `/dashboard`
        });
    } else {
        navRoutes.push({
            href: `/dashboard`,
            label: "Overview",
            icon: LayoutDashboard,
            active: pathname === `/dashboard`
        });
    }

    navRoutes.push({
        href: libraryId ? `/dashboard/${libraryId}/add` : "/dashboard/add",
        label: "Add Concepts",
        icon: PlusCircle,
        active: pathname?.includes("/add")
    });

    navRoutes.push({
        href: libraryId ? `/dashboard/${libraryId}/learn` : "/dashboard/learn",
        label: "Study Mode",
        icon: GraduationCap,
        active: pathname?.includes("/learn")
    });

    navRoutes.push({
        href: "/dashboard/guide",
        label: "User Guide",
        icon: BookOpen,
        active: pathname === "/dashboard/guide"
    });

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
                        {navRoutes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-muted-foreground font-medium rounded-xl transition-all duration-200",
                                    route.active
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "hover:text-primary hover:bg-primary/5"
                                )}
                            >
                                <route.icon size={20} />
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}
