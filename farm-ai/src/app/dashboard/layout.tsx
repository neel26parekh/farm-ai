"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Volume2 } from "lucide-react";
import VoiceReader from "./advisor/VoiceReader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateLayout = () => setIsMobile(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

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
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          fontWeight: 600,
        }}>
          <VoiceReader text="Welcome to your Dashboard. Here you can check your crop health, get weather advisories, check mandi market prices, and run a disease scan on your crops." />
          <span style={{ fontSize: '0.9rem', marginRight: '6px' }}>Audio Tour</span>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
