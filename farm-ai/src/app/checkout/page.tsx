"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck, CreditCard, Lock, Loader2 } from "lucide-react";
import styles from "./page.module.css";

export default function CheckoutPage() {
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
          <h1 className={styles.successTitle}>Payment Successful!</h1>
          <p className={styles.successDesc}>
            Welcome to FarmAI Pro. Your account has been upgraded.
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
          <Link href="/#pricing" className={styles.backLink}>
            <ArrowLeft size={16} /> Back
          </Link>
          
          <h1 className={styles.title}>Complete your upgrade</h1>
          <p className={styles.subtitle}>Join thousands of top farmers maximizing their yield.</p>
          
          <div className={styles.planCard}>
            <div className={styles.planHeader}>
              <div>
                <h3 className={styles.planName}>FarmAI Pro</h3>
                <p className={styles.planBilled}>Billed monthly</p>
              </div>
              <div className={styles.planPrice}>
                ₹299<span className={styles.period}>/mo</span>
              </div>
            </div>
            
            <ul className={styles.planFeatures}>
              <li><Check size={16} /> Unlimited AI Disease Scans</li>
              <li><Check size={16} /> 30-Day Market Forecasting</li>
              <li><Check size={16} /> Priority 24/7 Gemini Agronomist</li>
              <li><Check size={16} /> SMS Weather Alerts</li>
            </ul>
          </div>
          
          <div className={styles.secureNote}>
            <ShieldCheck size={20} />
            <div>
              <strong>Bank-grade security</strong>
              <p>Your payment information is encrypted and securely processed.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Form */}
        <div className={styles.paymentCol}>
          <form className={styles.paymentForm} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>Payment Details</h2>
            
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input type="email" placeholder="farmer@example.com" required defaultValue="" />
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
              <input type="text" placeholder="Rajesh Kumar" required />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Billing Address / PIN Code</label>
              <input type="text" placeholder="110001" required />
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Processing... <Loader2 size={18} className="spin" /></>
              ) : (
                <>Subscribe • ₹299</>
              )}
            </button>
            
            <p className={styles.termsNote}>
              <Lock size={12} /> Payments are secure and encrypted. By subscribing, you agree to our Terms of Service. You can cancel anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
