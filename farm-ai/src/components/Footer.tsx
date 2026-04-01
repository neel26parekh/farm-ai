"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { Mail, MessageSquare, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoAccent}>AgroNexus</span>
          </Link>
          <p className={styles.tagline}>
            Advancing the world's most vital industry through elegant, intuitive intelligence.
          </p>
          <div className={styles.socials}>
            <Mail size={18} />
            <MessageSquare size={18} />
            <Globe size={18} />
          </div>
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.column}>
            <h3>Product</h3>
            <Link href="/#features">Features</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/news">Intelligence Feed</Link>
          </div>
          <div className={styles.column}>
            <h3>Company</h3>
            <Link href="/about">About Us</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={styles.column}>
            <h3>Legal</h3>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} AgroNexus Technologies Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
