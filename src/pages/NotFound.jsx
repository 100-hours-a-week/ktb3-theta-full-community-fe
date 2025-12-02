import alert from "/assets/images/alert.svg";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <img className={styles.alert} src={alert} />
      <h1 className={styles.title}>요청하신 페이지를 찾을 수 없습니다.</h1>
    </div>
  );
}
