"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

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
          padding: "var(--space-6) var(--space-5)", /* Responsive padding via variables */
          transition: "margin-left var(--transition-base), padding 0.3s ease",
          minWidth: 0,
          background: "var(--bg-page)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
