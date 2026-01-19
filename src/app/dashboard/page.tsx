import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CreateLibraryDialog } from "./_components/CreateLibraryDialog";
import { LibraryCard } from "./_components/LibraryCard";
import { ImportLibraryButton } from "./_components/ImportLibraryButton";

export default async function LibraryPickerPage() {
    const user = await currentUser();
    if (!user) return null;

    // Fetch user libraries
    const libraries = await db.library.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        include: {
            _count: {
                select: { concepts: true }
            }
        }
    });

    return (
        <div className="space-y-8 container mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Libraries</h1>
                    <p className="text-muted-foreground">Select a subject to start studying.</p>
                </div>
                <div className="flex gap-2">
                    <ImportLibraryButton />
                    <CreateLibraryDialog />
                </div>
            </div>

            {libraries.length === 0 ? (
                <div className="text-center py-20 border rounded-lg bg-secondary/10 border-dashed">
                    <h3 className="text-lg font-medium">No libraries yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first subject library to get started.</p>
                    <CreateLibraryDialog />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraries.map((lib) => (
                        <LibraryCard
                            key={lib.id}
                            id={lib.id}
                            name={lib.name}
                            description={lib.description}
                            count={lib._count.concepts}
                            updatedAt={lib.updatedAt}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
