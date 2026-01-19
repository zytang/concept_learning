"use client";

import { useState } from "react";
import { Concept, DeepDive, Quiz } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BrainCircuit, Check, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { deleteConceptAction, updateConceptAction } from "@/actions/concept-management";
import { updateMasteryAction } from "@/actions/update-progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StudyInterfaceProps {
    concept: Concept & {
        deepDive: DeepDive | null;
        quizzes: Quiz[];
    };
    onUpdate: (concept: any) => void;
    onDelete: (id: string) => void;
}

export function StudyInterface({ concept, onUpdate, onDelete }: StudyInterfaceProps) {
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [quizSelected, setQuizSelected] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({
        definition: concept.definition,
        explanation: concept.explanation,
        realWorldExample: concept.realWorldExample,
    });
    const [isSaving, setIsSaving] = useState(false);

    // Quiz Data
    const quiz = concept.quizzes[0];
    const quizOptions = quiz ? JSON.parse(quiz.options) as string[] : [];

    // Deep Dive Data
    const deepDive = concept.deepDive;
    const relatedConcepts = deepDive?.relatedConcepts ? JSON.parse(deepDive.relatedConcepts) : [];

    const handleDelete = async () => {
        try {
            await deleteConceptAction(concept.id);
            toast.success("Concept deleted");
            onDelete(concept.id);
        } catch (e) {
            toast.error("Failed to delete concept");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updated = await updateConceptAction(concept.id, editValues);
            toast.success("Concept updated");
            onUpdate(updated);
            setIsEditing(false);
        } catch (e) {
            toast.error("Failed to update concept");
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuizSubmit = async () => {
        if (!quizSelected) return;

        const isCorrect = quizSelected === quiz.correctAnswer;
        setShowAnswer(true);

        try {
            // Optimistic Update
            const newLevel = isCorrect
                ? Math.min(concept.masteryLevel + 1, 5)
                : Math.max(concept.masteryLevel - 1, 0);

            onUpdate({ ...concept, masteryLevel: newLevel });

            // Server Update
            await updateMasteryAction(concept.id, isCorrect);

            if (isCorrect) {
                toast.success("Correct! Mastery Level Increased.");
            } else {
                toast.error("Incorrect. Mastery Level Decreased.");
            }
        } catch (e) {
            console.error("Failed to update mastery", e);
            toast.error("Failed to save progress");
        }
    };

    return (
        <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold text-primary">{concept.term}</CardTitle>
                <div className="flex gap-2">
                    <Badge variant={concept.masteryLevel >= 5 ? "default" : "secondary"}>
                        Lvl {concept.masteryLevel}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-red-500" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-lg mb-4">{concept.definition}</p>

                {/* Edit Dialog */}
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Concept</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Definition</Label>
                                <Textarea
                                    value={editValues.definition}
                                    onChange={e => setEditValues({ ...editValues, definition: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Explanation</Label>
                                <Textarea
                                    value={editValues.explanation}
                                    onChange={e => setEditValues({ ...editValues, explanation: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Real World Example</Label>
                                <Textarea
                                    value={editValues.realWorldExample}
                                    onChange={e => setEditValues({ ...editValues, realWorldExample: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
                {/* Deep Dive Dialog */}
                {deepDive && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <BookOpen className="w-4 h-4 mr-2" /> Deep Dive
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Deep Dive: {concept.term}</DialogTitle>
                            </DialogHeader>
                            <Tabs defaultValue="case" className="mt-4">
                                <TabsList>
                                    <TabsTrigger value="case">Mini Case</TabsTrigger>
                                    <TabsTrigger value="pitfalls">Common Pitfalls</TabsTrigger>
                                    <TabsTrigger value="related">Related Concepts</TabsTrigger>
                                </TabsList>
                                <TabsContent value="case" className="mt-4 space-y-2">
                                    <h4 className="font-semibold">Scenario</h4>
                                    <p className="text-muted-foreground">{deepDive.miniCase}</p>
                                    <h4 className="font-semibold mt-4">Real World Example</h4>
                                    <p className="text-muted-foreground">{concept.realWorldExample}</p>
                                </TabsContent>
                                <TabsContent value="pitfalls" className="mt-4">
                                    <ul className="list-disc pl-5 space-y-2">
                                        {JSON.parse(deepDive.pitfalls).map((p: string, i: number) => (
                                            <li key={i}>{p}</li>
                                        ))}
                                    </ul>
                                </TabsContent>
                                <TabsContent value="related" className="mt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {relatedConcepts.map((c: string, i: number) => (
                                            <Badge key={i} variant="outline">{c}</Badge>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Quiz Dialog */}
                {quiz && (
                    <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <BrainCircuit className="w-4 h-4 mr-2" /> Quiz Me
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Quiz: {concept.term}</DialogTitle>
                                <DialogDescription>Test your knowledge.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <p className="font-medium text-lg">{quiz.question}</p>
                                <div className="space-y-2 overflow-x-auto p-1 max-w-full">
                                    {quizOptions.map((option, idx) => (
                                        <Button
                                            key={idx}
                                            variant={quizSelected === option ? (showAnswer ? (option === quiz.correctAnswer ? "default" : "destructive") : "secondary") : "outline"}
                                            className={`w-full justify-start text-left h-auto py-3 whitespace-normal break-words ${showAnswer && option === quiz.correctAnswer ? "bg-green-100 border-green-500 text-green-900 hover:bg-green-200" : ""
                                                }`}
                                            onClick={() => {
                                                if (showAnswer) return;
                                                setQuizSelected(option);
                                            }}
                                        >
                                            <div className="flex items-start w-full">
                                                <div className="mr-3 mt-0.5 shrink-0">
                                                    {showAnswer && option === quiz.correctAnswer && <Check className="w-4 h-4" />}
                                                    {showAnswer && quizSelected === option && option !== quiz.correctAnswer && <X className="w-4 h-4" />}
                                                    {!showAnswer && <div className="w-4 h-4" />}
                                                </div>
                                                <span className="flex-1 min-w-0 text-sm whitespace-pre-wrap">{option}</span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <DialogFooter>
                                {showAnswer ? (
                                    <Button onClick={() => { setIsQuizOpen(false); setShowAnswer(false); setQuizSelected(null); }}>
                                        Close
                                    </Button>
                                ) : (
                                    <Button onClick={handleQuizSubmit} disabled={!quizSelected}>
                                        Check Answer
                                    </Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </CardFooter>
        </Card>
    );
}
