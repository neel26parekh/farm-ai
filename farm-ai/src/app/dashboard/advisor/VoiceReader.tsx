import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import styles from "./page.module.css";

type VoiceReaderProps = {
  text: string;
  label?: string;
  languageCode?: string;
};

export default function VoiceReader({ text, label, languageCode = "en" }: VoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Cancel any previous
    window.speechSynthesis.cancel();

    const unformatted = text.replace(/[*#_]/g, ""); // strip simple markdown
    const utterance = new SpeechSynthesisUtterance(unformatted);

    const languagePriority: Record<string, string[]> = {
      en: ["en-IN", "en-GB", "en-US"],
      hi: ["hi-IN", "en-IN"],
      gu: ["gu-IN", "hi-IN", "en-IN"],
      mr: ["mr-IN", "hi-IN", "en-IN"],
      te: ["te-IN", "en-IN"],
    };
    
    // Process voices
    let voices = window.speechSynthesis.getVoices();
    const tryPlay = () => {
      const preferred = languagePriority[languageCode] || languagePriority.en;
      const indianVoice = voices.find((v) => preferred.includes(v.lang))
        || voices.find(v => v.lang === "en-IN" || (v.name && v.name.includes("India")));
      if (indianVoice) utterance.voice = indianVoice;
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      
      if (navigator.vibrate) navigator.vibrate(50);
    };

    if (voices.length === 0) {
      // Voices not loaded yet
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        tryPlay();
      };
      // Fallback
      setTimeout(tryPlay, 1000);
    } else {
      tryPlay();
    }
  };

  return (
    <button 
      className={`${styles.readAloudBtn} ${label ? styles.labeledBtn : ''}`}
      onClick={handlePlay} 
      title="Read Aloud"
      aria-label="Read Aloud"
      style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}
    >
      {isPlaying ? <VolumeX size={label ? 18 : 14} /> : <Volume2 size={label ? 18 : 14} />}
      {label && <span>{label}</span>}
    </button>
  );
}
