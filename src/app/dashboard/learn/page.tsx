import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Need to install badge? I'll use standard span or add it. I'll use span for now to be safe.
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flashcard } from "@/components/Flashcard";
import { Quiz } from "@/components/Quiz";
import { DeepDive } from "@/components/DeepDive";
import { ConceptMap } from "@/components/ConceptMap";
import { ConceptList } from "./_components/ConceptList";
import { ShareButton } from "./_components/ShareButton";

export default async function LearnPage() {
    const user = await currentUser();
    if (!user) redirect("/");

    const concepts = await db.concept.findMany({
        where: { userId: user.id },
        include: {
            quizzes: true,
            deepDive: true,
        },
        orderBy: { term: 'asc' },
    });

    // Prepare data for Concept Map
    const mapData = concepts.map(c => ({
        id: c.id,
        term: c.term,
        explanation: c.explanation,
        definition: c.definition,
    }));

    const deepDives = concepts.filter(c => c.deepDive).map(c => ({
        conceptId: c.id,
        relatedConcepts: JSON.parse(c.deepDive!.relatedConcepts) as string[],
    }));

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Study Mode</h2>
                <div className="flex items-center gap-4">
                    <p className="text-muted-foreground">Master your concepts through active recall and application.</p>
                    <div className="flex-1" />
                    <ShareButton userId={user.id} />
                </div>
            </div>

            {concepts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Knowledge Map</h3>
                    <ConceptMap concepts={mapData} deepDives={deepDives} />
                </div>
            )}

            <ConceptList initialConcepts={concepts} />

        </div>
    );
}
