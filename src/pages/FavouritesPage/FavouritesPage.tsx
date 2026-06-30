import { useMemo } from 'react';
import { HomesteadCard } from '@/components/homestead/HomesteadCard/HomesteadCard';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { navigation } from '@/content/designContent';
import { useAuth } from '@/features/auth/useAuth';
import { useFavourites } from '@/features/favourites/useFavourites';
import { mapApiHomesteadToCard } from '@/features/homesteads/mapApiHomesteadToCard';
import styles from './FavouritesPage.module.scss';

export function FavouritesPage() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { favourites, isLoading, error } = useFavourites();

  const cards = useMemo(
    () => favourites.map(mapApiHomesteadToCard),
    [favourites],
  );

  return (
    <section className={styles.page} aria-labelledby="favourites-title">
      <div className={styles.container}>
        <div className={styles.pageIntro}>
          <LogoIcon
            className={styles.archiveOrnamentIcon}
            fill="#b79c73"
            size={14}
            aria-hidden
          />
          <h1 id="favourites-title" className={styles.title}>
            Favourites
          </h1>
          <span className={styles.archiveOrnamentLine} aria-hidden />
        </div>

        {!isAuthenticated && (
          <>
            <p className={styles.message}>
              Log in to view and manage your favourite homesteads.
            </p>
            <button
              type="button"
              className={styles.loginButton}
              onClick={openLoginModal}
            >
              {navigation.login}
            </button>
          </>
        )}

        {isLoading && (
          <p className={styles.archiveStatus}>Loading favourites…</p>
        )}

        {error && (
          <p
            className={`${styles.archiveStatus} ${styles.archiveError}`}
            role="alert"
          >
            {error}
          </p>
        )}

        {!isLoading && isAuthenticated && cards.length === 0 && !error && (
          <p className={styles.archiveStatus}>
            You have not added any favourites yet.
          </p>
        )}

        {cards.length > 0 && (
          <ul className={styles.archiveGrid}>
            {cards.map((homestead) => (
              <li key={homestead.id} className={styles.archiveItem}>
                <HomesteadCard {...homestead} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
