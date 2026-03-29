import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function DocsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)", padding: "var(--space-8) var(--space-4)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link href="/" style={{ color: "var(--emerald-500)", display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-8)" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <BookOpen size={48} style={{ color: "var(--emerald-500)", marginBottom: "var(--space-6)" }} />
        <h1 style={{ fontSize: "2.5rem", marginBottom: "var(--space-6)" }}>Platform Documentation</h1>
        
        <div style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--gray-300)" }}>
          <p style={{ marginBottom: "var(--space-4)" }}>
            Welcome to the AgroNexus Documentation. Our platform provides three core functionalities:
          </p>
          <ul style={{ paddingLeft: "var(--space-6)", marginBottom: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <li><strong style={{ color: "var(--foreground)" }}>Disease Detection:</strong> Upload clear images of crop leaves. Ensure the leaf occupies at least 60% of the frame and is well-lit for maximum confidence scoring (ResNet50 engine).</li>
            <li><strong style={{ color: "var(--foreground)" }}>Market Intelligence:</strong> Forecasts are updated daily at 00:00 UTC using historic Mandi data processed via Facebook Prophet. Predictions assume normal socio-economic conditions.</li>
            <li><strong style={{ color: "var(--foreground)" }}>AI Advisor:</strong> Powered by LLMs. Provides RAG-assisted answers. Always cross-verify critical chemical application dosages with local agronomy experts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
