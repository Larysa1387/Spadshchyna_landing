import { useFavourites } from '@/features/favourites/useFavourites';
import { isAuthenticated } from '@/api/authStorage';
import styles from './FavouritesPage.module.scss';

export function FavouritesPage() {
  const { favourites, isLoading, error, toggleFavourite, refreshFavourites } =
    useFavourites();

  return (
    <section className={styles.page} aria-labelledby="favourites-title">
      <div className={styles.container}>
        <h1 id="favourites-title" className={styles.title}>
          Favourites
        </h1>

        {!isAuthenticated() && (
          <p className={styles.message}>
            Log in to view and manage your favourite homesteads.
          </p>
        )}

        {isLoading && <p className={styles.message}>Loading favourites…</p>}

        {error && (
          <p className={`${styles.message} ${styles.error}`} role="alert">
            {error}
          </p>
        )}

        {!isLoading &&
          isAuthenticated() &&
          favourites.length === 0 &&
          !error && (
            <p className={styles.message}>
              You have not added any favourites yet.
            </p>
          )}

        {favourites.length > 0 && (
          <ul className={styles.list}>
            {favourites.map((homestead) => (
              <li key={homestead.id} className={styles.item}>
                {homestead.main_photo ? (
                  <img
                    className={styles.itemImage}
                    src={homestead.main_photo}
                    alt={homestead.name}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={styles.itemImage}
                    role="img"
                    aria-label={homestead.name}
                  />
                )}
                <h2 className={styles.itemTitle}>{homestead.name}</h2>
                <p className={styles.itemMeta}>
                  {homestead.region} · {homestead.rating.toFixed(1)} ·{' '}
                  {homestead.price_per_night} UAH / night
                </p>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => void toggleFavourite(homestead.id)}
                >
                  Remove from favourites
                </button>
              </li>
            ))}
          </ul>
        )}

        {isAuthenticated() && !isLoading && (
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => void refreshFavourites()}
          >
            Refresh list
          </button>
        )}
      </div>
    </section>
  );
}
