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
import Image from "next/image";
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

import VoiceReader from "../advisor/VoiceReader";

export default function WeatherPage() {
  const { t } = useLanguage();
  const [liveForecast, setLiveForecast] = useState<any[]>(weatherForecast);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Pune, Maharashtra (Default)");
  const [profileCrop, setProfileCrop] = useState("Wheat");
  const [dataSource, setDataSource] = useState<"live" | "cached">("live");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("farm_ai_settings");
      if (saved) {
        const farm = JSON.parse(saved);
        if (farm.primaryCrop) setProfileCrop(String(farm.primaryCrop));
      }
    } catch {}

    async function fetchWeather(lat: number, lon: number, name?: string) {
      setLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (name) setLocationName(name);

          const getCondition = (code: number) => {
            if (code === 0) return "sunny";
            if (code <= 3) return "partly-cloudy";
            if (code <= 48) return "cloudy";
            if (code <= 67 || (code >= 80 && code <= 82)) return "rainy";
            if (code >= 95) return "stormy";
            return "partly-cloudy";
          };

          setCurrentWeather({
            temp: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            humidity: Math.round(data.current.relative_humidity_2m),
            windSpeed: Math.round(data.current.wind_speed_10m),
            condition: getCondition(data.current.weather_code),
            visibility: 10
          });

          const newForecast = data.daily.time.map((dateStr: string, i: number) => {
            const dateObj = new Date(dateStr);
            const condition = getCondition(data.daily.weather_code[i]);
            const rain = data.daily.precipitation_sum[i];
            
            let impact = "good";
            let advisory = "Perfect day for field work and spraying";
            if (rain > 20 || condition === "stormy") {
              impact = "alert";
              advisory = "Waterlogging risk. Avoid field work entirely.";
            } else if (rain > 5 || condition === "rainy") {
              impact = "caution";
              advisory = "Rain expected. Postpone chemical spraying.";
            }

            return {
              day: i === 0 ? "Today" : dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
              date: dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
              temp: Math.round(data.daily.temperature_2m_max[i]),
              tempMin: Math.round(data.daily.temperature_2m_min[i]),
              humidity: 60 + Math.random() * 10,
              rainfall: rain,
              condition: condition,
              farmingImpact: impact,
              advisory: advisory,
            };
          });

          setLiveForecast(newForecast);
          setDataSource("live");
          localStorage.setItem(
            "farm_ai_weather_cache",
            JSON.stringify({ locationName: name || locationName, currentWeather: {
              temp: Math.round(data.current.temperature_2m),
              feelsLike: Math.round(data.current.apparent_temperature),
              humidity: Math.round(data.current.relative_humidity_2m),
              windSpeed: Math.round(data.current.wind_speed_10m),
              condition: getCondition(data.current.weather_code),
              visibility: 10,
            }, liveForecast: newForecast })
          );
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
        const cached = localStorage.getItem("farm_ai_weather_cache");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.locationName) setLocationName(parsed.locationName);
            if (parsed.currentWeather) setCurrentWeather(parsed.currentWeather);
            if (Array.isArray(parsed.liveForecast) && parsed.liveForecast.length > 0) {
              setLiveForecast(parsed.liveForecast);
              setDataSource("cached");
            }
          } catch {
            // keep fallback defaults
          }
        }
      } finally {
        setLoading(false);
      }
    }

    const fetchFromSavedLocation = async () => {
      try {
        const saved = localStorage.getItem("farm_ai_settings");
        if (!saved) return false;
        const farm = JSON.parse(saved);
        const name = (farm.location || "").toString().trim();
        if (!name) return false;

        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`);
        if (!geoRes.ok) return false;
        const geoData = await geoRes.json();
        const first = geoData?.results?.[0];
        if (!first?.latitude || !first?.longitude) return false;
        await fetchWeather(first.latitude, first.longitude, `${first.name}, ${first.admin1 || "India"}`);
        return true;
      } catch {
        return false;
      }
    };

    // Attempt Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, "Your Farm (Live Sync)");
        },
        async (error) => {
          console.warn("Geolocation denied, trying saved farm location.", error);
          const ok = await fetchFromSavedLocation();
          if (!ok) fetchWeather(18.5204, 73.8567, "Pune, Maharashtra");
        }
      );
    } else {
      fetchFromSavedLocation().then((ok) => {
        if (!ok) fetchWeather(18.5204, 73.8567, "Pune, Maharashtra");
      });
    }
  }, [t.weather.placeholder]);

  const todayForecast = liveForecast[0];
  const rainfallData = liveForecast.map((d) => ({
    day: d.day,
    rainfall: d.rainfall,
    humidity: Math.round(d.humidity),
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
            {t.weather.subtitle} Source: {dataSource === "live" ? "Live" : "Cached"}.
          </p>
        </div>
        <div className={styles.locationBadge}>
          📍 {locationName}
        </div>
      </div>

      {/* Current Weather */}
      <div className={styles.currentGrid}>
        <div className={styles.currentCard}>
          <div className={styles.currentMain}>
            <div className={styles.currentIcon} style={{ color: weatherColors[currentWeather ? currentWeather.condition : todayForecast.condition] }}>
              {weatherIcons[currentWeather ? currentWeather.condition : todayForecast.condition]}
            </div>
            <div>
              <p className={styles.currentTemp}>{currentWeather ? currentWeather.temp : todayForecast.temp}°C</p>
              <p className={styles.currentCondition}>
                {(currentWeather ? currentWeather.condition : todayForecast.condition).split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </p>
            </div>
          </div>
          <div className={styles.currentDetails}>
            <div className={styles.detailItem}>
              <Thermometer size={16} />
              <span>{t.weather.feelsLike} {currentWeather ? currentWeather.feelsLike : todayForecast.temp + 2}°C</span>
            </div>
            <div className={styles.detailItem}>
              <Droplets size={16} />
              <span>{t.weather.humidity} {currentWeather ? currentWeather.humidity : todayForecast.humidity}%</span>
            </div>
            <div className={styles.detailItem}>
              <Wind size={16} />
              <span>{t.weather.wind} {currentWeather ? currentWeather.windSpeed : 12} km/h</span>
            </div>
            <div className={styles.detailItem}>
              <Eye size={16} />
              <span>{t.weather.visibility} {currentWeather ? currentWeather.visibility : 10} km</span>
            </div>
          </div>
        </div>

        {/* Farming Impact */}
        <div className={styles.impactCard}>
          <div className={styles.doodleContainer}>
            <Image 
              src="/images/weather-bold.png"
              alt="Weather Sprout"
              width={180}
              height={180}
              className={styles.doodleImg}
            />
          </div>
          <h3 className={styles.impactTitle}>
            <Sprout size={18} />
            {t.weather.impactTitle}
          </h3>
          <div
            className={styles.impactBadge}
            style={{
              background: `${impactColors[todayForecast.farmingImpact]}15`,
              color: impactColors[todayForecast.farmingImpact],
              borderColor: `${impactColors[todayForecast.farmingImpact]}30`,
            }}
          >
            {todayForecast.farmingImpact === "good" && <Check size={16} />}
            {todayForecast.farmingImpact !== "good" && <AlertTriangle size={16} />}
            {todayForecast.farmingImpact.toUpperCase()} for farming
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <p className={styles.impactAdvisory} style={{ margin: 0, color: '#374151', fontSize: '1.25rem', fontWeight: 600 }}>{todayForecast.advisory}</p>
            <VoiceReader text={todayForecast.advisory} />
          </div>

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
          {liveForecast.map((day, i) => (
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
              { crop: profileCrop, alert: `Primary crop advisory: monitor ${profileCrop} leaf health after humidity spikes.`, severity: "medium" },
              { crop: "General", alert: "If rainfall exceeds 20mm, postpone spraying by 24-48 hours.", severity: "medium" },
              { crop: "Harvest", alert: "Dry and secure harvested produce before forecasted rain windows.", severity: "high" },
              { crop: "Irrigation", alert: "Prefer early morning irrigation to reduce fungal pressure.", severity: "low" },
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
                <p className={styles.alertText} style={{ fontWeight: 600 }}>Confidence: {item.severity === "high" ? "High" : item.severity === "medium" ? "Medium" : "Low"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
