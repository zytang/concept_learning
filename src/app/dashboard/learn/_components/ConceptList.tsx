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
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search concepts..."
                    className="pl-8 max-w-sm"
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
