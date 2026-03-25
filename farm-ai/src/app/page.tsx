"use client";

import Link from "next/link";
import {
  Scan,
  TrendingUp,
  CloudSun,
  Bot,
  Users,
  Target,
  Shield,
  BarChart3,
  ArrowRight,
  Zap,
  Globe,
  ChevronRight,
  Sparkles,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { features, testimonials, landingStats } from "@/lib/mockData";
import styles from "./page.module.css";

const iconMap: Record<string, React.ReactNode> = {
  Scan: <Scan size={28} />,
  TrendingUp: <TrendingUp size={28} />,
  CloudSun: <CloudSun size={28} />,
  Bot: <Bot size={28} />,
  Users: <Users size={24} />,
  Target: <Target size={24} />,
  Shield: <Shield size={24} />,
  BarChart3: <BarChart3 size={24} />,
};

export default function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroGlow1} />
          <div className={styles.heroGlow2} />
          <div className={styles.heroGrid} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>AI-Powered Agriculture for Bharat</span>
          </div>

          <h1 className={styles.heroTitle}>
            Grow Smarter.
            <br />
            <span className="gradient-text">Harvest More.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Detect crop diseases in seconds, track real-time market prices, and
            get AI-powered farming advice — all from your phone.
          </p>

          <div className={styles.heroCTA}>
            {user ? (
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <Link href="/auth" className="btn btn-primary btn-lg">
                Start Using FarmAI <ArrowRight size={20} />
              </Link>
            )}
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              See How It Works
            </a>
          </div>

          <div className={styles.heroTrust}>
            <div className={styles.trustAvatars}>
              {["🧑‍🌾", "👩‍🌾", "🧑‍🌾", "👨‍🌾", "👩‍🌾"].map((emoji, i) => (
                <div key={i} className={styles.trustAvatar}>
                  {emoji}
                </div>
              ))}
            </div>
            <p className={styles.trustText}>
              <strong>5,00,000+</strong> farmers already using FarmAI
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className={styles.floatingCard1}>
          <div className={styles.floatIcon}>
            <Scan size={20} />
          </div>
          <div>
            <p className={styles.floatLabel}>Disease Detected</p>
            <p className={styles.floatValue}>Late Blight — 94.7%</p>
          </div>
        </div>

        <div className={styles.floatingCard2}>
          <div className={styles.floatIcon2}>
            <TrendingUp size={20} />
          </div>
          <div>
            <p className={styles.floatLabel}>Wheat Price</p>
            <p className={styles.floatValue}>₹2,275/q ↑ 3.2%</p>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className={styles.statsBar}>
        <div className={styles.statsContainer}>
          {landingStats.map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.statIcon}>{iconMap[stat.icon]}</div>
              <div>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <div className="badge">
            <Zap size={12} />
            Features
          </div>
          <h2 className={styles.sectionTitle}>
            Everything Your Farm Needs,
            <br />
            <span className="gradient-text">Powered by AI</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From disease detection to market intelligence — FarmAI brings the
            power of artificial intelligence to every Indian farmer.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature, i) => (
            <div
              key={i}
              className={styles.featureCard}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={styles.featureIconWrap}>
                {iconMap[feature.icon]}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
              <div className={styles.featureStat}>
                <Check size={14} />
                <span>{feature.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <div className="badge">
            <Globe size={12} />
            How It Works
          </div>
          <h2 className={styles.sectionTitle}>
            From Field to Insight
            <br />
            <span className="gradient-text">in 3 Simple Steps</span>
          </h2>
        </div>

        <div className={styles.stepsGrid}>
          {[
            {
              step: "01",
              title: "Capture",
              desc: "Take a photo of your crop, field, or pest using your smartphone camera.",
              icon: <Scan size={32} />,
            },
            {
              step: "02",
              title: "Analyze",
              desc: "Our AI processes the image using advanced deep learning models trained on 50M+ agricultural images.",
              icon: <Sparkles size={32} />,
            },
            {
              step: "03",
              title: "Act",
              desc: "Get instant diagnosis, treatment plans, market prices, and actionable farming advice.",
              icon: <Zap size={32} />,
            },
          ].map((item, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.stepNumber}>{item.step}</div>
              <div className={styles.stepIconWrap}>{item.icon}</div>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDesc}>{item.desc}</p>
              {i < 2 && (
                <div className={styles.stepArrow}>
                  <ChevronRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <div className="badge">💬 Testimonials</div>
          <h2 className={styles.sectionTitle}>
            Trusted by Farmers
            <br />
            <span className="gradient-text">Across India</span>
          </h2>
        </div>

        <div className={styles.testimonialGrid}>
          {testimonials.map((t, i) => (
            <div key={i} className={styles.testimonialCard}>
              <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>{t.avatar}</div>
                <div>
                  <p className={styles.testimonialName}>{t.name}</p>
                  <p className={styles.testimonialRole}>
                    {t.crop} • {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING (BUSINESS MODEL) ===== */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.sectionHeader}>
          <div className="badge">
            <Zap size={12} /> Simple Pricing
          </div>
          <h2 className={styles.sectionTitle}>
            Free for Farmers.
            <br />
            <span className="gradient-text">Powerful for Pros.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A sustainable business model designed to maximize impact while generating venture-scale revenue.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          {/* Free Tier */}
          <div className={styles.pricingCard}>
            <h3 className={styles.planName}>Basic Farmer</h3>
            <div className={styles.planPrice}>
              <span className={styles.currency}>₹</span>0<span className={styles.period}>/month</span>
            </div>
            <p className={styles.planDesc}>Everything a smallholder farmer needs to get started with AI.</p>
            <ul className={styles.planFeatures}>
              <li><Check size={16} /> 3 Disease Scans per month</li>
              <li><Check size={16} /> Basic Weather Advisory</li>
              <li><Check size={16} /> Community Forum Access</li>
              <li><Check size={16} /> Daily Mandi Prices</li>
            </ul>
            <Link href="/auth" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
              Start for Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className={`${styles.pricingCard} ${styles.pricingPro}`}>
            <div className={styles.popularBadge}>Most Popular</div>
            <h3 className={styles.planName}>FarmAI Pro</h3>
            <div className={styles.planPrice}>
              <span className={styles.currency}>₹</span>299<span className={styles.period}>/month</span>
            </div>
            <p className={styles.planDesc}>Advanced machine learning tools for maximum yield and profit.</p>
            <ul className={styles.planFeatures}>
              <li><Check size={16} /> Unlimited Disease Detection</li>
              <li><Check size={16} /> Prophet Time-Series Market Forecast</li>
              <li><Check size={16} /> 24/7 Gemini-Powered AI Advisor</li>
              <li><Check size={16} /> SMS Alerts for Pests/Weather</li>
            </ul>
            <Link href="/checkout" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Upgrade to Pro
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className={styles.pricingCard}>
            <h3 className={styles.planName}>Enterprise / FPO</h3>
            <div className={styles.planPrice}>
              Custom
            </div>
            <p className={styles.planDesc}>API access and fleet management for Farmer Producer Organizations.</p>
            <ul className={styles.planFeatures}>
              <li><Check size={16} /> Raw API Access (CV & NLP)</li>
              <li><Check size={16} /> Custom Supply Chain Dashboards</li>
              <li><Check size={16} /> Dedicated Agronomist Support</li>
              <li><Check size={16} /> White-label App Options</li>
            </ul>
            <Link href="/about" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ready to <span className="gradient-text">Transform</span> Your Farm?
          </h2>
          <p className={styles.ctaSubtitle}>
            Join 5,00,000+ farmers already using AI to grow smarter
          </p>
          {user ? (
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <Link href="/auth" className="btn btn-primary btn-lg">
              Start Using FarmAI — It&apos;s Free <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>
                <Scan size={20} />
              </div>
              <span>Farm</span>
              <span className="gradient-text">AI</span>
            </div>
            <p className={styles.footerDesc}>
              AI-powered agricultural intelligence for every Indian farmer.
              Built with 🇮🇳 for Bharat.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Product</h4>
            <Link href="/dashboard/disease-detection">Disease Detection</Link>
            <Link href="/dashboard/market">Market Prices</Link>
            <Link href="/dashboard/weather">Weather Advisory</Link>
            <Link href="/dashboard/advisor">AI Advisor</Link>
          </div>
          <div className={styles.footerLinks}>
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/about">Contact</Link>
            <Link href="/about">Blog</Link>
          </div>
          <div className={styles.footerLinks}>
            <h4>Resources</h4>
            <Link href="/documentation">Documentation</Link>
            <Link href="/documentation">API</Link>
            <Link href="/legal">Privacy Policy</Link>
            <Link href="/legal">Terms of Service</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 FarmAI. All rights reserved. Made with ❤️ in India.</p>
        </div>
      </footer>
    </>
  );
}
