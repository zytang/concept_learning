"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import { generateConceptsAction } from "@/actions/generate-concepts";

const formSchema = z.object({
    concepts: z.string().min(2, {
        message: "Please enter at least one concept.",
    }),
});

export default function AddConceptsPage() {
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            concepts: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsGenerating(true);
        try {
            // Split by comma or new line
            const terms = values.concepts.split(/[\n,]+/).map(t => t.trim()).filter(t => t.length > 0);

            if (terms.length === 0) {
                toast.error("Error", { description: "No valid terms found" });
                setIsGenerating(false);
                return;
            }

            await generateConceptsAction(terms);

            toast.success("Success", {
                description: `Generated content for ${terms.length} concepts.`,
            });
            form.reset();
        } catch (error: any) {
            console.error("Client Error:", error);
            toast.error("Generation Failed", {
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Add New Concepts</h2>
                <p className="text-muted-foreground">
                    Enter a list of terms you want to master. We'll generate definitions, quizzes, and deep dives for you.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Input Concepts</CardTitle>
                    <CardDescription>
                        Enter terms separated by commas or new lines (e.g., "Normalization, SQL, Primary Key").
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="concepts"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key Terms</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Database, Cloud Computing, Enterprise Resource Planning..."
                                                className="min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isGenerating} className="w-full">
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Content...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Generate Learning Material
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
