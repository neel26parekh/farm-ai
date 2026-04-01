"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Scan, TrendingUp, CloudSun } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./home.module.css";

import Navbar from "@/components/Navbar";

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {t.home.heroTitle}
          </h1>
          <p className={styles.heroSubtitle}>
            {t.home.heroSubtitle}
          </p>
          <Link href="/auth" className="btn btn-primary">
            {t.home.cta} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Subject Cards Grid */}
      <div id="features" className={styles.grid}>
        
        {/* Card 1: AI Advisor */}
        <section className={`${styles.card} ${styles.cardSage}`}>
          <div className={styles.cardContent}>
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
        </section>

        {/* Card 2: Disease Detection */}
        <section className={`${styles.card} ${styles.cardLavender}`}>
          <div className={styles.cardContent}>
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
        </section>

        {/* Card 3: Market Intelligence */}
        <section className={`${styles.card} ${styles.cardSand}`}>
          <div className={styles.cardContent}>
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
        </section>

        {/* Card 4: Weather Intelligence */}
        <section className={`${styles.card} ${styles.cardSky}`}>
          <div className={styles.cardContent}>
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
        </section>

      </div>

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
          <div className={styles.footerGroup}>
            <h4>Connect</h4>
            <ul className={styles.footerList}>
              <li><Link href="#" className={styles.footerLink}>Twitter</Link></li>
              <li><Link href="#" className={styles.footerLink}>LinkedIn</Link></li>
              <li><Link href="#" className={styles.footerLink}>GitHub</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
