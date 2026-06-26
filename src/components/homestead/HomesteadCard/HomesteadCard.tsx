import { Link, useNavigate } from 'react-router-dom';
import {
  DetailsArrowIcon,
  HeartIcon,
  LocationMetaIcon,
  RatingFilledStarIcon,
} from '@/components/icons';
import { useFavourites } from '@/features/favourites/useFavourites';
import { homePage } from '@/content/designContent';
import { paths } from '@/app/paths';
import styles from './HomesteadCard.module.scss';

type HomesteadCardProps = {
  id: string;
  homesteadId?: number;
  region: string;
  location: string;
  rating: number;
  title: string;
  description: string;
  amenities?: readonly string[];
  extraPhotos?: number;
  price: number;
  image?: string;
  imageUrl?: string | null;
};

export type { HomesteadCardProps };

export function HomesteadCard({
  id,
  homesteadId,
  region,
  location,
  rating,
  title,
  description,
  amenities = [],
  extraPhotos = 0,
  price,
  image,
  imageUrl,
}: HomesteadCardProps) {
  const { isFavourited, toggleFavourite } = useFavourites();
  const navigate = useNavigate();
  const favourited = homesteadId ? isFavourited(homesteadId) : false;
  const productId = homesteadId ?? id;

  const handleDetailsClick = () => {
    navigate(paths.homesteadDetail(String(productId)));
  };

  return (
    <article className={styles.card}>
      <figure className={styles.imageWrap}>
        {imageUrl ? (
          <img
            className={styles.image}
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
          />
        ) : image ? (
          <picture>
            <source
              srcSet={`${image}.webp 1x, ${image}@2x.webp 2x`}
              type="image/webp"
            />
            <img
              className={styles.image}
              src={`${image}.jpeg`}
              srcSet={`${image}.jpeg 1x, ${image}@2x.jpeg 2x`}
              alt={title}
              loading="lazy"
              decoding="async"
            />
          </picture>
        ) : (
          <div className={styles.image} role="img" aria-label={title} />
        )}
        <figcaption className="visuallyHidden">{title}</figcaption>
        <button
          className={`${styles.favoriteBtn}${favourited ? ` ${styles.favoriteBtnActive}` : ''}`}
          type="button"
          aria-label={
            favourited ? 'Remove from favourites' : 'Add to favourites'
          }
          aria-pressed={favourited}
          onClick={() => {
            if (homesteadId) {
              void toggleFavourite(homesteadId);
            }
          }}
        >
          <HeartIcon filled={favourited} className={styles.favoriteIcon} />
        </button>
        <span className={styles.region}>{region}</span>
      </figure>

      <div className={styles.body}>
        <div className={styles.meta}>
          <address className={styles.location}>
            <LocationMetaIcon className={styles.metaIcon} />
            {location}
          </address>
          <data className={styles.rating} value={rating}>
            <RatingFilledStarIcon rating={rating} />
            <span className={styles.ratingValue}>{rating.toFixed(2)}</span>
          </data>
        </div>

        <h3 className={styles.title}>
          <Link to={paths.homesteadDetail(id)}>{title}</Link>
        </h3>

        <p className={styles.description}>{description}</p>

        {amenities.length > 0 && (
          <ul className={styles.amenities} aria-label="Amenities">
            {amenities.slice(0, 3).map((amenity) => (
              <li key={amenity} className={styles.amenity}>
                {amenity}
              </li>
            ))}
            {extraPhotos > 0 && (
              <li className={styles.amenity}>+{extraPhotos}</li>
            )}
          </ul>
        )}

        <div className={styles.footer}>
          <span className={styles.footerLine} aria-hidden />
          <div className={styles.footerRow}>
            <p className={styles.priceBlock}>
              <span className={styles.fairPrice}>
                {homePage.archive.fairPrice}
              </span>
              <span className={styles.price}>
                <data value={price}>{price}</data>{' '}
                <span className={styles.priceSuffix}>
                  {homePage.archive.priceSuffix}
                </span>
              </span>
            </p>
            <button
              type="button"
              className={styles.detailsLink}
              onClick={handleDetailsClick}
            >
              <span className={styles.detailsLinkText}>
                {homePage.archive.details}
              </span>
              <span className={styles.detailsArrow} aria-hidden>
                <DetailsArrowIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
