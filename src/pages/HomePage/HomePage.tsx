import { homePage } from '@/content/designContent';
import styles from './HomePage.module.scss';

export function HomePage() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <ul
          id="hero-title"
          className={styles.heroTitle}
          role="heading"
          aria-level={1}
        >
          {homePage.hero.title.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className={styles.heroSubtitle}>{homePage.hero.subtitle}</p>
        <a href="#" className={styles.heroCta}>
          {homePage.hero.cta}
        </a>
      </div>
    </section>
  );
}
