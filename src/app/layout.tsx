import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MIS Active Learning Platform",
  description: "Master MIS concepts through active learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${outfit.variable} ${inter.variable} font-sans antialiased`}
          suppressHydrationWarning
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
