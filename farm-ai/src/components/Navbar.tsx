"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bot } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide nav if inside dashboard
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          AI <span className={styles.logoAccent}>FarmAI</span>
        </Link>

        <div className={styles.navLinks}>
          <Link href="/#features">Product</Link>
          <Link href="/#about">About</Link>
          <Link href="/#news">News</Link>
          {user ? (
            <Link href="/dashboard" className={styles.cta}>
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/auth" className={styles.cta}>
              Try FarmAI
            </Link>
          )}
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
