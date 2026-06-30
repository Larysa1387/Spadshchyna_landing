import { NavLink, useLocation } from 'react-router-dom';
import { brand, navigation } from '@/content/designContent';
import { paths } from '@/app/paths';
import { useAuth } from '@/features/auth/useAuth';
import { useFavourites } from '@/features/favourites/useFavourites';
import styles from './Header.module.scss';

export function Header() {
  const { pathname } = useLocation();
  const { isAuthenticated, openLoginModal, logout } = useAuth();
  const { favourites } = useFavourites();
  const favouritesCount = favourites.length;

  const isHome = pathname === paths.home;

  const handleLogout = () => {
    void logout();
  };

  return (
    <header className={`${styles.header} ${isHome ? styles.headerOnHome : ''}`}>
      <div className={styles.inner}>
        <NavLink to={paths.home} className={styles.logo}>
          <img
            className={styles.logoIcon}
            src="/assets/logo/logo-icon.png"
            srcSet="/assets/logo/logo-icon.png 1x, /assets/logo/logo-icon@2x.png 2x"
            width={48}
            height={48}
            alt=""
            aria-hidden
          />
          <span className={styles.logoDivider} aria-hidden />
          <img
            className={styles.logoTextImage}
            src="/assets/logo/logo-text.png"
            srcSet="/assets/logo/logo-text.png 1x, /assets/logo/logo-text@2x.png 2x"
            width={310}
            height={48}
            alt={`${brand.name} — ${brand.tagline}`}
          />
        </NavLink>

        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink
            to={paths.favourites}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            aria-label={
              favouritesCount > 0
                ? `${navigation.favourites}, ${favouritesCount} items`
                : navigation.favourites
            }
          >
            <span className={styles.navLinkLabel}>
              {navigation.favourites}
              {favouritesCount > 0 && (
                <span className={styles.favouritesBadge} aria-hidden>
                  {favouritesCount > 99 ? '99+' : favouritesCount}
                </span>
              )}
            </span>
          </NavLink>
          <NavLink
            to={paths.home}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            end
          >
            {navigation.homesteads}
          </NavLink>
          {isAuthenticated ? (
            <button
              type="button"
              className={styles.logoutLink}
              onClick={handleLogout}
            >
              {navigation.logout}
            </button>
          ) : (
            <button
              type="button"
              className={styles.loginLink}
              onClick={openLoginModal}
            >
              {navigation.login}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
