import { NavLink, useLocation } from 'react-router-dom';
import { brand, navigation } from '@/content/designContent';
import { paths } from '@/app/paths';
import styles from './Header.module.scss';

const authRoutes: string[] = [
  paths.dashboard,
  paths.checkout,
  paths.bookingConfirmed,
];

export function Header() {
  const { pathname } = useLocation();
  const isAuthenticated = authRoutes.includes(pathname);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to={paths.home} className={styles.logo}>
          <span className={styles.logoMark} aria-hidden />
          <span className={styles.logoText}>
            <span className={styles.logoName}>{brand.name.toUpperCase()}</span>
            <span className={styles.logoTagline}>{brand.tagline}</span>
          </span>
        </NavLink>

        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink
            to={paths.home}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            end
          >
            {navigation.homesteads}
          </NavLink>
          <NavLink
            to={paths.dashboard}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            {navigation.favourites}
          </NavLink>
          {isAuthenticated ? (
            <NavLink to={paths.home} className={styles.logoutLink}>
              {navigation.logout}
            </NavLink>
          ) : (
            <NavLink to={paths.dashboard} className={styles.loginLink}>
              {navigation.login}
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
