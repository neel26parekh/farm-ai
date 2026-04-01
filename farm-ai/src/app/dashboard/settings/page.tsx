"use client";

import { useState, useEffect } from "react";
import { Save, User, MapPin, Sprout, Languages, ShieldCheck, Loader2, Bell, Smartphone, Database, Sparkles } from "lucide-react";
import styles from "./page.module.css";
import { useAuth } from "@/lib/AuthContext";

interface UserSettings {
  fullName: string;
  location: string;
  farmSize: string;
  primaryCrop: string;
  language: string;
  pushNotifications: boolean;
  smsAlerts: boolean;
  aiDataConsent: boolean;
  currency: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    fullName: "",
    location: "Punjab, India",
    farmSize: "5",
    primaryCrop: "Wheat",
    language: "English",
    pushNotifications: true,
    smsAlerts: false,
    aiDataConsent: true,
    currency: "INR",
  });

  useEffect(() => {
    if (user?.name) {
      setSettings(prev => ({ ...prev, fullName: prev.fullName || user.name }));
    }

    const saved = localStorage.getItem("farm_ai_settings");
    if (saved) {
      try {
        setSettings({ ...settings, ...JSON.parse(saved) });
      } catch (e) {}
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      localStorage.setItem("farm_ai_settings", JSON.stringify(settings));
      setIsSaving(false);
      setShowToast(true);
      
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Platform Settings</h1>
        <p className={styles.subtitle}>
          Configure your preferences for AgroNexus's AI models, global market algorithms, and SMS alerts.
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.avatarWrap}>
              <User size={32} className={styles.avatarIcon} />
            </div>
            <h3 className={styles.sidebarName}>{settings.fullName || "AgroNexus Commander"}</h3>
            <p className={styles.sidebarRole}>Pro Member</p>
            
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
                <><Save size={18} /> Save Settings</>
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
