"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, FileJson } from "lucide-react";
import { importLibrary, LibraryExport } from "@/actions/library";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ImportLibraryButton() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"upload" | "details">("upload");

    // Form State
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Auto-fill name from filename
            const cleanName = selectedFile.name.replace('.json', '').replace(/[-_]/g, ' ');
            // Title case (optional, simplistic)
            const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

            setName(formattedName);
            setStep("details");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        try {
            const text = await file.text();
            let data: LibraryExport;

            try {
                data = JSON.parse(text) as LibraryExport;
            } catch (e) {
                toast.error("Invalid JSON file");
                setIsLoading(false);
                return;
            }

            const result = await importLibrary(data, name, description);

            if (result.success) {
                toast.success(`Imported ${result.count} concepts into "${name}"`);
                setOpen(false);
                resetForm();
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to import library");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setName("");
        setDescription("");
        setStep("upload");
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Import Library
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Import Library</DialogTitle>
                        <DialogDescription>
                            Upload a JSON file to create a new library.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {step === "upload" && (
                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 cursor-pointer hover:bg-secondary/50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    accept=".json"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                                <p className="text-sm text-muted-foreground font-medium">Click to upload JSON file</p>
                            </div>
                        )}

                        {step === "details" && (
                            <>
                                <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-md text-sm text-muted-foreground mb-2">
                                    <FileJson className="h-4 w-4" />
                                    <span className="truncate flex-1">{file?.name}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => { setStep("upload"); setFile(null); }}>Change</Button>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Library Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        minLength={2}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Customize your description..."
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        {step === "details" && (
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
                                    </>
                                ) : (
                                    "Create Library"
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
