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
          padding: "var(--space-8)",
          transition: "margin-left var(--transition-base)",
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}
