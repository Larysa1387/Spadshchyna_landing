import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listBookings } from '@/api/bookings';
import type { BookingListItem } from '@/api/types';
import { paths } from '@/app/paths';
import { checkout } from '@/content/designContent';
import { useAuth } from '@/features/auth/useAuth';
import { formatDateRange, formatUah } from '@/lib/format';
import styles from './BookingConfirmedPage.module.scss';

const { confirmation } = checkout;

function parseBookingId(searchParams: URLSearchParams): string | null {
  return searchParams.get('bookingId') ?? searchParams.get('booking_id');
}

export function BookingConfirmedPage() {
  const [searchParams] = useSearchParams();
  const bookingIdParam = parseBookingId(searchParams);
  const { isAuthenticated, isInitializing } = useAuth();

  const [booking, setBooking] = useState<BookingListItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const bookingIdNum = useMemo(() => {
    if (!bookingIdParam) {
      return null;
    }

    const parsed = Number(bookingIdParam);
    return Number.isFinite(parsed) ? parsed : null;
  }, [bookingIdParam]);

  useEffect(() => {
    if (isInitializing || !isAuthenticated || bookingIdNum === null) {
      setBooking(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    listBookings()
      .then((bookings) => {
        if (cancelled) {
          return;
        }

        const match = bookings.find((item) => item.id === bookingIdNum) ?? null;
        setBooking(match);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setBooking(null);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isInitializing, bookingIdNum]);

  const showLoading =
    isLoading && isAuthenticated && bookingIdNum !== null && !isInitializing;
  const showSummary = booking !== null;

  return (
    <section className={styles.page} aria-labelledby="confirmation-title">
      <p className={styles.icon} aria-hidden>
        ✓
      </p>
      <h1 id="confirmation-title" className={styles.title}>
        {confirmation.title}
      </h1>
      <p className={styles.message} role="status">
        {confirmation.message}
      </p>
      {bookingIdParam && (
        <p className={styles.bookingRef}>
          {confirmation.bookingReference}: <strong>#{bookingIdParam}</strong>
        </p>
      )}

      {showLoading && (
        <p className={styles.loading} role="status">
          {confirmation.loading}
        </p>
      )}

      {showSummary && (
        <section
          className={styles.summaryCard}
          aria-labelledby="booking-summary-title"
        >
          <h2 id="booking-summary-title" className={styles.summaryTitle}>
            {confirmation.summaryTitle}
          </h2>
          <dl className={styles.summaryGrid}>
            <div className={styles.summaryField}>
              <dt className={styles.fieldLabel}>
                {confirmation.summaryLabels.homestead}
              </dt>
              <dd className={styles.fieldValue}>
                <Link
                  to={paths.homesteadDetail(String(booking.homestead_id))}
                  className={styles.homesteadLink}
                >
                  {booking.homestead_name}
                </Link>
              </dd>
            </div>
            <div className={styles.summaryField}>
              <dt className={styles.fieldLabel}>
                {confirmation.summaryLabels.dates}
              </dt>
              <dd className={styles.fieldValue}>
                <time dateTime={booking.check_in}>
                  {formatDateRange(booking.check_in, booking.check_out)}
                </time>
              </dd>
            </div>
            <div className={styles.summaryField}>
              <dt className={styles.fieldLabel}>
                {confirmation.summaryLabels.guests}
              </dt>
              <dd className={styles.fieldValue}>
                {confirmation.guestsValue(booking.guests)}
              </dd>
            </div>
            <div className={styles.summaryField}>
              <dt className={styles.fieldLabel}>
                {confirmation.summaryLabels.total}
              </dt>
              <dd className={styles.totalValue}>{formatUah(booking.total)}</dd>
            </div>
          </dl>
        </section>
      )}

      <nav className={styles.actions} aria-label="Confirmation actions">
        <Link to={paths.favourites} className={styles.primaryBtn}>
          {confirmation.viewFavourites}
        </Link>
        <Link to={paths.home} className={styles.secondaryBtn}>
          {confirmation.backToHomesteads}
        </Link>
      </nav>
    </section>
  );
}
