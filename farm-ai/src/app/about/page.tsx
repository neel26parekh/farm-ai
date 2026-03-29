import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)", padding: "var(--space-8) var(--space-4)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link href="/" style={{ color: "var(--emerald-500)", display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-8)" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <Building2 size={48} style={{ color: "var(--emerald-500)", marginBottom: "var(--space-6)" }} />
        <h1 style={{ fontSize: "2.5rem", marginBottom: "var(--space-6)" }}>About AgroNexus</h1>
        
        <div style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--gray-300)" }}>
          <p style={{ marginBottom: "var(--space-4)" }}>
            AgroNexus was founded with a singular mission: to bring Silicon Valley-tier artificial intelligence 
            directly into the hands of farmers across India and the developing world.
          </p>
          <p style={{ marginBottom: "var(--space-4)" }}>
            By leveraging state-of-the-art Computer Vision (ResNet) to instantly diagnose crop diseases from smartphone photos, 
            and deploying proprietary Time-Series forecasting models (Prophet) to predict Mandi prices, we are eliminating the information asymmetry that has historically disadvantaged agricultural workers.
          </p>
          <p style={{ marginBottom: "var(--space-4)" }}>
            Our team consists of agronomists, machine learning engineers, and designers dedicated to building scalable, robust, and accessible technology. We believe in extraordinary outcomes for extraordinary builders.
          </p>
        </div>
      </div>
    </div>
  );
}
