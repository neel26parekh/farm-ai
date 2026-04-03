"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck, CreditCard, Lock, Loader2 } from "lucide-react";
import styles from "./page.module.css";

export default function DonatePage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate real API payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect to dashboard after showing success state
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className={styles.page}>
        <div className={styles.successState}>
          <div className={styles.successIconWrap}>
            <Check size={48} className={styles.successIcon} />
          </div>
          <h1 className={styles.successTitle}>Donation Successful!</h1>
          <p className={styles.successDesc}>
            Thank you for supporting Farm AI. Your contribution keeps our servers running for Indian farmers.
            <br />
            Redirecting to your dashboard...
          </p>
          <Loader2 className="spin" size={24} color="var(--emerald-500)" style={{ margin: "0 auto" }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left Column - Order Summary */}
        <div className={styles.summaryCol}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Back
          </Link>
          
          <h1 className={styles.title}>Support Farm AI</h1>
          <p className={styles.subtitle}>Help us keep agriculture intelligence free for farmers across India.</p>
          
          <div className={styles.planCard}>
            <div className={styles.planHeader}>
              <div>
                <h3 className={styles.planName}>One-time Donation</h3>
                <p className={styles.planBilled}>Any amount helps</p>
              </div>
              <div className={styles.planPrice}>
                ₹100<span className={styles.period}>+</span>
              </div>
            </div>
            
            <ul className={styles.planFeatures}>
              <li><Check size={16} /> Keep AI scans free</li>
              <li><Check size={16} /> Support market intelligence</li>
              <li><Check size={16} /> Expand language support</li>
              <li><Check size={16} /> Fund mobile infrastructure</li>
            </ul>
          </div>
          
          <div className={styles.secureNote}>
            <ShieldCheck size={20} />
            <div>
              <strong>Community Backed</strong>
              <p>We are a 100% open-source, non-profit initiative. This is the only place we ask for money.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Form */}
        <div className={styles.paymentCol}>
          <form className={styles.paymentForm} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>Donation Details</h2>
            
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input type="email" placeholder="sponsor@example.com" required defaultValue="" />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Amount</label>
              <input type="number" placeholder="500" min="10" required defaultValue="" />
            </div>

            <div className={styles.inputGroup}>
              <label>Card Information</label>
              <div className={styles.cardInputWrapper}>
                <CreditCard size={18} className={styles.cardIcon} />
                <input 
                  type="text" 
                  placeholder="1234 5678 9101 1121" 
                  className={styles.cardNumber}
                  required 
                  maxLength={19}
                />
              </div>
              <div className={styles.cardExtras}>
                <input type="text" placeholder="MM/YY" required maxLength={5} />
                <input type="text" placeholder="CVC" required maxLength={4} />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Name on Card</label>
              <input type="text" placeholder="Jane Doe" required />
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Processing... <Loader2 size={18} className="spin" /></>
              ) : (
                <>Donate Now</>
              )}
            </button>
            
            <p className={styles.termsNote}>
              <Lock size={12} /> Donations are securely processed. Thank you for your support.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
