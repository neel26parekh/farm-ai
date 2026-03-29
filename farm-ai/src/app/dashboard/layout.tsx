"use client";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: "var(--sidebar-width)",
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
