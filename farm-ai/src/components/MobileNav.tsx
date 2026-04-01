"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScanSearch, TrendingUp, CloudSun, Bot } from "lucide-react";
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

  return (
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
    </nav>
  );
}
