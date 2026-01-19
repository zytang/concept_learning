"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Share2, PlusCircle, LayoutDashboard, Search, Target } from "lucide-react";

export default function GuidePage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            <div>
                <h2 className="text-3xl font-heading font-black tracking-tight text-primary">User Guide</h2>
                <p className="text-muted-foreground text-lg">
                    Master ActiveRecall with this quick start guide.
                </p>
            </div>

            {/* 1. What is ActiveRecall? */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Brain size={24} />
                        </div>
                        <CardTitle className="text-xl">What is ActiveRecall?</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                        ActiveRecall is an intelligent learning platform designed to help you master complex subjects faster. Unlike traditional note-taking apps, it uses <strong>Artificial Intelligence</strong> to instantly generate deep learning materials from simple terms, and uses <strong>active recall principles</strong> to ensure you actually remember them.
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* 2. Why Use It? */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                            <Zap size={24} />
                        </div>
                        <CardTitle className="text-xl">Why Use It?</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-secondary/30 p-4 rounded-xl">
                            <h3 className="font-bold text-foreground mb-1">Save Time</h3>
                            <p className="text-sm text-muted-foreground">Don't spend hours writing flashcards. Just type a topic, and AI builds the lesson for you.</p>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-xl">
                            <h3 className="font-bold text-foreground mb-1">Deep Understanding</h3>
                            <p className="text-sm text-muted-foreground">We generate real-world examples, mini-cases, and common pitfalls for every concept.</p>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-xl">
                            <h3 className="font-bold text-foreground mb-1">Retention</h3>
                            <p className="text-sm text-muted-foreground">"Active Learning" mode uses quizzes to move concepts to long-term memory.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 3. How to Use */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold tracking-tight">How to Use ActiveRecall</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PlusCircle className="text-blue-500" size={20} /> 1. Add Concepts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>1. Go to the <strong>Add Concepts</strong> tab.</p>
                            <p>2. Type a list of terms (e.g., "Machine Learning, Photosynthesis").</p>
                            <p>3. Click <strong>Generate</strong>.</p>
                            <p>The AI acts as an expert professor, creating a comprehenisve "Deep Dive" for each term.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LayoutDashboard className="text-violet-500" size={20} /> 2. Study Mode
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>Your Dashboard tracks your <strong>Library Size</strong> and <strong>Mastery Level</strong>.</p>
                            <p>In <strong>Study Mode</strong>, concepts are visualized as a network.</p>
                            <ul className="list-disc list-inside pl-2">
                                <li><strong>Click</strong> a node to focus.</li>
                                <li><strong>Double-Click</strong> to open a Quick Flashcard.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="text-emerald-500" size={20} /> 3. Mastery & Spaced Repetition
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-4">
                            <div>
                                <h4 className="font-bold text-foreground mb-1">Mastery Levels (0-5)</h4>
                                <ul className="list-disc list-inside pl-2 space-y-1">
                                    <li><strong>Level 0</strong>: New Concept.</li>
                                    <li><strong>Level 5</strong>: Mastered (Verified knowledge).</li>
                                    <li><strong>Action</strong>: Correct quiz answers increase level (+1), incorrect answers decrease it (-1).</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1">Due for Review</h4>
                                <p>We use smart scheduling to show you concepts just before you forget them:</p>
                                <div className="grid grid-cols-5 gap-2 mt-2 text-center text-xs">
                                    <div className="bg-secondary p-1 rounded">Lvl 1<br />1 Day</div>
                                    <div className="bg-secondary p-1 rounded">Lvl 2<br />2 Days</div>
                                    <div className="bg-secondary p-1 rounded">Lvl 3<br />4 Days</div>
                                    <div className="bg-secondary p-1 rounded">Lvl 4<br />8 Days</div>
                                    <div className="bg-secondary p-1 rounded">Lvl 5<br />16 Days</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="text-blue-500" size={20} /> 4. Active Practice Modes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>Click on any concept card to access three modes:</p>
                            <ul className="space-y-1">
                                <li><strong>Review</strong>: Traditional flashcard.</li>
                                <li><strong>Quiz</strong>: Scenario-based question. (+1 Mastery for correct).</li>
                                <li><strong>Deep Dive</strong>: Mini-cases and common pitfalls.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="text-pink-500" size={20} /> 5. Share & Collaborate
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>Click the <strong>Share</strong> button to create a read-only link.</p>
                            <p>Friends can view your concepts and diagrams to study along with you, but cannot edit your progress.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
