"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanSearch,
  TrendingUp,
  CloudSun,
  Bot,
  Settings,
  Sprout,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.sidebar.overview },
    { href: "/dashboard/disease-detection", icon: ScanSearch, label: t.sidebar.diseaseDetection },
    { href: "/dashboard/market", icon: TrendingUp, label: t.sidebar.marketIntelligence },
    { href: "/dashboard/weather", icon: CloudSun, label: t.sidebar.weatherAdvisory },
    { href: "/dashboard/advisor", icon: Bot, label: t.sidebar.aiAdvisor },
  ];

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "HI" },
    { code: "mr", label: "MR" },
    { code: "te", label: "TE" },
  ];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>

      {/* Logo */}
      <div className={styles.logoSection}>
        <Link href="/" className={styles.logo}>
          {!collapsed && (
            <span className={styles.logoText}>
              AI <span className={styles.logoAccent}>AgroNexus</span>
            </span>
          )}
          {collapsed && (
            <div className={styles.logoIcon}>
              AI
            </div>
          )}
        </Link>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          {!collapsed && <p className={styles.navSectionLabel}>Main</p>}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} strokeWidth={1.8} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className={styles.navBottom}>
          {/* Language toggle */}
          {!collapsed && <p className={styles.navSectionLabel}>Language</p>}
          <div className={styles.langRow}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`${styles.langBtn} ${language === lang.code ? styles.langActive : ""}`}
                onClick={() => setLanguage(lang.code as any)}
                title={lang.label}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className={styles.navDivider} />

          <Link
            href="/dashboard/settings"
            className={`${styles.navItem} ${pathname === "/dashboard/settings" ? styles.active : ""}`}
            title={collapsed ? t.sidebar.settings : undefined}
          >
            <Settings size={18} strokeWidth={1.8} />
            {!collapsed && <span>{t.sidebar.settings}</span>}
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className={styles.userSection}>
        <div className={styles.userAvatar}>
          {user ? user.name.substring(0, 2).toUpperCase() : "?"}
        </div>
        {!collapsed && (
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user ? user.name : "Loading..."}</p>
            <p className={styles.userRole}>{user ? user.role : t.sidebar.profile}</p>
          </div>
        )}
        {!collapsed && (
          <button className={styles.logoutBtn} title="Logout" onClick={logout}>
            <LogOut size={15} strokeWidth={1.8} />
          </button>
        )}
      </div>
    </aside>
  );
}
