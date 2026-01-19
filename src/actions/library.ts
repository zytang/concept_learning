"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Type definitions for the export format
export type ExportedQuiz = {
    question: string;
    options: string; // JSON string
    correctAnswer: string;
};

export type ExportedDeepDive = {
    miniCase: string;
    pitfalls: string; // JSON string
    relatedConcepts: string; // JSON string
};

export type ExportedConcept = {
    term: string;
    definition: string;
    explanation: string;
    realWorldExample: string;
    quizzes: ExportedQuiz[];
    deepDive: ExportedDeepDive | null;
};

export type LibraryExport = {
    version: number;
    exportedAt: string;
    concepts: ExportedConcept[];
};

export async function getLibraryExport(libraryId?: string): Promise<LibraryExport> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const concepts = await db.concept.findMany({
        where: {
            userId,
            ...(libraryId ? { libraryId } : {}),
        },
        include: {
            quizzes: true,
            deepDive: true,
        },
    });

    const cleanConcepts: ExportedConcept[] = concepts.map(c => ({
        term: c.term,
        definition: c.definition,
        explanation: c.explanation,
        realWorldExample: c.realWorldExample,
        quizzes: c.quizzes.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
        })),
        deepDive: c.deepDive ? {
            miniCase: c.deepDive.miniCase,
            pitfalls: c.deepDive.pitfalls,
            relatedConcepts: c.deepDive.relatedConcepts,
        } : null,
    }));

    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        concepts: cleanConcepts,
    };
}

export async function importLibrary(data: LibraryExport, libraryName: string, description?: string) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) throw new Error("Unauthorized");

    // Ensure user exists
    let dbUser = await db.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
        dbUser = await db.user.create({
            data: {
                id: userId,
                email: user.emailAddresses[0]?.emailAddress || "unknown@example.com",
            }
        });
    }

    if (!data.concepts || !Array.isArray(data.concepts)) {
        throw new Error("Invalid library format");
    }

    // Create a new library for this import
    const newLibrary = await db.library.create({
        data: {
            userId,
            name: libraryName,
            description: description || `Imported library from ${new Date().toLocaleDateString()}`,
        }
    });

    let importedCount = 0;

    for (const c of data.concepts) {
        // We do not check for duplicates across OTHER libraries, only within this new one?
        // Since it's a new library, it's empty. We can just create everything.

        await db.concept.create({
            data: {
                userId,
                libraryId: newLibrary.id,
                term: c.term,
                definition: c.definition,
                explanation: c.explanation,
                realWorldExample: c.realWorldExample,
                masteryLevel: 0,
                nextReviewDate: new Date(),
                quizzes: {
                    create: c.quizzes.map(q => ({
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                    }))
                },
                deepDive: c.deepDive ? {
                    create: {
                        miniCase: c.deepDive.miniCase,
                        pitfalls: c.deepDive.pitfalls,
                        relatedConcepts: c.deepDive.relatedConcepts,
                    }
                } : undefined,
            }
        });
        importedCount++;
    }

    revalidatePath("/dashboard");
    return { success: true, count: importedCount, libraryId: newLibrary.id };
}
