import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Mood Mix — Cocktails for how you feel",
  description:
    "AI-crafted cocktails tailored to your mood and moment. An emotionally intelligent luxury cocktail experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(serif.variable, sans.variable)}>
      <body className={cn(sans.className, "min-h-screen")}>{children}</body>
    </html>
  );
}
