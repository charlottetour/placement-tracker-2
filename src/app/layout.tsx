import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StageTrack — Suivi de recherche de stage",
  description: "Plateforme personnelle pour suivre mes candidatures de stage",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const alertCount = await prisma.followUp.count({
    where: { done: false, dueAt: { lte: new Date(new Date().setHours(23, 59, 59, 999)) } },
  });

  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <Providers>
          <AppShell alertCount={alertCount}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
