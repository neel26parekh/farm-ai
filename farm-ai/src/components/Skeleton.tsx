import React from "react";
import { motion } from "framer-motion";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className,
  circle
}) => {
  const style: React.CSSProperties = {
    width: width ?? "100%",
    height: height ?? "1rem",
    borderRadius: circle ? "50%" : borderRadius ?? "var(--radius-sm)",
  };

  return (
    <motion.div 
      className={`${styles.skeleton} ${className || ""}`} 
      style={style}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    />
  );
};

export default Skeleton;
