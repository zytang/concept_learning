import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, Zap } from "lucide-react";
import { QuickActions } from "./_components/QuickActions";

export default async function DashboardPage() {
    const user = await currentUser();

    // user will be present because of middleware
    if (!user) return null;

    // Fetch counts
    // Fetch counts with error handling for debugging Vercel deployment
    let conceptCount = 0;
    let masteredCount = 0;
    let dueCount = 0;
    let dbError = null;

    try {
        conceptCount = await db.concept.count({
            where: { userId: user.id },
        });

        masteredCount = await db.concept.count({
            where: {
                userId: user.id,
                masteryLevel: { gte: 5 }
            },
        });

        const now = new Date();
        dueCount = await db.concept.count({
            where: {
                userId: user.id,
                nextReviewDate: { lte: now }
            }
        });
    } catch (e: any) {
        console.error("Database Connection Error:", e);
        dbError = e.message || "Database connection failed";
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-heading font-bold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                        Hello, {user.firstName || "Scholar"}
                    </h2>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Ready to master some new concepts today?
                    </p>
                </div>
                <div className="text-sm text-muted-foreground font-medium bg-secondary/50 px-3 py-1 rounded-full w-fit">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {dbError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mb-4">
                    <strong>System Error:</strong> {dbError}. Please check Vercel Storage connection.
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2">
                {/* Total Concepts - Large Card */}
                <Card className="md:col-span-4 md:row-span-2 bg-gradient-to-br from-primary to-violet-700 text-white border-none shadow-xl shadow-primary/20 relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Brain size={180} />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-blue-100 font-medium text-lg">Library Size</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-[calc(100%-4rem)]">
                        <div>
                            <div className="text-6xl font-bold tracking-tighter">{conceptCount}</div>
                            <p className="text-blue-200 mt-1">Total Concepts</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-4">
                            <p className="text-xs text-blue-100 mb-1">Status</p>
                            <div className="flex items-center gap-2 font-medium">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Active Learning
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Mastery Status */}
                <Card className="md:col-span-4 md:row-span-1 border-muted hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Mastery Level</CardTitle>
                        <Target className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-foreground">{masteredCount}</span>
                            <span className="text-sm text-muted-foreground">/ {conceptCount}</span>
                        </div>
                        <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${conceptCount > 0 ? (masteredCount / conceptCount) * 100 : 0}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {conceptCount > 0 && Math.round((masteredCount / conceptCount) * 100)}% Mastered
                        </p>
                    </CardContent>
                </Card>

                {/* Due for Review */}
                <Card className="md:col-span-4 md:row-span-1 border-muted hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Due for Review</CardTitle>
                        <Zap className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{dueCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {dueCount === 0 ? "You're all caught up!" : "Concepts need attention"}
                        </p>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="md:col-span-8 md:row-span-1 border-muted bg-secondary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QuickActions />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
