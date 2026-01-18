"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Repeat } from "lucide-react";

interface FlashcardProps {
    term: string;
    definition: string;
    explanation: string;
}

export function Flashcard({ term, definition, explanation }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="perspective-1000 w-full max-w-lg mx-auto h-[300px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front */}
                <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 bg-white shadow-lg border-2 border-slate-100 hover:border-slate-200 transition-colors">
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Term</span>
                    <h3 className="text-3xl font-bold text-slate-800 text-center">{term}</h3>
                    <div className="mt-8 text-slate-400 text-xs flex items-center gap-1">
                        <Repeat size={12} />
                        Click to flip
                    </div>
                </Card>

                {/* Back */}
                <Card
                    className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 bg-slate-900 text-white shadow-xl rotate-y-180"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="overflow-y-auto w-full text-center space-y-4 max-h-full">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Definition</span>
                            <p className="text-lg font-medium leading-relaxed">{definition}</p>
                        </div>
                        {explanation && (
                            <div className="pt-4 border-t border-slate-700">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Deep Dive</span>
                                <p className="text-sm text-slate-300 leading-relaxed opacity-90">{explanation}</p>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
