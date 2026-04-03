// ============================================
// AgroNexus Mock Data
// Realistic simulated data for all features
// ============================================

export interface CropPrice {
  crop: string;
  price: number;
  change: number;
  unit: string;
  mandi: string;
}

export interface WeatherDay {
  day: string;
  date: string;
  temp: number;
  tempMin: number;
  humidity: number;
  rainfall: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "partly-cloudy";
  farmingImpact: "good" | "moderate" | "caution" | "alert";
  advisory: string;
}

export interface DiseaseResult {
  name: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  crop: string;
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Alert {
  id: string;
  type: "disease" | "weather" | "market" | "info";
  title: string;
  message: string;
  time: string;
  severity: "low" | "medium" | "high";
}

// ---- Market Data ----
export const cropPrices: CropPrice[] = [
  { crop: "Wheat", price: 2275, change: 3.2, unit: "quintal", mandi: "Azadpur" },
  { crop: "Rice (Basmati)", price: 3850, change: -1.5, unit: "quintal", mandi: "Karnal" },
  { crop: "Tomato", price: 2800, change: 12.4, unit: "quintal", mandi: "Nashik" },
  { crop: "Onion", price: 1650, change: -5.2, unit: "quintal", mandi: "Lasalgaon" },
  { crop: "Potato", price: 1200, change: 2.1, unit: "quintal", mandi: "Agra" },
  { crop: "Soybean", price: 4520, change: 1.8, unit: "quintal", mandi: "Indore" },
  { crop: "Cotton", price: 6800, change: -0.9, unit: "quintal", mandi: "Rajkot" },
  { crop: "Sugarcane", price: 350, change: 0.5, unit: "quintal", mandi: "Muzaffarnagar" },
];

export const priceHistory = [
  { month: "Oct", wheat: 2150, rice: 3700, tomato: 1800, onion: 2100 },
  { month: "Nov", wheat: 2180, rice: 3750, tomato: 2200, onion: 1900 },
  { month: "Dec", wheat: 2200, rice: 3800, tomato: 2600, onion: 1700 },
  { month: "Jan", wheat: 2220, rice: 3820, tomato: 3100, onion: 1500 },
  { month: "Feb", wheat: 2250, rice: 3840, tomato: 2900, onion: 1600 },
  { month: "Mar", wheat: 2275, rice: 3850, tomato: 2800, onion: 1650 },
];

export const mandiPrices = [
  { mandi: "Azadpur, Delhi", wheat: 2275, rice: 3900, tomato: 2850, onion: 1700 },
  { mandi: "Vashi, Mumbai", wheat: 2300, rice: 3950, tomato: 2600, onion: 1550 },
  { mandi: "Yeshwanthpur, Bangalore", wheat: 2350, rice: 4100, tomato: 2400, onion: 1800 },
  { mandi: "Koyambedu, Chennai", wheat: 2280, rice: 4050, tomato: 2700, onion: 1650 },
  { mandi: "Gultekdi, Pune", wheat: 2250, rice: 3880, tomato: 2500, onion: 1500 },
];

// ---- Weather Data ----
export const weatherForecast: WeatherDay[] = [
  { day: "Today", date: "25 Mar", temp: 32, tempMin: 22, humidity: 65, rainfall: 0, condition: "sunny", farmingImpact: "good", advisory: "Perfect day for field work and spraying" },
  { day: "Wed", date: "26 Mar", temp: 33, tempMin: 23, humidity: 60, rainfall: 0, condition: "sunny", farmingImpact: "good", advisory: "Ideal for irrigation in the morning" },
  { day: "Thu", date: "27 Mar", temp: 30, tempMin: 21, humidity: 72, rainfall: 5, condition: "partly-cloudy", farmingImpact: "moderate", advisory: "Light showers expected, postpone spraying" },
  { day: "Fri", date: "28 Mar", temp: 28, tempMin: 20, humidity: 80, rainfall: 15, condition: "rainy", farmingImpact: "caution", advisory: "Heavy rain expected. Secure harvested crops" },
  { day: "Sat", date: "29 Mar", temp: 27, tempMin: 19, humidity: 85, rainfall: 20, condition: "rainy", farmingImpact: "alert", advisory: "Waterlogging risk. Check drainage channels" },
  { day: "Sun", date: "30 Mar", temp: 29, tempMin: 20, humidity: 75, rainfall: 8, condition: "cloudy", farmingImpact: "moderate", advisory: "Clearing up. Good for post-rain field inspection" },
  { day: "Mon", date: "31 Mar", temp: 31, tempMin: 22, humidity: 68, rainfall: 0, condition: "partly-cloudy", farmingImpact: "good", advisory: "Resume normal farming activities" },
];

// ---- Disease Detection Results ----
export const sampleDiseaseResults: DiseaseResult[] = [
  {
    name: "Late Blight",
    confidence: 94.7,
    severity: "high",
    crop: "Tomato",
    description: "Late blight is caused by the oomycete pathogen Phytophthora infestans. It is one of the most destructive diseases of tomatoes and potatoes worldwide.",
    symptoms: [
      "Dark, water-soaked lesions on leaves",
      "White fuzzy growth on leaf undersides",
      "Brown spots on stems",
      "Firm, dark brown rot on fruits",
    ],
    treatment: [
      "Apply copper-based fungicide (Bordeaux mixture) immediately",
      "Remove and destroy all infected plant parts",
      "Improve air circulation by pruning",
      "Apply Mancozeb 75% WP @ 2.5g/L as preventive spray",
    ],
    prevention: [
      "Use certified disease-free seeds",
      "Maintain proper spacing between plants",
      "Avoid overhead irrigation",
      "Practice crop rotation with non-solanaceous crops",
      "Apply preventive fungicide sprays during humid weather",
    ],
  },
  {
    name: "Powdery Mildew",
    confidence: 89.3,
    severity: "medium",
    crop: "Wheat",
    description: "Powdery mildew is a fungal disease caused by Blumeria graminis f.sp. tritici. It appears as white powdery patches on leaves and stems.",
    symptoms: [
      "White powdery patches on upper leaf surface",
      "Yellowing of affected leaves",
      "Reduced grain size and quality",
      "Premature leaf senescence",
    ],
    treatment: [
      "Apply Propiconazole 25% EC @ 1ml/L of water",
      "Spray Sulphur 80% WP @ 2.5g/L",
      "Remove heavily infected leaves",
      "Ensure proper nitrogen management",
    ],
    prevention: [
      "Plant resistant varieties (HD 2967, PBW 725)",
      "Avoid excessive nitrogen fertilization",
      "Maintain proper plant spacing",
      "Sow at recommended time to avoid peak disease period",
    ],
  },
];

// ---- Dashboard Alerts ----
export const dashboardAlerts: Alert[] = [
  { id: "1", type: "disease", title: "Disease Risk Alert", message: "High humidity conditions may increase fungal disease risk in wheat fields", time: "2h ago", severity: "high" },
  { id: "2", type: "weather", title: "Rain Forecast", message: "Heavy rainfall expected on Friday-Saturday. Secure stored produce", time: "4h ago", severity: "medium" },
  { id: "3", type: "market", title: "Price Alert", message: "Tomato prices surged 12.4% in Nashik mandi. Consider selling", time: "6h ago", severity: "low" },
  { id: "4", type: "info", title: "Irrigation Advisory", message: "Optimal irrigation window: Tomorrow 6-8 AM based on soil moisture data", time: "8h ago", severity: "low" },
];

// ---- Testimonials ----
export const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Punjab",
    crop: "Wheat Farmer",
    quote: "AgroNexus detected blight in my wheat crop 2 weeks before I could see it. Saved my entire harvest worth ₹4 lakhs.",
    avatar: "🧑‍🌾",
  },
  {
    name: "Priya Devi",
    location: "Maharashtra",
    crop: "Tomato Grower",
    quote: "The market intelligence feature helped me sell tomatoes at the right time. I earned 30% more than last season.",
    avatar: "👩‍🌾",
  },
  {
    name: "Suresh Patel",
    location: "Gujarat",
    crop: "Cotton Farmer",
    quote: "Weather advisory saved my cotton crop. I harvested early before unexpected rains and avoided ₹2 lakh in losses.",
    avatar: "🧑‍🌾",
  },
];

// ---- Features ----
export const features = [
  {
    icon: "Scan",
    title: "AI Disease Detection",
    description: "Snap a photo of your crop. Our AI instantly identifies diseases with 98% accuracy and suggests treatments.",
    stat: "98% Accurate",
  },
  {
    icon: "TrendingUp",
    title: "Market Intelligence",
    description: "Real-time mandi prices, trend analysis, and AI-predicted best selling windows across India.",
    stat: "500+ Mandis",
  },
  {
    icon: "CloudSun",
    title: "Smart Weather Advisory",
    description: "Hyper-local weather forecasts with farming-specific impact analysis and actionable recommendations.",
    stat: "7-Day Forecast",
  },
  {
    icon: "Bot",
    title: "AI Crop Advisor",
    description: "Chat with our AI agronomist 24/7. Get personalized advice on crops, soil, pests, and farming practices.",
    stat: "24/7 Available",
  },
];

// ---- Crop Health Data for Dashboard ----
export const cropHealthData = [
  { week: "W1", health: 85, moisture: 72, nutrients: 90 },
  { week: "W2", health: 88, moisture: 68, nutrients: 87 },
  { week: "W3", health: 82, moisture: 75, nutrients: 85 },
  { week: "W4", health: 90, moisture: 70, nutrients: 92 },
  { week: "W5", health: 87, moisture: 65, nutrients: 88 },
  { week: "W6", health: 92, moisture: 72, nutrients: 94 },
];

// ---- Chat Preset Responses ----
export const chatPresets = [
  "What should I plant this season?",
  "My wheat has yellow spots on leaves",
  "Best fertilizer for tomatoes?",
  "How to prevent pest attacks?",
  "When should I harvest my rice crop?",
  "Organic farming tips for beginners",
];

export const chatResponses: Record<string, string> = {
  "What should I plant this season?":
    "Based on the current season (Rabi) and your location, here are my top recommendations:\n\n🌾 **Wheat** — Best suited for Punjab, Haryana, UP. Plant by mid-November.\n\n🥬 **Mustard** — Great for Rajasthan, MP. Low water requirement.\n\n🫘 **Chickpea (Chana)** — Excellent for dryland farming. Good MSP support.\n\n💡 **Pro Tip**: Consider intercropping wheat with mustard for better soil health and diversified income.",

  "My wheat has yellow spots on leaves":
    "Yellow spots on wheat leaves could indicate several issues. Let me help diagnose:\n\n🔍 **Most Likely: Stripe Rust (Puccinia striiformis)**\n- Yellow-orange pustules in stripes along leaf veins\n- Common in cool, humid weather (15-20°C)\n\n**Immediate Action:**\n1. Spray Propiconazole 25% EC @ 1ml/L water\n2. Add Mancozeb 75% WP @ 2.5g/L as tank mix\n3. Repeat after 15 days if symptoms persist\n\n📸 **For accurate diagnosis**, upload a clear photo to our Disease Detection feature!\n\n⚠️ If the yellowing is uniform (not spots), it might be **nitrogen deficiency** — apply urea @ 30-40 kg/acre.",

  "Best fertilizer for tomatoes?":
    "Here's a complete fertilizer guide for tomatoes:\n\n**Base Application (at transplanting):**\n- FYM/Compost: 20-25 tonnes/hectare\n- DAP: 150 kg/ha\n- MOP: 100 kg/ha\n\n**Top Dressing Schedule:**\n- 30 days: Urea 50 kg/ha\n- 50 days: Urea 50 kg/ha + calcium nitrate\n- Flowering stage: Spray 0.5% Boron + micronutrients\n\n**Organic Alternative:**\n- Vermicompost + Jeevamrut (every 15 days)\n- Panchagavya spray for flowering boost\n\n💡 **Key Tip**: Tomatoes are heavy feeders of Calcium. Deficiency causes blossom end rot!",

  default:
    "I understand your concern! Let me analyze this for you.\n\n🌱 Based on current agricultural conditions and best practices, here's my recommendation:\n\n1. **Monitor your crops regularly** — Early detection is key\n2. **Maintain soil health** — Regular soil testing every season\n3. **Follow IPM practices** — Integrated Pest Management reduces chemical dependency\n\nFor more specific advice, try using our **Disease Detection** feature by uploading a photo, or check the **Weather Advisory** for farming-specific forecasts.\n\nWould you like me to help with anything specific?",
};

// ---- Stats for Landing ----
export const landingStats = [
  { label: "Farmers Served", value: "5,00,000+", icon: "Users" },
  { label: "Disease Detection Accuracy", value: "98.2%", icon: "Target" },
  { label: "Crop Loss Prevented", value: "₹2,000 Cr", icon: "Shield" },
  { label: "Mandis Tracked", value: "500+", icon: "BarChart3" },
];

// ---- Non-Profit Impact & Live Activity Data ----
export interface Testimonial {
  id: string;
  farmer: string;
  location: string;
  crop: string;
  quote: string;
  impact: string;
  imageColor: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
  description: string;
}

export const farmerTestimonials: Testimonial[] = [
  {
    id: "t1",
    farmer: "Rajesh Kumar",
    location: "Punjab, India",
    crop: "Wheat",
    quote: "Farm AI's disease scanner caught Yellow Rust two weeks before it spread to my entire field.",
    impact: "Saved ₹45,000 in potential losses",
    imageColor: "#e6f4ea" // Sage
  },
  {
    id: "t2",
    farmer: "Pooja Patil",
    location: "Maharashtra, India",
    crop: "Tomato",
    quote: "Knowing the exact mandi prices at the regional hub helped me negotiate a 15% better rate.",
    impact: "Increased seasonal profit by 15%",
    imageColor: "#f3e8ff" // Lavender
  },
  {
    id: "t3",
    farmer: "Anil Reddy",
    location: "Telangana, India",
    crop: "Cotton",
    quote: "The voice reader in Telugu means our elders can use the weather advisor without knowing how to read.",
    impact: "Accessible to 50+ local families",
    imageColor: "#fef3c7" // Sand
  }
];

export const platformImpactMetrics: ImpactMetric[] = [
  { label: "Active Farmers", value: "1,24,500+", description: "Using Farm AI monthly across Indian states" },
  { label: "Diseases Detected", value: "85,000+", description: "Early interventions logged since 2024" },
  { label: "Economic Value", value: "₹10 Crores", description: "Estimated crop loss prevented in India" },
  { label: "Cost to Farmers", value: "₹0.00", description: "Free forever, backed by the community" }
];

