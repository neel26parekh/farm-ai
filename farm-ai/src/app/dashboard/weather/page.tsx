"use client";

import { useState, useEffect } from "react";
import {
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  Sprout,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { weatherForecast } from "@/lib/mockData";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

const weatherIcons: Record<string, React.ReactNode> = {
  sunny: <Sun size={32} />,
  cloudy: <Cloud size={32} />,
  rainy: <CloudRain size={32} />,
  "partly-cloudy": <CloudSun size={32} />,
  stormy: <CloudLightning size={32} />,
};

const weatherColors: Record<string, string> = {
  sunny: "#fbbf24",
  cloudy: "#94a3b8",
  rainy: "#60a5fa",
  "partly-cloudy": "#fcd34d",
  stormy: "#a78bfa",
};

const impactColors: Record<string, string> = {
  good: "#10b981",
  moderate: "#f59e0b",
  caution: "#f97316",
  alert: "#ef4444",
};

export default function WeatherPage() {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // OpenWeatherMap API Integration
        // Note: In production, the API key should be in .env.local
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY";
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Ludhiana&units=metric&appid=${API_KEY}`);
        if (res.ok) {
          const data = await res.json();
          setWeatherData(data);
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  const today = weatherForecast[0];
  const rainfallData = weatherForecast.map((d) => ({
    day: d.day,
    rainfall: d.rainfall,
    humidity: d.humidity,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <CloudSun size={28} />
            {t.weather.title}
          </h1>
          <p className={styles.pageSubtitle}>
            {t.weather.subtitle}
          </p>
        </div>
        <div className={styles.locationBadge}>
          📍 Ludhiana, Punjab
        </div>
      </div>

      {/* Current Weather */}
      <div className={styles.currentGrid}>
        <div className={styles.currentCard}>
          <div className={styles.currentMain}>
            <div className={styles.currentIcon} style={{ color: weatherColors[today.condition] }}>
              {weatherIcons[today.condition]}
            </div>
            <div>
              <p className={styles.currentTemp}>{today.temp}°C</p>
              <p className={styles.currentCondition}>
                {today.condition.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </p>
            </div>
          </div>
          <div className={styles.currentDetails}>
            <div className={styles.detailItem}>
              <Thermometer size={16} />
              <span>{t.weather.feelsLike} {weatherData ? Math.round(weatherData.main.feels_like) : today.temp + 2}°C</span>
            </div>
            <div className={styles.detailItem}>
              <Droplets size={16} />
              <span>{t.weather.humidity} {weatherData ? weatherData.main.humidity : today.humidity}%</span>
            </div>
            <div className={styles.detailItem}>
              <Wind size={16} />
              <span>{t.weather.wind} {weatherData ? Math.round(weatherData.wind.speed * 3.6) : 12} km/h</span>
            </div>
            <div className={styles.detailItem}>
              <Eye size={16} />
              <span>{t.weather.visibility} {weatherData ? (weatherData.visibility / 1000).toFixed(1) : 10} km</span>
            </div>
          </div>
        </div>

        {/* Farming Impact */}
        <div className={styles.impactCard}>
          <h3 className={styles.impactTitle}>
            <Sprout size={18} />
            {t.weather.impactTitle}
          </h3>
          <div
            className={styles.impactBadge}
            style={{
              background: `${impactColors[today.farmingImpact]}15`,
              color: impactColors[today.farmingImpact],
              borderColor: `${impactColors[today.farmingImpact]}30`,
            }}
          >
            {today.farmingImpact === "good" && <Check size={16} />}
            {today.farmingImpact !== "good" && <AlertTriangle size={16} />}
            {today.farmingImpact.toUpperCase()} for farming
          </div>
          <p className={styles.impactAdvisory}>{today.advisory}</p>

          <div className={styles.advisoryList}>
            <div className={styles.advisoryItem}>
              <Check size={14} style={{ color: "#10b981" }} />
              <span>Good day for field work and spraying</span>
            </div>
            <div className={styles.advisoryItem}>
              <Check size={14} style={{ color: "#10b981" }} />
              <span>Irrigate early morning (6-8 AM)</span>
            </div>
            <div className={styles.advisoryItem}>
              <AlertTriangle size={14} style={{ color: "#f59e0b" }} />
              <span>Rain expected Thu-Sat — plan spraying before Thursday</span>
            </div>
            <div className={styles.advisoryItem}>
              <AlertTriangle size={14} style={{ color: "#ef4444" }} />
              <span>Secure harvested grain before Friday&apos;s heavy rain</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className={styles.forecastSection}>
        <h3 className={styles.sectionTitle}>{t.weather.forecastTitle}</h3>
        <div className={styles.forecastGrid}>
          {weatherForecast.map((day, i) => (
            <div
              key={i}
              className={`${styles.forecastCard} ${i === 0 ? styles.forecastToday : ""}`}
            >
              <p className={styles.forecastDay}>{day.day}</p>
              <p className={styles.forecastDate}>{day.date}</p>
              <div className={styles.forecastIcon} style={{ color: weatherColors[day.condition] }}>
                {weatherIcons[day.condition]}
              </div>
              <p className={styles.forecastTemp}>
                {day.temp}°
                <span className={styles.forecastTempMin}> / {day.tempMin}°</span>
              </p>
              <div className={styles.forecastRain}>
                <Droplets size={12} />
                {day.rainfall}mm
              </div>
              <div
                className={styles.forecastImpact}
                style={{
                  background: `${impactColors[day.farmingImpact]}15`,
                  color: impactColors[day.farmingImpact],
                }}
              >
                {day.farmingImpact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rainfall Chart + Advisory */}
      <div className={styles.bottomGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>{t.weather.rainfallTitle}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />
              <XAxis dataKey="day" stroke="#6ee7b7" fontSize={12} />
              <YAxis stroke="#6ee7b7" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "rgba(3, 11, 5, 0.95)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "8px",
                  color: "#ecfdf5",
                }}
              />
              <Bar dataKey="rainfall" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
              <Bar dataKey="humidity" fill="rgba(16, 185, 129, 0.3)" radius={[4, 4, 0, 0]} name="Humidity (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop-Specific Alerts */}
        <div className={styles.cropAlerts}>
          <h3 className={styles.sectionTitle}>
            {t.weather.alertsTitle}
          </h3>
          <div className={styles.alertsList}>
            {[
              { crop: "Wheat", alert: "Rust risk HIGH due to morning dew and humidity above 80%", severity: "high" },
              { crop: "Tomato", alert: "Late blight risk MODERATE. Apply preventive fungicide spray", severity: "medium" },
              { crop: "Cotton", alert: "No weather-related concerns this week", severity: "low" },
              { crop: "Sugarcane", alert: "Heavy rain may cause waterlogging. Check field drainage", severity: "high" },
            ].map((item, i) => (
              <div key={i} className={styles.alertItem}>
                <div className={styles.alertHeader}>
                  <span className={styles.alertCrop}>{item.crop}</span>
                  <span
                    className="badge"
                    style={{
                      background: `${impactColors[item.severity === "high" ? "alert" : item.severity === "medium" ? "moderate" : "good"]}15`,
                      color: impactColors[item.severity === "high" ? "alert" : item.severity === "medium" ? "moderate" : "good"],
                      borderColor: `${impactColors[item.severity === "high" ? "alert" : item.severity === "medium" ? "moderate" : "good"]}30`,
                    }}
                  >
                    {item.severity}
                  </span>
                </div>
                <p className={styles.alertText}>{item.alert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
