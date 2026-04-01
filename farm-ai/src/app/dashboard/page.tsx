"use client";

import { useEffect, useState } from "react";
import {
  Sprout,
  Heart,
  Droplets,
  TrendingUp,
  AlertTriangle,
  CloudSun,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cropHealthData, dashboardAlerts, cropPrices, weatherForecast } from "@/lib/mockData";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ target, suffix = "", prefix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Hello");
  const [dateStr, setDateStr] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t.dashboard.welcome.split(",")[0] || "Good Morning");
    else if (hour < 17) setGreeting(t.dashboard.welcome.split(",")[0] || "Good Afternoon");
    else setGreeting(t.dashboard.welcome.split(",")[0] || "Good Evening");

    setDateStr(
      new Date().toLocaleDateString(language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "te-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, [language, t.dashboard.welcome]);

  const alertIcons: Record<string, React.ReactNode> = {
    disease: <AlertTriangle size={16} />,
    weather: <CloudSun size={16} />,
    market: <TrendingUp size={16} />,
    info: <Sprout size={16} />,
  };

  const alertColors: Record<string, string> = {
    disease: "#ef4444",
    weather: "#3b82f6",
    market: "#10b981",
    info: "#8b5cf6",
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>{greeting}, {user ? user.name.split(" ")[0] : "Farmer"}</h1>
          <p className={styles.subGreeting}>
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className={styles.headerDate}>
          {dateStr || "Loading..."}
        </div>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: "rgba(16, 185, 129, 0.12)" }}>
            <Sprout size={22} color="#10b981" />
          </div>
          <div className={styles.statCardInfo}>
            <p className={styles.statCardLabel}>{t.dashboard.stats.activeCrops}</p>
            <p className={styles.statCardValue}>
              {mounted ? <AnimatedCounter target={12} /> : "0"}
            </p>
          </div>
          <div className={styles.statCardTrend} style={{ color: "#10b981" }}>
            <ArrowUpRight size={14} />
            <span>+2 {t.dashboard.stats.thisSeason}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: "rgba(239, 68, 68, 0.12)" }}>
            <Heart size={22} color="#f87171" />
          </div>
          <div className={styles.statCardInfo}>
            <p className={styles.statCardLabel}>{t.dashboard.stats.healthScore}</p>
            <p className={styles.statCardValue}>
              {mounted ? <AnimatedCounter target={92} suffix="%" /> : "0%"}
            </p>
          </div>
          <div className={styles.statCardTrend} style={{ color: "#10b981" }}>
            <ArrowUpRight size={14} />
            <span>+5% {t.dashboard.stats.lastWeek}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: "rgba(59, 130, 246, 0.12)" }}>
            <Droplets size={22} color="#60a5fa" />
          </div>
          <div className={styles.statCardInfo}>
            <p className={styles.statCardLabel}>{t.dashboard.stats.moisture}</p>
            <p className={styles.statCardValue}>
              {mounted ? <AnimatedCounter target={72} suffix="%" /> : "0%"}
            </p>
          </div>
          <div className={styles.statCardTrend} style={{ color: "#f59e0b" }}>
            <ArrowDownRight size={14} />
            <span>{t.dashboard.stats.irrigationNeeded}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: "rgba(245, 158, 11, 0.12)" }}>
            <TrendingUp size={22} color="#fbbf24" />
          </div>
          <div className={styles.statCardInfo}>
            <p className={styles.statCardLabel}>{t.dashboard.stats.revenue}</p>
            <p className={styles.statCardValue}>
              {mounted ? <AnimatedCounter target={485000} prefix="₹" /> : "₹0"}
            </p>
          </div>
          <div className={styles.statCardTrend} style={{ color: "#10b981" }}>
            <ArrowUpRight size={14} />
            <span>+18% {t.dashboard.stats.lastYear}</span>
          </div>
        </div>
      </div>

      {/* Charts + Alerts */}
      <div className={styles.mainGrid}>
        {/* Crop Health Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>{t.dashboard.charts.title}</h3>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#10b981" }} />
                {t.dashboard.charts.health}
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#60a5fa" }} />
                {t.dashboard.charts.moisture}
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#fbbf24" }} />
                {t.dashboard.charts.nutrients}
              </span>
            </div>
          </div>
          <div className={styles.chartWrap}>
            {mounted && (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={cropHealthData}>
                  <defs>
                    <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="nutrientsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                  <XAxis dataKey="week" stroke="#6ee7b7" fontSize={12} />
                  <YAxis stroke="#6ee7b7" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(3, 11, 5, 0.95)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      borderRadius: "8px",
                      color: "#ecfdf5",
                    }}
                  />
                  <Area type="monotone" dataKey="health" stroke="#10b981" fill="url(#healthGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="moisture" stroke="#60a5fa" fill="url(#moistureGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="nutrients" stroke="#fbbf24" fill="url(#nutrientsGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className={styles.alertsCard}>
          <h3 className={styles.alertsTitle}>{t.dashboard.alerts.title}</h3>
          <div className={styles.alertsList}>
            {dashboardAlerts.map((alert) => (
              <div key={alert.id} className={styles.alertItem}>
                <div
                  className={styles.alertIcon}
                  style={{ color: alertColors[alert.type], background: `${alertColors[alert.type]}15` }}
                >
                  {alertIcons[alert.type]}
                </div>
                <div className={styles.alertContent}>
                  <p className={styles.alertTitle}>{alert.title}</p>
                  <p className={styles.alertMessage}>{alert.message}</p>
                  <p className={styles.alertTime}>{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market + Weather Quick View */}
      <div className={styles.bottomGrid}>
        {/* Market Prices */}
        <div className={styles.quickCard}>
          <h3 className={styles.quickTitle}>
            <TrendingUp size={18} />
            {t.dashboard.quickView.market}
          </h3>
          <div className={styles.priceList}>
            {cropPrices.slice(0, 5).map((crop, i) => (
              <div key={i} className={styles.priceItem}>
                <span className={styles.cropName}>{(t.data as any)[crop.crop.toLowerCase()] || crop.crop}</span>
                <span className={styles.cropPrice}>₹{crop.price} / {(t.data as any).quintal}</span>
                <span
                  className={styles.cropChange}
                  style={{ color: crop.change >= 0 ? "#10b981" : "#ef4444" }}
                >
                  {crop.change >= 0 ? "+" : ""}
                  {crop.change}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Quick */}
        <div className={styles.quickCard}>
          <h3 className={styles.quickTitle}>
            <CloudSun size={18} />
            {t.dashboard.quickView.weather}
          </h3>
          <div className={styles.weatherList}>
            {weatherForecast.slice(0, 5).map((day, i) => (
              <div key={i} className={styles.weatherItem}>
                <span className={styles.weatherDay}>{day.day}</span>
                <span className={styles.weatherCondition}>
                  {day.condition === "sunny" && "☀️"}
                  {day.condition === "cloudy" && "☁️"}
                  {day.condition === "rainy" && "🌧️"}
                  {day.condition === "partly-cloudy" && "⛅"}
                  {day.condition === "stormy" && "⛈️"}
                </span>
                <span className={styles.weatherTemp}>{day.temp}°C</span>
                <span
                  className={`badge ${
                    day.farmingImpact === "good"
                      ? ""
                      : day.farmingImpact === "moderate"
                      ? "badge-warning"
                      : "badge-danger"
                  }`}
                >
                  {day.farmingImpact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
