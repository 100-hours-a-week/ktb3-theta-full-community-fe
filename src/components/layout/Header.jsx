import { Link } from "react-router-dom";
import { usePageRouter } from "../../hooks/usePageRouter";
import { useUser } from "../../contexts/useUser";
import SearchBar from "../SearchBar";
import Button from "../common/Button";
import userIcon from "/assets/images/user.svg";
import styles from "./Header.module.css";

function Header() {
  const { goToLogin } = usePageRouter();
  const { user } = useUser();
  return (
    <>
      <header className={styles.headerWrapper}>
        <div className={styles.headerContainer}>
          <Link className={styles.headerIcon} to="/">
            커뮤니티
          </Link>
          <SearchBar />
          <div className={styles.headerActions}>
            {user ? (
              <Link to="/my" className={styles.headerProfile}>
                <span className={styles.headerProfileImage}>
                  {user.profile_image ? <img src={user.profile_image} /> : <img src={userIcon} />}
                </span>
              </Link>
            ) : (
              <Button variant="icon" onClick={goToLogin}>
                <img src={userIcon} style={{ width: "18px", height: "32px" }} />
              </Button>
            )}
          </div>
        </div>
      </header>
      <hr className={styles.headerDivider} />
    </>
  );
}

export default Header;
