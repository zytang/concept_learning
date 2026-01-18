"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
    userId: string;
}

export function ShareButton({ userId }: ShareButtonProps) {
    const handleShare = () => {
        const url = `${window.location.origin}/share/${userId}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard", {
            description: "Anyone with this link can view your concepts.",
        });
    };

    return (
        <Button onClick={handleShare} variant="outline" className="gap-2">
            <Share2 size={16} />
            Share Profile
        </Button>
    );
}
