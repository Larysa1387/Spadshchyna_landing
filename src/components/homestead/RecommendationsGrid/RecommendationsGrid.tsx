import { HomesteadCard } from '@/components/homestead/HomesteadCard/HomesteadCard';
import type { HomesteadCardProps } from '@/components/homestead/HomesteadCard/HomesteadCard';
import { LogoIcon } from '@/components/icons/LogoIcon';
import styles from './RecommendationsGrid.module.scss';

type RecommendationsGridProps = {
  title: string;
  recommendations: HomesteadCardProps[];
};

export function RecommendationsGrid({
  title,
  recommendations,
}: RecommendationsGridProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="recommendations-title">
      <div className={styles.heading}>
        <LogoIcon
          className={styles.headingIcon}
          fill="#b79c72"
          size={14}
          aria-hidden
        />
        <h2 id="recommendations-title" className={styles.title}>
          {title}
        </h2>
        <span className={styles.headingLine} aria-hidden />
      </div>

      <ul className={styles.grid}>
        {recommendations.map((homestead) => (
          <li key={homestead.id} className={styles.item}>
            <HomesteadCard {...homestead} variant="recommendation" />
          </li>
        ))}
      </ul>
    </section>
  );
}
