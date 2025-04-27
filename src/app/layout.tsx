import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster as SonnerToaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple Evaluation - Performance Evaluations Made Easy",
  description: "Simplify performance evaluations with customizable questions, dynamic reward models, and transparent approval workflows.",
  keywords: ["performance evaluation", "employee assessment", "performance management", "hr software"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <SonnerToaster position="top-right" />
        <Analytics />
      </body>
    </html>
  );
} 