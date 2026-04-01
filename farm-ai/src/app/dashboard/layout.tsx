"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        style={{
          flex: 1,
          marginLeft: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
          padding: "var(--space-6) var(--space-5)",
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
