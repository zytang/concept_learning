import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center p-4">
      <div className="mb-8">
        <Logo size="large" />
      </div>
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
