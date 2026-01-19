"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createLibraryAction(data: { name: string; description?: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    if (!data.name || data.name.length < 2) {
        throw new Error("Invalid name");
    }

    // Ensure user exists (sync with Clerk)
    const userEmail = (await currentUser())?.emailAddresses[0]?.emailAddress;
    if (userEmail) {
        await db.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email: userEmail,
            }
        });
    }

    const library = await db.library.create({
        data: {
            userId,
            name: data.name,
            description: data.description,
        },
    });

    revalidatePath("/dashboard");
    return library;
}

export async function getLibrariesAction() {
    const { userId } = await auth();
    if (!userId) return [];

    return await db.library.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { concepts: true },
            },
        },
    });
}

export async function deleteLibraryAction(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.library.delete({
        where: {
            id,
            userId, // Security check
        },
    });

    revalidatePath("/dashboard");
}

export async function getLibraryAction(id: string) {
    const { userId } = await auth();
    if (!userId) return null;

    return await db.library.findUnique({
        where: {
            id,
            userId,
        },
        include: {
            _count: {
                select: { concepts: true },
            },
        },
    });
}
