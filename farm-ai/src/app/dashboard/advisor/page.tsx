"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Mic, Sparkles, User, RotateCcw, Leaf } from "lucide-react";
import Image from "next/image";
import { chatPresets } from "@/lib/mockData";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

export default function AdvisorPage() {
  const { language, t } = useLanguage();
  const { messages, input, handleSubmit, handleInputChange, isLoading, setMessages, append } = useChat({
    api: "/api/advisor/chat",
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/advisor/history");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data && data.length > 0) {
          setMessages(data.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: m.timestamp ? new Date(m.timestamp) : new Date()
          })));
        } else {
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: t.advisor.placeholder,
            createdAt: new Date(),
          }]);
        }
      } catch (e) {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: t.advisor.placeholder,
          createdAt: new Date(),
        }]);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.advisor.placeholder]);

  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === "en" ? "en-IN" : "hi-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Manually fire the AI SDK event
      const syntheticEvent = { target: { value: transcript } } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(syntheticEvent);
    };

    recognition.start();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = async () => {
    const fresh = [{
      id: "welcome",
      role: "assistant",
      content: t.advisor.title,
      createdAt: new Date(),
    }];
    setMessages(fresh as any);
    await fetch("/api/advisor/history", { method: "DELETE" });
  };

  if (!isLoaded) return null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}><Bot size={28} />{t.advisor.title}</h1>
          <p className={styles.pageSubtitle}>{t.weather.subtitle}</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={clearChat}>
          <RotateCcw size={14} />{language === 'en' ? 'Clear Chat' : 'चैट साफ़ करें'}
        </button>
      </div>
      <div className={styles.chatLayout}>
        <div className={styles.presetsSidebar}>
          <h3 className={styles.presetsTitle}><Sparkles size={16} />Quick Questions</h3>
          <div className={styles.presetsList}>
            {chatPresets.map((preset, i) => (
              <button key={i} className={styles.presetBtn} onClick={() => append({ role: "user", content: preset })}>
                <Leaf size={14} />{preset}
              </button>
            ))}
          </div>
          <div className={styles.aiInfo}>
            <div className={styles.aiDoodleContainer}>
              <Image src="/images/advisor-bold.png" alt="Soil-Crop Fit" width={300} height={300} className={styles.aiDoodle} />
            </div>
            <h4>AgroNexus Advisor</h4>
            <p>Trained on agricultural data from ICAR, State Agricultural Universities, and real farming practices across India.</p>
            <div className={styles.aiStats}>
              <span>50M+ data points</span><span>200+ crop varieties</span><span>All Indian states covered</span>
            </div>
          </div>
        </div>
        <div className={styles.chatArea}>
          <div className={styles.messagesList}>
            {messages.map((msg: any) => (
              <div key={msg.id} className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.botMessage}`}>
                <div className={styles.messageAvatar}>
                  {msg.role === "user" ? <div className={styles.userAvatar}><User size={16} /></div> : <div className={styles.botAvatar}><Bot size={16} /></div>}
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageName}>{msg.role === "user" ? "You" : "AgroNexus Advisor"}</span>
                    <span className={styles.messageTime} suppressHydrationWarning>{msg.createdAt?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className={styles.messageBubble}>
                    {msg.content.replace(/^#{1,6}\s*/gm, '').split("\n").map((line: any, i: number) => {
                      if (line.trim() === "") return <br key={i} />;
                      const renderLine = (text: string) => {
                        const parts = text.split(/(\*\*.*?\*\*)/g);
                        return parts.map((part, index) => {
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={index} className={styles.inlineBold}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        });
                      };
                      if (line.startsWith("- ") || line.startsWith("• ")) {
                        return <div key={i} className={styles.msgListItem}>• {renderLine(line.substring(2))}</div>;
                      }
                      if (line.startsWith("**") && line.endsWith("**") && !line.includes(" ", 2)) {
                         return <p key={i} className={styles.msgHeader}>{renderLine(line)}</p>;
                      }
                      return <p key={i}>{renderLine(line)}</p>;
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageAvatar}><div className={styles.botAvatar}><Bot size={16} /></div></div>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}><span /><span /><span /></div>
                  <div className={styles.deepSearchBadge}><Sparkles size={12} /> Deep Search Agent Active</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className={styles.inputArea} onSubmit={handleSubmit}>
            <div className={styles.inputWrap}>
              <input type="text" value={input} onChange={handleInputChange} placeholder={t.advisor.placeholder} className={styles.chatInput} disabled={isLoading} />
              <button type="button" className={`${styles.micBtn} ${isListening ? styles.micBtnActive : ""}`} onClick={toggleRecording} title={isListening ? "Listening..." : "Tap to Speak"}>
                <div className={isListening ? styles.micPulse : ""} />
                <Mic size={18} />
              </button>
              <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading}>
                <Send size={18} />
              </button>
            </div>
            <p className={styles.inputHint}>AgroNexus can make mistakes. Verify critical farming decisions with local agricultural experts.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
