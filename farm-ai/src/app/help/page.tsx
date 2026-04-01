import { Search, Mail, MessageSquare, BookOpen, Shield, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./help.module.css";

export default function HelpCenter() {
  const faqs = [
    {
      category: "Getting Started",
      icon: <BookOpen size={24} />,
      items: [
        "How do I create an account?",
        "Setting up your farm profile",
        "Changing your language settings"
      ]
    },
    {
      category: "AI Advisor",
      icon: <HelpCircle size={24} />,
      items: [
        "How does the AI Advisor work?",
        "Best practices for asking questions",
        "Voice input and multi-turn chat"
      ]
    },
    {
      category: "Disease Detection",
      icon: <Shield size={24} />,
      items: [
        "Uploading crop leaf photos",
        "Understanding diagnosis results",
        "Handling 'Not a Plant' errors"
      ]
    },
    {
      category: "Market & Weather",
      icon: <TrendingUp size={24} />, // Actually TrendingUp from lucide-react but imported as icon below
      items: [
        "Real-time Mandi price tracking",
        "Weather impact analysis",
        "Price forecasting accuracy"
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <header className={styles.hero}>
          <h1 className={styles.title}>How can we help?</h1>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, and more..." 
              className={styles.searchInput}
            />
          </div>
        </header>

        {/* FAQ Grid */}
        <section className={styles.faqSection}>
          <div className={styles.grid}>
            {faqs.map((group, i) => (
              <div key={i} className={styles.faqCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.iconWrapper}>{group.icon}</span>
                  <h3>{group.category}</h3>
                </div>
                <ul className={styles.faqList}>
                  {group.items.map((item, j) => (
                    <li key={j}>
                      <Link href="#" className={styles.faqLink}>
                        {item} <ArrowRight size={14} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <section className={styles.contactSection}>
          <div className={styles.contactCard}>
            <h2>Still need help?</h2>
            <p>Our support team is available 24/7 to assist with your farming needs.</p>
            <div className={styles.contactOptions}>
              <div className={styles.option}>
                <Mail size={32} />
                <h3>Email Support</h3>
                <p>support@agronexus.ai</p>
              </div>
              <div className={styles.option}>
                <MessageSquare size={32} />
                <h3>Community Forum</h3>
                <p>Join 50k+ farmers</p>
              </div>
            </div>
            <button className="btn btn-primary">Contact Us Now</button>
          </div>
        </section>
      </main>

      {/* Footer minimal */}
      <footer className={styles.footer}>
        <p>&copy; 2026 AgroNexus AI Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Fixed import for TrendingUp since it was missing in the faqs map
import { TrendingUp } from "lucide-react";
