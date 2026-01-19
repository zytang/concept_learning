"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizProps {
    question: string;
    options: string[];
    correctAnswer: string;
    onComplete?: (isCorrect: boolean) => void;
}

export function Quiz({ question, options, correctAnswer, onComplete }: QuizProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSelect = (option: string) => {
        if (submitted) return;
        setSelected(option);
    };

    const handleSubmit = () => {
        if (!selected) return;
        setSubmitted(true);
        const isCorrect = selected === correctAnswer;
        if (onComplete) {
            // Optional delay to show animation before next action
            setTimeout(() => onComplete(isCorrect), 1500);
        }
    };

    const getOptionStyle = (option: string) => {
        if (!submitted) {
            return selected === option
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                : "hover:bg-gray-50 border-gray-200";
        }

        if (option === correctAnswer) {
            return "border-green-500 bg-green-50 ring-2 ring-green-500 text-green-700";
        }

        if (selected === option && selected !== correctAnswer) {
            return "border-red-500 bg-red-50 ring-2 ring-red-500 text-red-700";
        }

        return "opacity-50 border-gray-200";
    };

    return (
        <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-semibold leading-relaxed">
                    {question}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
                {options.map((option, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleSelect(option)}
                        className={cn(
                            "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-between",
                            getOptionStyle(option)
                        )}
                    >
                        <span className="font-medium flex-1 mr-3 text-sm md:text-base">{option}</span>
                        {submitted && option === correctAnswer && (
                            <CheckCircle2 className="text-green-600 h-5 w-5 flex-shrink-0" />
                        )}
                        {submitted && selected === option && selected !== correctAnswer && (
                            <XCircle className="text-red-600 h-5 w-5 flex-shrink-0" />
                        )}
                    </div>
                ))}
            </CardContent>
            <CardFooter className="justify-end pt-4 px-0">
                <Button
                    onClick={handleSubmit}
                    disabled={!selected || submitted}
                    className="w-full"
                >
                    {submitted ? (
                        selected === correctAnswer ? "Correct!" : "Incorrect"
                    ) : (
                        <>
                            Check Answer <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
