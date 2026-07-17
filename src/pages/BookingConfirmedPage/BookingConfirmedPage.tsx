import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { listBookings } from '@/api/bookings';
import type { BookingListItem } from '@/api/types';
import { paths } from '@/app/paths';
import { checkout } from '@/content/designContent';
import { useAuth } from '@/features/auth/useAuth';
import { formatDateRange, formatUah } from '@/lib/format';
import { isPendingBookingStatus } from '@/lib/bookings';
import { clearPendingCheckout } from '@/lib/pendingCheckout';
import styles from './BookingConfirmedPage.module.scss';

const { confirmation } = checkout;

function parseBookingId(searchParams: URLSearchParams): string | null {
  return searchParams.get('bookingId') ?? searchParams.get('booking_id');
}

function pickLatestBooking(
  bookings: BookingListItem[],
): BookingListItem | null {
  if (!bookings.length) {
    return null;
  }

  return [...bookings].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0];
}

function isCompletedBooking(booking: BookingListItem): boolean {
  const status = booking.status.trim().toLowerCase();
  if (
    status === 'completed' ||
    status === 'complete' ||
    status === 'past' ||
    status === 'finished'
  ) {
    return true;
  }

  const checkOut = new Date(`${booking.check_out}T00:00:00`);
  if (Number.isNaN(checkOut.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return checkOut < today;
}

export function BookingConfirmedPage() {
  const [searchParams] = useSearchParams();
  const bookingIdParam = parseBookingId(searchParams);
  const sessionId = searchParams.get('session_id');
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

  const shouldLoadBooking =
    !isInitializing &&
    isAuthenticated &&
    (bookingIdNum !== null || !!sessionId);

  useEffect(() => {
    if (!shouldLoadBooking) {
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

        if (bookingIdNum !== null) {
          const match =
            bookings.find((item) => item.id === bookingIdNum) ?? null;
          setBooking(match);
          return;
        }

        setBooking(pickLatestBooking(bookings));
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
  }, [bookingIdNum, shouldLoadBooking, sessionId]);

  useEffect(() => {
    if (!booking || isPendingBookingStatus(booking.status)) {
      return;
    }

    clearPendingCheckout(
      booking.homestead_id,
      booking.check_in,
      booking.check_out,
      booking.id,
    );
  }, [booking]);

  const displayBookingId = booking?.id ?? bookingIdParam;
  const showLoading = isLoading && shouldLoadBooking;
  const showSummary = booking !== null;
  const isCompleted = booking ? isCompletedBooking(booking) : false;
  const title = isCompleted ? confirmation.completedTitle : confirmation.title;
  const message = isCompleted
    ? confirmation.completedMessage
    : confirmation.message;

  return (
    <section className={styles.page} aria-labelledby="confirmation-title">
      <div className={styles.card}>
        <LogoIcon
          className={styles.icon}
          fill="#b79c73"
          size={48}
          aria-hidden
        />
        <h1 id="confirmation-title" className={styles.title}>
          {title}
        </h1>
        <p className={styles.message} role="status">
          {message}
        </p>

        {displayBookingId && (
          <p className={styles.bookingRef}>
            {confirmation.bookingReference}:{' '}
            <strong>#{displayBookingId}</strong>
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
                <dd className={styles.totalValue}>
                  {formatUah(booking.total)}
                </dd>
              </div>
            </dl>
          </section>
        )}

        <nav className={styles.actions} aria-label="Confirmation actions">
          <Link to={paths.home} className={styles.primaryBtn}>
            <span aria-hidden>←</span>
            <span>{confirmation.backToHomesteads}</span>
          </Link>
        </nav>
      </div>
    </section>
  );
}
