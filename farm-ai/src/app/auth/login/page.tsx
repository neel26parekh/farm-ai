"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LogIn, Mail, Lock } from "lucide-react";
import styles from "../auth.module.css";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth transition
    setTimeout(() => {
      login(email, email.split("@")[0]);
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.logoArea}>
          <h1 className={styles.logoTitle}>AgroNexus</h1>
          <p className={styles.logoSub}>Agricultural Intelligence SaaS</p>
        </div>

        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Enter your details to access your farm intelligence.</p>

        <div className={styles.socialAuth}>
          <button className={styles.socialBtn}>
            <img src="https://www.google.com/favicon.ico" alt="Google" width={16} />
            Google
          </button>
        </div>

        <div className={styles.divider}>or login with email</div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              className={styles.input} 
              placeholder="farmer@agronexus.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Authenticating..." : (
              <>
                Login to Dashboard <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account? 
          <Link href="/auth/signup" className={styles.link}>Create Farm Account</Link>
        </p>
      </div>
    </div>
  );
}
