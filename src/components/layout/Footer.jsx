import styles from "./Footer.module.css";

function Footer() {
  return (
    <>
      <hr className={styles.footerDivider} />
      <footer className={styles.footer}>
        <span>@tl1l1l1s</span>
      </footer>
    </>
  );
}

export default Footer;
