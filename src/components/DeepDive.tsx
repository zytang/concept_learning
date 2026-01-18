"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen, Lightbulb } from "lucide-react";

interface DeepDiveProps {
    term: string;
    miniCase: string;
    pitfalls: string[];
    relatedConcepts: string[];
}

export function DeepDive({ term, miniCase, pitfalls, relatedConcepts }: DeepDiveProps) {
    const [showPitfalls, setShowPitfalls] = useState(false);

    return (
        <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        <CardTitle>Mini Case: {term} in Action</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{miniCase}</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <CardTitle>Common Pitfalls</CardTitle>
                        </div>
                        <CardDescription>Where students often go wrong</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!showPitfalls ? (
                            <Button onClick={() => setShowPitfalls(true)} variant="outline" className="w-full">
                                Reveal Pitfalls
                            </Button>
                        ) : (
                            <ul className="list-disc pl-5 space-y-2">
                                {pitfalls.map((pitfall, idx) => (
                                    <li key={idx} className="text-gray-700">{pitfall}</li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-indigo-500" />
                            <CardTitle>Related Concepts</CardTitle>
                        </div>
                        <CardDescription>Connected terms in the knowledge graph</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {relatedConcepts.map((concept, idx) => (
                                <span
                                    key={idx}
                                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100"
                                >
                                    {concept}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
