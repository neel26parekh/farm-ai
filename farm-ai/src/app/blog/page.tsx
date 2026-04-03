"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Clock, 
  TrendingUp,
  Globe
} from "lucide-react";
import styles from "./page.module.css";

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of Precision Agriculture: How AI is Changing the Game",
    excerpt: "From autonomous tractors to real-time crop monitoring, discover why data is becoming the most valuable asset on the modern farm.",
    author: "Dr. Ananya Sharma",
    date: "March 28, 2026",
    readingTime: "6 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1594776208133-20010008e1fb?q=80&w=800&auto=format&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "Sustainable Soil Health: Moving Beyond Mechanical Tilling",
    excerpt: "Learn how regenerative farming practices are helping farmers restore carbon levels and increase yield resilience.",
    author: "Michael Chen",
    date: "March 25, 2026",
    readingTime: "4 min read",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Navigating the 2026 Global Fertilizer Market",
    excerpt: "Supply chain report: Essential strategies for managing input costs during the current phosphorus and urea shortage.",
    author: "Marcus Thorne",
    date: "March 22, 2026",
    readingTime: "8 min read",
    category: "Market Trends",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Drip Irrigation 2.0: Sensor-Driven Water Management",
    excerpt: "How automated irrigation systems are reducing water waste by up to 40% while improving crop uniformity.",
    author: "Sarah Jenkins",
    date: "March 18, 2026",
    readingTime: "5 min read",
    category: "Operations",
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Integrated Pest Management: The AI-First Approach",
    excerpt: "Using computer vision to identify early signs of fungal and insect infestations before they reach economic thresholds.",
    author: "Dr. Ananya Sharma",
    date: "March 15, 2026",
    readingTime: "7 min read",
    category: "Crop Health",
    image: "https://images.unsplash.com/photo-1594776208133-20010008e1fb?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Winter Wheat Optimization: A Case Study in Haryana",
    excerpt: "How a mid-sized cooperative used AgroNexus to increase their per-acre profitability by 18% in a single season.",
    author: "Rajesh Kumar",
    date: "March 10, 2026",
    readingTime: "10 min read",
    category: "Case Study",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop"
  }
];

export default function BlogPage() {
  const featuredPost = BLOG_POSTS.find(p => p.featured);
  const regularPosts = BLOG_POSTS.filter(p => !p.featured);

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.badge}
            >
              The AgroNexus Journal
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.title}
            >
              Agricultural Insights & Intelligence
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.subtitle}
            >
              Deep dives into technology, economics, and the sustainable practices shaping the future of global farming.
            </motion.p>
          </header>

          {/* Featured Post */}
          {featuredPost && (
            <section className={styles.featuredSection}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={styles.featuredCard}
              >
                <div className={styles.featuredImage} style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image src={featuredPost.image} alt={featuredPost.title} fill className={styles.imageInner} style={{ objectFit: 'cover' }} unoptimized/>
                </div>
                <div className={styles.featuredContent}>
                  <span className={styles.category}>{featuredPost.category}</span>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.excerpt}</p>
                  <div className={styles.cardFooter}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Globe size={14} /> {featuredPost.author}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} /> {featuredPost.readingTime}
                      </span>
                    </div>
                  </div>
                  <a href="#" className={styles.readBtn}>
                    Read full article <ArrowRight size={18} />
                  </a>
                </div>
              </motion.div>
            </section>
          )}

          {/* Regular Posts Grid */}
          <section className={styles.grid}>
            {regularPosts.map((post, index) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.card}
              >
                <div className={styles.cardImage} style={{ position: 'relative', width: '100%', height: '240px' }}>
                  <Image src={post.image} alt={post.title} fill className={styles.imageInner} style={{ objectFit: 'cover' }} unoptimized/>
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.category}>{post.category}</span>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <div className={styles.cardFooter}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={12} /> {post.readingTime}
                    </span>
                    <a href="#" className={styles.readBtn}>
                      Read <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
