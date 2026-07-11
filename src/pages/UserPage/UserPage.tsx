import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getDashboard } from '@/api/dashboard';
import { listBookings } from '@/api/bookings';
import type { BookingListItem, PastJourney, UpcomingStay } from '@/api/types';
import { paths } from '@/app/paths';
import {
  BedIcon,
  DetailsArrowIcon,
  HeartIcon,
  LeafIcon,
  LocationPinIcon,
  LogoIcon,
  PersonIcon,
} from '@/components/icons';
import { navigation, userPage } from '@/content/designContent';
import { useAuth } from '@/features/auth/useAuth';
import { useFavourites } from '@/features/favourites/useFavourites';
import { mapApiHomesteadToCard } from '@/features/homesteads/mapApiHomesteadToCard';
import { formatCompactDateRange, formatUah } from '@/lib/format';
import { publicAsset } from '@/lib/assets';
import styles from './UserPage.module.scss';

const DASHBOARD_HERO_IMAGE = publicAsset('assets/dashboard-hero/hero.png');
const HERO_IMAGE = publicAsset('assets/hero/hero_background.jpeg');
const IMPACT_IMAGE = publicAsset(
  'assets/homestead/onishchyna-honchars-house.jpeg',
);
const PAST_EMPTY_IMAGE = publicAsset(
  'assets/homestead/onishchyna-honchars-house.jpeg',
);

function ImpactItemIcon({ type }: { type: 'home' | 'tools' | 'leaf' }) {
  const iconProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 16 16',
    'aria-hidden': true as const,
  };

  const strokeProps = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (type === 'leaf') {
    return <LeafIcon size={18} />;
  }

  if (type === 'tools') {
    return (
      <svg {...iconProps}>
        <path
          d="M10.2 2.4a2.4 2.4 0 0 0-3.4 3.4L2.4 10.2a1.2 1.2 0 0 0 1.7 1.7l4.4-4.4a2.4 2.4 0 0 0 3.4-3.4L10.2 5.8 8.6 4.2Z"
          {...strokeProps}
        />
        <path d="M5.5 10.5 4 13.5" {...strokeProps} />
        <path
          d="M11.1 8.2 13.6 10.7a1.1 1.1 0 0 1 0 1.55L12.7 13.15a1.1 1.1 0 0 1-1.55 0L8.65 10.65"
          {...strokeProps}
        />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path
        d="M2.75 6.75 8 2.75l5.25 4V12.5a.75.75 0 0 1-.75.75H3.5a.75.75 0 0 1-.75-.75V6.75Z"
        {...strokeProps}
      />
    </svg>
  );
}

function SidebarIcon({
  type,
}: {
  type: 'home' | 'calendar' | 'heart' | 'impact';
}) {
  const iconProps = {
    width: 16,
    height: 16,
    viewBox: '0 0 16 16',
    'aria-hidden': true as const,
  };

  switch (type) {
    case 'calendar':
      return (
        <svg {...iconProps}>
          <path
            d="M4.5 2.25v1.25M11.5 2.25v1.25M3.25 5.75h9.5M3.25 4h9.5a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'heart':
      return <HeartIcon className={styles.sidebarLinkIcon} size={16} />;
    case 'impact':
      return <LogoIcon size={14} fill="currentColor" aria-hidden />;
    default:
      return (
        <svg {...iconProps}>
          <path
            d="M2.75 6.75 8 2.75l5.25 4V12.5a.75.75 0 0 1-.75.75H3.5a.75.75 0 0 1-.75-.75V6.75Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function UpcomingMetaIcon({ type }: { type: 'calendar' | 'capacity' }) {
  if (type === 'capacity') {
    const strokeProps = {
      fill: 'none' as const,
      stroke: 'currentColor',
      strokeWidth: 0.8,
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    };

    return (
      <svg
        className={`${styles.upcomingMetaIcon} ${styles.upcomingMetaIconCapacity}`}
        viewBox="0 0 16 16"
        width={22}
        height={22}
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

  return (
    <svg
      className={styles.upcomingMetaIcon}
      width={16}
      height={16}
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path
        d="M4.5 2.25v1.25M11.5 2.25v1.25M3.25 5.75h9.5M3.25 4h9.5a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className={styles.sectionTitle}>
      <LogoIcon
        className={styles.sectionTitleIcon}
        fill="#b79c73"
        size={12}
        aria-hidden
      />
      <h2>{children}</h2>
      <span className={styles.sectionTitleLine} aria-hidden />
    </div>
  );
}

const FAVOURITES_ROW_SLOTS_DESKTOP = 5;
const FAVOURITES_ROW_SLOTS_MOBILE = 2;
const FAVOURITES_LIMIT_DESKTOP = 4;
const FAVOURITES_LIMIT_MOBILE = 1;

function AddFavouriteCardItem() {
  return (
    <li>
      <Link
        to={`${paths.home}#archive`}
        className={styles.addFavouriteCard}
        aria-label={userPage.addFavourite}
      >
        <span className={styles.addFavouritePlus} aria-hidden>
          +
        </span>
        <span className={styles.favouriteHeart} aria-hidden>
          <HeartIcon className={styles.favouriteHeartIcon} size={14} />
        </span>
      </Link>
    </li>
  );
}

export function UserPage() {
  const { isAuthenticated, isInitializing, user, openLoginModal } = useAuth();
  const { favourites } = useFavourites();
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [pastJourneys, setPastJourneys] = useState<PastJourney[]>([]);
  const [upcomingStay, setUpcomingStay] = useState<UpcomingStay | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [totalDonated, setTotalDonated] = useState(0);
  const [totalNights, setTotalNights] = useState(0);
  const [isMobileViewport, setIsMobileViewport] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => {
      mediaQuery.removeEventListener('change', updateViewport);
    };
  }, []);

  useEffect(() => {
    if (isInitializing || !isAuthenticated) {
      setBookings([]);
      return;
    }

    let cancelled = false;

    listBookings()
      .then((data) => {
        if (!cancelled) {
          setBookings(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBookings([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isInitializing]);

  useEffect(() => {
    if (isInitializing || !isAuthenticated) {
      setPastJourneys([]);
      setUpcomingStay(null);
      setTotalDonated(0);
      setTotalNights(0);
      return;
    }

    let cancelled = false;
    setIsLoadingDashboard(true);

    getDashboard()
      .then((data) => {
        if (!cancelled) {
          setPastJourneys(data.past_journeys);
          setUpcomingStay(data.upcoming_stay);
          setTotalDonated(data.stats.total_donated);
          setTotalNights(data.stats.total_nights);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPastJourneys([]);
          setUpcomingStay(null);
          setTotalDonated(0);
          setTotalNights(0);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingDashboard(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isInitializing]);

  const favouriteCards = useMemo(
    () =>
      favourites
        .slice(
          0,
          isMobileViewport ? FAVOURITES_LIMIT_MOBILE : FAVOURITES_LIMIT_DESKTOP,
        )
        .map(mapApiHomesteadToCard),
    [favourites, isMobileViewport],
  );

  const favouritesRowSlots = isMobileViewport
    ? FAVOURITES_ROW_SLOTS_MOBILE
    : FAVOURITES_ROW_SLOTS_DESKTOP;

  const upcomingHomesteadId = useMemo(() => {
    if (!upcomingStay) {
      return null;
    }

    return (
      bookings.find((booking) => booking.id === upcomingStay.booking_id)
        ?.homestead_id ?? null
    );
  }, [bookings, upcomingStay]);

  const stats = useMemo(() => {
    const regions = new Set(bookings.map((booking) => booking.homestead_id))
      .size;

    return {
      nights: totalNights,
      regions: regions || 3,
      donated: totalDonated,
      restored: regions || 3,
    };
  }, [bookings, totalDonated, totalNights]);

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : 'Guest';

  if (!isInitializing && !isAuthenticated) {
    return (
      <section className={styles.page} aria-labelledby="dashboard-login-title">
        <div className={styles.loginPrompt}>
          <PersonIcon className={styles.loginPromptIcon} size={28} />
          <h1 id="dashboard-login-title" className={styles.loginPromptTitle}>
            Dashboard
          </h1>
          <p className={styles.loginPromptText}>{userPage.loginPrompt}</p>
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

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar} aria-label="Account navigation">
        <nav className={styles.sidebarNav}>
          <NavLink
            to={paths.dashboard}
            className={({ isActive }) =>
              isActive
                ? `${styles.sidebarLink} ${styles.sidebarLinkActive}`
                : styles.sidebarLink
            }
            end
          >
            <SidebarIcon type="home" />
            {userPage.nav.dashboard}
          </NavLink>
          <a href="#upcoming-stay" className={styles.sidebarLink}>
            <SidebarIcon type="calendar" />
            {userPage.nav.bookings}
          </a>
          <a href="#favourites" className={styles.sidebarLink}>
            <SidebarIcon type="heart" />
            {userPage.nav.favourites}
          </a>
          <a href="#impact" className={styles.sidebarLink}>
            <SidebarIcon type="impact" />
            {userPage.nav.impact}
          </a>
        </nav>

        <div className={styles.sidebarQuote}>
          <LogoIcon
            className={styles.sidebarQuoteIcon}
            fill="#b79c73"
            size={80}
            aria-hidden
          />
          <p className={styles.sidebarQuoteText}>{userPage.quote}</p>
          <div className={styles.sidebarQuoteDivider} aria-hidden>
            <span className={styles.sidebarQuoteLine} />
            <LogoIcon
              className={styles.sidebarQuoteDividerIcon}
              fill="#b79c73"
              size={18}
            />
            <span className={styles.sidebarQuoteLine} />
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <section className={styles.hero} aria-label="Welcome">
          <img className={styles.heroImage} src={DASHBOARD_HERO_IMAGE} alt="" />
          <div className={styles.heroOverlay}>
            <div className={styles.heroWelcome}>
              <h1 className={styles.heroPanel}>
                {userPage.welcome(displayName)}
              </h1>
              <p className={styles.heroWelcomeSummary}>
                {userPage.exploredSummary(stats.regions, stats.restored)}
              </p>
            </div>

            <div className={`${styles.heroStats} ${styles.heroPanel}`}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatIconSlot} aria-hidden>
                  <BedIcon className={styles.heroStatIcon} size={32} />
                </span>
                <div className={styles.heroStatContent}>
                  <span className={styles.heroStatValue}>{stats.nights}</span>
                  <span className={styles.heroStatLabel}>
                    {userPage.stats.nights}
                  </span>
                </div>
              </div>
              <div className={styles.heroStat}>
                <span
                  className={`${styles.heroStatIconSlot} ${styles.heroStatIconSlotLocation}`}
                  aria-hidden
                >
                  <LocationPinIcon className={styles.heroStatIcon} size={32} />
                </span>
                <div className={styles.heroStatContent}>
                  <span className={styles.heroStatValue}>{stats.regions}</span>
                  <span className={styles.heroStatLabel}>
                    {userPage.stats.regions}
                  </span>
                </div>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatIconSlot} aria-hidden>
                  <HeartIcon className={styles.heroStatIcon} size={28} />
                </span>
                <div className={styles.heroStatContent}>
                  <span className={styles.heroStatValue}>
                    {formatUah(stats.donated).replace(/ UAH$/, '')}
                    <span className={styles.heroStatValueCurrency}> UAH</span>
                  </span>
                  <span className={styles.heroStatLabel}>
                    {userPage.stats.donated}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.journeysGrid}>
          <section id="upcoming-stay" className={styles.upcomingSection}>
            <SectionTitle>{userPage.upcomingStay}</SectionTitle>
            {isLoadingDashboard ? (
              <p className={styles.status}>Loading…</p>
            ) : !upcomingStay ? (
              <div className={styles.upcomingEmpty}>
                <p className={styles.status}>{userPage.noUpcoming}</p>
                <Link
                  to={`${paths.home}#archive`}
                  className={styles.primaryBtn}
                >
                  {userPage.browseArchive}
                </Link>
              </div>
            ) : (
              <article className={styles.upcomingCard}>
                <img
                  className={styles.upcomingImage}
                  src={upcomingStay.main_photo ?? HERO_IMAGE}
                  alt=""
                />
                <div className={styles.upcomingBody}>
                  <h3>{upcomingStay.homestead_name}</h3>
                  <p className={styles.upcomingRegion}>{upcomingStay.region}</p>
                  <ul className={styles.upcomingMeta}>
                    <li className={styles.upcomingMetaItem}>
                      <UpcomingMetaIcon type="calendar" />
                      <span>
                        {formatCompactDateRange(
                          upcomingStay.check_in,
                          upcomingStay.check_out,
                        )}
                      </span>
                    </li>
                    <li className={styles.upcomingMetaItem}>
                      <UpcomingMetaIcon type="capacity" />
                      <span>{userPage.guests(upcomingStay.guests)}</span>
                    </li>
                  </ul>
                  <div className={styles.upcomingActions}>
                    {upcomingHomesteadId ? (
                      <>
                        <Link
                          to={`${paths.checkout}?${new URLSearchParams({
                            homesteadId: String(upcomingHomesteadId),
                            checkIn: upcomingStay.check_in,
                            checkOut: upcomingStay.check_out,
                            guests: String(upcomingStay.guests),
                            mode: 'view',
                          }).toString()}`}
                          className={styles.primaryBtn}
                        >
                          {userPage.viewBooking}
                        </Link>
                        <Link
                          to={paths.homesteadDetail(
                            String(upcomingHomesteadId),
                          )}
                          className={styles.secondaryBtn}
                        >
                          {userPage.viewHomesteads}
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`${paths.bookingConfirmed}?bookingId=${upcomingStay.booking_id}`}
                        className={styles.primaryBtn}
                      >
                        {userPage.viewBooking}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )}
          </section>

          <section id="past-journeys" className={styles.pastSection}>
            <SectionTitle>{userPage.pastJourneys}</SectionTitle>
            {isLoadingDashboard ? (
              <p className={styles.status}>Loading…</p>
            ) : pastJourneys.length === 0 ? (
              <article className={styles.pastEmpty}>
                <div className={styles.pastEmptyImageWrap}>
                  <img
                    className={styles.pastEmptyImage}
                    src={PAST_EMPTY_IMAGE}
                    alt=""
                  />
                </div>
                <div className={styles.pastEmptyTitle}>
                  <h3>{userPage.pastJourneysEmpty.title}</h3>
                  <div className={styles.pastEmptyDivider} aria-hidden>
                    <span className={styles.pastEmptyLine} />
                    <LogoIcon
                      className={styles.pastEmptyDividerIcon}
                      fill="#b79c73"
                      size={10}
                    />
                    <span className={styles.pastEmptyLine} />
                  </div>
                </div>
                <div className={styles.pastEmptyContent}>
                  <p className={styles.pastEmptyText}>
                    {userPage.pastJourneysEmpty.description}
                  </p>
                </div>
              </article>
            ) : (
              <ul className={styles.pastList}>
                {pastJourneys.map((journey) => (
                  <li key={journey.booking_id}>
                    <Link
                      to={`${paths.bookingConfirmed}?bookingId=${journey.booking_id}`}
                      className={styles.pastItem}
                    >
                      <img src={journey.main_photo ?? HERO_IMAGE} alt="" />
                      <div>
                        <p className={styles.pastRegion}>
                          <LocationPinIcon
                            className={styles.pastRegionIcon}
                            size={12}
                          />
                          <span>{journey.region}</span>
                        </p>
                        <p className={styles.pastTitle}>
                          {journey.homestead_name}
                        </p>
                        <p className={styles.pastDates}>
                          {formatCompactDateRange(
                            journey.check_in,
                            journey.check_out,
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className={styles.favouritesSection}>
          <div id="favourites" className={styles.favouritesHeader}>
            <SectionTitle>{userPage.favouriteHomesteads}</SectionTitle>
            <Link to={paths.favourites} className={styles.viewAllLink}>
              {userPage.viewAll}
            </Link>
          </div>

          <ul className={styles.favouritesRow}>
            {favouriteCards.length === 0 ? (
              Array.from({ length: favouritesRowSlots }, (_, index) => (
                <AddFavouriteCardItem key={`add-favourite-empty-${index}`} />
              ))
            ) : (
              <>
                {favouriteCards.map((homestead) => (
                  <li key={homestead.id}>
                    <article className={styles.favouriteCard}>
                      <Link
                        to={paths.homesteadDetail(
                          String(homestead.homesteadId ?? homestead.id),
                        )}
                        className={styles.favouriteImageLink}
                      >
                        {homestead.imageUrl ? (
                          <img src={homestead.imageUrl} alt={homestead.title} />
                        ) : (
                          <div
                            className={styles.favouritePlaceholder}
                            aria-hidden
                          />
                        )}
                        <span className={styles.favouriteHeart} aria-hidden>
                          <HeartIcon
                            filled
                            className={styles.favouriteHeartIcon}
                            size={14}
                          />
                        </span>
                      </Link>
                      <div className={styles.favouriteFooter}>
                        <Link
                          to={paths.homesteadDetail(
                            String(homestead.homesteadId ?? homestead.id),
                          )}
                          className={styles.favouriteTitle}
                        >
                          {homestead.title}
                        </Link>
                        <Link
                          to={paths.homesteadDetail(
                            String(homestead.homesteadId ?? homestead.id),
                          )}
                          className={styles.favouriteArrow}
                          aria-label={`View ${homestead.title}`}
                        >
                          <DetailsArrowIcon width={18} height={6} />
                        </Link>
                      </div>
                    </article>
                  </li>
                ))}
                <AddFavouriteCardItem key="add-favourite" />
              </>
            )}
          </ul>
        </section>

        <section
          id="impact"
          className={styles.impactSection}
          aria-labelledby="impact-title"
        >
          <div className={styles.impactCard}>
            <div className={styles.impactIntro}>
              <h2 id="impact-title">{userPage.impact.title}</h2>
              <p className={styles.impactSubtitle}>
                {userPage.impact.subtitle}
              </p>
              <p className={styles.impactAmount}>
                {formatUah(totalDonated).replace(/ UAH$/, '')}
                <span className={styles.impactAmountCurrency}> UAH</span>
              </p>
              <p className={styles.impactNote}>
                {userPage.impact.donationNote}
              </p>
            </div>

            <div className={styles.impactMedia}>
              <img className={styles.impactImage} src={IMPACT_IMAGE} alt="" />
              <div className={styles.impactThanks}>
                <span className={styles.impactThanksIcon} aria-hidden>
                  <HeartIcon filled size={14} />
                </span>
                <p>{userPage.impact.thankYou}</p>
              </div>
            </div>

            <div className={styles.impactActions}>
              <h3>{userPage.impact.supportTitle}</h3>
              <div className={styles.pastEmptyDivider} aria-hidden>
                <span className={styles.pastEmptyLine} />
                <LogoIcon
                  className={styles.pastEmptyDividerIcon}
                  fill="#b79c73"
                  size={10}
                />
                <span className={styles.pastEmptyLine} />
              </div>
              <ul>
                {userPage.impact.items.map((item, index) => (
                  <li key={item.title}>
                    <span className={styles.impactItemIcon} aria-hidden>
                      <ImpactItemIcon
                        type={
                          index === 0 ? 'home' : index === 1 ? 'tools' : 'leaf'
                        }
                      />
                    </span>
                    <div>
                      <p className={styles.impactItemTitle}>{item.title}</p>
                      <p className={styles.impactItemText}>{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
