import { forwardRef } from "react";
import styles from "./Input.module.css";

function Input({ className = "", ...props }, ref) {
  const classes = [styles.input, className].filter(Boolean).join(" ");
  return <input ref={ref} className={classes} {...props} />;
}

export default forwardRef(Input);
