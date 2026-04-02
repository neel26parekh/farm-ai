"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

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
          minWidth: 0,
          background: "var(--bg-page)",
        }}
      >
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
