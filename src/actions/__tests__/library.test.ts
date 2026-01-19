import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLibraryExport, importLibrary } from "../library";
import { db } from "@/lib/db";

// Mock auth
vi.mock("@clerk/nextjs/server", () => ({
    auth: vi.fn().mockResolvedValue({ userId: "user_123" }),
}));

// Mock db
vi.mock("@/lib/db", () => ({
    db: {
        concept: {
            findMany: vi.fn(),
            findFirst: vi.fn(),
            create: vi.fn(),
        },
    },
}));

// Mock revalidatePath
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

describe("Library Actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockExportData = {
        version: 1,
        exportedAt: "2024-01-01T00:00:00.000Z",
        concepts: [
            {
                term: "Test Term",
                definition: "Test Definition",
                explanation: "Test Explanation",
                realWorldExample: "Test Example",
                quizzes: [
                    {
                        question: "Test Question",
                        options: JSON.stringify(["A", "B"]),
                        correctAnswer: "A",
                    },
                ],
                deepDive: {
                    miniCase: "Test Case",
                    pitfalls: JSON.stringify(["Mistake 1"]),
                    relatedConcepts: JSON.stringify(["Rel 1"]),
                },
            },
        ],
    };

    describe("getLibraryExport", () => {
        it("should return formatted library data", async () => {
            // Mock DB response
            (db.concept.findMany as any).mockResolvedValue([
                {
                    ...mockExportData.concepts[0],
                    id: "concept_1",
                    userId: "user_123",
                    masteryLevel: 3, // Should be stripped
                    nextReviewDate: new Date(),
                    createdAt: new Date(),
                    quizzes: [
                        {
                            ...mockExportData.concepts[0].quizzes[0],
                            id: "quiz_1",
                            conceptId: "concept_1",
                        },
                    ],
                    deepDive: {
                        ...mockExportData.concepts[0].deepDive,
                        id: "dd_1",
                        conceptId: "concept_1",
                    },
                },
            ]);

            const result = await getLibraryExport();

            expect(result.version).toBe(1);
            expect(result.concepts).toHaveLength(1);
            expect(result.concepts[0].term).toBe("Test Term");
            // Ensure internal fields are stripped
            expect((result.concepts[0] as any).id).toBeUndefined();
            expect((result.concepts[0] as any).masteryLevel).toBeUndefined();
        });
    });

    describe("importLibrary", () => {
        it("should import concepts that do not exist", async () => {
            // Mock finding no existing concepts
            (db.concept.findFirst as any).mockResolvedValue(null);

            const result = await importLibrary(mockExportData);

            expect(db.concept.create).toHaveBeenCalledTimes(1);
            expect(result.count).toBe(1);
            expect(result.success).toBe(true);
        });

        it("should skip concepts that already exist", async () => {
            // Mock finding existing concept
            (db.concept.findFirst as any).mockResolvedValue({ id: "existing_1" });

            const result = await importLibrary(mockExportData);

            expect(db.concept.create).not.toHaveBeenCalled();
            expect(result.count).toBe(0);
        });
    });
});
