import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { checkAvailability } from '@/api/homesteads';
import { createBooking } from '@/api/bookings';
import { getApiErrorMessage, isUnauthorizedError } from '@/api/client';
import type { CheckAvailabilityResponse, HomesteadDetail } from '@/api/types';
import { paths } from '@/app/paths';
import {
  HeartIcon,
  LeafIcon,
  LogoIcon,
  RatingStarIcon,
} from '@/components/icons';
import { checkout, navigation, productPage } from '@/content/designContent';
import { useAuth } from '@/features/auth/useAuth';
import { useHomesteadDetail } from '@/features/homesteads/useHomesteadDetail';
import {
  addDays,
  formatDateRange,
  formatDisplayDate,
  formatUah,
  todayIso,
} from '@/lib/format';
import { publicAsset } from '@/lib/assets';
import styles from './CheckoutPage.module.scss';

const DEFAULT_DONATION_PCT = 5;
const DONATION_MARKERS = checkout.donation.sliderMarkers;
const DONATION_MARKERS_MOBILE = [0, 5, 25, 75, 100] as const;
const IMPACT_ICON = publicAsset('assets/checkout/impact-icon.png');

function formatHostFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

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

function estimateVat(total: number) {
  return Math.round((total * 20) / 120);
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

function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.sectionHeading}>
      <LogoIcon
        className={styles.sectionHeadingIcon}
        fill="#b79c73"
        size={12}
        aria-hidden
      />
      <h2 id={id} className={styles.sectionHeadingText}>
        {children}
      </h2>
      <span className={styles.sectionHeadingLine} aria-hidden />
    </div>
  );
}

function DonationSlider({
  value,
  onChange,
  markers,
  label,
  disabled = false,
}: {
  value: number;
  onChange: (nextValue: number) => void;
  markers: readonly number[];
  label: string;
  disabled?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const setValueFromClientX = useCallback(
    (clientX: number) => {
      if (disabled) {
        return;
      }

      const track = trackRef.current;
      if (!track) {
        return;
      }

      const { left, width } = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - left) / width));
      onChange(Math.round(ratio * 100));
    },
    [disabled, onChange],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    isDraggingRef.current = true;
    setValueFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !isDraggingRef.current) {
      return;
    }

    setValueFromClientX(event.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      onChange(Math.min(100, value + 1));
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      onChange(Math.max(0, value - 1));
    }
  };

  return (
    <div
      className={`${styles.sliderWrap}${
        disabled ? ` ${styles.sliderWrapDisabled}` : ''
      }`}
    >
      <div
        ref={trackRef}
        className={styles.sliderTrack}
        onPointerDown={disabled ? undefined : handlePointerDown}
        onPointerMove={disabled ? undefined : handlePointerMove}
        onPointerUp={disabled ? undefined : handlePointerUp}
        onPointerCancel={disabled ? undefined : handlePointerUp}
      >
        <div className={styles.sliderFill} style={{ width: `${value}%` }} />
        {markers.map((marker) => (
          <span
            key={`tick-${marker}`}
            className={styles.sliderTick}
            style={{ left: `${marker}%` }}
            data-value={marker}
            aria-hidden
          />
        ))}
        <button
          type="button"
          className={styles.sliderThumb}
          style={{ left: `${value}%` }}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-label={label}
          aria-disabled={disabled}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.sliderMarkers} aria-hidden>
        {markers.map((marker) => (
          <span
            key={marker}
            className={
              marker === value
                ? `${styles.sliderMarker} ${styles.sliderMarkerActive}`
                : styles.sliderMarker
            }
            style={{ left: `${marker}%` }}
            data-value={marker}
          >
            {marker}%
          </span>
        ))}
      </div>
    </div>
  );
}

function LockIcon({
  className,
  size = 16,
  filled = false,
}: {
  className?: string;
  size?: number;
  filled?: boolean;
}) {
  if (filled) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden
      >
        <path
          d="M12 2a4.5 4.5 0 0 0-4.5 4.5V9H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-.5V6.5A4.5 4.5 0 0 0 12 2Zm0 2a2.5 2.5 0 0 1 2.5 2.5V9h-5V6.5A2.5 2.5 0 0 1 12 4Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon({
  className,
  size = 18,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M4.5 2.25v1.25M11.5 2.25v1.25M3.25 5.75h9.5M3.25 4h9.5a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CapacityIcon({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  const strokeProps = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 0.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden
    >
      <circle cx="10.35" cy="5.35" r="1.05" {...strokeProps} />
      <path
        d="M8.6 9.85v-.45c0-.95.82-1.72 1.85-1.72s1.85.77 1.85 1.72v.45"
        {...strokeProps}
      />
      <path d="M8.15 10.3h4.3" {...strokeProps} />
      <circle cx="5.65" cy="5.65" r="1.4" {...strokeProps} />
      <path
        d="M2.75 10.75v-.75c0-1.45 1.46-2.625 3.25-2.625s3.25 1.175 3.25 2.625v.75"
        {...strokeProps}
      />
      <path d="M2.75 11.5h6.5" {...strokeProps} />
    </svg>
  );
}

function ShieldIcon({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 12 1.75 1.75L15 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon({
  className,
  size = 14,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M12 10.5V16M12 8v.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeadsetIcon({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M4 14v-2a8 8 0 0 1 16 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <rect
        x="3"
        y="13"
        width="4"
        height="6"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <rect
        x="17"
        y="13"
        width="4"
        height="6"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M12 19v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HostDetailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={16}
      height={16}
      aria-hidden
    >
      <path
        d="M3.25 3.25h9.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-.75.75H7l-2.25 2.25V9.25H3.25a.75.75 0 0 1-.75-.75V4a.75.75 0 0 1 .75-.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="6.25" r="0.45" fill="currentColor" />
      <circle cx="8" cy="6.25" r="0.45" fill="currentColor" />
      <circle cx="10" cy="6.25" r="0.45" fill="currentColor" />
    </svg>
  );
}

const trustIcons = [LockIcon, ShieldIcon, HeartIcon, RatingStarIcon] as const;

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const homesteadIdParam = searchParams.get('homesteadId');
  const isViewMode = searchParams.get('mode') === 'view';
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
  const [isMobileViewport, setIsMobileViewport] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches,
  );

  const { isAuthenticated, isInitializing, openLoginModal } = useAuth();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => {
      mediaQuery.removeEventListener('change', updateViewport);
    };
  }, []);

  const donationSliderMarkers = useMemo(
    () => (isMobileViewport ? DONATION_MARKERS_MOBILE : DONATION_MARKERS),
    [isMobileViewport],
  );

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

  const vatAmount = useMemo(() => estimateVat(displayTotal), [displayTotal]);

  const pricePerNight = useMemo(() => {
    if (!availability || availability.nights <= 0) {
      return 0;
    }

    return Math.round(availability.accommodation_total / availability.nights);
  }, [availability]);

  const serviceFeePct = homestead?.pricing.service_fee_pct ?? 0;
  const hostFirstName = homestead
    ? formatHostFirstName(homestead.host.name)
    : '';
  const hostEmail = productPage.host.contactEmail(hostFirstName);

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

  if (isInitializing) {
    return (
      <section className={`${styles.page} ${styles.pageStatusCenter}`}>
        <p className={styles.status}>{checkout.loading}</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section
        className={`${styles.page} ${styles.pageStatusCenter}`}
        aria-labelledby="checkout-login-title"
      >
        <div className={styles.loginPrompt}>
          <p id="checkout-login-title" className={styles.loginPromptText}>
            {checkout.loginPrompt}
          </p>
          <button
            type="button"
            className={styles.loginPromptBtn}
            onClick={openLoginModal}
          >
            {navigation.login}
          </button>
        </div>
      </section>
    );
  }

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
    {
      label: homestead.name,
      to: paths.homesteadDetail(String(homestead.id)),
    },
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
          <header className={styles.pageHeader}>
            <h1 id="checkout-title" className={styles.title}>
              {checkout.title}
            </h1>
            <p className={styles.security}>
              <LockIcon className={styles.securityIcon} size={20} filled />
              <span>{checkout.securityNote}</span>
            </p>
          </header>

          <section
            className={styles.bookingSection}
            aria-labelledby="booking-title"
          >
            <SectionHeading id="booking-title">
              {checkout.bookingLabels.yourBooking}
            </SectionHeading>
            <dl className={styles.bookingGrid}>
              <div className={styles.bookingFieldBox}>
                <dt className={styles.fieldLabel}>
                  {checkout.bookingLabels.checkIn}
                </dt>
                <dd className={styles.fieldValue}>
                  <CalendarIcon className={styles.propertyDetailIcon} />
                  <time dateTime={checkIn}>{formatDisplayDate(checkIn)}</time>
                </dd>
              </div>
              <div className={styles.bookingFieldBox}>
                <dt className={styles.fieldLabel}>
                  {checkout.bookingLabels.checkOut}
                </dt>
                <dd className={styles.fieldValue}>
                  <CalendarIcon className={styles.propertyDetailIcon} />
                  <time dateTime={checkOut}>{formatDisplayDate(checkOut)}</time>
                </dd>
              </div>
              <div
                className={`${styles.bookingFieldBox} ${styles.bookingFieldBoxWide}`}
              >
                <dt className={styles.fieldLabel}>
                  {checkout.bookingLabels.guests}
                </dt>
                <dd className={styles.fieldValue}>
                  <CapacityIcon
                    className={`${styles.propertyDetailIcon} ${styles.propertyDetailIconCapacity}`}
                  />
                  <span>{checkout.summaryLabels.guestsValue(guests)}</span>
                </dd>
              </div>
            </dl>
          </section>

          <section
            className={styles.donationSection}
            aria-labelledby="donation-title"
          >
            <SectionHeading id="donation-title">
              {checkout.donation.title}
            </SectionHeading>

            <div className={styles.donationCard}>
              <div className={styles.donationSubtitleRow}>
                <LogoIcon fill="#b79c73" size={10} aria-hidden />
                <p className={styles.donationSubtitle}>
                  {checkout.donation.subtitle}
                </p>
              </div>

              <DonationSlider
                value={donationPct}
                onChange={setDonationPct}
                markers={donationSliderMarkers}
                label={checkout.donation.subtitle}
                disabled={isViewMode}
              />

              <aside className={styles.impactBox}>
                <img
                  className={styles.impactIcon}
                  src={IMPACT_ICON}
                  alt=""
                  width={72}
                  height={56}
                />
                <div>
                  <p className={styles.impactHeading}>
                    {checkout.donation.impactHeading}
                  </p>
                  <p className={styles.impactText}>
                    <strong>{donationPct}%</strong> of your booking (
                    <strong>{formatUah(donationAmount)}</strong>) will be
                    donated to restore historic homesteads across Ukraine.{' '}
                    <a href="#impact" className={styles.impactLink}>
                      {checkout.donation.impactLink}
                    </a>
                  </p>
                </div>
              </aside>

              <p className={styles.legal}>
                {checkout.donation.legalPrefix}{' '}
                <a href="#terms">{checkout.donation.termsLabel}</a> and{' '}
                <a href="#privacy">{checkout.donation.privacyLabel}</a>.
              </p>
            </div>
          </section>

          <section
            className={styles.trustSection}
            aria-labelledby="trust-title"
          >
            <div className={styles.trustHeading}>
              <span className={styles.trustHeadingLine} aria-hidden />
              <h2 id="trust-title">{checkout.trustTitle}</h2>
              <span className={styles.trustHeadingLine} aria-hidden />
            </div>
            <div className={styles.trustPanel}>
              <ul className={styles.trustGrid}>
                {checkout.trustItems.map((item, index) => {
                  const Icon = trustIcons[index] ?? LockIcon;
                  return (
                    <li key={item.title} className={styles.trustItem}>
                      <Icon
                        className={styles.trustIcon}
                        size={40}
                        aria-hidden
                      />
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>

        <aside className={styles.sidebar} aria-label="Order summary">
          <section className={styles.summaryCard}>
            <div className={styles.summaryTop}>
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
              <div>
                <h2 className={styles.summaryTitle}>{homestead.name}</h2>
                <address className={styles.summaryLocation}>
                  {homestead.location} · {homestead.region}
                </address>
              </div>
            </div>

            <div className={styles.summaryMeta}>
              <CalendarIcon className={styles.summaryMetaIcon} size={18} />
              <div>
                <p className={styles.summaryMetaPrimary}>
                  <time dateTime={`${checkIn}/${checkOut}`}>
                    {formatDateRange(checkIn, checkOut)}
                  </time>
                </p>
                <p className={styles.summaryMetaSecondary}>
                  {checkout.summaryLabels.nightsValue(availability.nights)}
                </p>
              </div>
            </div>

            <div className={styles.summaryMeta}>
              <CapacityIcon
                className={`${styles.propertyDetailIcon} ${styles.propertyDetailIconCapacity}`}
              />
              <div>
                <p className={styles.summaryMetaPrimary}>
                  {checkout.summaryLabels.guestsValue(guests)}
                </p>
              </div>
            </div>

            {!availability.available && !isViewMode && (
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
                <dt>
                  <span>{checkout.summaryLabels.cleaningFee}</span>
                  <span className={styles.lineItemTip}>
                    <button
                      type="button"
                      className={styles.lineItemTipTrigger}
                      aria-label={checkout.summaryLabels.cleaningFeeTooltip}
                    >
                      <InfoIcon className={styles.lineItemIcon} size={13} />
                    </button>
                    <span className={styles.lineItemTipText} role="tooltip">
                      {checkout.summaryLabels.cleaningFeeTooltip}
                    </span>
                  </span>
                </dt>
                <dd>{formatUah(availability.cleaning_fee)}</dd>
              </div>
              <div className={styles.lineItem}>
                <dt>{checkout.summaryLabels.serviceFee(serviceFeePct)}</dt>
                <dd>{formatUah(availability.service_fee)}</dd>
              </div>
              {donationPct > 0 && (
                <div className={styles.lineItem}>
                  <dt>
                    <span>{checkout.summaryLabels.donation(donationPct)}</span>
                    <LeafIcon className={styles.lineItemIcon} size={13} />
                  </dt>
                  <dd>{formatUah(donationAmount)}</dd>
                </div>
              )}
            </dl>

            <div className={styles.totalBlock}>
              <div className={styles.total}>
                <span>{checkout.summaryLabels.total}</span>
                <span>{formatUah(displayTotal)}</span>
              </div>
              <p className={styles.vatNote}>
                <span>{checkout.summaryLabels.vatNoteLabel}</span>
                <span>{formatUah(vatAmount)}</span>
              </p>
            </div>

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
              disabled={isViewMode || !availability.available || isPaying}
            >
              <LockIcon className={styles.payBtnIcon} size={18} filled />
              <span>
                {isPaying
                  ? checkout.loading
                  : checkout.summaryLabels.payButton(formatUah(displayTotal))}
              </span>
            </button>
          </section>

          <section className={styles.infoCard}>
            <ShieldIcon className={styles.infoCardIcon} size={28} />
            <div>
              <h3>{checkout.support.cancellationTitle}</h3>
              <p>{checkout.support.cancellation}</p>
            </div>
          </section>

          <section className={styles.infoCard}>
            <HeadsetIcon className={styles.infoCardIcon} size={28} />
            <div>
              <h3>{checkout.support.helpTitle}</h3>
              <p>{checkout.support.help}</p>
              <a href={`mailto:${checkout.support.email}`}>
                {checkout.support.email}
              </a>
            </div>
          </section>

          <section className={styles.infoCard}>
            <CapacityIcon
              className={`${styles.infoCardIcon} ${styles.propertyDetailIcon} ${styles.propertyDetailIconCapacity}`}
              size={28}
            />
            <div>
              <h3>
                {productPage.host.hostedBy(
                  formatHostFirstName(homestead.host.name),
                )}
              </h3>
              <p>
                {productPage.host.role}{' '}
                <span className={styles.metaDivider} aria-hidden>
                  ·
                </span>{' '}
                Response {productPage.host.responseTime.highlight}
              </p>
              <a href={`mailto:${hostEmail}`} className={styles.hostContact}>
                <HostDetailIcon className={styles.hostDetailIcon} />
                <span>{productPage.host.contactHost(hostEmail)}</span>
              </a>
            </div>
          </section>
        </aside>
      </div>
    </article>
  );
}
