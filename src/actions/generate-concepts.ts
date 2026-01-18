"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generateConceptContent } from "@/lib/ai";
import { revalidatePath } from "next/cache";

export async function generateConceptsAction(terms: string[]) {
    console.log("🚀 Server Action: generateConceptsAction started", { terms });

    const session = await auth();
    console.log("👤 Auth Session:", session ? "Found" : "Missing", { userId: session?.userId });
    const { userId } = session;

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
                term: term,
            }
        });

        if (existing) continue;

        const content = await generateConceptContent(term);

        if (content) {
            await db.$transaction(async (tx) => {
                const concept = await tx.concept.create({
                    data: {
                        userId,
                        term,
                        definition: content.definition,
                        explanation: content.explanation,
                        realWorldExample: content.realWorldExample,
                    }
                });

                // Create Deep Dive
                await tx.deepDive.create({
                    data: {
                        conceptId: concept.id,
                        miniCase: content.miniCase,
                        pitfalls: JSON.stringify(content.pitfalls),
                        relatedConcepts: JSON.stringify(content.relatedConcepts),
                    },
                });

                // Create Quiz
                await tx.quiz.create({
                    data: {
                        conceptId: concept.id,
                        question: content.quizQuestion,
                        options: JSON.stringify(content.quizOptions),
                        correctAnswer: content.quizCorrectAnswer,
                    },
                });
            });
        }
    }

    revalidatePath("/dashboard");
}
