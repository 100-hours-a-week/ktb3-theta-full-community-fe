import eyeIcon from "../../../public/assets/images/eye.svg";
import heartIcon from "../../../public/assets/images/heart.svg";
import messageIcon from "../../../public/assets/images/message-square.svg";
import styles from "./ArticleCard.module.css";
import Theme from "./Theme";

function ArticleCard({ title, author, date, views, likes, comments, theme }) {
  return (
    <article className={styles.articleCard}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <Theme theme={theme} />
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.cardAuthor}>
          <span className={styles.avatar}></span>
          <span className={styles.name}>{author}</span>

          <time className={styles.cardTime} dateTime={date}>
            {date}
          </time>
        </div>

        <div className={styles.cardStats}>
          <span className={styles.cardStatItem}>
            <img className={styles.cardStatIcon} src={heartIcon} />
            {likes}
          </span>
          <span className={styles.cardStatItem}>
            <img className={styles.cardStatIcon} src={messageIcon} />
            {comments}
          </span>
          <span className={styles.cardStatItem}>
            <img className={styles.cardStatIcon} src={eyeIcon} />
            {views}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
