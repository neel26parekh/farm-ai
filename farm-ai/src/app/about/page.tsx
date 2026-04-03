import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { platformImpactMetrics } from "@/lib/mockData";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)", padding: "var(--space-8) var(--space-4)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link href="/" style={{ color: "var(--emerald-500)", display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-8)" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <Building2 size={48} style={{ color: "var(--emerald-500)", marginBottom: "var(--space-6)" }} />
        <h1 style={{ fontSize: "2.5rem", marginBottom: "var(--space-6)" }}>Our Mission</h1>
        
        <div style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--gray-300)" }}>
          <div style={{ padding: '1.5rem', backgroundColor: '#e8f5e9', borderLeft: '4px solid #4ade80', borderRadius: '0 8px 8px 0', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.25rem', color: '#065f46', margin: 0, fontWeight: 500 }}>
              Farm AI is a 100% open-source, non-profit initiative. We believe that access to agricultural intelligence should be a fundamental right, not a paid luxury.
            </p>
          </div>

          <p style={{ marginBottom: "var(--space-4)", color: "var(--foreground)"}}>
            Climate change, erratic weather, and volatile markets disproportionately affect smallholder farmers. 
            Our platform leverages AI to democratize expert agronomy—putting enterprise-grade crop disease detection, market forecasting, and weather alerts directly in the hands of the farmers who need it most.
          </p>

          <p style={{ marginBottom: "var(--space-4)", color: "var(--foreground)"}}>
            By leveraging state-of-the-art Computer Vision to instantly diagnose crop diseases from smartphone photos, 
            and deploying predictive models to forecast Mandi prices, we are eliminating the information asymmetry that has historically disadvantaged agricultural workers. We promise to never charge farmers for this tool.
          </p>
        </div>

        <h2 style={{ fontSize: '1.75rem', marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--foreground)' }}>Impact Across India</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          {platformImpactMetrics.map((metric, idx) => (
            <div key={idx} style={{ padding: '1.5rem', backgroundColor: 'var(--gray-900)', borderRadius: '12px', border: '1px solid var(--gray-800)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>{metric.value}</div>
              <div style={{ fontWeight: '600', color: 'var(--foreground)', marginBottom: '0.25rem' }}>{metric.label}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
