import { Link } from 'react-router-dom';
import { checkout, homesteadDetail } from '@/content/designContent';
import { paths } from '@/app/paths';
import styles from './CheckoutPage.module.scss';

export function CheckoutPage() {
  return (
    <article className={styles.page} aria-labelledby="checkout-title">
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          {checkout.breadcrumbs.map((crumb, index) => {
            const isLast = index === checkout.breadcrumbs.length - 1;

            return (
              <li key={crumb} className={styles.breadcrumbItem}>
                {isLast ? (
                  <span aria-current="page">{crumb}</span>
                ) : (
                  <span>{crumb}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={styles.layout}>
        <div className={styles.mainCol}>
          <header>
            <h1 id="checkout-title" className={styles.title}>
              {checkout.title}
            </h1>
            <p className={styles.security}>{checkout.securityNote}</p>
          </header>

          <section className={styles.card} aria-labelledby="booking-title">
            <h2 id="booking-title" className={styles.cardTitle}>
              Your booking
            </h2>
            <dl className={styles.bookingGrid}>
              <div className={styles.bookingField}>
                <dt className={styles.fieldLabel}>Check-in</dt>
                <dd className={styles.fieldValue}>
                  <time dateTime="2026-06-12">{checkout.booking.checkIn}</time>
                </dd>
              </div>
              <div className={styles.bookingField}>
                <dt className={styles.fieldLabel}>Check-out</dt>
                <dd className={styles.fieldValue}>
                  <time dateTime="2026-06-15">{checkout.booking.checkOut}</time>
                </dd>
              </div>
              <div className={styles.bookingField}>
                <dt className={styles.fieldLabel}>Guests</dt>
                <dd className={styles.fieldValue}>{checkout.booking.guests}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.card} aria-labelledby="donation-title">
            <h2 id="donation-title" className={styles.cardTitle}>
              {checkout.donation.title}
            </h2>
            <p className={styles.fieldValue}>{checkout.donation.description}</p>
            <aside className={styles.impactBox}>
              {checkout.donation.impact}
            </aside>
            <p className={styles.legal}>{checkout.donation.legal}</p>
          </section>

          <section className={styles.card} aria-labelledby="trust-title">
            <h2 id="trust-title" className={styles.cardTitle}>
              {checkout.trustTitle}
            </h2>
            <ul className={styles.trustGrid}>
              {checkout.trustItems.map((item) => (
                <li key={item.title} className={styles.trustItem}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className={styles.sidebar} aria-label="Order summary">
          <section className={styles.summaryCard}>
            <figure className={styles.summaryFigure}>
              <div
                className={styles.summaryImage}
                role="img"
                aria-label={checkout.summary.title}
              />
            </figure>
            <h2 className="text-h3">{checkout.summary.title}</h2>
            <address className={styles.fieldValue}>
              {checkout.summary.location}
            </address>
            <p className={styles.fieldValue}>
              <time dateTime="2026-06-12/2026-06-15">
                {checkout.summary.dates}
              </time>
            </p>
            <p className={styles.fieldValue}>
              {checkout.summary.guests} · {checkout.summary.nights} ·{' '}
              {checkout.summary.rooms}
            </p>

            <dl className={styles.lineItems}>
              {checkout.summary.lineItems.map((item) => (
                <div key={item.label} className={styles.lineItem}>
                  <dt>{item.label}</dt>
                  <dd>{item.amount}</dd>
                </div>
              ))}
              <div className={styles.total}>
                <dt>Total (UAH)</dt>
                <dd>{checkout.summary.total}</dd>
              </div>
            </dl>

            <p className={styles.fieldValue}>
              Includes VAT {checkout.summary.vat}
            </p>

            <Link to={paths.bookingConfirmed} className={styles.payBtn}>
              {checkout.summary.payButton}
            </Link>
          </section>

          <section
            className={styles.supportCard}
            aria-labelledby="support-title"
          >
            <h2 id="support-title" className="visuallyHidden">
              Support information
            </h2>
            <h3>Free cancellation</h3>
            <p>{checkout.support.cancellation}</p>
            <h3>Need help?</h3>
            <p>{checkout.support.help}</p>
            <a href={`mailto:${checkout.support.email}`}>
              {checkout.support.email}
            </a>
          </section>

          <section className={styles.supportCard} aria-labelledby="host-title">
            <h2 id="host-title" className="visuallyHidden">
              Host information
            </h2>
            <h3>Hosted by {homesteadDetail.host.name}</h3>
            <p>{homesteadDetail.host.role}</p>
            <a href={`mailto:${homesteadDetail.host.email}`}>
              Contact host {homesteadDetail.host.email}
            </a>
          </section>
        </aside>
      </div>
    </article>
  );
}
