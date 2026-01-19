"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { LayoutDashboard, PlusCircle, GraduationCap, BookOpen, Library } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarNav() {
    const pathname = usePathname();
    const params = useParams();
    const libraryId = params.libraryId as string | undefined;

    const routes = [
        {
            href: "/dashboard",
            label: "Overview", // Or "My Libraries" effectively
            icon: LayoutDashboard,
            // If we are in a library, "Overview" goes to root to pick another? 
            // Or should we have a separate "Library Dashboard"?
            // For now, let's keep Overview as Global Dashboard (Picker)
            // But wait, if I am in a library, I might want to go to *that* library's dashboard.
            // Let's make "Overview" context aware too?
            // If I am in a library, Overview -> Library Dashboard. 
            // And add a "Switch Library" link?
            // Let's stick to the user request. Update Add and Study.
            // Actually, usually "Overview" implies "Current Scope Overview".
            // So if libraryId, Overview -> /dashboard/[id].
            exact: true
        },
        {
            href: libraryId ? `/dashboard/${libraryId}/add` : "/dashboard/add",
            label: "Add Concepts",
            icon: PlusCircle,
        },
        {
            href: libraryId ? `/dashboard/${libraryId}/learn` : "/dashboard/learn",
            label: "Study Mode",
            icon: GraduationCap,
        },
        {
            href: "/dashboard/guide",
            label: "User Guide",
            icon: BookOpen,
        },
    ];

    // If we are inside a library, maybe we change "Overview" to "Library Home" 
    // and add a "All Libraries" link?
    // Let's modify the routes array dynamically.

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

    // Add common routes
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
        <nav className="flex-1 p-4 space-y-2 mt-2">
            {navRoutes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 text-muted-foreground font-medium rounded-xl transition-all duration-200 group",
                        route.active
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:text-primary hover:bg-primary/5"
                    )}
                >
                    <route.icon size={20} className={cn("group-hover:scale-110 transition-transform", route.active && "text-primary")} />
                    {route.label}
                </Link>
            ))}
        </nav>
    );
}
