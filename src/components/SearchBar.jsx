import styles from "./SearchBar.module.css";
import searchIcon from "/assets/images/search.svg";
import Theme from "./common/Theme";

export default function SearchBar() {
  return (
    <>
      <div className={styles.searchBox}>
        <div className={styles.search} id="header-search">
          <img className={styles.searchIcon} src={searchIcon} />
          <input
            className={styles.input}
            type="text"
            id="search"
            name="search"
            placeholder="검색하기..."
            minLength="1"
            autoComplete="off"
          />
        </div>
        <div className={styles.dropdown} id="search-dropdown">
          <div className="search-theme">
            <div className={styles.themeContainer} id="search-theme-list">
              <Theme theme="All" isActive={true} />
              <Theme theme="Dog" isActive={false} />
              <Theme theme="Cat" isActive={false} />
              <Theme theme="Coffee" isActive={false} />
              <Theme theme="Dinner" isActive={false} />
              <Theme theme="Other" isActive={false} />
            </div>
          </div>
          <hr className={styles.dropdownDivider} />
          <div className="popular">
            <div className={styles.popularTitle}>인기 검색어</div>
            <div className={styles.popularList} id="popular-list">
              <div className={styles.popularItem}>1. 강아지</div>
              <div className={styles.popularItem}>2. 고양이</div>
              <div className={styles.popularItem}>3. 헤드셋</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
