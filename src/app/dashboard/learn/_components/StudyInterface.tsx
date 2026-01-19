"use client";

import { useState } from "react";
import { Concept, Quiz as QuizType, DeepDive as DeepDiveType } from "@prisma/client"; // Need to ensure type access
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Flashcard } from "@/components/Flashcard";
import { Quiz } from "@/components/Quiz";
import { DeepDive } from "@/components/DeepDive";
import { updateMasteryAction } from "@/actions/update-progress";
import { toast } from "sonner";
import { Brain, BookOpen, HelpCircle, MoreVertical, Trash2, Edit, Zap } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { deleteConceptAction, updateConceptAction } from "@/actions/concept-management";

interface StudyInterfaceProps {
    concept: Concept & {
        quizzes: QuizType[];
        deepDive: DeepDiveType | null;
    };
    readOnly?: boolean;
}

export function StudyInterface({ concept, readOnly }: StudyInterfaceProps) {
    const [openActivity, setOpenActivity] = useState<"flashcard" | "quiz" | "deepdive" | null>(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Edit Form State
    const [editTerm, setEditTerm] = useState(concept.term);
    const [editDefinition, setEditDefinition] = useState(concept.definition);

    const handleDelete = async () => {
        setIsPending(true);
        try {
            await deleteConceptAction(concept.id);
            toast.success("Concept deleted");
        } catch (e) {
            toast.error("Failed to delete concept");
        } finally {
            setIsPending(false);
            setShowDeleteAlert(false);
        }
    };

    const handleUpdate = async () => {
        setIsPending(true);
        try {
            await updateConceptAction(concept.id, { term: editTerm, definition: editDefinition });
            toast.success("Concept updated");
            setShowEditDialog(false);
        } catch (e) {
            toast.error("Failed to update concept");
        } finally {
            setIsPending(false);
        }
    };

    const handleQuizComplete = async (isCorrect: boolean) => {
        try {
            await updateMasteryAction(concept.id, isCorrect);
            toast.success(isCorrect ? "Correct! +1 Mastery" : "Incorrect. Keep practicing!", {
                description: isCorrect ? "Great job applying the concept." : "Review the flashcard and try again.",
            });
            setOpenActivity(null); // Close on complete
        } catch (e) {
            toast.error("Failed to save progress");
        }
    };

    const masteryColor =
        concept.masteryLevel >= 4 ? "bg-green-100 text-green-800" :
            concept.masteryLevel >= 2 ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-800";

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-2 flex-1 mr-2 leading-tight" title={concept.term}>{concept.term}</CardTitle>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${masteryColor}`}>
                            Lvl {concept.masteryLevel}
                        </span>
                        {new Date(concept.nextReviewDate) <= new Date() && (
                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 text-amber-800 flex items-center gap-1">
                                <Zap size={12} fill="currentColor" /> Due
                            </span>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowDeleteAlert(true)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <CardDescription className="line-clamp-2">{concept.definition}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                {/* Placeholder for stats or mini-graph */}
            </CardContent>

            <CardFooter className="grid grid-cols-3 gap-2">
                <Dialog open={openActivity === "flashcard"} onOpenChange={(open) => setOpenActivity(open ? "flashcard" : null)}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full flex flex-col h-auto py-2 gap-1 text-xs">
                            <Brain size={16} />
                            Review
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Flashcard: {concept.term}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Flashcard
                                term={concept.term}
                                definition={concept.definition}
                                explanation={concept.explanation}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={openActivity === "quiz"} onOpenChange={(open) => setOpenActivity(open ? "quiz" : null)}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full flex flex-col h-auto py-2 gap-1 text-xs">
                            <HelpCircle size={16} />
                            Quiz
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Quiz: {concept.term}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            {concept.quizzes.length > 0 ? (
                                <Quiz
                                    question={concept.quizzes[0].question}
                                    options={JSON.parse(concept.quizzes[0].options) as string[]}
                                    correctAnswer={concept.quizzes[0].correctAnswer}
                                    onComplete={handleQuizComplete}
                                />
                            ) : (
                                <div className="text-center text-muted-foreground p-8">No quiz generated for this concept yet.</div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={openActivity === "deepdive"} onOpenChange={(open) => setOpenActivity(open ? "deepdive" : null)}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full flex flex-col h-auto py-2 gap-1 text-xs">
                            <BookOpen size={16} />
                            Deep Dive
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Deep Dive: {concept.term}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            {concept.deepDive ? (
                                <DeepDive
                                    term={concept.term}
                                    miniCase={concept.deepDive.miniCase}
                                    pitfalls={JSON.parse(concept.deepDive.pitfalls) as string[]}
                                    relatedConcepts={JSON.parse(concept.deepDive.relatedConcepts) as string[]}
                                />
                            ) : (
                                <div className="text-center text-muted-foreground p-8">No deep dive content available.</div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </CardFooter>

            {/* Delete Confirmation */}
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{concept.term}" and all its related quizzes and history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isPending}>
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Concept</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Term</Label>
                            <Input value={editTerm} onChange={(e) => setEditTerm(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Definition</Label>
                            <Textarea value={editDefinition} onChange={(e) => setEditDefinition(e.target.value)} className="min-h-[100px]" />
                        </div>
                        <Button onClick={handleUpdate} className="w-full" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card >
    );
}
