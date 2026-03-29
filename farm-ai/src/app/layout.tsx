import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "FarmAI — AI-Powered Agricultural Intelligence",
  description:
    "Detect crop diseases instantly, get real-time market prices, and receive AI-powered farming advice. Built for Indian farmers, powered by artificial intelligence.",
  keywords: [
    "agriculture",
    "AI",
    "crop disease detection",
    "farming",
    "India",
    "market prices",
    "weather advisory",
  ],
  manifest: "/manifest.json",
  themeColor: "#10b981",
  authors: [{ name: "FarmAI" }],
  openGraph: {
    title: "FarmAI — AI-Powered Agricultural Intelligence",
    description:
      "Detect crop diseases instantly, get real-time market prices, and receive AI-powered farming advice.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
