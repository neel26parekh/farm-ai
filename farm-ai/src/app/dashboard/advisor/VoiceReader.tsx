import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import styles from "./page.module.css";

export default function VoiceReader({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSynth(window.speechSynthesis);
    }
  }, []);

  const handlePlay = () => {
    if (!synth) return;
    
    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    const unformatted = text.replace(/[*#_]/g, ""); // strip simple markdown
    const utterance = new SpeechSynthesisUtterance(unformatted);
    // try to get Indian English voice if available
    const voices = synth.getVoices();
    const indianVoice = voices.find(v => v.lang === "en-IN");
    if (indianVoice) utterance.voice = indianVoice;
    
    utterance.rate = 1.0;
    utterance.onend = () => setIsPlaying(false);
    
    synth.speak(utterance);
    setIsPlaying(true);
    
    // haptic feedback for physical feel
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <button 
      className={styles.readAloudBtn} 
      onClick={handlePlay} 
      title="Read Aloud"
      aria-label="Read Aloud"
    >
      {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
    </button>
  );
}
