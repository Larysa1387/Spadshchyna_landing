import { brand, navigation } from '@/content/designContent';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoMark} aria-hidden />
          <span className={styles.logoText}>
            <span className={styles.logoName}>{brand.name.toUpperCase()}</span>
            <span className={styles.logoTagline}>{brand.tagline}</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Main navigation">
          <a href="/" className={styles.navLink}>
            {navigation.homesteads}
          </a>
          <a href="#" className={styles.navLink}>
            {navigation.favourites}
          </a>
          <a href="#" className={styles.loginLink}>
            {navigation.login}
          </a>
        </nav>
      </div>
    </header>
  );
}
