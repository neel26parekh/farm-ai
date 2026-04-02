"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Scan, TrendingUp, CloudSun } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./home.module.css";
import Navbar from "@/components/Navbar";
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
            <Link href="/auth/signup" className="btn btn-primary">
              {t.home.cta} <ArrowRight size={18} />
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
    </div>
  );
}
