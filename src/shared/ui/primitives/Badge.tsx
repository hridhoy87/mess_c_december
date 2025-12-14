import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "gold" | "emerald" | "royal" | "burgundy";

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
