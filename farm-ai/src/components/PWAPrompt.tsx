"use client";
import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import styles from "./PWAPrompt.module.css";

export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className={styles.promptCard}>
      <div className={styles.iconBox}><Download size={18} /></div>
      <div className={styles.content}>
        <strong>Install AgroNexus</strong>
        <span>Get the native app experience.</span>
      </div>
      <button onClick={handleInstall} className={styles.btnSm}>Install</button>
      <button onClick={() => setShow(false)} className={styles.closeBtn}><X size={14} /></button>
    </div>
  );
}
