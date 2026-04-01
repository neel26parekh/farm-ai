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
          padding: "32px 40px",
          transition: "margin-left var(--transition-base)",
          minWidth: 0,
          background: "#fafaf8",
        }}
      >
        {children}
      </main>
    </div>
  );
}
