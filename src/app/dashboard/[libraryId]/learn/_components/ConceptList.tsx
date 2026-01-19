"use client";

import { useState } from "react";
import { Concept, DeepDive, Quiz } from "@prisma/client";
import { StudyInterface } from "./StudyInterface";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type ConceptWithRelations = Concept & {
    deepDive: DeepDive | null;
    quizzes: Quiz[];
};

interface ConceptListProps {
    initialConcepts: ConceptWithRelations[];
    readOnly?: boolean;
}

export function ConceptList({ initialConcepts, readOnly = false }: ConceptListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [concepts, setConcepts] = useState(initialConcepts);

    const filteredConcepts = concepts.filter(c =>
        c.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    placeholder="Search your library..."
                    className="pl-10 h-12 text-lg shadow-sm hover:shadow-md transition-shadow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-6">
                {filteredConcepts.map((concept) => (
                    <StudyInterface
                        key={concept.id}
                        concept={concept}
                        readOnly={readOnly}
                        onUpdate={(updated) => {
                            if (readOnly) return;
                            setConcepts(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
                        }}
                        onDelete={(id) => {
                            if (readOnly) return;
                            setConcepts(prev => prev.filter(p => p.id !== id));
                        }}
                    />
                ))}
            </div>

            {filteredConcepts.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    No concepts found matching "{searchTerm}".
                </div>
            )}
        </div>
    );
}
