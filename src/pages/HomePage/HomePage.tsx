import { homePage } from '@/content/designContent';
import styles from './HomePage.module.scss';

export function HomePage() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <h1 id="hero-title" className={styles.heroTitle}>
          {homePage.hero.title.map((line) => (
            <span key={line} className={styles.heroTitleLine}>
              {line}
            </span>
          ))}
        </h1>

        <div className={styles.heroOrnament} aria-hidden>
          <img
            className={styles.heroOrnamentIcon}
            src="/assets/logo/meta-ornament.svg"
            width={18}
            height={18}
            alt=""
          />
          <span className={styles.heroOrnamentLine} />
        </div>

        <p className={styles.heroSubtitle}>{homePage.hero.subtitle}</p>

        <a href="#archive" className={styles.heroCta}>
          {homePage.hero.cta}
          <span className={styles.heroCtaArrow} aria-hidden>
            →
          </span>
        </a>
      </div>
    </section>
  );
}
