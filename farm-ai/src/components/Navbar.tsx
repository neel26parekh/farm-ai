"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import Logo from "./Logo";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Hide nav if inside dashboard
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Logo scrolled={scrolled} />
        </Link>

        <div className={styles.navLinks}>
          <Link href="/#features">Product</Link>
          <Link href="/about">About</Link>
          <Link href="/news">News</Link>
          {mounted ? (
            <Link href={user ? "/dashboard" : "/auth/login"} className={styles.cta}>
              {user ? "Dashboard" : "Login"}
            </Link>
          ) : (
             <Link href="/auth/login" className={styles.cta}>
              Login
            </Link>
          )}
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/#features" className={styles.mobileMenuLink}>Product</Link>
            <Link href="/about" className={styles.mobileMenuLink}>About</Link>
            <Link href="/news" className={styles.mobileMenuLink}>News</Link>
            <Link href={user ? "/dashboard" : "/auth/login"} className={styles.mobileMenuCta}>
              {user ? "Go to Dashboard" : "Login"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
