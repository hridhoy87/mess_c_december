import styles from "./Skeleton.module.css";

export function Skeleton({ style }: { style?: React.CSSProperties }) {
  return <div className={styles.skeleton} style={style} />;
}
