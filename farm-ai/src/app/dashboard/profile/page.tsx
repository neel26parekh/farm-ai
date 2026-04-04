"use client";

import { useEffect, useState } from "react";
import { User, MapPin, Sprout, Ruler, Languages } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import styles from "./page.module.css";

type FarmerSettings = {
  fullName?: string;
  location?: string;
  farmSize?: string;
  primaryCrop?: string;
  language?: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<FarmerSettings>({});

  useEffect(() => {
    const saved = localStorage.getItem("farm_ai_settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        setSettings({});
      }
    }
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Farmer Profile</h1>
      <p className={styles.subtitle}>This profile powers personalized market and weather advisories.</p>

      <div className={styles.card}>
        <div className={styles.row}><User size={18} /><span>Name: {settings.fullName || user?.name || "Farmer"}</span></div>
        <div className={styles.row}><MapPin size={18} /><span>Location: {settings.location || "Not set"}</span></div>
        <div className={styles.row}><Sprout size={18} /><span>Primary crop: {settings.primaryCrop || "Not set"}</span></div>
        <div className={styles.row}><Ruler size={18} /><span>Farm size: {settings.farmSize ? `${settings.farmSize} acres` : "Not set"}</span></div>
        <div className={styles.row}><Languages size={18} /><span>Language: {settings.language || "Not set"}</span></div>
      </div>
    </div>
  );
}
