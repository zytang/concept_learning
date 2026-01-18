import { db } from "@/lib/db";
import { ConceptList } from "../../dashboard/learn/_components/ConceptList";
import { ConceptMap } from "@/components/ConceptMap";
import { notFound } from "next/navigation";

interface SharePageProps {
    params: Promise<{ userId: string }>;
}

export default async function SharePage(props: SharePageProps) {
    const params = await props.params;
    const { userId } = params;

    const user = await db.user.findUnique({
        where: { id: userId },
    });

    if (!user) return notFound();

    const concepts = await db.concept.findMany({
        where: { userId: userId },
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
        <div className="container mx-auto py-10 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Shared Study Materials</h1>
                <p className="text-muted-foreground">Learning concepts shared by {user.email}</p>
            </div>

            {concepts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Knowledge Map</h3>
                    <ConceptMap concepts={mapData} deepDives={deepDives} />
                </div>
            )}

            <ConceptList initialConcepts={concepts} readOnly={true} />
        </div>
    );
}
