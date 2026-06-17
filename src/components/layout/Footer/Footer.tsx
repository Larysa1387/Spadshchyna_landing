import { brand } from '@/content/designContent';
import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.brand}>{brand.name.toUpperCase()}</span>
        <div className={styles.meta}>
          <span>© {brand.footer.copyright}</span>
          <span className={styles.madeWith}>
            {brand.footer.madeWith}
            <span className={styles.heart} aria-hidden>
              ✦
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
