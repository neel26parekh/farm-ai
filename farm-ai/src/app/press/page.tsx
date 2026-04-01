"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  ExternalLink, 
  ArrowRight,
  Mail,
  Globe
} from "lucide-react";
import styles from "./page.module.css";

const PRESS_RELEASES = [
  {
    id: 1,
    day: "28",
    month: "MAR",
    tag: "Market Sync",
    title: "AgroNexus Bridges Agmarknet Daily Feeds for Real-Time Mandi Intelligence",
    excerpt: "The first-of-its-kind integration brings institutional-grade price transparency to smallholder farmers across 5 major Indian states.",
    link: "#"
  },
  {
    id: 2,
    day: "15",
    month: "MAR",
    tag: "ML Innovation",
    title: "Prophet ML Engine Surpasses 92% Accuracy in Wheat Price Forecasting",
    excerpt: "New performance benchmarks show AgroNexus predicting regional market shifts with unprecedented precision, empowering data-driven sales strategies.",
    link: "#"
  },
  {
    id: 3,
    day: "02",
    month: "MAR",
    tag: "Social Impact",
    title: "AgroNexus Surpasses 10,000 Verified Operations Across the Wheat Belt",
    excerpt: "Platform growth signals a massive shift toward digital-first agricultural management in Punjab and Haryana.",
    link: "#"
  },
  {
    id: 4,
    day: "18",
    month: "FEB",
    tag: "Tech Launch",
    title: "New Hyper-Local Weather Engine Deployed with Geolocation Support",
    excerpt: "Farmers can now receive pinpoint-accurate spray advisories based on their exact field coordinates, reducing waste by 22%.",
    link: "#"
  },
  {
    id: 5,
    day: "05",
    month: "FEB",
    tag: "Corporate",
    title: "Series A: AgroNexus Secures $12M to Scale Autonomous Farm Intelligence",
    excerpt: "The funding round will accelerate the development of next-gen computer vision models for early-stage pest detection.",
    link: "#"
  }
];

export default function PressPage() {
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
              Newsroom
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.title}
            >
              Latest from AgroNexus
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.subtitle}
            >
              Official announcements, media assets, and news about our mission to modernize the world's most vital industry.
            </motion.p>
          </header>

          {/* Media Kit */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={styles.mediaKit}
          >
            <div className={styles.mediaKitInfo}>
              <h2>Official Media Kit</h2>
              <p>Download our logos, executive headshots, and company backgrounder for your story.</p>
            </div>
            <a href="#" className={styles.downloadBtn}>
              Download Kit <Mail size={20} />
            </a>
          </motion.div>

          {/* Newsroom Grid (Optional - if needed) */}
          {/* <section className={styles.newsroomGrid}>
            <div className={styles.newsroomStat}>
              <Newspaper size={32} />
              <h3>Media Contact</h3>
              <p>press@agronexus.com</p>
            </div>
          </section> */}

          {/* Releases Timeline */}
          <section className={styles.timeline}>
            {PRESS_RELEASES.map((release, index) => (
              <motion.article 
                key={release.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.pressItem}
              >
                <div className={styles.dateBlock}>
                  <span className={styles.dateDay}>{release.day}</span>
                  <span className={styles.dateMonth}>{release.month}</span>
                </div>
                <div className={styles.pressContent}>
                  <span className={styles.pressTag}>{release.tag}</span>
                  <h3 className={styles.pressTitle}>{release.title}</h3>
                  <p className={styles.pressExcerpt}>{release.excerpt}</p>
                  <a href={release.link} className={styles.readBtn}>
                    View full release <ArrowRight size={16} />
                  </a>
                </div>
              </motion.article>
            ))}
          </section>

          {/* Contact Press */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginTop: "6rem", textAlign: "center", padding: "4rem", background: "var(--bg-sage)", borderRadius: "var(--radius-2xl)", border: "var(--border-thick)" }}
          >
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", marginBottom: "1rem", color: "var(--ink)" }}>Media Inquiries</h2>
            <p style={{ color: "var(--ink-light)", fontSize: "1.1rem", marginBottom: "2rem" }}>Are you a journalist or researcher interested in telling the story of modern agriculture?</p>
            <a 
              href="mailto:press@agronexus.com" 
              className={styles.downloadBtn}
              style={{ display: "inline-flex", width: "auto" }}
            >
              Contact Press Team <Mail size={20} />
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
