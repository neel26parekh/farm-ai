import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  image?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionHref,
  image = "/images/advisor-bold.png", // Default doodle icon
  className
}) => {
  return (
    <div className={`${styles.emptyState} ${className || ""}`}>
      <div className={styles.illustration}>
        <Image src={image} alt="Empty state" width={200} height={200} className={styles.image} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
