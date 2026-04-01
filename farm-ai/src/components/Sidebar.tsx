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
import Logo from "./Logo";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
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
        <Link href="/" className={styles.logo} title="AgroNexus Home">
          <Logo collapsed={collapsed} />
        </Link>
        {!collapsed && (
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          className={styles.expandBtn}
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <ChevronRight size={14} />
        </button>
      )}

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
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className={styles.navBottom}>
          {/* Language toggle */}
          {!collapsed && (
            <>
              <p className={styles.navSectionLabel}>Language</p>
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
            </>
          )}

          <Link
            href="/dashboard/settings"
            className={`${styles.navItem} ${pathname === "/dashboard/settings" ? styles.active : ""}`}
            title={collapsed ? t.sidebar.settings : undefined}
          >
            <Settings size={20} strokeWidth={pathname === "/dashboard/settings" ? 2.5 : 2} />
            {!collapsed && <span>{t.sidebar.settings}</span>}
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className={styles.userSection}>
        <div className={styles.userAvatar}>
          {user ? user.name.substring(0, 2).toUpperCase() : "AG"}
        </div>
        {!collapsed && (
          <>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user ? user.name : "AgroNexus Fleet"}</p>
              <p className={styles.userRole}>{user ? user.role : "Command Center"}</p>
            </div>
            <button className={styles.logoutBtn} title="Logout" onClick={logout}>
              <LogOut size={15} strokeWidth={1.8} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
