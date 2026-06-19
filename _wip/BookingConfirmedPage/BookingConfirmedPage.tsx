import { Link } from 'react-router-dom';
import { checkout } from '@/content/designContent';
import { paths } from '@/app/paths';
import styles from './BookingConfirmedPage.module.scss';

export function BookingConfirmedPage() {
  return (
    <section className={styles.page} aria-labelledby="confirmation-title">
      <p className={styles.icon} aria-hidden>
        ✓
      </p>
      <h1 id="confirmation-title" className={styles.title}>
        {checkout.confirmation.title}
      </h1>
      <p className={styles.message} role="status">
        {checkout.confirmation.message}
      </p>
      <nav className={styles.actions} aria-label="Confirmation actions">
        <Link to={paths.favourites} className={styles.primaryBtn}>
          View favourites
        </Link>
        <Link to={paths.home} className={styles.secondaryBtn}>
          Back to homesteads
        </Link>
      </nav>
    </section>
  );
}
