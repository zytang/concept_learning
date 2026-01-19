"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
    userId: string;
}

export function ShareButton({ userId }: ShareButtonProps) {
    const handleShare = () => {
        // Construct public URL (assuming public share page exists at /share/[userId])
        // If we want library specific share, we'll need to update this later.
        // For now, it shares the user's profile/all libraries if implemented, 
        // or we just copy the current URL if the page is public.
        // Assuming /share/[userId] is the portfolio.

        const url = `${window.location.origin}/share/${userId}`;
        navigator.clipboard.writeText(url);
        toast.success("Share link copied to clipboard");
    };

    return (
        <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
        </Button>
    );
}
