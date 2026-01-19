"use client";

import { useState } from "react";
import { Concept, Quiz, DeepDive } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { StudyInterface } from "./StudyInterface";

interface ConceptListProps {
    initialConcepts: (Concept & {
        quizzes: Quiz[];
        deepDive: DeepDive | null;
    })[];
    readOnly?: boolean;
}

export function ConceptList({ initialConcepts, readOnly }: ConceptListProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConcepts = initialConcepts.filter(concept =>
        concept.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-lg mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search concepts..."
                    className="pl-12 py-6 text-lg shadow-md border-primary/20 focus-visible:ring-primary/30 rounded-full bg-white transition-all hover:shadow-lg hover:border-primary/40"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredConcepts.map((concept) => (
                    <StudyInterface key={concept.id} concept={concept} readOnly={readOnly} />
                ))}

                {filteredConcepts.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        {searchTerm ? "No matching concepts found." : "No concepts found. Go to \"Add Concepts\" to get started."}
                    </div>
                )}
            </div>
        </div>
    );
}
