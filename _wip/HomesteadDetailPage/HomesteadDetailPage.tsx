import { Link, useParams } from 'react-router-dom';
import { homesteadDetail, homesteads } from '@/content/designContent';
import { paths } from '@/app/paths';
import styles from './HomesteadDetailPage.module.scss';

export function HomesteadDetailPage() {
  const { homesteadId } = useParams<{ homesteadId: string }>();
  const homestead = homesteads.find((item) => item.id === homesteadId);

  if (!homestead) {
    return (
      <section className={styles.notFound} aria-labelledby="not-found-title">
        <h1 id="not-found-title" className="text-h1">
          Homestead not found
        </h1>
        <p>
          <Link to={paths.home} className={styles.checkoutLink}>
            Back to archive
          </Link>
        </p>
      </section>
    );
  }

  return (
    <article className={styles.page} aria-labelledby="homestead-title">
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          {homesteadDetail.breadcrumbs.map((crumb, index) => {
            const isLast = index === homesteadDetail.breadcrumbs.length - 1;

            return (
              <li key={crumb} className={styles.breadcrumbItem}>
                {isLast ? (
                  <span aria-current="page">{crumb}</span>
                ) : (
                  <Link to={paths.home}>{crumb}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={styles.layout}>
        <div className={styles.primary}>
          <figure className={styles.gallery}>
            <div
              className={styles.galleryImage}
              role="img"
              aria-label={homestead.title}
            />
          </figure>

          <div className={styles.content}>
            <ul className={styles.badges} aria-label="Property highlights">
              {homesteadDetail.badges.map((badge) => (
                <li key={badge} className={styles.badge}>
                  {badge}
                </li>
              ))}
            </ul>

            <section aria-labelledby="about-title">
              <h2 id="about-title" className={styles.sectionTitle}>
                About the homestead
              </h2>
              <div className={styles.aboutText}>
                {homesteadDetail.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="amenities-title">
              <h2 id="amenities-title" className={styles.sectionTitle}>
                Amenities
              </h2>
              <ul className={styles.amenities}>
                {homesteadDetail.amenities.map((amenity) => (
                  <li key={amenity} className={styles.amenity}>
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="reviews-title">
              <h2 id="reviews-title" className={styles.sectionTitle}>
                What guests love
              </h2>
              <ul className={styles.reviews}>
                {homesteadDetail.reviews.map((review) => (
                  <li key={review.author}>
                    <blockquote className={styles.review}>
                      <p className={styles.reviewTheme}>{review.theme}</p>
                      <p className={styles.reviewQuote}>{review.quote}</p>
                      <footer className={styles.reviewAuthor}>
                        — {review.author}
                      </footer>
                    </blockquote>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <aside className={styles.sidebar} aria-label="Booking details">
          <header className={styles.sidebarHeader}>
            <p className={styles.location}>{homesteadDetail.location}</p>
            <h1 id="homestead-title" className={styles.title}>
              {homestead.title}
            </h1>
            <p className={styles.rating}>
              <data value={homesteadDetail.rating.score}>
                {homesteadDetail.rating.score}
              </data>{' '}
              ({homesteadDetail.rating.reviews} reviews)
            </p>
            <p className={styles.description}>{homestead.description}</p>
          </header>

          <p className={styles.price}>
            <data value={homesteadDetail.price.amount}>
              {homesteadDetail.price.amount}
            </data>
            <span className={styles.priceNote}>
              {' '}
              {homesteadDetail.price.suffix}
            </span>
          </p>
          <p className={styles.priceNote}>{homesteadDetail.price.note}</p>

          <form className={styles.bookingForm} aria-label="Check availability">
            <Link to={paths.checkout} className={styles.bookingBtn}>
              {homesteadDetail.booking.checkAvailability}
            </Link>
            <button type="button" className={styles.favoriteBtn}>
              {homesteadDetail.booking.addToFavorites}
            </button>
          </form>
        </aside>
      </div>
    </article>
  );
}
