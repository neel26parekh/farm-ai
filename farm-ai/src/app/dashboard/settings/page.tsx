"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Save, User, MapPin, Sprout, Languages, ShieldCheck, Loader2, Bell, Smartphone, Database, Sparkles } from "lucide-react";
import styles from "./page.module.css";
import { useAuth } from "@/lib/AuthContext";
import {
  FarmerSettings,
  defaultFarmerSettings,
  isOnboardingComplete,
  loadFarmerSettingsLocal,
  saveFarmerSettingsLocal,
} from "@/lib/farmerProfile";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const onboardingMode = searchParams.get("onboarding") === "1";
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [settings, setSettings] = useState<FarmerSettings>(defaultFarmerSettings);

  useEffect(() => {
    const hydrate = async () => {
      const local = loadFarmerSettingsLocal();
      let merged: FarmerSettings = {
        ...local,
        fullName: local.fullName || user?.name || "",
      };

      try {
        const res = await fetch("/api/farmer/profile", { cache: "no-store" });
        if (res.ok) {
          const remote = await res.json();
          merged = {
            ...merged,
            fullName: remote.fullName || merged.fullName,
            location: remote.location || merged.location,
            farmSize: remote.farmSize || merged.farmSize,
            primaryCrop: remote.primaryCrop || merged.primaryCrop,
            pushNotifications: remote.pushNotifications ?? merged.pushNotifications,
            smsAlerts: remote.smsAlerts ?? merged.smsAlerts,
            aiDataConsent: remote.aiDataConsent ?? merged.aiDataConsent,
            currency: remote.currency || merged.currency,
          };
        }
      } catch {
        // Keep local settings on API failures
      }

      setSettings(merged);
      setIsLoading(false);
    };

    hydrate();
  }, [user]);

  useEffect(() => {
    const map: Record<string, string> = {
      English: "en",
      Hindi: "hi",
      Gujarati: "gu",
      Marathi: "mr",
      Telugu: "te",
      Tamil: "te",
      Punjabi: "hi",
    };

    localStorage.setItem("farm-ai-language", map[settings.language] || "en");
  }, [settings.language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      saveFarmerSettingsLocal(settings);
      await fetch("/api/farmer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return null;

  const profileComplete = isOnboardingComplete(settings);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{onboardingMode ? "Complete Farmer Onboarding" : "Platform Settings"}</h1>
        <p className={styles.subtitle}>
          Configure your farm profile so advice, weather, and market recommendations are personalized for your needs.
        </p>
        {onboardingMode && !profileComplete && (
          <p className={styles.subtitle} style={{ marginTop: "8px", color: "#b91c1c", fontWeight: 600 }}>
            Complete all required fields to unlock personalized recommendations.
          </p>
        )}
      </div>

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.avatarWrap}>
              <User size={32} className={styles.avatarIcon} />
            </div>
            <h3 className={styles.sidebarName}>{settings.fullName || "Farmer"}</h3>
            <p className={styles.sidebarRole}>Farmer Profile</p>
            
            <div className={styles.sidebarBadges}>
              <div className={styles.badge}>
                <ShieldCheck size={14} /> Platform Authenticated
              </div>
            </div>
          </div>
        </div>

        <form className={styles.formCard} onSubmit={handleSave}>
          <h2 className={styles.formTitle}>Personal Details</h2>
          
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <div className={styles.inputWrap}>
                <User size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  name="fullName"
                  value={settings.fullName} 
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Kumar" 
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Preferred Language</label>
              <div className={styles.inputWrap}>
                <Languages size={18} className={styles.inputIcon} />
                <select name="language" value={settings.language} onChange={handleChange}>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                </select>
              </div>
            </div>
          </div>

          <h2 className={styles.formTitle}>Farm Details (AI Context)</h2>
          <p className={styles.formDesc}>
            Our ML models customize agronomic recommendations based on your local climate, scale, and currency.
          </p>
          
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Primary Crop</label>
              <div className={styles.inputWrap}>
                <Sprout size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  name="primaryCrop"
                  value={settings.primaryCrop} 
                  onChange={handleChange}
                  placeholder="e.g. Wheat, Rice, Cotton" 
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Farm Location (State, Dist)</label>
              <div className={styles.inputWrap}>
                <MapPin size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  name="location"
                  value={settings.location} 
                  onChange={handleChange}
                  placeholder="e.g. Ludhiana, Punjab" 
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Farm Size (in Acres)</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputPrefix}>Acres</span>
                <input 
                  type="number" 
                  name="farmSize"
                  value={settings.farmSize} 
                  onChange={handleChange}
                  placeholder="e.g. 5" 
                  required
                  style={{ paddingLeft: "4.5rem" }}
                />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Market Currency</label>
              <div className={styles.inputWrap}>
                <Database size={18} className={styles.inputIcon} />
                <select name="currency" value={settings.currency} onChange={handleChange}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Irrigation Type</label>
              <div className={styles.inputWrap}>
                <Database size={18} className={styles.inputIcon} />
                <select name="irrigationType" value={settings.irrigationType} onChange={handleChange}>
                  <option value="Canal">Canal</option>
                  <option value="Borewell">Borewell</option>
                  <option value="Drip">Drip</option>
                  <option value="Rainfed">Rainfed</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Sowing Date</label>
              <div className={styles.inputWrap}>
                <input 
                  type="date" 
                  name="sowingDate"
                  value={settings.sowingDate}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: "12px" }}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Input Budget Band</label>
              <div className={styles.inputWrap}>
                <Database size={18} className={styles.inputIcon} />
                <select name="budgetBand" value={settings.budgetBand} onChange={handleChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          <h2 className={styles.formTitle}>Notifications & Alerts</h2>
          <div className={styles.toggleGroup}>
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <Bell size={18} />
                <div>
                  <strong>Push Notifications</strong>
                  <p>Receive extreme weather and disease alerts in the browser.</p>
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" name="pushNotifications" checked={settings.pushNotifications} onChange={handleChange} />
                <span className={styles.slider}></span>
              </label>
            </div>
            
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <Smartphone size={18} />
                <div>
                  <strong>Market Spike SMS Alerts</strong>
                  <p>Get an SMS when your primary crop price jumps significantly.</p>
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" name="smsAlerts" checked={settings.smsAlerts} onChange={handleChange} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <h2 className={styles.formTitle}>Data & Machine Learning</h2>
          <div className={styles.toggleGroup}>
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <Sparkles size={18} style={{ color: "var(--brand-green-vibrant)" }} />
                <div>
                  <strong>Global ML Training Consent</strong>
                  <p>Allow AgroNexus to anonymize and use your crop yield and disease data to train better predictive models.</p>
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" name="aiDataConsent" checked={settings.aiDataConsent} onChange={handleChange} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.formFooter}>
            <button 
              type="submit" 
              className={`btn btn-primary ${styles.saveBtn}`}
              disabled={isSaving}
            >
              {isSaving ? (
                <><Loader2 size={18} className="spin" /> Syncing with Platform...</>
              ) : (
                <><Save size={18} /> {onboardingMode ? "Save & Continue" : "Save Settings"}</>
              )}
            </button>
            
            {showToast && (
              <span className={styles.successToast}>
                <ShieldCheck size={16} /> Configuration synced successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
