import { db } from "@/lib/db";
import { ConceptList } from "../../dashboard/[libraryId]/learn/_components/ConceptList";
import { ConceptMap } from "@/components/ConceptMap";
import { notFound } from "next/navigation";

interface SharePageProps {
    params: Promise<{ userId: string }>;
    searchParams: Promise<{ libraryId?: string }>;
}

export default async function SharePage(props: SharePageProps) {
    const params = await props.params;
    const { userId } = params;
    const searchParams = await props.searchParams;
    const libraryId = searchParams?.libraryId;

    const user = await db.user.findUnique({
        where: { id: userId },
    });

    if (!user) return notFound();

    const whereClause: any = { userId: userId };
    if (libraryId) {
        whereClause.libraryId = libraryId;
    }

    const concepts = await db.concept.findMany({
        where: whereClause,
        include: {
            quizzes: true,
            deepDive: true,
        },
        orderBy: { term: 'asc' },
    });

    let libraryName = "";
    if (libraryId) {
        const library = await db.library.findUnique({
            where: { id: libraryId }
        });
        if (library) libraryName = library.name;
    }

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
                <h1 className="text-3xl font-bold tracking-tight">
                    {libraryName ? `Study: ${libraryName}` : "Shared Study Materials"}
                </h1>
                <p className="text-muted-foreground">
                    {libraryName
                        ? `Learning concepts from ${libraryName} shared by ${user.email}`
                        : `Learning concepts shared by ${user.email}`
                    }
                </p>
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
