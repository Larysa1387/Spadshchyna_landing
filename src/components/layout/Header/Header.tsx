import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuIcon, PersonIcon } from '@/components/icons';
import { brand, navigation } from '@/content/designContent';
import { paths } from '@/app/paths';
import { useAuth } from '@/features/auth/useAuth';
import { useFavourites } from '@/features/favourites/useFavourites';
import { publicAsset, publicAssetSrcSet } from '@/lib/assets';
import styles from './Header.module.scss';

export function Header() {
  const { pathname } = useLocation();
  const { isAuthenticated, openLoginModal, logout } = useAuth();
  const { favourites } = useFavourites();
  const favouritesCount = favourites.length;
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === paths.home;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    void logout();
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isHome ? styles.headerOnHome : ''}`}>
      <div className={styles.inner}>
        <NavLink to={paths.home} className={styles.logo} onClick={closeMenu}>
          <img
            className={styles.logoIcon}
            src={publicAsset('assets/logo/logo-icon.png')}
            srcSet={publicAssetSrcSet(
              'assets/logo/logo-icon.png',
              'assets/logo/logo-icon@2x.png',
            )}
            width={48}
            height={48}
            alt=""
            aria-hidden
          />
          <span className={styles.logoDivider} aria-hidden />
          <img
            className={styles.logoTextImage}
            src={publicAsset('assets/logo/logo-text.png')}
            srcSet={publicAssetSrcSet(
              'assets/logo/logo-text.png',
              'assets/logo/logo-text@2x.png',
            )}
            width={310}
            height={48}
            alt={`${brand.name} — ${brand.tagline}`}
          />
        </NavLink>

        <div className={styles.mobileActions}>
          {isAuthenticated && (
            <NavLink
              to={paths.dashboard}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navIconLink} ${styles.navIconLinkActive}`
                  : styles.navIconLink
              }
              aria-label={navigation.dashboard}
            >
              <PersonIcon className={styles.navIcon} size={18} />
            </NavLink>
          )}
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon className={styles.menuIcon} />
          </button>
        </div>

        <nav
          id="main-nav"
          className={`${styles.nav}${menuOpen ? ` ${styles.navOpen}` : ''}`}
          aria-label="Main navigation"
        >
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
            onClick={closeMenu}
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
            onClick={closeMenu}
          >
            {navigation.homesteads}
          </NavLink>
          {isAuthenticated ? (
            <div className={styles.authActions}>
              <NavLink
                to={paths.dashboard}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navIconLink} ${styles.navIconLinkInNav} ${styles.navIconLinkActive}`
                    : `${styles.navIconLink} ${styles.navIconLinkInNav}`
                }
                aria-label={navigation.dashboard}
                onClick={closeMenu}
              >
                <PersonIcon className={styles.navIcon} size={18} />
              </NavLink>
              <button
                type="button"
                className={styles.logoutLink}
                onClick={handleLogout}
              >
                {navigation.logout}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.loginLink}
              onClick={() => {
                closeMenu();
                openLoginModal();
              }}
            >
              {navigation.login}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
