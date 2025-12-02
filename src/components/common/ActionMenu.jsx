import { useEffect, useRef, useState } from "react";
import styles from "./ActionMenu.module.css";
import moreIcon from "/assets/images/more.svg?import";

function ActionMenu({ items = [] }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={styles.menu} ref={menuRef}>
      <button className={styles.trigger} type="button" onClick={() => setOpen(!open)}>
        <img src={moreIcon} />
      </button>
      <div className={`${styles.dropdown} ${open ? styles.open : ""}`}>
        {items.map((item) => (
          <button
            key={item.label}
            onClick={typeof item.click === "function" ? item.click : undefined}
            className={styles.item}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActionMenu;
