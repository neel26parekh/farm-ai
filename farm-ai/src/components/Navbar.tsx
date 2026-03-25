"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sprout, Menu, X, ArrowRight, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Sprout size={24} />
          </div>
          <span className={styles.logoText}>Farm</span>
          <span className={styles.logoAccent}>AI</span>
        </Link>

        <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</a>
          {user ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <Link href="/auth" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              Login <User size={16} />
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
