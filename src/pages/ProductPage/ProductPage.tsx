import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  EveIcon,
  HeartIcon,
  LeafIcon,
  LocationMetaIcon,
  LocationPinIcon,
  PriceTagIcon,
  RatingFilledStarIcon,
  RatingStarIcon,
  SpoonIcon,
} from '@/components/icons';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { productPage } from '@/content/designContent';
import { useFavourites } from '@/features/favourites/useFavourites';
import { useHomesteadDetail } from '@/features/homesteads/useHomesteadDetail';
import { useHomesteadRecommendations } from '@/features/homesteads/useHomesteadRecommendations';
import { paths } from '@/app/paths';
import { addDays, todayIso } from '@/lib/format';
import { compareIsoDates } from '@/lib/calendar';
import { BookingDatePicker } from '@/components/booking/BookingDatePicker/BookingDatePicker';
import { publicAsset } from '@/lib/assets';
import { RecommendationsGrid } from '@/components/homestead/RecommendationsGrid/RecommendationsGrid';
import styles from './ProductPage.module.scss';

const PILLAR_ICON_COLORS = ['#ffc101', '#f62a24', '#1c63bc'] as const;

function GalleryThumbsArrowIcon({
  direction = 'down',
}: {
  direction?: 'down' | 'left' | 'right';
}) {
  const rotation = direction === 'left' ? 90 : direction === 'right' ? -90 : 0;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      aria-hidden
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M8 3.25v6.25M5.25 9.5 8 12.25 10.75 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatReviewCategory(category: string) {
  return category.replace(/_/g, ' ');
}

const REVIEW_THEME_ICON_COLOR = '#a1600a';

type ReviewThemeIconProps = {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
};

const REVIEW_THEME_ICONS: Array<(props: ReviewThemeIconProps) => ReactNode> = [
  (props) => <LogoIcon {...props} fill={REVIEW_THEME_ICON_COLOR} size={10} />,
  (props) => <LocationPinIcon {...props} />,
  (props) => <LocationMetaIcon {...props} />,
  (props) => <HeartIcon {...props} />,
  (props) => <LeafIcon {...props} />,
  (props) => <SpoonIcon {...props} />,
  (props) => <EveIcon {...props} />,
  (props) => <PriceTagIcon {...props} />,
  (props) => <RatingStarIcon {...props} />,
];

function ReviewThemeIcon({ reviewId }: { reviewId: number }) {
  const iconProps: ReviewThemeIconProps = {
    className: styles.reviewThemeIcon,
    size: 14,
    'aria-hidden': true,
  };

  const Icon = REVIEW_THEME_ICONS[reviewId % REVIEW_THEME_ICONS.length];
  return Icon(iconProps);
}

function formatHostFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

function formatHostLanguages(codes: string[]) {
  return codes.map(
    (code) => productPage.host.languageLabels[code] ?? code.toUpperCase(),
  );
}

function HostDetailIcon({ type }: { type: 'bell' | 'globe' | 'message' }) {
  const iconProps = {
    className: styles.hostDetailIcon,
    viewBox: '0 0 16 16',
    width: 16,
    height: 16,
    'aria-hidden': true as const,
  };

  if (type === 'bell') {
    return (
      <img
        className={styles.hostDetailIcon}
        src={publicAsset('assets/icons/notification-bell-svgrepo-com.svg')}
        width={16}
        height={16}
        alt=""
        aria-hidden
      />
    );
  }

  if (type === 'globe') {
    return (
      <svg {...iconProps}>
        <circle
          cx="8"
          cy="8"
          r="5.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M2.25 8h11.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M8 2.25v11.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M8 2.25Q5.15 8 8 13.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M8 2.25Q10.85 8 8 13.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M4.35 4.35Q8 3.05 11.65 4.35"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M4.35 11.65Q8 12.95 11.65 11.65"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
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

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className={styles.sectionHeading}>
      <LogoIcon
        className={styles.sectionOrnamentIcon}
        fill="#b79c73"
        size={14}
        aria-hidden
      />
      <h2 id={id} className={styles.sectionTitle}>
        {children}
      </h2>
      <span className={styles.sectionOrnamentLine} aria-hidden />
    </div>
  );
}

function PropertyDetailIcon({
  type,
}: {
  type: 'house' | 'capacity' | 'bed' | 'shield';
}) {
  const iconProps = {
    className: styles.propertyDetailIcon,
    viewBox: '0 0 16 16',
    width: 18,
    height: 18,
    'aria-hidden': true as const,
  };

  const strokeProps = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (type === 'capacity') {
    const capacityStrokeProps = {
      ...strokeProps,
      strokeWidth: 0.8,
    };

    return (
      <svg
        {...iconProps}
        className={`${styles.propertyDetailIcon} ${styles.propertyDetailIconCapacity}`}
        width={22}
        height={22}
      >
        <circle cx="10.35" cy="5.35" r="1.05" {...capacityStrokeProps} />
        <path
          d="M8.6 9.85v-.45c0-.95.82-1.72 1.85-1.72s1.85.77 1.85 1.72v.45"
          {...capacityStrokeProps}
        />
        <path d="M8.15 10.3h4.3" {...capacityStrokeProps} />
        <circle cx="5.65" cy="5.65" r="1.4" {...capacityStrokeProps} />
        <path
          d="M2.75 10.75v-.75c0-1.45 1.46-2.625 3.25-2.625s3.25 1.175 3.25 2.625v.75"
          {...capacityStrokeProps}
        />
        <path d="M2.75 11.5h6.5" {...capacityStrokeProps} />
      </svg>
    );
  }

  if (type === 'bed') {
    return (
      <svg {...iconProps}>
        <path
          d="M4.1 2.75h7.8q.85 0 .85.85v1.9H3.25V3.6q0-.85.85-.85Z"
          {...strokeProps}
        />
        <rect
          x="3"
          y="6.1"
          width="3.85"
          height="1.35"
          rx="0.4"
          {...strokeProps}
        />
        <rect
          x="9.15"
          y="6.1"
          width="3.85"
          height="1.35"
          rx="0.4"
          {...strokeProps}
        />
        <rect
          x="2.85"
          y="7.85"
          width="10.3"
          height="2.7"
          rx="0.55"
          {...strokeProps}
        />
        <path
          d="M2.35 10.9h11.3M2.85 10.9v1.2M13.15 10.9v1.2"
          {...strokeProps}
        />
      </svg>
    );
  }

  if (type === 'shield') {
    return (
      <svg {...iconProps}>
        <path
          d="M8 1.75 12.75 3.5V7.5c0 2.45-1.95 4.74-4.75 5.5-2.8-.76-4.75-3.05-4.75-5.5V3.5L8 1.75Z"
          {...strokeProps}
        />
        <path d="M5.45 7.55 7.2 9.3 11.55 4.85" {...strokeProps} />
      </svg>
    );
  }

  const paths: Record<
    Exclude<typeof type, 'capacity' | 'bed' | 'shield'>,
    string
  > = {
    house:
      'M2.5 5.75 8 1.75l5.5 4V13a.75.75 0 0 1-.75.75H3.25A.75.75 0 0 1 2.5 13V5.75Zm2 1.25v5.5h3.5v-5.5',
  };

  return (
    <svg {...iconProps}>
      <path d={paths[type]} {...strokeProps} />
    </svg>
  );
}

export function ProductPage() {
  const { homesteadId } = useParams<{ homesteadId: string }>();
  const { homestead, isLoading, error } = useHomesteadDetail(homesteadId);
  const { recommendations } = useHomesteadRecommendations(homestead?.id);
  const { isFavourited, toggleFavourite } = useFavourites();
  const [activePhotoId, setActivePhotoId] = useState<number | null>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const [canScrollThumbsDown, setCanScrollThumbsDown] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [homesteadId]);

  const updateThumbsScrollState = useCallback(() => {
    const list = thumbsRef.current;

    if (!list) {
      setCanScrollThumbsDown(false);
      return;
    }

    setCanScrollThumbsDown(
      list.scrollTop + list.clientHeight < list.scrollHeight - 1,
    );
  }, []);

  const scrollThumbsDown = () => {
    const list = thumbsRef.current;

    if (!list) {
      return;
    }

    const firstItem = list.querySelector('li');
    const gapValue = Number.parseFloat(getComputedStyle(list).gap) || 0;
    const step = (firstItem?.getBoundingClientRect().height ?? 0) + gapValue;

    list.scrollBy({ top: step, behavior: 'smooth' });
    window.setTimeout(updateThumbsScrollState, 300);
  };

  const photos = useMemo(() => {
    if (!homestead?.photos.length) {
      return [];
    }

    return [...homestead.photos].sort((a, b) => a.sort_order - b.sort_order);
  }, [homestead]);

  const activePhoto = useMemo(() => {
    if (!photos.length) {
      return null;
    }

    if (activePhotoId !== null) {
      return photos.find((photo) => photo.id === activePhotoId) ?? photos[0];
    }

    return photos.find((photo) => photo.is_main) ?? photos[0];
  }, [activePhotoId, photos]);

  const activePhotoIndex = useMemo(() => {
    if (!activePhoto) {
      return 0;
    }

    const index = photos.findIndex((photo) => photo.id === activePhoto.id);
    return index >= 0 ? index : 0;
  }, [activePhoto, photos]);

  const scrollThumbIntoView = useCallback((photoId: number) => {
    const list = thumbsRef.current;

    if (!list) {
      return;
    }

    const thumb = list.querySelector<HTMLElement>(
      `[data-photo-id="${photoId}"]`,
    );
    thumb?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);

  const showPhotoAtIndex = useCallback(
    (index: number) => {
      const photo = photos[index];

      if (!photo) {
        return;
      }

      setActivePhotoId(photo.id);
      scrollThumbIntoView(photo.id);
    },
    [photos, scrollThumbIntoView],
  );

  const showPreviousPhoto = () => {
    if (activePhotoIndex > 0) {
      showPhotoAtIndex(activePhotoIndex - 1);
    }
  };

  const showNextPhoto = () => {
    if (activePhotoIndex < photos.length - 1) {
      showPhotoAtIndex(activePhotoIndex + 1);
    }
  };

  useEffect(() => {
    updateThumbsScrollState();
  }, [photos.length, updateThumbsScrollState]);

  useEffect(() => {
    if (!homestead) {
      return;
    }

    setCheckIn('');
    setCheckOut('');
    setGuests(
      Math.min(homestead.pricing.base_guests, homestead.pricing.max_guests),
    );
  }, [
    homestead?.id,
    homestead?.pricing.base_guests,
    homestead?.pricing.max_guests,
  ]);

  const minGuests = 1;
  const maxGuests = homestead?.pricing.max_guests ?? minGuests;

  const decreaseGuests = () => {
    setGuests((current) => Math.max(minGuests, current - 1));
  };

  const increaseGuests = () => {
    setGuests((current) => Math.min(maxGuests, current + 1));
  };

  const handleCheckInChange = useCallback((value: string) => {
    setCheckIn(value);

    if (!value) {
      setCheckOut('');
      return;
    }

    setCheckOut(addDays(value, 1));
  }, []);

  const handleCheckOutChange = useCallback(
    (value: string) => {
      if (!value) {
        setCheckOut('');
        return;
      }

      if (checkIn && compareIsoDates(value, checkIn) > 0) {
        setCheckOut(value);
      }
    },
    [checkIn],
  );

  const checkoutUrl = useMemo(() => {
    if (!homestead || !checkIn || !checkOut) {
      return paths.checkout;
    }

    const params = new URLSearchParams({
      homesteadId: String(homestead.id),
      checkIn,
      checkOut,
      guests: String(guests),
    });
    return `${paths.checkout}?${params.toString()}`;
  }, [checkIn, checkOut, guests, homestead]);

  if (isLoading) {
    return (
      <section className={`${styles.page} ${styles.pageStatusCenter}`}>
        <p className={styles.status}>{productPage.loading}</p>
      </section>
    );
  }

  if (error || !homestead) {
    return (
      <section className={styles.page} aria-labelledby="not-found-title">
        <div className={styles.notFound}>
          <h1 id="not-found-title" className={styles.notFoundTitle}>
            {productPage.notFound.title}
          </h1>
          {error && (
            <p
              className={`${styles.status} ${styles.statusError}`}
              role="alert"
            >
              {error}
            </p>
          )}
          <Link to={paths.home} className={styles.backLink}>
            {productPage.notFound.back}
          </Link>
        </div>
      </section>
    );
  }

  const favourited = isFavourited(homestead.id);

  return (
    <article className={styles.page} aria-labelledby="homestead-title">
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li className={styles.breadcrumbItem}>
            <Link to={paths.home}>{productPage.breadcrumbs.home}</Link>
          </li>
          <li className={styles.breadcrumbItem}>
            <Link to={`${paths.home}#archive`}>
              {productPage.breadcrumbs.archive}
            </Link>
          </li>
          <li className={styles.breadcrumbItem}>
            <span aria-current="page">{homestead.name}</span>
          </li>
        </ol>
      </nav>

      <div className={styles.layout}>
        <figure className={styles.gallery}>
          <div
            className={[
              styles.galleryMedia,
              photos.length > 1 && styles.galleryMediaMulti,
              photos.length > 4 && styles.galleryMediaHasThumbArrow,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {photos.length > 1 && (
              <div className={styles.galleryThumbsWrap}>
                <ul
                  ref={thumbsRef}
                  className={styles.galleryThumbs}
                  aria-label="Photo gallery"
                  onScroll={updateThumbsScrollState}
                >
                  {photos.map((photo) => (
                    <li key={photo.id} data-photo-id={photo.id}>
                      <button
                        type="button"
                        className={`${styles.galleryThumb}${
                          activePhoto?.id === photo.id
                            ? ` ${styles.galleryThumbActive}`
                            : ''
                        }`}
                        onClick={() => setActivePhotoId(photo.id)}
                        aria-label={`View photo ${photo.sort_order + 1}`}
                        aria-pressed={activePhoto?.id === photo.id}
                      >
                        <img src={photo.url} alt="" loading="lazy" />
                      </button>
                    </li>
                  ))}
                </ul>

                {photos.length > 4 && (
                  <button
                    type="button"
                    className={styles.galleryThumbsArrow}
                    onClick={scrollThumbsDown}
                    disabled={!canScrollThumbsDown}
                    aria-label="Scroll gallery thumbnails down"
                  >
                    <GalleryThumbsArrowIcon />
                  </button>
                )}
              </div>
            )}

            <div className={styles.galleryMainSlider}>
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.galleryThumbsArrow} ${styles.galleryMainArrow} ${styles.galleryMainArrowPrev}`}
                    onClick={showPreviousPhoto}
                    disabled={activePhotoIndex <= 0}
                    aria-label="Previous photo"
                  >
                    <GalleryThumbsArrowIcon direction="left" />
                  </button>
                  <button
                    type="button"
                    className={`${styles.galleryThumbsArrow} ${styles.galleryMainArrow} ${styles.galleryMainArrowNext}`}
                    onClick={showNextPhoto}
                    disabled={activePhotoIndex >= photos.length - 1}
                    aria-label="Next photo"
                  >
                    <GalleryThumbsArrowIcon direction="right" />
                  </button>
                </>
              )}

              <button
                type="button"
                className={`${styles.galleryFavoriteBtn}${
                  favourited ? ` ${styles.galleryFavoriteBtnActive}` : ''
                }`}
                aria-label={
                  favourited ? 'Remove from favourites' : 'Add to favourites'
                }
                aria-pressed={favourited}
                onClick={() => void toggleFavourite(homestead.id)}
              >
                <HeartIcon
                  filled={favourited}
                  className={styles.galleryFavoriteIcon}
                />
              </button>

              <div className={styles.galleryMainWrap}>
                {activePhoto ? (
                  <img
                    className={styles.galleryMain}
                    src={activePhoto.url}
                    alt={homestead.name}
                  />
                ) : (
                  <div
                    className={styles.galleryPlaceholder}
                    role="img"
                    aria-label={homestead.name}
                  />
                )}
              </div>
            </div>

            {homestead.featured_amenities.length > 0 && (
              <ul className={styles.badges} aria-label="Property highlights">
                {homestead.featured_amenities.map((amenity, index) => (
                  <li key={amenity.id} className={styles.badge}>
                    <LogoIcon
                      className={styles.pillarIcon}
                      fill={
                        PILLAR_ICON_COLORS[index % PILLAR_ICON_COLORS.length]
                      }
                      size={18}
                    />
                    <span>{amenity.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </figure>

        <div className={styles.sidebarColumn}>
          <aside className={styles.sidebar} aria-label="Booking details">
            <header className={styles.sidebarHeader}>
              <p className={styles.location}>
                <LocationMetaIcon className={styles.locationIcon} />
                {homestead.location} · {homestead.region}
              </p>
              <h1 id="homestead-title" className={styles.title}>
                {homestead.name}
              </h1>
              <p className={styles.rating}>
                <RatingFilledStarIcon
                  rating={homestead.rating}
                  className={styles.ratingStar}
                />
                <data className={styles.ratingValue} value={homestead.rating}>
                  {homestead.rating.toFixed(1)}
                </data>
                <span className={styles.ratingCount}>
                  ({homestead.review_count} {productPage.reviewsLabel})
                </span>
              </p>
              <p className={styles.description}>
                {homestead.short_description || homestead.description}
              </p>
            </header>

            <div className={styles.pricing}>
              <p className={styles.price}>
                <data value={homestead.pricing.price_per_night}>
                  {homestead.pricing.price_per_night}
                </data>
                <span className={styles.priceNote}>
                  {' '}
                  {productPage.priceSuffix}
                </span>
              </p>
              <p className={styles.priceDetail}>
                {productPage.priceNote(homestead.pricing.base_guests)}
              </p>
            </div>

            <form
              className={styles.bookingForm}
              aria-label="Check availability"
            >
              <div className={styles.bookingFields}>
                <div className={styles.bookingDates}>
                  <BookingDatePicker
                    label={productPage.booking.checkIn}
                    value={checkIn}
                    min={todayIso()}
                    placeholder={productPage.booking.addDate}
                    onChange={handleCheckInChange}
                  />
                  <BookingDatePicker
                    label={productPage.booking.checkOut}
                    value={checkOut}
                    min={checkIn ? addDays(checkIn, 1) : todayIso()}
                    placeholder={productPage.booking.addDate}
                    disabled={!checkIn}
                    onChange={handleCheckOutChange}
                  />
                </div>

                <div
                  className={styles.bookingFieldGuests}
                  role="group"
                  aria-label={productPage.booking.guests}
                >
                  <span className={styles.bookingFieldGuestsLabel}>
                    {productPage.booking.guests}
                  </span>
                  <div className={styles.guestStepper}>
                    <button
                      type="button"
                      className={styles.guestStepperBtn}
                      onClick={decreaseGuests}
                      disabled={guests <= minGuests}
                      aria-label={productPage.booking.decreaseGuests}
                    >
                      −
                    </button>
                    <span
                      className={styles.guestStepperValue}
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {guests}
                    </span>
                    <button
                      type="button"
                      className={styles.guestStepperBtn}
                      onClick={increaseGuests}
                      disabled={guests >= maxGuests}
                      aria-label={productPage.booking.increaseGuests}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <Link to={checkoutUrl} className={styles.bookingBtn}>
                {productPage.booking.checkAvailability}
              </Link>
              <button
                type="button"
                className={`${styles.favoriteBtn}${
                  favourited ? ` ${styles.favoriteBtnActive}` : ''
                }`}
                onClick={() => void toggleFavourite(homestead.id)}
              >
                <HeartIcon
                  filled={favourited}
                  className={styles.favoriteBtnIcon}
                />
                {favourited
                  ? productPage.booking.removeFromFavorites
                  : productPage.booking.addToFavorites}
              </button>
            </form>
          </aside>

          <div className={styles.specSidebar}>
            <section
              className={styles.hostCard}
              aria-labelledby="host-card-title"
            >
              <div className={styles.hostHeader}>
                {homestead.host.photo_url ? (
                  <img
                    className={styles.hostAvatar}
                    src={homestead.host.photo_url}
                    alt=""
                  />
                ) : (
                  <div className={styles.hostAvatarPlaceholder} aria-hidden />
                )}
                <div className={styles.hostIntro}>
                  <h3 id="host-card-title" className={styles.hostName}>
                    {productPage.host.hostedBy(
                      formatHostFirstName(homestead.host.name),
                    )}
                  </h3>
                  <p className={styles.hostRole}>{productPage.host.role}</p>
                </div>
              </div>

              <ul className={styles.hostDetails}>
                <li className={styles.hostDetailItem}>
                  <HostDetailIcon type="bell" />
                  <span>
                    {productPage.host.responseTime.prefix}{' '}
                    <span className={styles.hostDetailHighlight}>
                      {productPage.host.responseTime.highlight}
                    </span>
                  </span>
                </li>
                {homestead.host.languages.length > 0 && (
                  <li className={styles.hostDetailItem}>
                    <HostDetailIcon type="globe" />
                    <span className={styles.hostLanguages}>
                      {productPage.host.languagesLabel}{' '}
                      <strong>
                        {formatHostLanguages(homestead.host.languages).join(
                          ', ',
                        )}
                      </strong>
                    </span>
                  </li>
                )}
                <li className={styles.hostDetailItem}>
                  <HostDetailIcon type="message" />
                  <a
                    className={styles.hostContactLink}
                    href={`mailto:${productPage.host.contactEmail(formatHostFirstName(homestead.host.name))}`}
                  >
                    {productPage.host.contactHost(
                      productPage.host.contactEmail(
                        formatHostFirstName(homestead.host.name),
                      ),
                    )}
                  </a>
                </li>
              </ul>
            </section>

            <ul
              className={styles.propertyDetails}
              aria-label="Property details"
            >
              <li className={styles.propertyDetailItem}>
                <LocationMetaIcon
                  className={styles.propertyDetailIcon}
                  size={18}
                />
                <div className={styles.propertyDetailContent}>
                  <p className={styles.propertyDetailLabel}>
                    {productPage.propertyDetails.location}
                  </p>
                  <p className={styles.propertyDetailValue}>
                    {homestead.region}, Ukraine
                  </p>
                </div>
              </li>
              <li className={styles.propertyDetailItem}>
                <PropertyDetailIcon type="house" />
                <div className={styles.propertyDetailContent}>
                  <p className={styles.propertyDetailLabel}>
                    {productPage.propertyDetails.houseType}
                  </p>
                  <p className={styles.propertyDetailValue}>
                    {productPage.propertyDetails.houseTypeValue}
                  </p>
                </div>
              </li>
              <li className={styles.propertyDetailItem}>
                <PropertyDetailIcon type="capacity" />
                <div className={styles.propertyDetailContent}>
                  <p className={styles.propertyDetailLabel}>
                    {productPage.propertyDetails.capacity}
                  </p>
                  <p className={styles.propertyDetailValue}>
                    {productPage.propertyDetails.capacityValue(
                      homestead.pricing.max_guests,
                    )}
                  </p>
                </div>
              </li>
              <li className={styles.propertyDetailItem}>
                <PropertyDetailIcon type="bed" />
                <div className={styles.propertyDetailContent}>
                  <p className={styles.propertyDetailLabel}>
                    {productPage.propertyDetails.rooms}
                  </p>
                  <p className={styles.propertyDetailValue}>
                    {productPage.propertyDetails.roomsValue(
                      homestead.bedrooms,
                      homestead.beds,
                      homestead.bathrooms,
                    )}
                  </p>
                </div>
              </li>
              <li className={styles.propertyDetailItem}>
                <PropertyDetailIcon type="shield" />
                <div className={styles.propertyDetailContent}>
                  <p className={styles.propertyDetailLabel}>
                    {productPage.propertyDetails.cancellation}
                  </p>
                  <p className={styles.propertyDetailValue}>
                    {productPage.propertyDetails.cancellationValue}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <section aria-labelledby="about-title">
            <SectionHeading id="about-title">
              {productPage.aboutTitle}
            </SectionHeading>
            <p className={styles.aboutText}>{homestead.description}</p>
          </section>

          {homestead.amenities.length > 0 && (
            <section aria-labelledby="amenities-title">
              <SectionHeading id="amenities-title">
                {productPage.amenitiesTitle}
              </SectionHeading>
              <ul className={styles.amenities}>
                {homestead.amenities.map((amenity) => (
                  <li key={amenity.id} className={styles.amenity}>
                    <LogoIcon
                      className={styles.amenityOrnamentIcon}
                      fill="#b79c73"
                      size={10}
                      aria-hidden
                    />
                    {amenity.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {homestead.reviews.length > 0 && (
            <section aria-labelledby="reviews-title">
              <SectionHeading id="reviews-title">
                {productPage.reviewsTitle}
              </SectionHeading>
              <ul className={styles.reviews}>
                {homestead.reviews.map((review) => (
                  <li key={review.id}>
                    <blockquote className={styles.review}>
                      <p className={styles.reviewTheme}>
                        <ReviewThemeIcon reviewId={review.id} />
                        {formatReviewCategory(review.category)}
                      </p>
                      <p className={styles.reviewQuote}>{review.text}</p>
                      <footer className={styles.reviewAuthor}>
                        - {review.author_name}, {review.country}
                      </footer>
                    </blockquote>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <RecommendationsGrid
        title={productPage.recommendationsTitle}
        recommendations={recommendations}
      />
    </article>
  );
}
