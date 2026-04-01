"use client";

import { motion } from "framer-motion";
import styles from "./Logo.module.css";

interface LogoProps {
  scrolled?: boolean;
  collapsed?: boolean;
}

export default function Logo({ scrolled = false, collapsed = false }: LogoProps) {
  // If explicitly collapsed (sidebar), we force the "AN" state
  const isCollapsed = collapsed || scrolled;

  return (
    <div className={styles.logoContainer}>
      <span className={styles.logoTextWrapper}>
        <span className={styles.logoLetter}>A</span>
        <motion.span
          initial={false}
          animate={{ 
            width: isCollapsed ? 0 : "auto",
            opacity: isCollapsed ? 0 : 1,
            marginRight: isCollapsed ? 0 : "0.15em"
          }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className={styles.logoCollapse}
        >
          gro
        </motion.span>
        <span className={styles.logoLetter}>N</span>
        <motion.span
          initial={false}
          animate={{ 
            width: isCollapsed ? 0 : "auto",
            opacity: isCollapsed ? 0 : 1
          }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className={styles.logoCollapse}
        >
          exus
        </motion.span>
      </span>
    </div>
  );
}
