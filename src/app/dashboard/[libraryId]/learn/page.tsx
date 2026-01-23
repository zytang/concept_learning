import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ConceptMap } from "@/components/ConceptMap";
import { ConceptList } from "./_components/ConceptList";
import { ShareButton } from "./_components/ShareButton";
import { LibraryManager } from "./_components/LibraryManager";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ libraryId: string }>;
}

export default async function LearnPage({ params }: PageProps) {
    const user = await currentUser();
    if (!user) redirect("/");

    const { libraryId } = await params;

    const library = await db.library.findUnique({
        where: { id: libraryId, userId: user.id }
    });

    if (!library) notFound();

    const concepts = await db.concept.findMany({
        where: {
            userId: user.id,
            libraryId: libraryId,
        },
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
                <h2 className="text-3xl font-bold tracking-tight">Study: {library.name}</h2>
                <div className="flex items-center gap-4">
                    <p className="text-muted-foreground">Master your concepts through active recall and application.</p>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                        <LibraryManager libraryId={libraryId} libraryName={library.name} />
                        <ShareButton userId={user.id} libraryId={libraryId} />
                    </div>
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
