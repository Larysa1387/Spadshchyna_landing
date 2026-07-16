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
  ImpactItemIcon,
  LocationPinIcon,
  LogoIcon,
  PersonIcon,
  SidebarIcon,
  UpcomingMetaIcon,
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
const PAST_EMPTY_IMAGE = publicAsset('assets/dashboard/past-empty.jpeg');

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
const FAVOURITES_ROW_SLOTS_TABLET = 4;
const FAVOURITES_ROW_SLOTS_MOBILE = 2;
const FAVOURITES_LIMIT_DESKTOP = 4;
const FAVOURITES_LIMIT_TABLET = 3;
const FAVOURITES_LIMIT_MOBILE = 1;

type SidebarSection = 'dashboard' | 'upcoming-stay' | 'favourites' | 'impact';

function getSidebarSectionFromHash(): SidebarSection {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === 'upcoming-stay' || hash === 'favourites' || hash === 'impact') {
    return hash;
  }
  return 'dashboard';
}

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
  const [isTabletViewport, setIsTabletViewport] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches,
  );
  const [activeSidebarSection, setActiveSidebarSection] =
    useState<SidebarSection>(() =>
      typeof window !== 'undefined' ? getSidebarSectionFromHash() : 'dashboard',
    );

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1023px)',
    );
    const updateViewport = () => {
      setIsMobileViewport(mobileQuery.matches);
      setIsTabletViewport(tabletQuery.matches);
    };

    updateViewport();
    mobileQuery.addEventListener('change', updateViewport);
    tabletQuery.addEventListener('change', updateViewport);

    return () => {
      mobileQuery.removeEventListener('change', updateViewport);
      tabletQuery.removeEventListener('change', updateViewport);
    };
  }, []);

  useEffect(() => {
    const syncSidebarSection = () => {
      setActiveSidebarSection(getSidebarSectionFromHash());
    };

    syncSidebarSection();
    window.addEventListener('hashchange', syncSidebarSection);

    return () => {
      window.removeEventListener('hashchange', syncSidebarSection);
    };
  }, []);

  const sidebarLinkClass = (section: SidebarSection) =>
    activeSidebarSection === section
      ? `${styles.sidebarLink} ${styles.sidebarLinkActive}`
      : styles.sidebarLink;

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
          isMobileViewport
            ? FAVOURITES_LIMIT_MOBILE
            : isTabletViewport
              ? FAVOURITES_LIMIT_TABLET
              : FAVOURITES_LIMIT_DESKTOP,
        )
        .map(mapApiHomesteadToCard),
    [favourites, isMobileViewport, isTabletViewport],
  );

  const favouritesRowSlots = isMobileViewport
    ? FAVOURITES_ROW_SLOTS_MOBILE
    : isTabletViewport
      ? FAVOURITES_ROW_SLOTS_TABLET
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
    const regionKeys = [
      ...pastJourneys.map((journey) => journey.region),
      ...(upcomingStay?.region ? [upcomingStay.region] : []),
    ]
      .map((region) => region.trim().toLowerCase())
      .filter(Boolean);

    const homesteadKeys = [
      ...pastJourneys.map((journey) => journey.homestead_name),
      ...(upcomingStay ? [upcomingStay.homestead_name] : []),
    ]
      .map((name) => name.trim().toLowerCase())
      .filter(Boolean);

    return {
      nights: totalNights,
      regions: new Set(regionKeys).size,
      donated: totalDonated,
      restored: new Set(homesteadKeys).size,
    };
  }, [pastJourneys, upcomingStay, totalDonated, totalNights]);

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
            className={() => sidebarLinkClass('dashboard')}
            end
            onClick={() => {
              setActiveSidebarSection('dashboard');
              if (window.location.hash) {
                window.history.replaceState(null, '', paths.dashboard);
              }
            }}
          >
            <SidebarIcon type="home" />
            {userPage.nav.dashboard}
          </NavLink>
          <a
            href="#upcoming-stay"
            className={sidebarLinkClass('upcoming-stay')}
            onClick={() => setActiveSidebarSection('upcoming-stay')}
          >
            <SidebarIcon type="calendar" />
            {userPage.nav.bookings}
          </a>
          <a
            href="#favourites"
            className={sidebarLinkClass('favourites')}
            onClick={() => setActiveSidebarSection('favourites')}
          >
            <SidebarIcon type="heart" className={styles.sidebarLinkIcon} />
            {userPage.nav.favourites}
          </a>
          <a
            href="#impact"
            className={sidebarLinkClass('impact')}
            onClick={() => setActiveSidebarSection('impact')}
          >
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
                {stats.regions === 0
                  ? userPage.exploredSummaryEmpty
                  : userPage.exploredSummary(stats.regions, stats.restored)}
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
                      <UpcomingMetaIcon
                        type="calendar"
                        className={styles.upcomingMetaIcon}
                      />
                      <span>
                        {formatCompactDateRange(
                          upcomingStay.check_in,
                          upcomingStay.check_out,
                        )}
                      </span>
                    </li>
                    <li className={styles.upcomingMetaItem}>
                      <UpcomingMetaIcon
                        type="capacity"
                        className={styles.upcomingMetaIcon}
                        capacityClassName={styles.upcomingMetaIconCapacity}
                      />
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
              <ul
                className={`${styles.pastList}${
                  pastJourneys.length > 1 ? ` ${styles.pastListGrid}` : ''
                }`}
              >
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
              <div
                className={`${styles.impactThanks} ${styles.impactThanksDesktop}`}
              >
                <span className={styles.impactThanksIcon} aria-hidden>
                  <HeartIcon filled size={14} />
                </span>
                <p>{userPage.impact.thankYou}</p>
              </div>
            </div>

            <div className={styles.impactMedia}>
              <img className={styles.impactImage} src={IMPACT_IMAGE} alt="" />
              <div
                className={`${styles.impactThanks} ${styles.impactThanksMobile}`}
              >
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
