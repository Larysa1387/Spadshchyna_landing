import { Link } from 'react-router-dom';
import { homePage } from '@/content/designContent';
import { paths } from '@/app/paths';
import styles from './HomesteadCard.module.scss';

type HomesteadCardProps = {
  id: string;
  region: string;
  location: string;
  rating: number;
  title: string;
  description: string;
  tags: readonly string[];
  price: number;
};

export function HomesteadCard({
  id,
  region,
  location,
  rating,
  title,
  description,
  tags,
  price,
}: HomesteadCardProps) {
  return (
    <article className={styles.card}>
      <figure className={styles.imageWrap}>
        <div className={styles.image} role="img" aria-label={title} />
        <figcaption className="visuallyHidden">{title}</figcaption>
        <span className={styles.region}>{region}</span>
        <data className={styles.rating} value={rating}>
          {rating.toFixed(2)}
        </data>
      </figure>
      <div className={styles.body}>
        <address className={styles.location}>{location}</address>
        <h3 className={styles.title}>
          <Link to={paths.homesteadDetail(id)}>{title}</Link>
        </h3>
        <p className={styles.description}>{description}</p>
        <ul className={styles.tags} aria-label="Features">
          {tags.slice(0, 3).map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
        <footer className={styles.footer}>
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
          <Link to={paths.homesteadDetail(id)} className={styles.detailsLink}>
            {homePage.archive.details}
          </Link>
        </footer>
      </div>
    </article>
  );
}
