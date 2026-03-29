import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function GenericPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)", padding: "var(--space-8) var(--space-4)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link href="/" style={{ color: "var(--emerald-500)", display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-8)" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <FileText size={48} style={{ color: "var(--emerald-500)", marginBottom: "var(--space-6)" }} />
        <h1 style={{ fontSize: "2.5rem", marginBottom: "var(--space-6)" }}>Legal & Policies</h1>
        
        <div style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--gray-300)" }}>
          <p style={{ marginBottom: "var(--space-4)" }}>
            This page serves as a placeholder for the AgroNexus Terms of Service, Privacy Policy, and legal documentation.
          </p>
          <p>
            By using AgroNexus, you agree that ML-generated predictions (Market forecasts, Disease diagnoses, AI Advice) are advisory in nature. AgroNexus is not liable for autonomous crop execution errors based on platform recommendations. 
          </p>
        </div>
      </div>
    </div>
  );
}
