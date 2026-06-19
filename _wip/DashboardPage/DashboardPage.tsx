import { Link } from 'react-router-dom';
import { dashboard } from '@/content/designContent';
import { paths } from '@/app/paths';
import styles from './DashboardPage.module.scss';

export function DashboardPage() {
  return (
    <article className={styles.page} aria-labelledby="dashboard-title">
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Account navigation">
          <nav className={styles.nav} aria-label="Dashboard navigation">
            <ul className={styles.navList}>
              {dashboard.sidebar.nav.map((item, index) => (
                <li key={item}>
                  <span
                    className={`${styles.navItem}${index === 0 ? ` ${styles.navItemActive}` : ''}`}
                    aria-current={index === 0 ? 'page' : undefined}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </nav>
          <blockquote className={styles.quote}>
            {dashboard.sidebar.quote.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </blockquote>
        </aside>

        <div className={styles.main}>
          <header className={styles.heroBanner}>
            <h1 id="dashboard-title" className={styles.welcomeTitle}>
              {dashboard.welcome.greeting}
            </h1>
            <p className={styles.welcomeText}>{dashboard.welcome.summary}</p>
            <ul className={styles.stats} aria-label="Your travel statistics">
              <li className={styles.stat}>
                <span className={styles.statValue}>
                  {dashboard.welcome.stats.nightsTraveled}
                </span>
                <span className={styles.statLabel}>nights traveled</span>
              </li>
              <li className={styles.stat}>
                <span className={styles.statValue}>
                  {dashboard.welcome.stats.regionsExplored}
                </span>
                <span className={styles.statLabel}>regions explored</span>
              </li>
              <li className={styles.stat}>
                <span className={styles.statValue}>
                  {dashboard.welcome.stats.donatedUah}
                </span>
                <span className={styles.statLabel}>UAH donated</span>
              </li>
            </ul>
          </header>

          <div className={styles.grid}>
            <section
              className={styles.card}
              aria-labelledby="upcoming-stay-title"
            >
              <h2 id="upcoming-stay-title" className={styles.cardTitle}>
                Upcoming Stay
              </h2>
              <figure className={styles.upcomingFigure}>
                <div
                  className={styles.upcomingImage}
                  role="img"
                  aria-label={dashboard.upcomingStay.title}
                />
              </figure>
              <h3 className="text-h3">{dashboard.upcomingStay.title}</h3>
              <address className={styles.meta}>
                {dashboard.upcomingStay.region}
              </address>
              <time className={styles.meta} dateTime="2026-08-12/2026-08-15">
                {dashboard.upcomingStay.dates}
              </time>
              <p className={styles.meta}>{dashboard.upcomingStay.guests}</p>
              <p className={styles.meta}>{dashboard.upcomingStay.host}</p>
              <nav
                className={styles.actions}
                aria-label="Upcoming stay actions"
              >
                <Link to={paths.checkout} className={styles.primaryBtn}>
                  {dashboard.upcomingStay.viewBooking}
                </Link>
                <Link to={paths.home} className={styles.secondaryBtn}>
                  {dashboard.upcomingStay.viewHomesteads}
                </Link>
              </nav>
            </section>

            <section
              className={styles.card}
              aria-labelledby="past-journeys-title"
            >
              <h2 id="past-journeys-title" className={styles.cardTitle}>
                {dashboard.pastJourneys.title}
              </h2>
              <ul className={styles.journeyList}>
                {dashboard.pastJourneys.items.map((item) => (
                  <li key={item.title} className={styles.journeyItem}>
                    <article>
                      <h3 className={styles.journeyTitle}>{item.title}</h3>
                      <p>{item.region}</p>
                    </article>
                    <data value={item.rating}>{item.rating.toFixed(1)}</data>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className={styles.card} aria-labelledby="favourites-title">
            <h2 id="favourites-title" className={styles.cardTitle}>
              Favourite Homesteads
            </h2>
            <ul className={styles.journeyList}>
              {dashboard.favourites.map((name) => (
                <li key={name} className={styles.journeyItem}>
                  <span>{name}</span>
                  <Link to={paths.home}>View</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.impact} aria-labelledby="impact-title">
            <h2 id="impact-title" className={styles.cardTitle}>
              {dashboard.impact.title}
            </h2>
            <p>{dashboard.impact.subtitle.join(' ')}</p>
            <p className={styles.impactAmount}>
              <data value={dashboard.impact.amount}>
                {dashboard.impact.amount} UAH
              </data>
            </p>
            <p className={styles.meta}>{dashboard.impact.note}</p>
            <p className={styles.welcomeText}>{dashboard.impact.community}</p>
            <ul className={styles.impactGrid}>
              {dashboard.impact.actions.map((action) => (
                <li key={action.title} className={styles.impactItem}>
                  <strong>{action.title}</strong>
                  <p>{action.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
