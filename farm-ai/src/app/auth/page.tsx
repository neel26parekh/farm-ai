"use client";

import { useState } from "react";
import Link from "next/link";
import { Sprout, ArrowRight, Mail, Lock, User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import styles from "./page.module.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && (isLogin || name)) {
      login(email, isLogin ? "Farmer" : name);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>AN</span>
            </div>
            <span className={styles.logoText}>
              AgroNexus
            </span>
          </Link>
          <h1 className={styles.brandHeading}>
            Your Agricultural Partner.
          </h1>
          <p className={styles.brandSubheading} style={{ color: 'var(--ink)', opacity: 0.8 }}>
            Join 5,00,000+ progressive Indian farmers using AgroNexus to increase yield and maximize profits.
          </p>
          <div className={styles.featureList}>
            <div className={styles.featureItem} style={{ color: 'var(--ink)' }}>
              <div className={styles.checkIcon} style={{ background: 'var(--ink)', color: 'white' }}><ShieldCheck size={16} /></div>
              Instant crop disease diagnosis
            </div>
            <div className={styles.featureItem} style={{ color: 'var(--ink)' }}>
              <div className={styles.checkIcon} style={{ background: 'var(--ink)', color: 'white' }}><ShieldCheck size={16} /></div>
              Real-time mandi price predictions
            </div>
            <div className={styles.featureItem} style={{ color: 'var(--ink)' }}>
              <div className={styles.checkIcon} style={{ background: 'var(--ink)', color: 'white' }}><ShieldCheck size={16} /></div>
              Hyper-local weather advisory
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
            <p>{isLogin ? "Enter your details to access your dashboard" : "Sign up to start managing your farm smarter"}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <div className={styles.inputWrap}>
                  <UserIcon size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Email or Phone</label>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
              {isLogin ? "Sign In" : "Create Account"} <ArrowRight size={18} />
            </button>
          </form>

          <p className={styles.toggleText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className={styles.toggleBtn}>
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
