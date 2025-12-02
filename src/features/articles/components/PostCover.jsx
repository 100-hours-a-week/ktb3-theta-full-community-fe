import styles from "./PostCover.module.css";

function PostCover({ src }) {
  return <figure className={styles.cover}>{src ? <img className={styles.image} src={src} /> : null}</figure>;
}

export default PostCover;
