"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteConceptAction(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.concept.delete({
        where: {
            id,
            userId, // Security: Ensure user owns the concept
        },
    });

    revalidatePath("/dashboard/learn");
}

export async function updateConceptAction(id: string, data: { term?: string; definition?: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.concept.update({
        where: {
            id,
            userId,
        },
        data: {
            term: data.term,
            definition: data.definition,
        },
    });

    revalidatePath("/dashboard/learn");
}
