import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import PWAPrompt from "@/components/PWAPrompt";

export const metadata: Metadata = {
  title: "AgroNexus — Precision Agricultural Intelligence & ML Market Forecasts",
  description:
    "The institutional-grade platform for modern agriculture. Live Mandi price tracking, Prophet-driven market forecasts, and hyper-local weather intelligence for optimized farm management.",
  keywords: [
    "AgroNexus",
    "agricultural intelligence",
    "mandi prices live",
    "wheat price forecast",
    "crop disease detection AI",
    "precision farming india",
    "agtech saas",
  ],
  manifest: "/manifest.json",
  themeColor: "#065f46", // Dark Emerald
  authors: [{ name: "AgroNexus Global" }],
  openGraph: {
    title: "AgroNexus — High-Precision Farm Intelligence",
    description:
      "Empowering the next generation of farmers with live market sync and AI-powered field advisory.",
    url: "https://agronexus.ai",
    siteName: "AgroNexus",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgroNexus Platform Overview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgroNexus — AI-Powered Agricultural Intelligence",
    description: "Live market sync and ML-driven forecasts for modern farm operations.",
    images: ["/images/og-image.png"],
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
        <div className="noise-overlay" />
        <AuthProvider>
          <LanguageProvider>
            {children}
            <PWAPrompt />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
