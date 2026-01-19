"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Clock, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteLibraryAction } from "@/actions/libraries";
import { toast } from "sonner";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface LibraryCardProps {
    id: string;
    name: string;
    description: string | null;
    count: number;
    updatedAt: Date;
}

export function LibraryCard({ id, name, description, count, updatedAt }: LibraryCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        setIsDeleting(true);
        try {
            await deleteLibraryAction(id);
            toast.success("Library deleted");
        } catch (error) {
            toast.error("Failed to delete library");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="flex flex-col hover:border-primary/50 transition-colors group relative">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl line-clamp-1" title={name}>{name}</CardTitle>
                    <Badge variant="secondary" className="font-normal">
                        {count} concepts
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2 h-10">
                    {description || "No description provided."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Updated {new Date(updatedAt).toLocaleDateString()}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-4 border-t bg-secondary/5">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Library?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete <strong>{name}</strong> and all {count} concepts inside it. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Link href={`/dashboard/${id}`} className="w-full ml-2">
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Open Library <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
