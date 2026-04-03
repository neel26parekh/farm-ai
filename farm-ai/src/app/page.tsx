"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Scan, TrendingUp, CloudSun } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { farmerTestimonials } from '@/lib/mockData';
import styles from "./home.module.css";
import Navbar from "@/components/Navbar";
import PWAPrompt from "@/components/PWAPrompt";
import { useRef } from "react";

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const popIn = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, type: "spring", bounce: 0.3 } }
};

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Fake A/B Testing for the CTA
  const [ctaVariant, setCtaVariant] = useState<"A" | "B">("A");
  
  useEffect(() => {
    // Randomize 50/50 for A/B testing
    const variant = Math.random() > 0.5 ? "B" : "A";
    setCtaVariant(variant);
    // In a real app we would log this assignment to Mixpanel/PostHog
    console.log("A/B Test Variant Assigned: ", variant);
  }, []);

  const handleCtaClick = () => {
    // In a real app we'd log conversion
    console.log(`Conversion Tracked on Variant: ${ctaVariant}`);
  };

  const getCtaText = () => {
    if (ctaVariant === "A") return t.home.cta;
    return "Try Farm AI For Free"; // Variant B test
  };

  return (
    <div className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroContent}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className={styles.heroBadge}>
            <span className={styles.badgePulse}></span> Intelligent Farming Built for India
          </motion.div>
          
          <motion.h1 className={styles.heroTitle} variants={fadeUp}>
            {t.home.heroTitle}
          </motion.h1>
          
          <motion.p className={styles.heroSubtitle} variants={fadeUp}>
            {t.home.heroSubtitle}
          </motion.p>
          
          <motion.div variants={fadeUp} className={styles.heroActions} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href={user ? "/dashboard" : "/auth/signup"} className="btn btn-primary" onClick={handleCtaClick}>
              {getCtaText()} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Subject Cards Grid */}
      <motion.div 
        id="features" 
        className={styles.grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        {/* Card 1: AI Advisor */}
        <motion.section variants={popIn} whileHover={{ y: -6, transition: { duration: 0.2 } }} className={`${styles.card} ${styles.cardSage}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardIconWrap}>
              <Bot size={28} />
            </div>
            <h2 className={styles.cardTitle}>{t.home.features.advisor.title}</h2>
            <p className={styles.cardDesc}>
              {t.home.features.advisor.desc}
            </p>
            <Link href="/dashboard/advisor" className="btn btn-dark">
              {t.home.features.advisor.action} <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.cardIllustration}>
            <Image 
              src="/images/advisor-bold.png" 
              alt="Farm AI Illustration" 
              width={400} 
              height={400} 
              className={styles.doodleImg}
              priority
            />
          </div>
        </motion.section>

        {/* Card 2: Disease Detection */}
        <motion.section variants={popIn} whileHover={{ y: -6, transition: { duration: 0.2 } }} className={`${styles.card} ${styles.cardLavender}`}>
          <div className={styles.cardContent}>
             <div className={styles.cardIconWrap}>
              <Scan size={28} />
            </div>
            <h2 className={styles.cardTitle}>{t.home.features.disease.title}</h2>
            <p className={styles.cardDesc}>
              {t.home.features.disease.desc}
            </p>
            <Link href="/dashboard/disease-detection" className="btn btn-dark">
              {t.home.features.disease.action} <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.cardIllustration}>
            <Image 
              src="/images/disease-bold.png" 
              alt="Disease Scan Illustration" 
              width={400} 
              height={400} 
              className={styles.doodleImg}
            />
          </div>
        </motion.section>

        {/* Card 3: Market Intelligence */}
        <motion.section variants={popIn} whileHover={{ y: -6, transition: { duration: 0.2 } }} className={`${styles.card} ${styles.cardSand}`}>
          <div className={styles.cardContent}>
             <div className={styles.cardIconWrap}>
              <TrendingUp size={28} />
            </div>
            <h2 className={styles.cardTitle}>{t.home.features.market.title}</h2>
            <p className={styles.cardDesc}>
              {t.home.features.market.desc}
            </p>
            <Link href="/dashboard/market" className="btn btn-dark">
              {t.home.features.market.action} <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.cardIllustration}>
            <Image 
              src="/images/market-bold.png" 
              alt="Market Graph Illustration" 
              width={400} 
              height={400} 
              className={styles.doodleImg}
            />
          </div>
        </motion.section>

        {/* Card 4: Weather Intelligence */}
        <motion.section variants={popIn} whileHover={{ y: -6, transition: { duration: 0.2 } }} className={`${styles.card} ${styles.cardSky}`}>
          <div className={styles.cardContent}>
             <div className={styles.cardIconWrap}>
              <CloudSun size={28} />
            </div>
            <h2 className={styles.cardTitle}>{t.home.features.weather.title}</h2>
            <p className={styles.cardDesc}>
              {t.home.features.weather.desc}
            </p>
            <Link href="/dashboard/weather" className="btn btn-dark">
              {t.home.features.weather.action} <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.cardIllustration}>
            <Image 
              src="/images/weather-bold.png" 
              alt="Weather Illustration" 
              width={400} 
              height={400} 
              className={styles.doodleImg}
            />
          </div>
        </motion.section>

      </motion.div>

      {/* Real Farmer Impact Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4rem 0 2rem 0' }}>
        <motion.div 
          className={styles.heroBadge}
          style={{ backgroundColor: '#e6f4ea', color: '#137333', marginBottom: '1rem' }}
          variants={fadeUp}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Community Impact
        </motion.div>
        
        <motion.h2 variants={fadeUp} style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color: '#111827', fontWeight: 'bold' }}>
          Trusted by Farmers Across India
        </motion.h2>
      </div>

      <motion.div className={styles.grid} variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginBottom: '4rem' }}>
        {farmerTestimonials.map((testimonial) => (
          <motion.div 
            key={testimonial.id} 
            className={styles.card} 
            variants={fadeUp}
            style={{ backgroundColor: testimonial.imageColor, minHeight: 'auto', display: 'flex', flexDirection: 'column', padding: '2rem' }}
          >
            <div className={styles.cardContent} style={{ maxWidth: '100%', marginBottom: 0 }}>
              <h3 className={styles.cardTitle} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{testimonial.farmer}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem', fontWeight: 500 }}>
                📍 {testimonial.location} &nbsp;•&nbsp; 🌾 {testimonial.crop}
              </p>
              <p className={styles.cardDesc} style={{ fontStyle: 'italic', color: '#1f2937', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
                "{testimonial.quote}"
              </p>
              <div style={{ marginTop: 'auto', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#047857', display: 'inline-block', alignSelf: 'flex-start' }}>
                Impact: {testimonial.impact}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <footer className={styles.footerContainer}>
        <div className={styles.footer}>
          <div className={styles.footerGroup}>
            <h4>Product</h4>
            <ul className={styles.footerList}>
              <li><Link href="/dashboard/advisor" className={styles.footerLink}>Crop Advisory</Link></li>
              <li><Link href="/dashboard/disease-detection" className={styles.footerLink}>Disease Detection</Link></li>
              <li><Link href="/dashboard/market" className={styles.footerLink}>Market Intelligence</Link></li>
              <li><Link href="/dashboard/weather" className={styles.footerLink}>Weather Advisory</Link></li>
            </ul>
          </div>
          <div className={styles.footerGroup}>
            <h4>Company</h4>
            <ul className={styles.footerList}>
              <li><Link href="/about" className={styles.footerLink}>About</Link></li>
              <li><Link href="/careers" className={styles.footerLink}>Careers</Link></li>
              <li><Link href="/press" className={styles.footerLink}>Press</Link></li>
              <li><Link href="/contact" className={styles.footerLink}>Contact</Link></li>
            </ul>
          </div>
          <div className={styles.footerGroup}>
            <h4>Resources</h4>
            <ul className={styles.footerList}>
              <li><Link href="/blog" className={styles.footerLink}>Blog</Link></li>
              <li><Link href="/help" className={styles.footerLink}>Help Center</Link></li>
              <li><Link href="/legal" className={styles.footerLink}>Terms</Link></li>
              <li><Link href="/legal" className={styles.footerLink}>Privacy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
      <PWAPrompt />
    </div>
  );
}
