import Toast from "./Toast";
import styles from "./Toast.module.css";
import { useToastStore } from "../../lib/toast";

function ToastContainer() {
  const toasts = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className={styles.toastStack}>
      {toasts.map((toast) => (
        <Toast key={toast.id} icon={toast.type} message={toast.message} />
      ))}
    </div>
  );
}

export default ToastContainer;
