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
  Bell,
  Settings,
  ChevronLeft,
  Sprout,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/disease-detection", icon: ScanSearch, label: "Disease Detection" },
  { href: "/dashboard/market", icon: TrendingUp, label: "Market Intelligence" },
  { href: "/dashboard/weather", icon: CloudSun, label: "Weather Advisory" },
  { href: "/dashboard/advisor", icon: Bot, label: "AI Crop Advisor" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* Logo */}
      <div className={styles.logoSection}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Sprout size={20} />
          </div>
          {!collapsed && (
            <span className={styles.logoText}>
              Farm<span className="gradient-text">AI</span>
            </span>
          )}
        </Link>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {!collapsed && <p className={styles.navLabel}>Main Menu</p>}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
                {isActive && <div className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>

        <div className={styles.navSection}>
          {!collapsed && <p className={styles.navLabel}>System</p>}
          <button className={styles.navItem} title={collapsed ? "Notifications" : undefined}>
            <Bell size={20} />
            {!collapsed && <span>Notifications</span>}
            <div className={styles.notifDot} />
          </button>
          <Link 
            href="/dashboard/settings" 
            className={`${styles.navItem} ${pathname === '/dashboard/settings' ? styles.active : ''}`} 
            title={collapsed ? "Settings" : undefined}
          >
            <Settings size={20} />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className={styles.userSection}>
        <div className={styles.userAvatar}>
          {user ? user.name.substring(0, 2).toUpperCase() : "??"}
        </div>
        {!collapsed && (
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user ? user.name : "Loading..."}</p>
            <p className={styles.userRole}>{user ? user.role : "Farmer"}</p>
          </div>
        )}
        {!collapsed && (
          <button className={styles.logoutBtn} title="Logout" onClick={logout}>
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
