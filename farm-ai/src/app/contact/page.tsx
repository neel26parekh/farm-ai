"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Send, 
  Globe,
  Bot
} from "lucide-react";
import styles from "./page.module.css";

export default function ContactPage() {
  const [formState, setFormState] = useState("idle"); // idle | sending | success
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "support",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    // Simulate real-world submission
    setTimeout(() => {
      setFormState("success");
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.badge}
            >
              Get in Touch
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.title}
            >
              How can we help your farm?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.subtitle}
            >
              Whether you're looking for enterprise pricing, technical support, or just want to talk AgTech, our team is here.
            </motion.p>
          </header>

          <div className={styles.grid}>
            {/* Left Side: Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={styles.infoColumn}
            >
              <div className={styles.infoCard}>
                <h3>Global Operations</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <div className={styles.iconWrapper}><Mail size={20} /></div>
                    <div>
                      <span className={styles.itemLabel}>Support & Inquiries</span>
                      <p className={styles.itemValue}>hello@agronexus.ai</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.iconWrapper}><Globe size={20} /></div>
                    <div>
                      <span className={styles.itemLabel}>Enterprise Support</span>
                      <p className={styles.itemValue}>+91 91152 70800</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.iconWrapper}><Globe size={20} /></div>
                    <div>
                      <span className={styles.itemLabel}>R&D Headquarters</span>
                      <p className={styles.itemValue}>Plot No. 12, IT Park, Chandigarh-160101</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.socialCard}>
                <h3>Connect with us</h3>
                <p>Stay updated with our latest agricultural insights and platform updates.</p>
                <div className={styles.socialLinks}>
                  <a href="https://twitter.com/agronexus" target="_blank" className={styles.socialBtn}>
                    <Globe size={20} />
                  </a>
                  <a href="https://linkedin.com/company/agronexus" target="_blank" className={styles.socialBtn}>
                    <Globe size={20} />
                  </a>
                  <a href="https://github.com/agronexus" target="_blank" className={styles.socialBtn}>
                    <Globe size={20} />
                  </a>
                  <a href="https://instagram.com/agronexus" target="_blank" className={styles.socialBtn}>
                    <Globe size={20} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.formCard}>
                <AnimatePresence mode="wait">
                  {formState === "success" ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className={styles.successMessage}
                    >
                      <Bot size={64} style={{ color: "var(--brand-green-vibrant)", marginBottom: "1.5rem" }} />
                      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", marginBottom: "1rem" }}>Message Sent!</h2>
                      <p style={{ color: "var(--ink-light)" }}>Thank you for reaching out. A farm intelligence specialist will get back to you within 24 hours.</p>
                      <button 
                        onClick={() => setFormState("idle")}
                        className={styles.submitBtn}
                        style={{ marginTop: "2rem", width: "auto", marginInline: "auto" }}
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                    >
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label>Your Name</label>
                          <input 
                            type="text" 
                            placeholder="Rajesh Kumar" 
                            required 
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Email Address</label>
                          <input 
                            type="email" 
                            placeholder="rajesh@farm.com" 
                            required 
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>What do you need help with?</label>
                        <select 
                          value={form.subject}
                          onChange={(e) => setForm({...form, subject: e.target.value})}
                        >
                          <option value="support">Technical Support</option>
                          <option value="sales">Sales & Enterprise Pricing</option>
                          <option value="partnership">Partnership Opportunities</option>
                          <option value="press">Press & Media</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Your Message</label>
                        <textarea 
                          rows={6} 
                          placeholder="Tell us more about your operation..." 
                          required 
                          value={form.message}
                          onChange={(e) => setForm({...form, message: e.target.value})}
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={formState === "sending"}
                        className={styles.submitBtn}
                      >
                        {formState === "sending" ? "Transmitting..." : "Send Message"}
                        <Send size={18} />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
