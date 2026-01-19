import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center p-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        ActiveRecall
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl mb-8">
        Master any subject through active recall, deep dive case studies, and interactive quizzes.
      </p>

      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
