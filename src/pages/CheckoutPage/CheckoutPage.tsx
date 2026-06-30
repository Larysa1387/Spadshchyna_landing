import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { checkAvailability } from '@/api/homesteads';
import { createBooking } from '@/api/bookings';
import { getApiErrorMessage, isUnauthorizedError } from '@/api/client';
import type { CheckAvailabilityResponse, HomesteadDetail } from '@/api/types';
import { paths } from '@/app/paths';
import { checkout, productPage } from '@/content/designContent';
import { useAuth } from '@/features/auth/useAuth';
import { useHomesteadDetail } from '@/features/homesteads/useHomesteadDetail';
import {
  addDays,
  formatDateRange,
  formatDisplayDate,
  formatUah,
  todayIso,
} from '@/lib/format';
import styles from './CheckoutPage.module.scss';

const DEFAULT_DONATION_PCT = 5;

function estimateDonation(
  availability: CheckAvailabilityResponse,
  donationPct: number,
): number {
  const base =
    availability.accommodation_total +
    availability.cleaning_fee +
    availability.service_fee;
  return Math.round((base * donationPct) / 100);
}

function getMainPhotoUrl(homestead: HomesteadDetail): string | null {
  if (!homestead.photos.length) {
    return null;
  }

  const sorted = [...homestead.photos].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const main = sorted.find((photo) => photo.is_main) ?? sorted[0];
  return main?.url ?? null;
}

function parseCheckoutParams(
  searchParams: URLSearchParams,
  homestead: HomesteadDetail | null,
) {
  const homesteadIdParam = searchParams.get('homesteadId');
  const defaultCheckIn = addDays(todayIso(), 30);
  const defaultCheckOut = addDays(defaultCheckIn, 3);
  const defaultGuests = homestead?.pricing.base_guests ?? 2;

  return {
    homesteadId: homesteadIdParam ? Number(homesteadIdParam) : NaN,
    checkIn: searchParams.get('checkIn') ?? defaultCheckIn,
    checkOut: searchParams.get('checkOut') ?? defaultCheckOut,
    guests: Number(searchParams.get('guests') ?? defaultGuests),
  };
}

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const homesteadIdParam = searchParams.get('homesteadId');
  const {
    homestead,
    isLoading: isHomesteadLoading,
    error: homesteadError,
  } = useHomesteadDetail(homesteadIdParam ?? undefined);

  const { checkIn, checkOut, guests, homesteadId } = useMemo(
    () => parseCheckoutParams(searchParams, homestead),
    [searchParams, homestead],
  );

  const [availability, setAvailability] =
    useState<CheckAvailabilityResponse | null>(null);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );
  const [donationPct, setDonationPct] = useState(DEFAULT_DONATION_PCT);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [pendingPay, setPendingPay] = useState(false);

  const { isAuthenticated, isInitializing, openLoginModal } = useAuth();

  useEffect(() => {
    if (!homesteadIdParam || Number.isNaN(homesteadId)) {
      setAvailability(null);
      setIsAvailabilityLoading(false);
      setAvailabilityError('Homestead not found.');
      return;
    }

    if (isHomesteadLoading) {
      return;
    }

    let cancelled = false;

    async function loadAvailability() {
      setIsAvailabilityLoading(true);
      setAvailabilityError(null);

      try {
        const data = await checkAvailability(homesteadId, {
          check_in: checkIn,
          check_out: checkOut,
          guests,
        });

        if (!cancelled) {
          setAvailability(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setAvailability(null);
          setAvailabilityError(
            getApiErrorMessage(requestError, checkout.error),
          );
        }
      } finally {
        if (!cancelled) {
          setIsAvailabilityLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [
    checkIn,
    checkOut,
    guests,
    homesteadId,
    homesteadIdParam,
    isHomesteadLoading,
  ]);

  const donationAmount = useMemo(() => {
    if (!availability) {
      return 0;
    }

    return estimateDonation(availability, donationPct);
  }, [availability, donationPct]);

  const displayTotal = useMemo(() => {
    if (!availability) {
      return 0;
    }

    return availability.total + donationAmount;
  }, [availability, donationAmount]);

  const pricePerNight = useMemo(() => {
    if (!availability || availability.nights <= 0) {
      return 0;
    }

    return Math.round(availability.accommodation_total / availability.nights);
  }, [availability]);

  const serviceFeePct = homestead?.pricing.service_fee_pct ?? 0;

  const handlePay = useCallback(async () => {
    if (!homestead || !availability?.available) {
      return;
    }

    if (!isAuthenticated) {
      setPendingPay(true);
      openLoginModal();
      return;
    }

    setIsPaying(true);
    setPayError(null);

    try {
      const booking = await createBooking({
        homestead_id: homestead.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        donation_pct: donationPct,
      });

      window.location.href = booking.checkout_url;
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        setPendingPay(true);
        openLoginModal();
      } else {
        setPayError(getApiErrorMessage(requestError, checkout.payError));
      }
    } finally {
      setIsPaying(false);
    }
  }, [
    availability,
    checkIn,
    checkOut,
    donationPct,
    guests,
    homestead,
    isAuthenticated,
    openLoginModal,
  ]);

  useEffect(() => {
    if (pendingPay && isAuthenticated && !isInitializing) {
      setPendingPay(false);
      void handlePay();
    }
  }, [pendingPay, isAuthenticated, isInitializing, handlePay]);

  const isLoading = isHomesteadLoading || isAvailabilityLoading;
  const pageError = homesteadError ?? availabilityError;
  const mainPhotoUrl = homestead ? getMainPhotoUrl(homestead) : null;

  if (isLoading) {
    return (
      <section className={`${styles.page} ${styles.pageStatusCenter}`}>
        <p className={styles.status}>{checkout.loading}</p>
      </section>
    );
  }

  if (pageError || !homestead || !availability) {
    return (
      <section className={styles.page} aria-labelledby="checkout-error-title">
        <div className={styles.layout}>
          <p
            id="checkout-error-title"
            className={`${styles.status} ${styles.statusError}`}
            role="alert"
          >
            {pageError ?? checkout.error}
          </p>
          <Link to={paths.home} className={styles.payBtn}>
            {productPage.notFound.back}
          </Link>
        </div>
      </section>
    );
  }

  const breadcrumbLinks = [
    { label: checkout.breadcrumbs[0], to: paths.home },
    { label: checkout.breadcrumbs[1], to: `${paths.home}#archive` },
    { label: checkout.breadcrumbs[2], to: null },
  ];

  return (
    <article className={styles.page} aria-labelledby="checkout-title">
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          {breadcrumbLinks.map((crumb) => (
            <li key={crumb.label} className={styles.breadcrumbItem}>
              {crumb.to ? (
                <Link to={crumb.to}>{crumb.label}</Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </li>
          ))}
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
              {checkout.bookingLabels.yourBooking}
            </h2>
            <dl className={styles.bookingGrid}>
              <div className={styles.bookingField}>
                <dt className={styles.fieldLabel}>
                  {checkout.bookingLabels.checkIn}
                </dt>
                <dd className={styles.fieldValue}>
                  <time dateTime={checkIn}>{formatDisplayDate(checkIn)}</time>
                </dd>
              </div>
              <div className={styles.bookingField}>
                <dt className={styles.fieldLabel}>
                  {checkout.bookingLabels.checkOut}
                </dt>
                <dd className={styles.fieldValue}>
                  <time dateTime={checkOut}>{formatDisplayDate(checkOut)}</time>
                </dd>
              </div>
              <div className={styles.bookingField}>
                <dt className={styles.fieldLabel}>
                  {checkout.bookingLabels.guests}
                </dt>
                <dd className={styles.fieldValue}>
                  {checkout.summaryLabels.guestsValue(guests)} ·{' '}
                  {checkout.summaryLabels.roomsValue(homestead.bedrooms)}
                </dd>
              </div>
            </dl>
          </section>

          <section className={styles.card} aria-labelledby="donation-title">
            <div className={styles.donationHeader}>
              <h2 id="donation-title" className={styles.cardTitle}>
                {checkout.donation.title}
              </h2>
              <p className={styles.donationSubtitle}>
                {checkout.donation.subtitle}
              </p>
            </div>
            <p className={styles.fieldValue}>{checkout.donation.description}</p>
            <div className={styles.sliderRow}>
              <input
                id="donation-slider"
                type="range"
                min={0}
                max={100}
                step={1}
                value={donationPct}
                onChange={(event) => setDonationPct(Number(event.target.value))}
                className={styles.slider}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={donationPct}
                aria-label={checkout.donation.subtitle}
              />
              <span className={styles.sliderValue}>{donationPct}%</span>
            </div>
            <aside className={styles.impactBox}>
              {checkout.donation.impactTemplate(
                donationPct,
                formatUah(donationAmount),
              )}
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
              {mainPhotoUrl ? (
                <img
                  className={styles.summaryImage}
                  src={mainPhotoUrl}
                  alt={homestead.name}
                />
              ) : (
                <div
                  className={styles.summaryImage}
                  role="img"
                  aria-label={homestead.name}
                />
              )}
            </figure>
            <h2 className={styles.summaryTitle}>{homestead.name}</h2>
            <address className={styles.fieldValue}>
              {homestead.location} · {homestead.region}
            </address>
            <p className={styles.fieldValue}>
              <time dateTime={`${checkIn}/${checkOut}`}>
                {formatDateRange(checkIn, checkOut)}
              </time>
            </p>
            <p className={styles.fieldValue}>
              {checkout.summaryLabels.guestsValue(guests)} ·{' '}
              {checkout.summaryLabels.nightsValue(availability.nights)} ·{' '}
              {checkout.summaryLabels.roomsValue(homestead.bedrooms)}
            </p>

            {!availability.available && (
              <p className={styles.unavailableNotice} role="alert">
                {checkout.unavailable}
              </p>
            )}

            <dl className={styles.lineItems}>
              <div className={styles.lineItem}>
                <dt>
                  {formatUah(pricePerNight)} x {availability.nights}{' '}
                  {availability.nights === 1 ? 'night' : 'nights'}
                </dt>
                <dd>{formatUah(availability.accommodation_total)}</dd>
              </div>
              <div className={styles.lineItem}>
                <dt>{checkout.summaryLabels.cleaningFee}</dt>
                <dd>{formatUah(availability.cleaning_fee)}</dd>
              </div>
              <div className={styles.lineItem}>
                <dt>{checkout.summaryLabels.serviceFee(serviceFeePct)}</dt>
                <dd>{formatUah(availability.service_fee)}</dd>
              </div>
              {donationPct > 0 && (
                <div className={styles.lineItem}>
                  <dt>{checkout.summaryLabels.donation(donationPct)}</dt>
                  <dd>{formatUah(donationAmount)}</dd>
                </div>
              )}
              <div className={styles.total}>
                <dt>{checkout.summaryLabels.total}</dt>
                <dd>{formatUah(displayTotal)}</dd>
              </div>
            </dl>

            {payError && (
              <p
                className={`${styles.status} ${styles.statusError}`}
                role="alert"
              >
                {payError}
              </p>
            )}

            <button
              type="button"
              className={styles.payBtn}
              onClick={() => void handlePay()}
              disabled={!availability.available || isPaying}
            >
              {isPaying
                ? checkout.loading
                : checkout.summaryLabels.payButton(formatUah(displayTotal))}
            </button>
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
            <h3>Hosted by {homestead.host.name}</h3>
            {homestead.host.languages.length > 0 && (
              <p>Speaks {homestead.host.languages.join(', ')}</p>
            )}
          </section>
        </aside>
      </div>
    </article>
  );
}
