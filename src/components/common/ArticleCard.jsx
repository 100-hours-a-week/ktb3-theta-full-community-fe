import { Link } from "react-router-dom";
import Theme from "./Theme";
import formatDate from "../../utils/formatDate";
import { resolveImageUrl } from "../../utils/image";
import eyeIcon from "/assets/images/eye.svg";
import heartIcon from "/assets/images/heart.svg";
import messageIcon from "/assets/images/message-square.svg";
import styles from "./ArticleCard.module.css";

function ArticleCard({ article_id, title, writtenBy, createdAt, viewCount, likeCount, commentCount, theme = "None" }) {
  return (
    <Link className={styles.articleCard} to={`/articles/${article_id}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <Theme theme={theme} />
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.cardAuthor}>
          <span className={styles.avatar}>
            {writtenBy?.profile_image ? <img src={resolveImageUrl(writtenBy?.profile_image)} /> : null}
          </span>
          <span className={styles.name}>{writtenBy?.nickname}</span>

          <time className={styles.cardTime} dateTime={createdAt}>
            {formatDate(createdAt)}
          </time>
        </div>

        <div className={styles.cardStats}>
          <span className={styles.cardStatItem}>
            <img className={styles.cardStatIcon} src={heartIcon} />
            {likeCount ?? 0}
          </span>
          <span className={styles.cardStatItem}>
            <img className={styles.cardStatIcon} src={messageIcon} />
            {commentCount ?? 0}
          </span>
          <span className={styles.cardStatItem}>
            <img className={styles.cardStatIcon} src={eyeIcon} />
            {viewCount ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
