import { Brain } from "lucide-react";

export function Logo({ className = "", size = "default" }: { className?: string, size?: "default" | "large" }) {
    const iconSize = size === "large" ? 48 : 32;
    const textSize = size === "large" ? "text-3xl" : "text-xl";

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative bg-gradient-to-br from-primary to-violet-600 text-white p-2.5 rounded-xl shadow-lg shadow-primary/25">
                    <Brain size={iconSize} className="text-white" />
                </div>
            </div>
            <span className={`${textSize} font-heading font-black tracking-tighter bg-gradient-to-br from-primary to-violet-600 bg-clip-text text-transparent`}>
                ActiveRecall
            </span>
        </div>
    );
}
