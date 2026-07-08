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
import { publicAsset } from '@/lib/assets';
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
  variant?: 'default' | 'recommendation';
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
  variant = 'default',
}: HomesteadCardProps) {
  const { isFavourited, toggleFavourite } = useFavourites();
  const navigate = useNavigate();
  const favourited = homesteadId ? isFavourited(homesteadId) : false;
  const productId = homesteadId ?? id;
  const imageBase = image ? publicAsset(image) : null;
  const isRecommendation = variant === 'recommendation';
  const productPath = paths.homesteadDetail(String(productId));

  const handleDetailsClick = () => {
    navigate(productPath);
  };

  return (
    <article
      className={`${styles.card}${
        isRecommendation ? ` ${styles.cardRecommendation}` : ''
      }`}
    >
      <figure
        className={`${styles.imageWrap}${
          isRecommendation ? ` ${styles.imageWrapRecommendation}` : ''
        }`}
      >
        {imageUrl ? (
          <img
            className={styles.image}
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
          />
        ) : imageBase ? (
          <picture>
            <source
              srcSet={`${imageBase}.webp 1x, ${imageBase}@2x.webp 2x`}
              type="image/webp"
            />
            <img
              className={styles.image}
              src={`${imageBase}.jpeg`}
              srcSet={`${imageBase}.jpeg 1x, ${imageBase}@2x.jpeg 2x`}
              alt={title}
              loading="lazy"
              decoding="async"
            />
          </picture>
        ) : (
          <div className={styles.image} role="img" aria-label={title} />
        )}
        <figcaption className="visuallyHidden">{title}</figcaption>
        {!isRecommendation && (
          <>
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
          </>
        )}
      </figure>

      <div
        className={`${styles.body}${
          isRecommendation ? ` ${styles.bodyRecommendation}` : ''
        }`}
      >
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

        <h3
          className={`${styles.title}${
            isRecommendation ? ` ${styles.titleRecommendation}` : ''
          }`}
        >
          <Link to={productPath}>{title}</Link>
        </h3>

        {!isRecommendation && (
          <p className={styles.description}>{description}</p>
        )}

        <div className={styles.cardBottom}>
          {!isRecommendation && (
            <ul
              className={styles.amenities}
              aria-label={amenities.length > 0 ? 'Amenities' : undefined}
              aria-hidden={amenities.length === 0 ? true : undefined}
            >
              {amenities.slice(0, 3).map((amenity) => (
                <li key={amenity} className={styles.amenity} title={amenity}>
                  <span className={styles.amenityText}>{amenity}</span>
                </li>
              ))}
              {extraPhotos > 0 && (
                <li className={`${styles.amenity} ${styles.amenityMeta}`}>
                  +{extraPhotos}
                </li>
              )}
            </ul>
          )}

          <div
            className={`${styles.footer}${
              isRecommendation ? ` ${styles.footerRecommendation}` : ''
            }`}
          >
            {!isRecommendation && (
              <span className={styles.footerLine} aria-hidden />
            )}
            <div className={styles.footerRow}>
              <p className={styles.priceBlock}>
                {!isRecommendation && (
                  <span className={styles.fairPrice}>
                    {homePage.archive.fairPrice}
                  </span>
                )}
                <span
                  className={`${styles.price}${
                    isRecommendation ? ` ${styles.priceRecommendation}` : ''
                  }`}
                >
                  <data value={price}>{price}</data>{' '}
                  <span className={styles.priceSuffix}>
                    {homePage.archive.priceSuffix}
                  </span>
                </span>
              </p>
              <button
                type="button"
                className={`${styles.detailsLink}${
                  isRecommendation ? ` ${styles.detailsLinkRecommendation}` : ''
                }`}
                onClick={handleDetailsClick}
                aria-label={homePage.archive.details}
              >
                {!isRecommendation && (
                  <span className={styles.detailsLinkText}>
                    {homePage.archive.details}
                  </span>
                )}
                <span className={styles.detailsArrow} aria-hidden>
                  <DetailsArrowIcon />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
