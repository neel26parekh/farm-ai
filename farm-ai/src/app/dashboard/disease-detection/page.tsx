"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ScanSearch, Upload, Camera, X, AlertTriangle, Check, Shield, Loader2, Leaf, ShieldAlert, Pill, ShieldCheck } from "lucide-react";
import { sampleDiseaseResults, DiseaseResult } from "@/lib/mockData";
import styles from "./page.module.css";

export default function DiseaseDetectionPage() {
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
            <ScanSearch size={28} />
            AI Disease Detection
          </h1>
          <p className={styles.pageSubtitle}>
            Upload a photo of your crop leaf to instantly detect diseases using our AI model trained on 50M+ images
          </p>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Upload Area */}
        <div className={styles.uploadSection}>
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

            {imagePreview && (
              <div className={styles.imagePreviewWrapper}>
                <Image src={imagePreview} alt="Crop preview" fill style={{ objectFit: "cover" }} className={styles.previewImage} />
              </div>
            )}

            {scanning ? (
              <div className={styles.scanningState}>
                <div className={styles.scanLine} />
                <Loader2 size={48} className={styles.spinner} />
                <p className={styles.scanText}>Analyzing crop image...</p>
                <p className={styles.scanSubText}>AI is detecting diseases, pests, and deficiencies</p>
              </div>
            ) : !imagePreview && (
              <div className={styles.uploadContent}>
                <div className={styles.uploadIcon}><Upload size={32} /></div>
                <p className={styles.uploadTitle}>Drop your crop photo here</p>
                <p className={styles.uploadSubtitle}>or click to upload</p>
                <div className={styles.uploadFormats}>
                  <Camera size={14} /><span>JPG, PNG, WebP — Max 10MB</span>
                </div>
              </div>
            )}
          </div>

          {imagePreview && !scanning && (
            <button className="btn btn-secondary" onClick={clearImage} style={{ marginTop: "var(--space-4)" }}>
              <X size={14} /> Clear & Scan Again
            </button>
          )}
        </div>

        {/* Results */}
        <div className={styles.resultSection}>
          {!result && !scanning && (
            <div className={styles.placeholder}>
              <Leaf size={48} />
              <h3>Upload a crop image</h3>
              <p>Our AI will analyze it and provide disease diagnosis, treatment plans, and prevention tips</p>
            </div>
          )}

          {scanning && (
            <div className={styles.placeholder}>
              <div className={styles.spinnerLg}>
                <Loader2 size={48} />
              </div>
              <h3>AI is analyzing your crop...</h3>
              <p>Running through 200+ disease models to find the best match</p>
            </div>
          )}

          {result && (
            <div className={styles.resultContent}>
              {/* Status Badge */}
              <div className={styles.resultBadge} style={{ borderColor: severityColors[result.severity] }}>
                <AlertTriangle size={18} style={{ color: severityColors[result.severity] }} />
                <div>
                  <p className={styles.resultDisease}>{result.name}</p>
                  <p className={styles.resultCrop}>Detected in {result.crop}</p>
                </div>
                <div className={styles.confidenceBadge}>
                  {result.confidence}% confident
                </div>
              </div>

              {/* Severity */}
              <div className={styles.severityBar}>
                <span>Severity</span>
                <div className={styles.severityTrack}>
                  <div
                    className={styles.severityFill}
                    style={{
                      width: result.severity === "low" ? "25%" : result.severity === "medium" ? "50%" : result.severity === "high" ? "75%" : "100%",
                      background: severityColors[result.severity],
                    }}
                  />
                </div>
                <span className={styles.severityLabel} style={{ color: severityColors[result.severity] }}>
                  {result.severity.toUpperCase()}
                </span>
              </div>

              {/* Description */}
              <p className={styles.resultDesc}>{result.description}</p>

              {/* Symptoms */}
              <div className={styles.resultBlock}>
                <h4>
                  <ShieldAlert size={16} />
                  Symptoms
                </h4>
                <ul>
                  {result.symptoms.map((s, i) => (
                    <li key={i}>
                      <AlertTriangle size={12} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment */}
              <div className={styles.resultBlock}>
                <h4>
                  <Pill size={16} />
                  Treatment Plan
                </h4>
                <ul>
                  {result.treatment.map((t, i) => (
                    <li key={i}>
                      <Check size={12} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention */}
              <div className={styles.resultBlock}>
                <h4>
                  <ShieldCheck size={16} />
                  Prevention Tips
                </h4>
                <ul>
                  {result.prevention.map((p, i) => (
                    <li key={i}>
                      <Check size={12} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
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
