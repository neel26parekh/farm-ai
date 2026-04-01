"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, UserPlus, Mail, Lock, User } from "lucide-react";
import styles from "../auth.module.css";
import { useAuth } from "@/lib/AuthContext";
import Logo from "@/components/Logo";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate signup transition
    setTimeout(() => {
      login(form.email, form.name);
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.logoArea}>
          <Logo />
          <p className={styles.logoSub}>Join 10,000+ Smart Farmers</p>
        </div>

        <h2 className={styles.title}>Start Your Farm</h2>
        <p className={styles.subtitle}>Get personalized intelligence for your crops in minutes.</p>

        <div className={styles.socialAuth}>
          <button 
            className={styles.socialBtn}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" width={16} />
            Sign up with Google
          </button>
        </div>

        <div className={styles.divider}>or register with email</div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Rajesh Kumar"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              className={styles.input} 
              placeholder="rajesh@punjabfarms.com"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Create Password</label>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating Account..." : (
              <>
                Create Account <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <p className={styles.footer}>
          Already using AgroNexus? 
          <Link href="/auth/login" className={styles.link}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
