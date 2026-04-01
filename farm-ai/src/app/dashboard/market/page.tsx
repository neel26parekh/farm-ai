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
  Search,
  X,
  BellRing,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import Image from "next/image";
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
  const [selectedCrop, setSelectedCrop] = useState("mustard");
  const [forecastData, setForecastData] = useState<any[]>(priceHistory);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState<"myFarm" | "explorer">("myFarm");
  const [pinnedCrops, setPinnedCrops] = useState<string[]>([]);
  const [reminderSet, setReminderSet] = useState(false);

  // Load pinned crops from local storage on mount
  useEffect(() => {
    const savedPins = localStorage.getItem("agronexus_pinned_crops");
    if (savedPins) {
      setPinnedCrops(JSON.parse(savedPins));
    } else {
      setPinnedCrops(["mustard", "wheat"]); // defaults
    }
  }, []);

  const allCrops = cropPrices.map(c => c.crop);
  const filteredCrops = allCrops.filter(c => 
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const displayedCrops = viewMode === "myFarm" 
    ? cropPrices.filter(c => pinnedCrops.includes(c.crop.toLowerCase()))
    : cropPrices;

  const togglePin = (crop: string) => {
    const c = crop.toLowerCase();
    let updatedPins;
    if (pinnedCrops.includes(c)) {
      updatedPins = pinnedCrops.filter(p => p !== c);
    } else {
      updatedPins = [...pinnedCrops, c];
    }
    setPinnedCrops(updatedPins);
    localStorage.setItem("agronexus_pinned_crops", JSON.stringify(updatedPins));
  };

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
    wheat: "#3D5A44", /* Forest */
    rice: "#8AA382",  /* Sage */
    tomato: "#BC6C25", /* Earthy Red/Brown */
    onion: "#606C38",  /* Olive */
    potato: "#B5A48B", /* Earthy Tan */
    soybean: "#4A5D4E", /* Dark Sage */
    cotton: "#D6DBB2", /* Light Lime */
    gram: "#8B5E3C",   /* Brown */
    mustard: "#DAA520", /* Golden */
    jowar: "#A4C639",  /* Greenish */
    bajra: "#C2B280",  /* Sand */
  };

  // Helper to format crop names consistently
  const formatCrop = (c: string) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();

  // Calculate prediction details from forecast
  const getPrediction = () => {
    if (!forecastData || forecastData.length < 5) return null;
    const futureData = forecastData.filter(d => d.month.includes("Fct"));
    if (futureData.length === 0) return null;

    const prices = futureData.map(d => d[selectedCrop]);
    const min = Math.round(Math.min(...prices));
    const max = Math.round(Math.max(...prices));
    const lastHist = forecastData[3]?.[selectedCrop] || prices[0];
    const trend = ((max - lastHist) / lastHist) * 100;
    
    // Find best time to sell (peak price)
    const peakIdx = prices.indexOf(Math.max(...prices));
    return { min, max, trend, peakIdx: peakIdx + 1 };
  };

  const prediction = getPrediction();

  // Ensure enough items to fill the ticker track seamlessly, even if only 1-2 crops are pinned
  const tickerItems = Array(Math.max(2, Math.ceil(24 / Math.max(1, displayedCrops.length))))
    .fill(displayedCrops)
    .flat();

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
        
        <div className={styles.viewToggleGroup}>
          <button 
            className={`${styles.viewToggleBtn} ${viewMode === "myFarm" ? styles.viewToggleActive : ""}`}
            onClick={() => setViewMode("myFarm")}
          >
            My Farm (Actionable)
          </button>
          <button 
            className={`${styles.viewToggleBtn} ${viewMode === "explorer" ? styles.viewToggleActive : ""}`}
            onClick={() => setViewMode("explorer")}
          >
            Market Explorer
          </button>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <div className={`${styles.searchBar} ${isSearchFocused ? styles.searchFocused : ""}`}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Find your crop (e.g. Mustard, Gram...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className={styles.searchClear}>
                  <X size={14} />
                </button>
              )}
            </div>
            
            {isSearchFocused && searchQuery && (
              <div className={styles.searchResults}>
                {filteredCrops.length > 0 ? (
                  filteredCrops.map((crop) => (
                    <div 
                      key={crop} 
                      className={styles.searchResultItem}
                      onClick={() => {
                        setSelectedCrop(crop.toLowerCase());
                        setSearchQuery("");
                      }}
                    >
                      <Zap size={14} />
                      {crop}
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults}>No crops found. Try "Wheat" or "Tomato"</div>
                )}
              </div>
            )}
          </div>

          <div className={styles.lastUpdated}>
            <Clock size={14} />
            {t.market.lastUpdated}
          </div>
        </div>
      </div>

      {/* Smart Alerts (Only in My Farm View) */}
      {viewMode === "myFarm" && prediction && (
        <div className={styles.smartAlertCard}>
          <div className={styles.smartAlertIcon}>
            <BellRing size={24} />
          </div>
          <div className={styles.smartAlertContent}>
            <h4>Smart Advisory: {formatCrop(selectedCrop)}</h4>
            <p>
              Your pinned {formatCrop(selectedCrop)} crop is showing a <strong>{prediction.trend >= 0 ? "Bullish" : "Bearish"} trend</strong>. 
              Our AI recommends targeting a sale in <strong>{prediction.peakIdx} weeks</strong> to maximize profit around 
              <span className={styles.alertHighlight}> ₹{prediction.max.toLocaleString("en-IN")}/q</span>.
            </p>
          </div>
          <button 
            className={`${styles.btnHollowDark} ${reminderSet ? styles.btnSuccess : ""}`}
            onClick={() => {
              setReminderSet(true);
              setTimeout(() => setReminderSet(false), 3000);
            }}
          >
            {reminderSet ? "Reminder Set ✓" : "Set Calendar Reminder"}
          </button>
        </div>
      )}

      {/* Price Ticker */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {tickerItems.map((crop, i) => (
            <div 
              key={i} 
              className={`${styles.tickerItem} ${selectedCrop === crop.crop.toLowerCase() ? styles.tickerActive : ""}`}
              onClick={() => setSelectedCrop(crop.crop.toLowerCase())}
              role="button"
              tabIndex={0}
            >
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
        {displayedCrops.map((crop, i) => (
          <div 
            key={i} 
            className={`${styles.priceCard} ${selectedCrop === crop.crop.toLowerCase() ? styles.priceCardActive : ""}`}
            onClick={() => setSelectedCrop(crop.crop.toLowerCase())}
            role="button"
            tabIndex={0}
          >
            <div className={styles.priceCardHeader}>
              <h3>{crop.crop}</h3>
              <button 
                className={styles.pinBtn}
                onClick={(e) => { e.stopPropagation(); togglePin(crop.crop); }}
                title={pinnedCrops.includes(crop.crop.toLowerCase()) ? "Unpin from My Farm" : "Pin to My Farm"}
              >
                {pinnedCrops.includes(crop.crop.toLowerCase()) ? (
                  <BookmarkCheck size={20} className={styles.pinnedIcon} />
                ) : (
                  <Bookmark size={20} className={styles.unpinnedIcon} />
                )}
              </button>
            </div>
            <div className={styles.mandiTag}>{crop.mandi}</div>
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
              {["wheat", "rice", "tomato", "onion", "gram", "mustard"].map((crop) => (
                <button
                  key={crop}
                  className={`${styles.cropBtn} ${selectedCrop === crop ? styles.cropBtnActive : ""}`}
                  onClick={() => setSelectedCrop(crop)}
                >
                  {formatCrop(crop)}
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
              <XAxis dataKey="month" stroke="var(--ink)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--ink)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "var(--border-thick)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--ink)",
                  boxShadow: "var(--shadow-handdrawn)",
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
            <Image 
              src="/images/market-bold.png"
              alt="Market Growth"
              width={160}
              height={160}
              className={styles.doodleImg}
            />
            <div className={styles.predictionTitle}>
              <Zap size={18} />
              <h3>{t.market.aiPrediction}</h3>
            </div>
          </div>
          <div className={styles.predictionContent}>
            {prediction ? (
              <>
                <div className={styles.predictionItem}>
                  <p className={styles.predictionLabel}>{formatCrop(selectedCrop)} (Next 30 Days)</p>
                  <p className={styles.predictionValue} style={{ color: prediction.trend >= 0 ? "#10b981" : "#ef4444" }}>
                    ₹{prediction.min.toLocaleString("en-IN")} - ₹{prediction.max.toLocaleString("en-IN")}
                  </p>
                  <p className={styles.predictionConf}>92% model confidence</p>
                  <div className={styles.predictionTrend} style={{ color: prediction.trend >= 0 ? "#10b981" : "#ef4444" }}>
                    {prediction.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    Expected to {prediction.trend >= 0 ? "rise" : "drop"} {Math.abs(prediction.trend).toFixed(1)}%
                  </div>
                </div>

                <div className={styles.predictionDivider} />

                <div className={styles.predictionItem}>
                  <p className={styles.predictionLabel}>Best Time to Sell</p>
                  <p className={styles.predictionValue} style={{ color: "#fbbf24" }}>
                    In {prediction.peakIdx} Weeks
                  </p>
                  <p className={styles.predictionConf}>Peak demand period prediction</p>
                </div>
              </>
            ) : (
              <p className={styles.predictionConf}>Calculating predictions...</p>
            )}
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
