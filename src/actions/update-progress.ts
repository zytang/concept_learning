"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateMasteryAction(conceptId: string, isCorrect: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const concept = await db.concept.findUnique({
        where: { id: conceptId, userId },
    });

    if (!concept) throw new Error("Concept not found");

    // Simple Mastery Logic: 0-5
    // Correct: +1
    // Incorrect: -1 (min 0)
    let newLevel = concept.masteryLevel;
    if (isCorrect) {
        newLevel = Math.min(newLevel + 1, 5);
    } else {
        newLevel = Math.max(newLevel - 1, 0);
    }

    // Update Next Review Date (Simple spaced repetition: level * 1 day)
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + (newLevel === 0 ? 0 : Math.pow(2, newLevel - 1)));

    await db.concept.update({
        where: { id: conceptId },
        data: {
            masteryLevel: newLevel,
            nextReviewDate: nextReview,
        },
    });

    // Log Activity
    await db.activityLog.create({
        data: {
            userId,
            action: "QUIZ_ATTEMPT",
            details: JSON.stringify({ conceptId, isCorrect, newLevel }),
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/learn");
}
