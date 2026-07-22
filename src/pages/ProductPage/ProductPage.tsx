import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronIcon,
  EveIcon,
  GalleryThumbsArrowIcon,
  HeartIcon,
  HostDetailIcon,
  LeafIcon,
  LocationMetaIcon,
  LocationPinIcon,
  PriceTagIcon,
  PropertyDetailIcon,
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
import { checkAvailability } from '@/api/homesteads';
import { getApiErrorMessage } from '@/api/client';
import type { HomesteadDetail } from '@/api/types';
import { addDays, todayIso } from '@/lib/format';
import { compareIsoDates } from '@/lib/calendar';
import { BookingDatePicker } from '@/components/booking/BookingDatePicker/BookingDatePicker';
import { GalleryLightbox } from '@/components/homestead/GalleryLightbox/GalleryLightbox';
import { RecommendationsGrid } from '@/components/homestead/RecommendationsGrid/RecommendationsGrid';
import styles from './ProductPage.module.scss';

const PILLAR_ICON_COLORS = ['#ffc101', '#f62a24', '#1c63bc'] as const;

function formatReviewCategory(category: string) {
  return category.replace(/_/g, ' ');
}

function getMobileThumbWindowStart(activeIndex: number, total: number): number {
  if (total <= 4) {
    return 0;
  }

  // Images 1–2: show thumbs 1–4. From image 3 on: slide window to show 2–5, then shift.
  if (activeIndex < 2) {
    return 0;
  }

  return Math.min(activeIndex - 1, total - 4);
}

function isMobileThumbVisible(
  index: number,
  activeIndex: number,
  total: number,
): boolean {
  if (total <= 4) {
    return true;
  }

  const start = getMobileThumbWindowStart(activeIndex, total);
  return index >= start && index < start + 4;
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

function PropertyDetailsList({
  homestead,
  tabletOrder = false,
}: {
  homestead: HomesteadDetail;
  tabletOrder?: boolean;
}) {
  const details = [
    {
      key: 'location',
      icon: (
        <LocationMetaIcon className={styles.propertyDetailIcon} size={18} />
      ),
      label: productPage.propertyDetails.location,
      value: `${homestead.region}, Ukraine`,
    },
    {
      key: 'house',
      icon: (
        <PropertyDetailIcon
          type="house"
          className={styles.propertyDetailIcon}
        />
      ),
      label: productPage.propertyDetails.houseType,
      value: productPage.propertyDetails.houseTypeValue,
    },
    {
      key: 'capacity',
      icon: (
        <PropertyDetailIcon
          type="capacity"
          className={styles.propertyDetailIcon}
        />
      ),
      label: productPage.propertyDetails.capacity,
      value: productPage.propertyDetails.capacityValue(
        homestead.pricing.max_guests,
      ),
    },
    {
      key: 'rooms',
      icon: (
        <PropertyDetailIcon type="bed" className={styles.propertyDetailIcon} />
      ),
      label: productPage.propertyDetails.rooms,
      value: productPage.propertyDetails.roomsValue(
        homestead.bedrooms,
        homestead.beds,
        homestead.bathrooms,
      ),
    },
    {
      key: 'cancellation',
      icon: (
        <PropertyDetailIcon
          type="shield"
          className={styles.propertyDetailIcon}
        />
      ),
      label: productPage.propertyDetails.cancellation,
      value: productPage.propertyDetails.cancellationValue,
    },
  ];
  const orderedDetails = tabletOrder
    ? [details[0], details[1], details[4], details[3], details[2]]
    : details;

  return (
    <ul className={styles.propertyDetails} aria-label="Property details">
      {orderedDetails.map((detail) => (
        <li key={detail.key} className={styles.propertyDetailItem}>
          {detail.icon}
          <div className={styles.propertyDetailContent}>
            <p className={styles.propertyDetailLabel}>{detail.label}</p>
            <p className={styles.propertyDetailValue}>{detail.value}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function HostCard({
  homestead,
  headingId,
  className = '',
}: {
  homestead: HomesteadDetail;
  headingId: string;
  className?: string;
}) {
  const hostFirstName = formatHostFirstName(homestead.host.name);

  return (
    <section
      className={`${styles.hostCard} ${className}`.trim()}
      aria-labelledby={headingId}
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
          <h3 id={headingId} className={styles.hostName}>
            {productPage.host.hostedBy(hostFirstName)}
          </h3>
          <p className={styles.hostRole}>{productPage.host.role}</p>
        </div>
      </div>

      <ul className={styles.hostDetails}>
        <li className={styles.hostDetailItem}>
          <HostDetailIcon type="bell" className={styles.hostDetailIcon} />
          <span>
            {productPage.host.responseTime.prefix}{' '}
            <span className={styles.hostDetailHighlight}>
              {productPage.host.responseTime.highlight}
            </span>
          </span>
        </li>
        {homestead.host.languages.length > 0 && (
          <li className={styles.hostDetailItem}>
            <HostDetailIcon type="globe" className={styles.hostDetailIcon} />
            <span className={styles.hostLanguages}>
              {productPage.host.languagesLabel}{' '}
              <strong>
                {formatHostLanguages(homestead.host.languages).join(', ')}
              </strong>
            </span>
          </li>
        )}
        <li className={styles.hostDetailItem}>
          <HostDetailIcon type="message" className={styles.hostDetailIcon} />
          <a
            className={styles.hostContactLink}
            href={`mailto:${productPage.host.contactEmail(hostFirstName)}`}
          >
            {productPage.host.contactHost(
              productPage.host.contactEmail(hostFirstName),
            )}
          </a>
        </li>
      </ul>
    </section>
  );
}

export function ProductPage() {
  const { homesteadId } = useParams<{ homesteadId: string }>();
  const navigate = useNavigate();
  const { homestead, isLoading, error } = useHomesteadDetail(homesteadId);
  const { recommendations } = useHomesteadRecommendations(homestead?.id);
  const { isFavourited, toggleFavourite } = useFavourites();
  const [activePhotoId, setActivePhotoId] = useState<number | null>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const [canScrollThumbsDown, setCanScrollThumbsDown] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{
    type: 'error' | 'unavailable';
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'amenities' | 'reviews'>(
    'about',
  );
  const [showAllTabletReviews, setShowAllTabletReviews] = useState(false);
  const [isGalleryLightboxOpen, setIsGalleryLightboxOpen] = useState(false);

  useEffect(() => {
    setShowAllTabletReviews(false);
    setIsGalleryLightboxOpen(false);

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

  const touchStartXRef = useRef<number | null>(null);

  const handleMainTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
    },
    [],
  );

  const handleMainTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const startX = touchStartXRef.current;

      if (startX === null) {
        return;
      }

      const endX = event.changedTouches[0]?.clientX ?? startX;
      const deltaX = endX - startX;
      touchStartXRef.current = null;

      if (Math.abs(deltaX) < 40) {
        return;
      }

      if (deltaX < 0) {
        if (activePhotoIndex < photos.length - 1) {
          showPhotoAtIndex(activePhotoIndex + 1);
        }
        return;
      }

      if (activePhotoIndex > 0) {
        showPhotoAtIndex(activePhotoIndex - 1);
      }
    },
    [activePhotoIndex, photos.length, showPhotoAtIndex],
  );

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

  useEffect(() => {
    setBookingMessage(null);
  }, [checkIn, checkOut, guests]);

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

  const handleBookingSubmit = useCallback(async () => {
    if (!homestead) {
      return;
    }

    setBookingMessage(null);

    if (!checkIn || !checkOut) {
      setBookingMessage({
        type: 'error',
        text: productPage.booking.selectDates,
      });
      return;
    }

    if (compareIsoDates(checkOut, checkIn) <= 0) {
      setBookingMessage({
        type: 'error',
        text: productPage.booking.invalidDates,
      });
      return;
    }

    if (guests < minGuests || guests > maxGuests) {
      setBookingMessage({
        type: 'error',
        text: productPage.booking.invalidGuests(maxGuests),
      });
      return;
    }

    setIsCheckingAvailability(true);

    try {
      const availability = await checkAvailability(homestead.id, {
        check_in: checkIn,
        check_out: checkOut,
        guests,
      });

      if (availability.available) {
        const params = new URLSearchParams({
          homesteadId: String(homestead.id),
          checkIn,
          checkOut,
          guests: String(guests),
        });
        navigate(`${paths.checkout}?${params.toString()}`);
        return;
      }

      setBookingMessage({
        type: 'unavailable',
        text: productPage.booking.datesUnavailable,
      });
    } catch (requestError) {
      setBookingMessage({
        type: 'error',
        text: getApiErrorMessage(requestError, productPage.booking.checkFailed),
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [checkIn, checkOut, guests, homestead, maxGuests, minGuests, navigate]);

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
                  {photos.map((photo, index) => (
                    <li
                      key={photo.id}
                      data-photo-id={photo.id}
                      className={
                        !isMobileThumbVisible(
                          index,
                          activePhotoIndex,
                          photos.length,
                        )
                          ? styles.galleryThumbHiddenMobile
                          : undefined
                      }
                    >
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

            <div
              className={styles.galleryMainSlider}
              onTouchStart={handleMainTouchStart}
              onTouchEnd={handleMainTouchEnd}
            >
              {photos.length > 1 && (
                <>
                  {activePhotoIndex > 0 && (
                    <button
                      type="button"
                      className={`${styles.galleryThumbsArrow} ${styles.galleryMainArrow} ${styles.galleryMainArrowPrev}`}
                      onClick={showPreviousPhoto}
                      aria-label="Previous photo"
                    >
                      <ChevronIcon direction="left" size={18} />
                    </button>
                  )}
                  {activePhotoIndex < photos.length - 1 && (
                    <button
                      type="button"
                      className={`${styles.galleryThumbsArrow} ${styles.galleryMainArrow} ${styles.galleryMainArrowNext}`}
                      onClick={showNextPhoto}
                      aria-label="Next photo"
                    >
                      <ChevronIcon direction="right" size={18} />
                    </button>
                  )}
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
                  <button
                    type="button"
                    className={styles.galleryMainOpenBtn}
                    onClick={() => setIsGalleryLightboxOpen(true)}
                    aria-label={productPage.gallery.openPhoto}
                  >
                    <img
                      className={styles.galleryMain}
                      src={activePhoto.url}
                      alt={homestead.name}
                    />
                  </button>
                ) : (
                  <div
                    className={styles.galleryPlaceholder}
                    role="img"
                    aria-label={homestead.name}
                  />
                )}
              </div>
            </div>

            <GalleryLightbox
              photos={photos}
              activeIndex={activePhotoIndex}
              alt={homestead.name}
              isOpen={isGalleryLightboxOpen}
              onClose={() => setIsGalleryLightboxOpen(false)}
              onSelectIndex={showPhotoAtIndex}
            />

            {homestead.featured_amenities.length > 0 && (
              <ul
                className={`${styles.badges} ${styles.galleryBadges}`}
                aria-label="Property highlights"
              >
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
                  {homestead.rating.toFixed(2)}
                </data>
                <span className={styles.ratingCount}>
                  ({homestead.review_count} {productPage.reviewsLabel})
                </span>
              </p>
              <p className={styles.description}>
                {homestead.short_description || homestead.description}
              </p>
            </header>

            <div className={styles.bookingPanel}>
              <div className={styles.bookingCard}>
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
                      popupAlign="end"
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
                    <select
                      className={styles.guestSelect}
                      value={guests}
                      aria-label={productPage.booking.guests}
                      onChange={(event) =>
                        setGuests(Number.parseInt(event.target.value, 10))
                      }
                    >
                      {Array.from({ length: maxGuests }, (_, index) => {
                        const count = index + 1;

                        return (
                          <option key={count} value={count}>
                            {productPage.booking.guestsValue(count)}
                          </option>
                        );
                      })}
                    </select>
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
              </div>

              <div className={styles.bookingActions}>
                <button
                  type="button"
                  className={styles.bookingBtn}
                  onClick={() => void handleBookingSubmit()}
                  disabled={isCheckingAvailability}
                >
                  {isCheckingAvailability
                    ? productPage.booking.checking
                    : productPage.booking.checkAvailability}
                </button>
                {bookingMessage && (
                  <p
                    className={
                      bookingMessage.type === 'unavailable'
                        ? styles.bookingMessageWarning
                        : styles.bookingMessageError
                    }
                    role="alert"
                  >
                    {bookingMessage.text}
                  </p>
                )}
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
              </div>
            </div>

            {homestead.featured_amenities.length > 0 && (
              <ul
                className={`${styles.badges} ${styles.mobileHighlights}`}
                aria-label="Property highlights"
              >
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
          </aside>

          <aside
            className={`${styles.specSidebar} ${styles.specSidebarDesktop}`}
          >
            <PropertyDetailsList homestead={homestead} />
            <HostCard
              homestead={homestead}
              headingId="host-card-title-desktop"
            />
          </aside>
        </div>

        <div className={styles.content}>
          <div className={styles.contentDesktop}>
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

            <aside
              className={`${styles.specSidebar} ${styles.specSidebarTablet}`}
            >
              <PropertyDetailsList homestead={homestead} tabletOrder />
            </aside>

            <div className={styles.reviewsHostRow}>
              {homestead.reviews.length > 0 && (
                <section
                  className={styles.reviewsSection}
                  aria-labelledby="reviews-title"
                >
                  <SectionHeading id="reviews-title">
                    {productPage.reviewsTitle}
                  </SectionHeading>
                  <ul
                    className={`${styles.reviews}${
                      showAllTabletReviews ? ` ${styles.reviewsExpanded}` : ''
                    }`}
                  >
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
                  {homestead.reviews.length > 3 && !showAllTabletReviews && (
                    <button
                      type="button"
                      className={styles.reviewsViewAll}
                      onClick={() => setShowAllTabletReviews(true)}
                    >
                      {productPage.reviewsViewAll}
                    </button>
                  )}
                </section>
              )}

              <HostCard
                homestead={homestead}
                headingId="host-card-title-tablet"
                className={styles.hostCardTablet}
              />
            </div>
          </div>

          <div className={styles.contentMobile}>
            <div
              className={styles.contentTabs}
              role="tablist"
              aria-label="Homestead details"
            >
              <button
                type="button"
                role="tab"
                id="tab-about"
                aria-selected={activeTab === 'about'}
                aria-controls="panel-about"
                className={`${styles.contentTab}${
                  activeTab === 'about' ? ` ${styles.contentTabActive}` : ''
                }`}
                onClick={() => setActiveTab('about')}
              >
                {productPage.tabs.about}
              </button>
              <button
                type="button"
                role="tab"
                id="tab-amenities"
                aria-selected={activeTab === 'amenities'}
                aria-controls="panel-amenities"
                className={`${styles.contentTab}${
                  activeTab === 'amenities' ? ` ${styles.contentTabActive}` : ''
                }`}
                onClick={() => setActiveTab('amenities')}
              >
                {productPage.tabs.amenities}
              </button>
              <button
                type="button"
                role="tab"
                id="tab-reviews"
                aria-selected={activeTab === 'reviews'}
                aria-controls="panel-reviews"
                className={`${styles.contentTab}${
                  activeTab === 'reviews' ? ` ${styles.contentTabActive}` : ''
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                {productPage.tabs.reviews}
              </button>
            </div>

            <section
              id="panel-about"
              role="tabpanel"
              aria-labelledby="tab-about"
              className={`${styles.contentSection}${
                activeTab === 'about' ? ` ${styles.contentSectionActive}` : ''
              }`}
            >
              <SectionHeading id="about-title-mobile">
                {productPage.aboutTitle}
              </SectionHeading>
              <p className={styles.aboutText}>{homestead.description}</p>
            </section>

            <section
              id="panel-amenities"
              role="tabpanel"
              aria-labelledby="tab-amenities"
              className={`${styles.contentSection}${
                activeTab === 'amenities'
                  ? ` ${styles.contentSectionActive}`
                  : ''
              }`}
            >
              <SectionHeading id="amenities-title-mobile">
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

            <section
              id="panel-reviews"
              role="tabpanel"
              aria-labelledby="tab-reviews"
              className={`${styles.contentSection}${
                activeTab === 'reviews' ? ` ${styles.contentSectionActive}` : ''
              }`}
            >
              <SectionHeading id="reviews-title-mobile">
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
          </div>
        </div>
      </div>

      <RecommendationsGrid
        title={productPage.recommendationsTitle}
        recommendations={recommendations}
      />
    </article>
  );
}
