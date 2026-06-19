import { NavLink, useLocation } from 'react-router-dom';
import { brand, navigation } from '@/content/designContent';
import { paths } from '@/app/paths';
import styles from './Header.module.scss';

const authRoutes: string[] = [
  paths.favourites,
  paths.checkout,
  paths.bookingConfirmed,
];

export function Header() {
  const { pathname } = useLocation();
  const isAuthenticated = authRoutes.includes(pathname);

  const isHome = pathname === paths.home;

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
          >
            {navigation.favourites}
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
            <NavLink to={paths.home} className={styles.logoutLink}>
              {navigation.logout}
            </NavLink>
          ) : (
            <NavLink to={paths.favourites} className={styles.loginLink}>
              {navigation.login}
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
