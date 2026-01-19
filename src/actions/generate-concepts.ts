"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generateConceptContent } from "@/lib/ai";
import { revalidatePath } from "next/cache";

export async function generateConceptsAction(terms: string[], libraryId: string) {
    console.log("🚀 Server Action: generateConceptsAction started", { terms, libraryId });

    const { userId } = await auth();
    if (!userId) {
        console.error("❌ Authorization Failed: No userId found");
        throw new Error("Unauthorized: Please sign in again.");
    }

    // Ensure user exists in DB (sync with Clerk)
    // Simple upsert primarily to ensure ID exists
    const userEmail = "placeholder@example.com"; // In real app, fetch from Clerk API or webhook
    await db.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: userId, // Placeholder if email not available in session claims easily
        }
    });

    for (const term of terms) {
        // Check if concept already exists to avoid duplicates
        const existing = await db.concept.findFirst({
            where: {
                userId,
                libraryId, // Added libraryId to check for existing concepts within the specific library
                term: term,
            }
        });

        if (existing) continue;

        const content = await generateConceptContent(term);

        // Even if content generation fails partially, we still want to create a concept
        // with placeholder data so the user can edit it.
        await db.concept.create({
            data: {
                userId,
                libraryId,
                term: content?.definition ? term : `${term} (Failed Generation)`,
                definition: content?.definition || "Failed to generate content. Please edit manually.",
                explanation: content?.explanation || "",
                realWorldExample: content?.realWorldExample || "",
                masteryLevel: 0, // Initialize mastery level
                quizzes: content?.quizQuestion ? {
                    create: {
                        question: content.quizQuestion,
                        options: JSON.stringify(content.quizOptions),
                        correctAnswer: content.quizCorrectAnswer,
                    },
                } : undefined,
                deepDive: content?.miniCase ? {
                    create: {
                        miniCase: content.miniCase,
                        pitfalls: JSON.stringify(content.pitfalls),
                        relatedConcepts: JSON.stringify(content.relatedConcepts),
                    }
                } : undefined
            }
        });
    }
    revalidatePath("/dashboard");
}
