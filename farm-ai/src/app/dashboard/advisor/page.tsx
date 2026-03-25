"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Mic,
  Sparkles,
  User,
  RotateCcw,
  Leaf,
} from "lucide-react";
import { chatPresets, chatResponses, ChatMessage } from "@/lib/mockData";
import { generateId } from "@/lib/utils";
import styles from "./page.module.css";

export default function AdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("farm_ai_chat");
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(parsed);
      } catch (e) {
        // Fallback
      }
    } else {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! 🌾 I'm your AI Crop Advisor. I can help you with crop selection, disease diagnosis, fertilizer recommendations, pest management, and farming best practices.\n\nWhat would you like to know today?",
          timestamp: new Date(),
        }
      ]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      localStorage.setItem("farm_ai_chat", JSON.stringify(messages));
    }
  }, [messages, isLoaded]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Check for user settings to append as context
      let userContext = null;
      try {
        const savedSettings = localStorage.getItem("farm_ai_settings");
        if (savedSettings) userContext = JSON.parse(savedSettings);
      } catch(e) {}

      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text,
          history: messages,
          user_context: userContext 
        }),
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Sorry, I am having trouble connecting to the FarmAI ML backend. Please check your connection.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    const fresh = [
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared! 🌾 How can I help you today?",
        timestamp: new Date(),
      },
    ];
    setMessages(fresh);
    localStorage.setItem("farm_ai_chat", JSON.stringify(fresh));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <Bot size={28} />
            AI Crop Advisor
          </h1>
          <p className={styles.pageSubtitle}>
            Chat with our AI agronomist — get personalized farming advice 24/7
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={clearChat}>
          <RotateCcw size={14} />
          Clear Chat
        </button>
      </div>

      <div className={styles.chatLayout}>
        {/* Preset Prompts Sidebar */}
        <div className={styles.presetsSidebar}>
          <h3 className={styles.presetsTitle}>
            <Sparkles size={16} />
            Quick Questions
          </h3>
          <div className={styles.presetsList}>
            {chatPresets.map((preset, i) => (
              <button
                key={i}
                className={styles.presetBtn}
                onClick={() => sendMessage(preset)}
              >
                <Leaf size={14} />
                {preset}
              </button>
            ))}
          </div>

          <div className={styles.aiInfo}>
            <div className={styles.aiInfoIcon}>
              <Bot size={20} />
            </div>
            <h4>FarmAI Advisor</h4>
            <p>
              Trained on agricultural data from ICAR, State Agricultural
              Universities, and real farming practices across India.
            </p>
            <div className={styles.aiStats}>
              <span>🌾 50M+ data points</span>
              <span>📚 200+ crop varieties</span>
              <span>🇮🇳 All Indian states</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={styles.chatArea}>
          <div className={styles.messagesList}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  msg.role === "user" ? styles.userMessage : styles.botMessage
                }`}
              >
                <div className={styles.messageAvatar}>
                  {msg.role === "user" ? (
                    <div className={styles.userAvatar}>
                      <User size={16} />
                    </div>
                  ) : (
                    <div className={styles.botAvatar}>
                      <Bot size={16} />
                    </div>
                  )}
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageName}>
                      {msg.role === "user" ? "You" : "FarmAI Advisor"}
                    </span>
                    <span className={styles.messageTime} suppressHydrationWarning>
                      {msg.timestamp.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className={styles.messageBubble}>
                    {msg.content.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return (
                          <p key={i} className={styles.msgBold}>
                            {line.replace(/\*\*/g, "")}
                          </p>
                        );
                      }
                      if (line.startsWith("- ") || line.startsWith("• ")) {
                        return (
                          <p key={i} className={styles.msgListItem}>
                            {line}
                          </p>
                        );
                      }
                      if (line.trim() === "") {
                        return <br key={i} />;
                      }
                      return <p key={i}>{line}</p>;
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageAvatar}>
                  <div className={styles.botAvatar}>
                    <Bot size={16} />
                  </div>
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className={styles.inputArea} onSubmit={handleSubmit}>
            <div className={styles.inputWrap}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about crops, diseases, fertilizers, weather..."
                className={styles.chatInput}
                disabled={isTyping}
              />
              <button
                type="button"
                className={styles.micBtn}
                title="Voice input (coming soon)"
              >
                <Mic size={18} />
              </button>
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={!input.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </div>
            <p className={styles.inputHint}>
              FarmAI can make mistakes. Verify critical farming decisions with local agricultural experts.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
