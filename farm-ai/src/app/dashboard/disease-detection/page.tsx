"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { CheckIcon, AlertTriangle, Upload, X, Sprout, Info, Shield, Droplets, Loader2, Leaf, ShieldAlert, Pill, ShieldCheck, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { sampleDiseaseResults, DiseaseResult } from "@/lib/mockData";
import styles from "./page.module.css";

export default function DiseaseDetectionPage() {
  const { t } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

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

      const res = await fetch("http://localhost:8000/api/predict-disease", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to analyze image");

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult({
        name: "Analysis Failed",
        crop: "Unknown",
        description: "There was an error connecting to the FarmAI ML backend. Please check your connection or try again later.",
        symptoms: [],
        confidence: 0,
        severity: "critical",
        treatment: ["Please try uploading the image again or check your local server status."],
        prevention: []
      });
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

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <Sprout size={28} />
            {t.disease.title}
          </h1>
          <p className={styles.pageSubtitle}>
            {t.disease.subtitle}
          </p>
        </div>
      </div>

      <div className={imagePreview ? styles.mainGrid : styles.initialLayout}>
        {/* Upload Area */}
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
                    <div className={`${styles.corner} ${styles.topLeft}`} />
                    <div className={`${styles.corner} ${styles.topRight}`} />
                    <div className={`${styles.corner} ${styles.bottomLeft}`} />
                    <div className={`${styles.corner} ${styles.bottomRight}`} />
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
                <div className={styles.uploadIcon}><Upload size={32} /></div>
                <h3>Upload a photo of a leaf</h3>
                <p>Drag and drop or click to browse</p>
                <span className={styles.uploadLimit}>Supports JPG, PNG (Max 5MB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Results - Only show if scanning or result exists */}
        {(scanning || result) && (
          <div className={styles.resultSection}>
            {scanning ? (
              <div className={styles.placeholder}>
                <div className={styles.spinnerLg}>
                  <Loader2 size={48} />
                </div>
                <h3>AI is analyzing your crop...</h3>
                <p>Running through 200+ disease models to find the best match</p>
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
                      <span className="badge badge-danger">{result.severity.toUpperCase()}</span>
                      <span className={styles.resultConf}>{t.disease.confidence}: {result.confidence}%</span>
                    </div>
                  </div>
                </div>
                {/* Severity */}
                <div className={styles.severityBar}>
                  <div className={styles.severityLabels}>
                    <span>Severity</span>
                    <span style={{ color: severityColors[result.severity] }}>{result.severity.toUpperCase()}</span>
                  </div>
                  <div className={styles.severityTrack}>
                    <div
                      className={styles.severityFill}
                      style={{
                        width: result.severity === "low" ? "25%" : result.severity === "medium" ? "50%" : result.severity === "high" ? "75%" : "100%",
                        background: severityColors[result.severity],
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className={styles.resultDesc}>{result.description}</p>

                {/* Symptoms */}
                <div className={styles.resultCard}>
                  <div className={styles.cardHeader}>
                    <ShieldAlert size={18} />
                    <h4>Symptoms</h4>
                  </div>
                  <div className={styles.cardList}>
                    {result.symptoms.map((s, i) => (
                      <div key={i} className={styles.cardListItem}>
                        <div className={styles.checkIcon} style={{ background: "var(--bg-lavender)" }}><AlertTriangle size={14} /></div>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Treatment */}
                <div className={styles.resultCard}>
                  <div className={styles.cardHeader}>
                    <Pill size={18} />
                    <h4>Treatment Plan</h4>
                  </div>
                  <div className={styles.cardList}>
                    {result.treatment.map((step: string, i: number) => (
                      <div key={i} className={styles.cardListItem}>
                        <div className={styles.checkIcon}><Check size={14} /></div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prevention */}
                <div className={styles.resultCard}>
                  <div className={styles.cardHeader}>
                    <ShieldCheck size={18} />
                    <h4>Prevention Tips</h4>
                  </div>
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
        )}
      </div>

      {/* Disease Gallery */}
      <div className={styles.gallerySection}>
        <h3 className={styles.galleryTitle}>Common Crop Diseases</h3>
        <div className={styles.galleryGrid}>
          {sampleDiseaseResults.map((disease, i) => (
            <div key={i} className={styles.galleryCard}>
              <div className={styles.galleryIcon}>
                <Leaf size={24} />
              </div>
              <h4>{disease.name}</h4>
              <p>{disease.crop}</p>
              <span
                className="badge"
                style={{
                  background: `${severityColors[disease.severity]}15`,
                  color: severityColors[disease.severity],
                  borderColor: `${severityColors[disease.severity]}30`,
                }}
              >
                {disease.severity} severity
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
