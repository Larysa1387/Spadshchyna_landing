import { HomesteadCard } from '@/components/homestead/HomesteadCard/HomesteadCard';
import { ArchiveFilters } from '@/components/homestead/ArchiveFilters/ArchiveFilters';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { useArchiveFilters } from '@/features/homesteads/useArchiveFilters';
import { useHomesteadsArchive } from '@/features/homesteads/useHomesteadsArchive';
import { homePage } from '@/content/designContent';
import styles from './HomePage.module.scss';

const PILLAR_ICON_COLORS = ['#ffc101', '#f62a24', '#1c63bc'] as const;

function PillarDescription({
  description,
  index,
}: {
  description: string;
  index: number;
}) {
  if (index === 0) {
    const emphasis = 'You help preserve living history.';
    const splitAt = description.lastIndexOf(emphasis);

    if (splitAt !== -1) {
      return (
        <p className={styles.pillarText}>
          {description.slice(0, splitAt)}
          <strong>{emphasis}</strong>
        </p>
      );
    }
  }

  return <p className={styles.pillarText}>{description}</p>;
}

export function HomePage() {
  const {
    filterState,
    regionName,
    setRegionName,
    priceFilter,
    setPriceFilter,
    ratingFilter,
    setRatingFilter,
  } = useArchiveFilters();
  const { homesteads, regions, isLoading, error } =
    useHomesteadsArchive(filterState);

  return (
    <>
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
            <LogoIcon
              className={styles.heroOrnamentIcon}
              fill="#b79c73"
              size={18}
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

      <section
        className={styles.howItWorks}
        aria-labelledby="how-it-works-title"
      >
        <div className={styles.howItWorksContainer}>
          <div className={styles.howHeader}>
            <div className={styles.sectionLabel} aria-hidden>
              <span className={styles.sectionLabelLine} />
              <span className={styles.sectionLabelText}>
                {homePage.howItWorks.label}
              </span>
              <span className={styles.sectionLabelLine} />
            </div>
            <h2 id="how-it-works-title" className={styles.howTitle}>
              {homePage.howItWorks.title}
            </h2>
            <p className={styles.howSubtitle}>{homePage.howItWorks.subtitle}</p>
          </div>

          <ul className={styles.pillars}>
            {homePage.howItWorks.pillars.map((pillar, index) => (
              <li key={pillar.title} className={styles.pillarItem}>
                <article className={styles.pillar}>
                  <LogoIcon
                    className={styles.pillarIcon}
                    fill={PILLAR_ICON_COLORS[index]}
                  />
                  <div className={styles.pillarContent}>
                    <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                    <PillarDescription
                      description={pillar.description}
                      index={index}
                    />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.quote} aria-label="Mission quote">
        <div className={styles.quoteDivider} aria-hidden>
          <span className={styles.quoteDividerLine} />
          <LogoIcon
            className={styles.quoteDividerIcon}
            fill="#b79c73"
            size={18}
          />
          <span className={styles.quoteDividerLine} />
        </div>

        <blockquote className={styles.quoteText}>
          <img
            className={styles.quoteMark}
            src="/assets/quote/quote-mark.png"
            srcSet="/assets/quote/quote-mark.png 1x, /assets/quote/quote-mark@2x.png 2x"
            width={20}
            height={16}
            alt=""
            aria-hidden
          />
          <span className={styles.quoteContent}>
            {homePage.quote.before}{' '}
            <em className={styles.quoteEmphasis}>{homePage.quote.emphasis}</em>{' '}
            {homePage.quote.after}
          </span>
          <img
            className={`${styles.quoteMark} ${styles.quoteMarkClosing}`}
            src="/assets/quote/quote-mark.png"
            srcSet="/assets/quote/quote-mark.png 1x, /assets/quote/quote-mark@2x.png 2x"
            width={20}
            height={16}
            alt=""
            aria-hidden
          />
        </blockquote>

        <div
          className={`${styles.quoteDivider} ${styles.quoteDividerBottom}`}
          aria-hidden
        >
          <span className={styles.quoteDividerLine} />
          <LogoIcon
            className={styles.quoteDividerIcon}
            fill="#b79c73"
            size={10}
          />
          <span className={styles.quoteDividerLine} />
        </div>
      </section>

      <section
        id="archive"
        className={styles.archive}
        aria-labelledby="archive-title"
      >
        <div className={styles.archiveContainer}>
          <div className={styles.archiveHeader}>
            <div className={styles.archiveIntro}>
              <h2 id="archive-title" className={styles.archiveTitle}>
                {homePage.archive.title}
              </h2>
              <div className={styles.archiveOrnament} aria-hidden>
                <LogoIcon
                  className={styles.archiveOrnamentIcon}
                  fill="#b79c73"
                  size={14}
                />
                <span className={styles.archiveOrnamentLine} />
              </div>
              <p className={styles.archiveDescription}>
                {homePage.archive.description}
              </p>
            </div>

            <ArchiveFilters
              regions={regions}
              regionName={regionName}
              priceFilter={priceFilter}
              ratingFilter={ratingFilter}
              onRegionChange={setRegionName}
              onPriceChange={setPriceFilter}
              onRatingChange={setRatingFilter}
            />
          </div>

          {isLoading && (
            <p className={styles.archiveStatus}>Loading homesteads…</p>
          )}

          {error && (
            <p
              className={`${styles.archiveStatus} ${styles.archiveError}`}
              role="alert"
            >
              {error}
            </p>
          )}

          {!isLoading && !error && homesteads.length === 0 && (
            <p className={styles.archiveStatus}>No homesteads found.</p>
          )}

          <ul className={styles.archiveGrid}>
            {homesteads.map((homestead) => (
              <li key={homestead.id} className={styles.archiveItem}>
                <HomesteadCard {...homestead} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
