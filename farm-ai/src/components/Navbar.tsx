"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide nav if inside dashboard
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <div className={styles.logoTextWrapper}>
              <AnimatePresence mode="wait">
                {scrolled ? (
                  <motion.span
                    key="folded"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={styles.logoAccent}
                  >
                    AN
                  </motion.span>
                ) : (
                  <motion.span
                    key="full"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={styles.logoAccent}
                  >
                    AgroNexus
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Link>

        <div className={styles.navLinks}>
          <Link href="/#features">Product</Link>
          <Link href="/about">About</Link>
          <Link href="/news">News</Link>
          <Link href={user ? "/dashboard" : "/auth"} className={styles.cta}>
            Login
          </Link>
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
