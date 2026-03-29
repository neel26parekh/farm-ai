"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ExternalLink, Clock, Globe, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

// Real-time headlines fetched from recent search
const LATEST_NEWS = [
  {
    id: 1,
    title: "Global Fertilizer Crisis Intensifies Amid Middle East Supply Disruptions",
    excerpt: "Record urea and ammonia prices are forcing farmers worldwide to shift crop rotations for the 2026 season as key transit points remain blocked.",
    source: "Agri-Pulse",
    date: "March 29, 2026",
    category: "Market Trends",
    url: "https://www.agri-pulse.com",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Brazil's Soybean Export Surge Hits Logistical Hurdles Despite Record Crop",
    excerpt: "Daily average exports for March have fallen as the country struggles with peak-season bottlenecks at major shipping terminals.",
    source: "Reuters Agriculture",
    date: "March 29, 2026",
    category: "Global Trade",
    url: "https://www.reuters.com",
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Precision Ag-Tech Adoption Reaches New Peak in North American Wheat Belt",
    excerpt: "New sensor-driven nitrogen application models are reducing input waste by 22%, promising higher margins for mid-sized operations.",
    source: "Agritecture",
    date: "March 28, 2026",
    category: "Technology",
    url: "https://www.agritecture.com",
    image: "https://images.unsplash.com/photo-1594776208133-20010008e1fb?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "UK Trade Policy Debate Sparks Concerns Over Rising Bread Prices",
    excerpt: "Controversial proposals to double wheat prices through trade barriers draw warnings from cost-of-living advocacy groups.",
    source: "The Guardian",
    date: "March 29, 2026",
    category: "Policy",
    url: "https://www.theguardian.com",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Regenerative Farming Initiatives Receive $2B Global Investment Spark",
    excerpt: "Private equity firms signal heavy shift toward soil health startups as carbon credit markets mature across Europe.",
    source: "ScienceDaily",
    date: "March 27, 2026",
    category: "Sustainability",
    url: "https://www.sciencedaily.com",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop"
  }
];

export default function NewsPage() {
  const [news, setNews] = useState(LATEST_NEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time fetch
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.container}
          >
            <span className={styles.badge}>AgroNexus Intelligence</span>
            <h1 className={styles.title}>Global Agricultural News</h1>
            <p className={styles.subtitle}>
              Real-time insights and market intelligence from the world's most trusted sources.
            </p>
          </motion.div>
        </header>

        <section className={styles.feedSection}>
          <div className={styles.container}>
            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Updating intelligence feed...</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {news.map((item, index) => (
                  <motion.article 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.card}
                  >
                    <div className={styles.cardImage}>
                      <img src={item.image} alt={item.title} />
                      <span className={styles.cardCategory}>{item.category}</span>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardMeta}>
                        <span className={styles.source}>
                          <Globe size={12} /> {item.source}
                        </span>
                        <span className={styles.date}>
                          <Clock size={12} /> {item.date}
                        </span>
                      </div>
                      <h2 className={styles.cardTitle}>{item.title}</h2>
                      <p className={styles.cardExcerpt}>{item.excerpt}</p>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
                        Read full story <ExternalLink size={14} />
                      </a>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={styles.newsletter}>
          <div className={styles.container}>
            <div className={styles.newsletterCard}>
              <h2>Stay ahead of the field</h2>
              <p>Get weekly agricultural intelligence delivered straight to your inbox.</p>
              <div className={styles.inputGroup}>
                <input type="email" placeholder="farmer@example.com" />
                <button>Subscribe <ArrowRight size={16} /></button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
