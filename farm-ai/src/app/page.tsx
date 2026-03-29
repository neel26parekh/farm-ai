"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Scan, TrendingUp, CloudSun } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import styles from "./home.module.css";

import Navbar from "@/components/Navbar";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Agricultural intelligence for every farmer
          </h1>
          <p className={styles.heroSubtitle}>
            We build advanced AI models to help farmers detect diseases, track market intelligence, and receive expert agronomic advice—all through a clean, accessible interface designed for the field.
          </p>
          <Link href="/auth" className={styles.cardAction}>
            Start building your farm <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Subject Cards Grid */}
      <div id="features" className={styles.grid}>
        
        {/* Card 1: AI Advisor */}
        <section className={`${styles.card} ${styles.cardSage}`}>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Expert Advice</h2>
            <p className={styles.cardDesc}>
              Our AI Crop Advisor provides hyper-local forecasts and farming-specific impact analysis, helping you make informed decisions about your crops.
            </p>
            <Link href="/dashboard/advisor" className={styles.cardAction}>
              Ask the Advisor
            </Link>
          </div>
          <div className={styles.cardIllustration}>
            <Image 
              src="/images/hero-doodle.png" 
              alt="Farm AI Illustration" 
              width={400} 
              height={400} 
              priority
            />
          </div>
        </section>

        {/* Card 2: Disease Detection */}
        <section className={`${styles.card} ${styles.cardLavender}`}>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Disease Detection</h2>
            <p className={styles.cardDesc}>
              Upload a photo of your crop to identify diseases in seconds. Our models are trained on millions of images to provide high-accuracy diagnosis and treatment plans.
            </p>
            <Link href="/dashboard/disease-detection" className={styles.cardAction}>
              Scan your crops
            </Link>
          </div>
          <div className={styles.cardIllustration}>
            <Image 
              src="/images/disease-doodle.png" 
              alt="Disease Scan Illustration" 
              width={400} 
              height={400} 
            />
          </div>
        </section>

        {/* Card 3: Market Intelligence */}
        <section className={`${styles.card} ${styles.cardSand}`}>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Market Pricing</h2>
            <p className={styles.cardDesc}>
              Track real-time market prices across Mandis in India. Get AI-powered price predictions to help you decide when and where to sell for maximum profit.
            </p>
            <Link href="/dashboard/market" className={styles.cardAction}>
              Explore Mandis
            </Link>
          </div>
          <div className={styles.cardIllustration}>
            <Image 
              src="/images/market-doodle.png" 
              alt="Market Graph Illustration" 
              width={400} 
              height={400} 
            />
          </div>
        </section>

        {/* Card 4: Weather Intelligence */}
        <section className={`${styles.card} ${styles.cardSky}`}>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Weather Advisory</h2>
            <p className={styles.cardDesc}>
              Receive hyper-local weather alerts and actionable advice on how to protect your crops from upcoming weather events.
            </p>
            <Link href="/dashboard/weather" className={styles.cardAction}>
              Get weather data
            </Link>
          </div>
          <div className={styles.cardIllustration}>
            <Image 
              src="/images/weather-doodle.png" 
              alt="Weather Illustration" 
              width={400} 
              height={400} 
            />
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGroup}>
          <h4>Product</h4>
          <ul className={styles.footerList}>
            <li><Link href="/dashboard/advisor" className={styles.footerLink}>AI Advisor</Link></li>
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
      </footer>
    </div>
  );
}
