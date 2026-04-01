"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Mic, Sparkles, User, RotateCcw, Leaf } from "lucide-react";
import Image from "next/image";
import { chatPresets } from "@/lib/mockData";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export default function AdvisorPage() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history on mount
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
            createdAt: m.timestamp ? new Date(m.timestamp) : new Date(),
          })));
        } else {
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: "Welcome! I'm AgroNexus Advisor. Ask me anything about your crops, soil, weather, or farming practices.",
            createdAt: new Date(),
          }]);
        }
      } catch {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: "Welcome! I'm AgroNexus Advisor. Ask me anything about your crops, soil, weather, or farming practices.",
          createdAt: new Date(),
        }]);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Add user message immediately
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsLoading(true);

    // Add empty assistant message to stream into
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    }]);

    try {
      // Read user's farm settings for personalized AI context
      let farmContext = {};
      try {
        const saved = localStorage.getItem("farm_ai_settings");
        if (saved) farmContext = JSON.parse(saved);
      } catch {}

      const res = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
          farmContext,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "API error");
      }

      if (!res.body) throw new Error("No response body");

      // Stream the response (plain text chunks from toTextStreamResponse)
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: fullText } : m
        ));
      }
    } catch (err: any) {
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: `Sorry, I encountered an error: ${err.message}. Please try again.` }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(chatInput);
  };

  const clearChat = async () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Chat cleared. Ask me anything about your farms!",
      createdAt: new Date(),
    }]);
    await fetch("/api/advisor/history", { method: "DELETE" }).catch(() => {});
  };

  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) { setIsListening(false); return; }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = language === "en" ? "en-IN" : "hi-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      setChatInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const renderContent = (content: string) => {
    return content.replace(/^#{1,6}\s*/gm, "").split("\n").map((line, i) => {
      if (line.trim() === "") return <br key={i} />;
      const renderLine = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, idx) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={idx} className={styles.inlineBold}>{part.slice(2, -2)}</strong>
            : part
        );
      };
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return <div key={i} className={styles.msgListItem}>• {renderLine(line.substring(2))}</div>;
      }
      return <p key={i}>{renderLine(line)}</p>;
    });
  };

  if (!isLoaded) return null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}><Bot size={28} />{t.advisor.title}</h1>
          <p className={styles.pageSubtitle}>{t.weather.subtitle} <span className="model-badge"><Sparkles size={10} />Gemini 2.5 Flash</span></p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={clearChat}>
          <RotateCcw size={14} />{language === "en" ? "Clear Chat" : "चैट साफ़ करें"}
        </button>
      </div>

      <div className={styles.chatLayout}>
        {/* Presets sidebar */}
        <div className={styles.presetsSidebar}>
          <h3 className={styles.presetsTitle}><Sparkles size={16} />Quick Questions</h3>
          <div className={styles.presetsList}>
            {chatPresets.map((preset, i) => (
              <button key={i} className={styles.presetBtn} onClick={() => sendMessage(preset)} disabled={isLoading}>
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

        {/* Chat area */}
        <div className={styles.chatArea}>
          <div className={styles.messagesList}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.botMessage}`}>
                <div className={styles.messageAvatar}>
                  {msg.role === "user"
                    ? <div className={styles.userAvatar}><User size={16} /></div>
                    : <div className={styles.botAvatar}><Bot size={16} /></div>
                  }
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageName}>{msg.role === "user" ? "You" : "AgroNexus Advisor"}</span>
                    <span className={styles.messageTime} suppressHydrationWarning>
                      {msg.createdAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className={styles.messageBubble}>
                    {msg.content === "" && msg.role === "assistant"
                      ? <div className={styles.typingIndicator}><span /><span /><span /></div>
                      : renderContent(msg.content)
                    }
                  </div>
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t.advisor.placeholder}
                className={styles.chatInput}
                disabled={isLoading}
                autoComplete="off"
              />
              <button type="button" className={`${styles.micBtn} ${isListening ? styles.micBtnActive : ""}`} onClick={toggleRecording}>
                <div className={isListening ? styles.micPulse : ""} />
                <Mic size={18} />
              </button>
              <button type="submit" className={styles.sendBtn} disabled={!chatInput.trim() || isLoading}>
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
