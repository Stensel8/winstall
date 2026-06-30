import { useEffect } from "react";
import styles from "../styles/toast.module.scss";

export default function Toast({ message, type = "success", onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      className={`${styles.toast} ${type === "error" ? styles.error : styles.success}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
