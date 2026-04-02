"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  CheckIcon, 
  AlertTriangle, 
  Upload, 
  X, 
  Sprout, 
  ShieldAlert, 
  Pill, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Loader2,
  Leaf
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { sampleDiseaseResults, DiseaseResult } from "@/lib/mockData";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import styles from "./page.module.css";

export default function DiseaseDetectionPage() {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    startScan(file);
  };

  const startScan = async (file: File) => {
    setScanning(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/vision/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await res.json();
      setResult(data.result);
    } catch (error: any) {
      console.error(error);
      setResult({
        name: "Analysis Failed",
        crop: "Unknown",
        description: "Could not identify the plant. Please try a clearer leaf photo.",
        symptoms: [],
        confidence: 0,
        severity: "critical",
        treatment: ["Retry with better lighting"],
        prevention: []
      } as any);
    } finally {
      setScanning(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const severityColors: Record<string, string> = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
    critical: "#dc2626",
  };

  if (!mounted) return null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <Sprout size={28} />
            {t.disease.title}
          </h1>
          <p className={styles.pageSubtitle}>
            {t.disease.subtitle} <span className="model-badge"><Sparkles size={10} />Gemini Vision AI</span>
          </p>
        </div>
      </div>

      <div className={imagePreview ? styles.mainGrid : styles.initialLayout}>
        <div className={imagePreview ? styles.uploadSection : styles.centeredUpload}>
          <div
            className={`${styles.uploadZone} ${dragActive ? styles.uploadZoneActive : ""} ${scanning ? styles.uploadZoneScanning : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => !scanning && !imagePreview && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/webp"
              style={{ display: "none" }}
            />

            {imagePreview ? (
              <div className={styles.imagePreviewWrapper}>
                <Image src={imagePreview} alt="Crop preview" fill style={{ objectFit: "cover" }} className={styles.previewImage} />
                {scanning && (
                  <div className={styles.scanningOverlay}>
                    <div className={styles.scanLine} />
                  </div>
                )}
                {!scanning && (
                  <button className={styles.clearBtn} onClick={(e) => { e.stopPropagation(); clearImage(); }}>
                    <X size={16} />
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.uploadContent}>
                <div className={styles.doodleContainer}>
                  <Image src="/images/disease-bold.png" alt="Leaf Scan" width={180} height={180} className={styles.doodleImg} />
                </div>
                <h3>{t.disease.upload}</h3>
                <p>Drag and drop or click to browse</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className={styles.resultSection}>
          {!scanning && !result ? (
            <EmptyState 
              title="Awaiting Scan" 
              description="Upload a photo of a diseased plant leaf to receive a professional AI diagnosis and treatment plan instantly."
              image="/images/disease-bold.png"
            />
          ) : scanning ? (
            <div className={styles.placeholder}>
              <Loader2 className={styles.spinner} size={48} />
              <h3>{t.disease.scanning}</h3>
              <p>Analyzing morphology and identifying disease markers...</p>
            </div>
          ) : result && (
            <div className={styles.resultContent}>
              <div className={styles.resultHeader}>
                <div className={styles.resultIcon} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                  <ShieldAlert size={20} />
                </div>
                <div className={styles.resultInfo}>
                  <h3 className={styles.resultName}>{result.name}</h3>
                  <div className={styles.resultMeta}>
                    <span className="badge badge-danger">{t.severity[result.severity as keyof typeof t.severity]}</span>
                    <span className={styles.resultConf}>{t.disease.confidence}: {result.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className={styles.severityBar}>
                <div className={styles.severityLabels}>
                  <span>{t.disease.severity}</span>
                  <span style={{ color: severityColors[result.severity] }}>{t.severity[result.severity as keyof typeof t.severity]}</span>
                </div>
                <div className={styles.severityTrack}>
                  <div className={styles.severityFill} style={{
                    width: result.severity === "low" ? "25%" : result.severity === "medium" ? "50%" : result.severity === "high" ? "75%" : "100%",
                    background: severityColors[result.severity],
                  }} />
                </div>
              </div>

              <p className={styles.resultDesc}>{result.description}</p>

              <div className={styles.resultCard}>
                <div className={styles.cardHeader}><ShieldAlert size={18} /><h4>Symptoms</h4></div>
                <div className={styles.cardList}>
                  {result.symptoms.map((s, i) => (
                    <div key={i} className={styles.cardListItem}>
                      <div className={styles.checkIcon} style={{ background: "var(--bg-lavender)" }}><AlertTriangle size={14} /></div>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.cardHeader}><Pill size={18} /><h4>{t.disease.treatment}</h4></div>
                <div className={styles.cardList}>
                  {result.treatment.map((step: string, i: number) => (
                    <div key={i} className={styles.cardListItem}>
                      <div className={styles.checkIcon}><Check size={14} /></div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.cardHeader}><ShieldCheck size={18} /><h4>{t.disease.prevention}</h4></div>
                <div className={styles.cardList}>
                  {result.prevention.map((step: string, i: number) => (
                    <div key={i} className={styles.cardListItem}>
                      <div className={styles.checkIcon}><Check size={14} /></div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.gallerySection}>
        <h3 className={styles.galleryTitle}>Common Crop Diseases</h3>
        <div className={styles.galleryGrid}>
          {sampleDiseaseResults.map((disease, i) => (
            <div key={i} className={styles.galleryCard}>
              <div className={styles.galleryIcon}><Leaf size={24} /></div>
              <h4>{disease.name}</h4>
              <p>{(t.data as any)[disease.crop.toLowerCase()] || disease.crop}</p>
              <span className="badge" style={{
                background: `${severityColors[disease.severity]}15`,
                color: severityColors[disease.severity],
                borderColor: `${severityColors[disease.severity]}30`,
              }}>
                {t.severity[disease.severity as keyof typeof t.severity]} {t.disease.severity.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
