import React from "react";
import styles from "./LiveIndicator.module.css";

interface LiveIndicatorProps {
  label?: string;
  className?: string;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({ label = "LIVE", className }) => {
  return (
    <div className={`${styles.liveIndicator} ${className || ""}`}>
      <span className={styles.dot} />
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default LiveIndicator;
