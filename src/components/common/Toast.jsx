import alertIcon from "/assets/images/alert.svg";
import xIcon from "/assets/images/x-circle.svg";
import styles from "./Toast.module.css";

const iconType = {
  info: alertIcon,
  error: xIcon,
};

function Toast({ icon = "info", message }) {
  return (
    <div className={styles.toastContainer}>
      <img className={styles.icon} src={iconType[icon]} />
      <span className={styles.message}>{message}</span>
    </div>
  );
}

export default Toast;
