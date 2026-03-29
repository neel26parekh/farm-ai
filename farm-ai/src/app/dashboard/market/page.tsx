"use client";

"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Clock,
  IndianRupee,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { cropPrices, priceHistory, mandiPrices } from "@/lib/mockData";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

export default function MarketPage() {
  const { language, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [forecastData, setForecastData] = useState<any[]>(priceHistory);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchForecast = async () => {
      setLoadingForecast(true);
      try {
        const res = await fetch("http://localhost:8000/api/market-forecast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ crop: selectedCrop, days_to_forecast: 6 }),
        });
        if (!res.ok) throw new Error("Failed to fetch forecast");
        const data = await res.json();
        
        // Merge history with Prophet forecast
        if (isMounted && data.forecast) {
          const newForecast = priceHistory.slice(0, 4).map(h => ({ ...h } as any));
          data.forecast.forEach((f: any, i: number) => {
            const dateObj = new Date(f.ds);
            const monthName = dateObj.toLocaleString('default', { month: 'short' });
            newForecast.push({ month: `Fct ${i+1}`, [selectedCrop]: f.yhat });
          });
          setForecastData(newForecast);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setForecastData(priceHistory);
      } finally {
        if (isMounted) setLoadingForecast(false);
      }
    };
    
    fetchForecast();
    return () => { isMounted = false; };
  }, [selectedCrop]);

  const cropColors: Record<string, string> = {
    wheat: "#10b981",
    rice: "#60a5fa",
    tomato: "#f87171",
    onion: "#a78bfa",
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <TrendingUp size={28} />
            {t.market.title}
          </h1>
          <p className={styles.pageSubtitle}>
            {t.market.subtitle}
          </p>
        </div>
        <div className={styles.lastUpdated}>
          <Clock size={14} />
          {t.market.lastUpdated}
        </div>
      </div>

      {/* Price Ticker */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {[...cropPrices, ...cropPrices].map((crop, i) => (
            <div key={i} className={styles.tickerItem}>
              <span className={styles.tickerCrop}>{crop.crop}</span>
              <span className={styles.tickerPrice}>₹{crop.price.toLocaleString("en-IN")}</span>
              <span
                className={styles.tickerChange}
                style={{ color: crop.change >= 0 ? "#10b981" : "#ef4444" }}
              >
                {crop.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(crop.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Cards */}
      <div className={styles.priceGrid}>
        {cropPrices.slice(0, 4).map((crop, i) => (
          <div key={i} className={styles.priceCard}>
            <div className={styles.priceCardHeader}>
              <h3>{crop.crop}</h3>
              <span className={styles.mandiTag}>{crop.mandi}</span>
            </div>
            <p className={styles.priceCardValue}>
              <IndianRupee size={18} />
              {crop.price.toLocaleString("en-IN")}
              <span className={styles.priceUnit}>/{crop.unit}</span>
            </p>
            <div
              className={styles.priceCardChange}
              style={{ color: crop.change >= 0 ? "#10b981" : "#ef4444" }}
            >
              {crop.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{crop.change >= 0 ? "+" : ""}{crop.change}% from yesterday</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + AI Prediction */}
      <div className={styles.chartGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>{t.market.priceTrends}</h3>
            <div className={styles.cropSelector}>
              {["wheat", "rice", "tomato", "onion"].map((crop) => (
                <button
                  key={crop}
                  className={`${styles.cropBtn} ${selectedCrop === crop ? styles.cropBtnActive : ""}`}
                  onClick={() => setSelectedCrop(crop)}
                >
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {loadingForecast ? (
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald-500)" }}>
              <div className={styles.spinner} style={{ animation: "spin 1s linear infinite" }}>⚙️</div>
              <span style={{ marginLeft: 10 }}>Running Prophet Model...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="cropGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cropColors[selectedCrop]} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={cropColors[selectedCrop]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />
              <XAxis dataKey="month" stroke="#6ee7b7" fontSize={12} />
              <YAxis stroke="#6ee7b7" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "rgba(3, 11, 5, 0.95)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "8px",
                  color: "#ecfdf5",
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedCrop}
                stroke={cropColors[selectedCrop]}
                fill="url(#cropGrad)"
                strokeWidth={3}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>

        {/* AI Prediction */}
        <div className={styles.predictionCard}>
          <div className={styles.predictionHeader}>
            <Zap size={18} />
            <h3>{t.market.aiPrediction}</h3>
          </div>
          <div className={styles.predictionContent}>
            <div className={styles.predictionItem}>
              <p className={styles.predictionLabel}>Wheat (Next 30 Days)</p>
              <p className={styles.predictionValue} style={{ color: "#10b981" }}>
                ₹2,350 - ₹2,420
              </p>
              <p className={styles.predictionConf}>85% confidence</p>
              <div className={styles.predictionTrend}>
                <TrendingUp size={14} />
                Expected to rise 3-6%
              </div>
            </div>

            <div className={styles.predictionDivider} />

            <div className={styles.predictionItem}>
              <p className={styles.predictionLabel}>Best Time to Sell</p>
              <p className={styles.predictionValue} style={{ color: "#fbbf24" }}>
                April 5-12
              </p>
              <p className={styles.predictionConf}>Peak demand period</p>
            </div>

            <div className={styles.predictionDivider} />

            <div className={styles.predictionItem}>
              <p className={styles.predictionLabel}>Tomato (Alert)</p>
              <p className={styles.predictionValue} style={{ color: "#ef4444" }}>
                Price Drop Expected
              </p>
              <p className={styles.predictionConf}>Oversupply from Maharashtra</p>
              <div className={styles.predictionTrend} style={{ color: "#ef4444" }}>
                <TrendingDown size={14} />
                May drop 15-20% by mid-April
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandi Comparison */}
      <div className={styles.mandiSection}>
        <h3 className={styles.mandiTitle}>
          <BarChart3 size={18} />
          {t.market.mandiComparison}
        </h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mandi</th>
                <th>Wheat (₹/q)</th>
                <th>Rice (₹/q)</th>
                <th>Tomato (₹/q)</th>
                <th>Onion (₹/q)</th>
              </tr>
            </thead>
            <tbody>
              {mandiPrices.map((mandi, i) => (
                <tr key={i}>
                  <td className={styles.mandiName}>{mandi.mandi}</td>
                  <td>₹{mandi.wheat.toLocaleString("en-IN")}</td>
                  <td>₹{mandi.rice.toLocaleString("en-IN")}</td>
                  <td>₹{mandi.tomato.toLocaleString("en-IN")}</td>
                  <td>₹{mandi.onion.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
