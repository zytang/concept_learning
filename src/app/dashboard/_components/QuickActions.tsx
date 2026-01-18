"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function QuickActions() {
    const router = useRouter();

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-left items-start"
                onClick={() => router.push("/dashboard/learn")}
            >
                <div className="flex items-center gap-2 font-semibold">
                    <PlayCircle className="text-primary h-5 w-5" />
                    Recall Session
                </div>
                <p className="text-xs text-muted-foreground font-normal">
                    Jump back into your active recalls.
                </p>
            </Button>

            <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-left items-start"
                onClick={() => router.push("/dashboard/add")}
            >
                <div className="flex items-center gap-2 font-semibold">
                    <PlusCircle className="text-primary h-5 w-5" />
                    New Concept
                </div>
                <p className="text-xs text-muted-foreground font-normal">
                    Add a new term to your library.
                </p>
            </Button>
        </div>
    );
}
