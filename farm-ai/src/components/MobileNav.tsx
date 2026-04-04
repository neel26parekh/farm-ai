"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScanSearch, TrendingUp, CloudSun, Bot, Settings, User, LogOut, Ellipsis } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./MobileNav.module.css";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/disease-detection", icon: ScanSearch, label: "Scan" },
  { href: "/dashboard/market", icon: TrendingUp, label: "Market" },
  { href: "/dashboard/weather", icon: CloudSun, label: "Weather" },
  { href: "/dashboard/advisor", icon: Bot, label: "AI Chat" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
    <nav className={styles.mobileNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        className={styles.navItem}
        onClick={() => setMoreOpen((v) => !v)}
        aria-label="Open more menu"
      >
        <Ellipsis size={20} />
        <span>More</span>
      </button>
    </nav>

    {moreOpen && (
      <div className={styles.moreSheet} role="dialog" aria-label="More options">
        <div className={styles.moreHeader}>Quick Settings</div>
        <div className={styles.moreLangRow}>
          {["en", "hi", "gu", "mr", "te"].map((lang) => (
            <button
              key={lang}
              type="button"
              className={`${styles.langBtn} ${language === lang ? styles.langBtnActive : ""}`}
              onClick={() => setLanguage(lang as any)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <Link href="/dashboard/profile" className={styles.moreItem} onClick={() => setMoreOpen(false)}>
          <User size={16} /> Profile
        </Link>
        <Link href="/dashboard/settings" className={styles.moreItem} onClick={() => setMoreOpen(false)}>
          <Settings size={16} /> Settings
        </Link>
        <button type="button" className={styles.moreItem} onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    )}
    </>
  );
}
