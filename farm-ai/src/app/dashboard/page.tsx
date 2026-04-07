"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { motion } from "framer-motion";
import { cropHealthData, dashboardAlerts, cropPrices, weatherForecast } from "@/lib/mockData";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import Skeleton from "@/components/Skeleton";
import LiveIndicator from "@/components/LiveIndicator";
import EmptyState from "@/components/EmptyState";
import VoiceReader from "./advisor/VoiceReader";
import styles from "./page.module.css";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
}

interface DailyAction {
  id: string;
  title: string;
  why: string;
  confidence: "High" | "Medium" | "Low";
  advisorPrompt: string;
  estimatedValue: number;
  done: boolean;
}

interface ImpactSnapshot {
  actionsDone: number;
  timelySales: number;
  diseasePreventions: number;
  estimatedSavings: number;
  monthKey: string;
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
  const router = useRouter();
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [farmerProfile, setFarmerProfile] = useState<{ crop: string; location: string; farmSize: string }>({
    crop: "Wheat",
    location: "your location",
    farmSize: "5",
  });
  const [dailyActions, setDailyActions] = useState<DailyAction[]>([]);
  const [impact, setImpact] = useState<ImpactSnapshot>({
    actionsDone: 0,
    timelySales: 0,
    diseasePreventions: 0,
    estimatedSavings: 0,
    monthKey: new Date().toISOString().slice(0, 7),
  });
  const [communityAlert, setCommunityAlert] = useState({
    title: "Community Outbreak Alert",
    message:
      "Model risk estimate loading for your farm...",
  });
  const { user } = useAuth();
  const todayKey = new Date().toISOString().slice(0, 10);
  const monthKey = new Date().toISOString().slice(0, 7);

  const buildActions = (crop: string, location: string, farmSize: string): DailyAction[] => [
    {
      id: "disease-scout",
      title: `Inspect ${crop} leaves this morning`,
      why: `Humidity-linked disease risk can rise quickly in ${location}. Early field scouting prevents spread and saves spray cost later.`,
      confidence: "High",
      advisorPrompt: `Why should I inspect ${crop} early today and what exactly should I look for?`,
      estimatedValue: 1800,
      done: false,
    },
    {
      id: "irrigation-plan",
      title: "Set irrigation window before noon",
      why: "Morning irrigation lowers fungal pressure and improves water-use efficiency compared to late-evening watering.",
      confidence: "Medium",
      advisorPrompt: `Create an irrigation plan for my ${crop} farm size ${farmSize} acres.`,
      estimatedValue: 900,
      done: false,
    },
    {
      id: "market-check",
      title: `Check nearest mandi rates for ${crop}`,
      why: "Price spread between nearby mandis can materially change net income after transport and commission.",
      confidence: "High",
      advisorPrompt: `Explain how I should decide where to sell ${crop} this week based on mandi price spread.`,
      estimatedValue: 2200,
      done: false,
    },
  ];

  const applyImpactUpdate = (actionId: string, value: number) => {
    setImpact((prev) => {
      const reset = prev.monthKey !== monthKey;
      const base: ImpactSnapshot = reset
        ? { actionsDone: 0, timelySales: 0, diseasePreventions: 0, estimatedSavings: 0, monthKey }
        : prev;

      const next: ImpactSnapshot = {
        ...base,
        actionsDone: base.actionsDone + 1,
        estimatedSavings: base.estimatedSavings + value,
      };

      if (actionId === "market-check") next.timelySales += 1;
      if (actionId === "disease-scout") next.diseasePreventions += 1;

      localStorage.setItem("farm_ai_impact_metrics", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("farm_ai_settings");
      if (saved) {
        const farm = JSON.parse(saved);
        const crop = (farm.primaryCrop || "Wheat").toString();
        const location = (farm.location || "your location").toString();
        const farmSize = (farm.farmSize || "5").toString();
        setFarmerProfile({ crop, location, farmSize });

        const actionKey = `farm_ai_daily_actions_${todayKey}`;
        const persistedActions = localStorage.getItem(actionKey);
        if (persistedActions) {
          const parsed = JSON.parse(persistedActions) as DailyAction[];
          setDailyActions(parsed);
        } else {
          const starterActions = buildActions(crop, location, farmSize);
          setDailyActions(starterActions);
          localStorage.setItem(actionKey, JSON.stringify(starterActions));
        }
      } else {
        const starterActions = buildActions("Wheat", "your location", "5");
        setDailyActions(starterActions);
      }

      const rawImpact = localStorage.getItem("farm_ai_impact_metrics");
      if (rawImpact) {
        const parsedImpact = JSON.parse(rawImpact) as ImpactSnapshot;
        if (parsedImpact.monthKey === monthKey) {
          setImpact(parsedImpact);
        }
      }
    } catch {
      // Continue with defaults when local storage is unavailable
    }

    // Simulate real-time data fetch delay for skeleton demo
    const timer = setTimeout(() => setLoading(false), 1200);

    const hour = new Date().getHours();
    const welcomeText = t.dashboard.welcome.split(",")[1] || t.dashboard.welcome;
    if (hour < 12) setGreeting(language === 'en' ? "Good Morning" : t.dashboard.welcome.split(",")[0]);
    else if (hour < 17) setGreeting(language === 'en' ? "Good Afternoon" : t.dashboard.welcome.split(",")[0]);
    else setGreeting(language === 'en' ? "Good Evening" : t.dashboard.welcome.split(",")[0]);

    setDateStr(
      new Date().toLocaleDateString(language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "te-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    const loadLiveAlert = async () => {
      try {
        const saved = localStorage.getItem("farm_ai_settings");
        const farm = saved ? JSON.parse(saved) : {};
        const crop = (farm.primaryCrop || "Wheat").toString();
        const location = (farm.location || "your location").toString();

        const getRiskFromData = (temp: number, humidity: number, wind: number) => {
          let score = 0;
          if (humidity >= 75) score += 2;
          if (temp >= 14 && temp <= 24) score += 1;
          if (wind <= 8) score += 1;
          if (score >= 3) return "high";
          if (score >= 2) return "moderate";
          return "low";
        };

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
              const data = await res.json();
              const temp = Number(data?.current?.temperature_2m ?? 24);
              const humidity = Number(data?.current?.relative_humidity_2m ?? 65);
              const wind = Number(data?.current?.wind_speed_10m ?? 10);
              const risk = getRiskFromData(temp, humidity, wind);

              if (risk === "high") {
                setCommunityAlert({
                  title: "Live Disease Risk Alert",
                  message: `High fungal risk for ${crop} in ${location} right now (Humidity ${humidity}%, Temp ${temp}°C). Inspect field today and prioritize preventive spray in the morning.`,
                });
              } else if (risk === "moderate") {
                setCommunityAlert({
                  title: "Live Crop Risk Watch",
                  message: `Moderate disease risk for ${crop} in ${location} (Humidity ${humidity}%, Temp ${temp}°C). Monitor leaves over next 48 hours and avoid late-evening irrigation.`,
                });
              } else {
                setCommunityAlert({
                  title: "Live Farm Health Update",
                  message: `Current conditions are relatively stable for ${crop} in ${location} (Humidity ${humidity}%, Temp ${temp}°C). Continue scheduled field checks.`,
                });
              }
            } catch {
              setCommunityAlert({
                title: "Community Outbreak Alert",
                message: `Local model estimate for ${crop}: monitor crop closely in ${location} and report unusual leaf spots early for faster intervention.`,
              });
            }
          },
          () => {
            setCommunityAlert({
              title: "Community Outbreak Alert",
              message: `Location permission is off. Enable location for live alerts. For now, keep daily scouting active for ${crop}.`,
            });
          }
        );
      } catch {
        setCommunityAlert({
          title: "Community Outbreak Alert",
          message: "Unable to load personalized alert right now. Keep disease scouting active this week.",
        });
      }
    };

    loadLiveAlert();

    return () => clearTimeout(timer);
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

  // Helper to translate alert data
  const getAlertMessage = (type: string) => {
    return t.dashboard.alerts.messages?.[type] || "Alert notification";
  };

  const whatsappNumber = "918320936239";
  const whatsappMessage = encodeURIComponent(
    "Namaste AgroNexus team, I need help diagnosing my crop."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleWhatsappConnect = () => {
    if (typeof window === "undefined") return;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const persistActions = (actions: DailyAction[]) => {
    localStorage.setItem(`farm_ai_daily_actions_${todayKey}`, JSON.stringify(actions));
  };

  const markActionDone = (actionId: string) => {
    setDailyActions((prev) => {
      const next = prev.map((action) => {
        if (action.id !== actionId || action.done) return action;
        applyImpactUpdate(actionId, action.estimatedValue);
        return { ...action, done: true };
      });
      persistActions(next);
      return next;
    });
  };

  const remindAction = async (title: string) => {
    if (typeof window === "undefined") return;

    if (!("Notification" in window)) {
      alert("Reminders are not supported in this browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setTimeout(() => {
        new Notification("AgroNexus Reminder", {
          body: title,
        });
      }, 3000);
    }
  };

  const askAdvisorWhy = (prompt: string) => {
    router.push(`/dashboard/advisor?ask=${encodeURIComponent(prompt)}`);
  };

  if (!mounted) return null;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {loading ? <Skeleton width={250} height={32} /> : `${greeting}, ${user ? user.name.split(" ")[0] : t.sidebar.profile}`}
            {!loading && <VoiceReader text={`${greeting} ${user ? user.name.split(" ")[0] : t.sidebar.profile}. Here is your farm summary for today.`} />}
          </h1>
          <p className={styles.subGreeting}>
            {loading ? <Skeleton width={320} height={20} className={styles.mtShort} /> : t.dashboard.subtitle}
          </p>
        </div>
        <div className={styles.headerDate}>
          {loading ? <Skeleton width={180} height={20} /> : dateStr}
        </div>
      </div>

      {/* Outbreak / Community Alert Banner */}
      {!loading && (
        <div style={{
          backgroundColor: '#fef2f2',
          borderLeft: '5px solid #ef4444',
          padding: '1.25rem',
          borderRadius: '0 12px 12px 0',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ backgroundColor: '#ef4444', borderRadius: '50%', padding: '8px', color: 'white' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#991b1b' }}>{communityAlert.title}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: '#7f1d1d' }}>
              ⚠️ {communityAlert.message}
            </p>
          </div>
        </div>
      )}

      {/* WhatsApp Connect Banner */}
      {!loading && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '1.25rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '10px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* WhatsApp Icon (using default lucide or just Text) */}
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Farm AI is on WhatsApp</h3>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>Send a photo of your sick crop to <strong>+91 8320936239</strong> to get instant AI agronomy advice.</p>
            </div>
          </div>
          <button style={{ 
            backgroundColor: 'white', 
            color: '#059669', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            fontWeight: 700, 
            cursor: 'pointer',
            fontSize: '1rem',
            whiteSpace: 'nowrap'
          }} onClick={handleWhatsappConnect} type="button" aria-label="Open WhatsApp chat">
            Connect Now
          </button>
        </div>
      )}

      {!loading && (
        <div className={styles.actionImpactGrid}>
          <div className={styles.actionsCard}>
            <div className={styles.actionsHeader}>
              <h3>Today&apos;s Farm Actions</h3>
              <span className={styles.actionsTag}>Action-first recommendations</span>
            </div>
            <div className={styles.actionsList}>
              {dailyActions.map((action) => (
                <div key={action.id} className={styles.actionItem}>
                  <div className={styles.actionMain}>
                    <p className={styles.actionTitle}>{action.title}</p>
                    <p className={styles.actionWhy}>Why: {action.why}</p>
                    <p className={styles.actionMeta}>Confidence: {action.confidence} · Est. value protected: ₹{action.estimatedValue.toLocaleString("en-IN")}</p>
                  </div>
                  <div className={styles.actionButtons}>
                    <button type="button" className={styles.actionBtn} onClick={() => askAdvisorWhy(action.advisorPrompt)}>
                      Ask AI Why
                    </button>
                    <button type="button" className={styles.actionBtn} onClick={() => remindAction(action.title)}>
                      Remind Me
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.actionPrimary}`}
                      onClick={() => markActionDone(action.id)}
                      disabled={action.done}
                    >
                      {action.done ? "Done ✓" : "Mark Done"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.impactCard}>
            <h3>Your Farm Gains ({monthKey})</h3>
            <div className={styles.impactMetrics}>
              <div>
                <span>Actions Completed</span>
                <strong>{impact.actionsDone}</strong>
              </div>
              <div>
                <span>Disease Risks Prevented</span>
                <strong>{impact.diseasePreventions}</strong>
              </div>
              <div>
                <span>Timely Sale Decisions</span>
                <strong>{impact.timelySales}</strong>
              </div>
              <div>
                <span>Estimated Savings</span>
                <strong>₹{impact.estimatedSavings.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {[
          { icon: <Sprout size={22} color="#10b981" />, bg: "rgba(16, 185, 129, 0.12)", label: t.dashboard.stats.activeCrops, value: 12, trend: `+2 ${t.dashboard.stats.thisSeason}`, trendColor: "#10b981", tIcon: <ArrowUpRight size={14} /> },
          { icon: <Heart size={22} color="#f87171" />, bg: "rgba(239, 68, 68, 0.12)", label: t.dashboard.stats.healthScore, value: 92, suffix: "%", trend: `+5% ${t.dashboard.stats.lastWeek}`, trendColor: "#10b981", tIcon: <ArrowUpRight size={14} /> },
          { icon: <Droplets size={22} color="#60a5fa" />, bg: "rgba(59, 130, 246, 0.12)", label: t.dashboard.stats.moisture, value: 72, suffix: "%", trend: t.dashboard.stats.irrigationNeeded, trendColor: "#f59e0b", tIcon: <ArrowDownRight size={14} /> },
          { icon: <TrendingUp size={22} color="#fbbf24" />, bg: "rgba(245, 158, 11, 0.12)", label: t.dashboard.stats.revenue, value: 485000, prefix: "₹", trend: `+18% ${t.dashboard.stats.lastYear}`, trendColor: "#10b981", tIcon: <ArrowUpRight size={14} /> },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <div className={styles.statCardIcon} style={{ background: stat.bg }}>
              {stat.icon}
            </div>
            <div className={styles.statCardInfo}>
              <p className={styles.statCardLabel}>{stat.label}</p>
              <p className={styles.statCardValue}>
                {loading ? <Skeleton width={60} height={28} /> : <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />}
              </p>
            </div>
            <div className={styles.statCardTrend} style={{ color: stat.trendColor }}>
              {stat.tIcon}
              <span>{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Alerts */}
      <div className={styles.mainGrid}>
        {/* Crop Health Chart */}
        <div className={styles.chartCard} style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
          <div className={styles.chartHeader}>
            <h3>{loading ? <Skeleton width={200} height={24} /> : t.dashboard.charts.title}</h3>
            <div className={styles.chartLegend}>
              {[
                { dot: "#10b981", label: t.dashboard.charts.health },
                { dot: "#60a5fa", label: t.dashboard.charts.moisture },
                { dot: "#fbbf24", label: t.dashboard.charts.nutrients },
              ].map((item, i) => (
                <span key={i} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: item.dot }} />
                  {loading ? <Skeleton width={50} height={14} /> : item.label}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.chartWrap}>
            {loading ? (
              <Skeleton width="100%" height={280} borderRadius={12} />
            ) : (
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
          <h3 className={styles.alertsTitle}>{loading ? <Skeleton width={120} height={24} /> : t.dashboard.alerts.title}</h3>
          <div className={styles.alertsList}>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className={styles.alertItem}>
                  <Skeleton width={40} height={40} circle />
                  <div className={styles.alertContent}>
                    <Skeleton width={150} height={16} />
                    <Skeleton width={200} height={14} className={styles.mtSmall} />
                  </div>
                </div>
              ))
            ) : dashboardAlerts.length > 0 ? (
              dashboardAlerts.map((alert) => (
                <div key={alert.id} className={styles.alertItem}>
                  <div
                    className={styles.alertIcon}
                    style={{ color: alertColors[alert.type], background: `${alertColors[alert.type]}15` }}
                  >
                    {alertIcons[alert.type]}
                  </div>
                  <div className={styles.alertContent}>
                    <p className={styles.alertTitle}>{alert.title}</p>
                    <p className={styles.alertMessage}>{getAlertMessage(alert.type)}</p>
                    <p className={styles.alertTime}>{alert.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState 
                title="All Clear" 
                description="No active alerts for your farm at this time. We'll notify you if anything changes."
                image="/images/advisor-bold.png"
                className={styles.compactEmpty}
              />
            )}
          </div>
        </div>
      </div>

      {/* Market + Weather Quick View */}
      <div className={styles.bottomGrid}>
        {/* Market Prices */}
        <div className={styles.quickCard}>
          <div className={styles.quickCardHeader}>
            <h3 className={styles.quickTitle}>
              <TrendingUp size={18} />
              {t.dashboard.quickView.market}
            </h3>
            <LiveIndicator />
          </div>
          <div className={styles.priceList}>
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} width="100%" height={32} className={styles.mbSmall} />)
            ) : (
              cropPrices.slice(0, 5).map((crop, i) => (
                <div key={i} className={styles.priceItem}>
                  <span className={styles.cropName}>{t?.data ? (t.data as any)[crop.crop.toLowerCase()] || crop.crop : crop.crop}</span>
                  <span className={styles.cropPrice}>₹{crop.price} / {t?.data?.quintal || "quintal"}</span>
                  <span
                    className={styles.cropChange}
                    style={{ color: crop.change >= 0 ? "#10b981" : "#ef4444" }}
                  >
                    {crop.change >= 0 ? "+" : ""}
                    {crop.change}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Weather Quick */}
        <div className={styles.quickCard}>
          <div className={styles.quickCardHeader}>
            <h3 className={styles.quickTitle}>
              <CloudSun size={18} />
              {t.dashboard?.quickView?.weather || "Weather"}
            </h3>
            <LiveIndicator />
          </div>
          <div className={styles.weatherList}>
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} width="100%" height={32} className={styles.mbSmall} />)
            ) : (
              weatherForecast.slice(0, 5).map((day, i) => (
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
                    {t?.impact ? t.impact[day.farmingImpact as keyof typeof t.impact] || day.farmingImpact : day.farmingImpact}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

