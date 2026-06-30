import { NavLink } from 'react-router-dom';
import { brand } from '@/content/designContent';
import { paths } from '@/app/paths';
import { publicAsset, publicAssetSrcSet } from '@/lib/assets';
import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <NavLink to={paths.home} className={styles.logo}>
          <img
            className={styles.logoIcon}
            src={publicAsset('assets/logo/logo-icon.png')}
            srcSet={publicAssetSrcSet(
              'assets/logo/logo-icon.png',
              'assets/logo/logo-icon@2x.png',
            )}
            width={32}
            height={32}
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
            width={208}
            height={32}
            alt={`${brand.name} — ${brand.tagline}`}
          />
        </NavLink>
        <div className={styles.meta}>
          <span>© {brand.footer.copyright}</span>
          <img
            className={styles.metaOrnament}
            src={publicAsset('assets/logo/meta-ornament.svg')}
            width={16}
            height={16}
            alt=""
            aria-hidden
          />
          <span>{brand.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
