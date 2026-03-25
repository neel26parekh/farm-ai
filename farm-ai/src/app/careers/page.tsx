import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function CareersPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)", padding: "var(--space-8) var(--space-4)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link href="/" style={{ color: "var(--emerald-500)", display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-8)" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <Briefcase size={48} style={{ color: "var(--emerald-500)", marginBottom: "var(--space-6)" }} />
        <h1 style={{ fontSize: "2.5rem", marginBottom: "var(--space-6)" }}>Join FarmAI</h1>
        
        <div style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--gray-300)" }}>
          <p style={{ marginBottom: "var(--space-4)" }}>
            We are looking for extraordinary builders to join our mission of transforming global agriculture. 
            If you thrive in high-velocity environments and want to work on complex ML problems (CV, NLP, Forecasting) that directly impact millions of lives, we want to hear from you.
          </p>
          
          <div style={{ padding: "var(--space-6)", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", marginTop: "var(--space-8)" }}>
            <h3 style={{ color: "var(--emerald-400)", marginBottom: "var(--space-2)" }}>Open Roles</h3>
            <p>Please contact the founder directly for the list of open roles you wish to advertise here.</p>
            <p style={{ fontSize: "0.9rem", color: "var(--gray-400)", marginTop: "var(--space-4)" }}>
              (Note to user: Please let me know what specific roles like Senior ML Engineer, Full-Stack Developer, etc. you would like to list on this page!)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
