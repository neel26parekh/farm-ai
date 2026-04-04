"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import VoiceReader from "./advisor/VoiceReader";
import { useLanguage } from "@/lib/LanguageContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const { language } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateLayout = () => setIsMobile(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(pathname || "/dashboard")}`);
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        style={{
          flex: 1,
          marginLeft: isMobile ? "0" : (collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)"),
          padding: isMobile ? "var(--space-4) var(--space-3)" : "var(--space-6) var(--space-5)",
          paddingBottom: "80px", /* Space for mobile nav */
          transition: "margin-left var(--transition-base), padding 0.3s ease",
          position: "relative",
          minWidth: 0,
          background: "var(--bg-page)",
        }}
      >
        {children}
        
        {/* Universal Audio Help Button */}
        <div style={{
          position: 'fixed',
          bottom: isMobile ? '100px' : '30px',
          right: '30px',
          zIndex: 50,
          backgroundColor: '#059669',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '30px',
          boxShadow: '0 10px 25px rgba(5, 150, 105, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'bounce 2s infinite',
        }}>
          <VoiceReader 
            text="Welcome to your Dashboard. Here you can check your crop health, get weather advisories, check mandi market prices, and run a disease scan on your crops." 
            label="Audio Tour • Tap to listen"
            languageCode={language}
          />
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}} />
      <MobileNav />
    </div>
  );
}
