import type { ApiHomesteadCard } from '@/api/types';
import type { HomesteadCardProps } from '@/components/homestead/HomesteadCard/HomesteadCard';

export function mapApiHomesteadToCard(
  homestead: ApiHomesteadCard,
): HomesteadCardProps {
  return {
    id: String(homestead.id),
    homesteadId: homestead.id,
    region: homestead.region.toUpperCase(),
    location: homestead.location,
    rating: homestead.rating,
    title: homestead.name,
    description: homestead.short_description || homestead.description,
    amenities: homestead.amenities ?? [],
    price: homestead.price_per_night,
    imageUrl: homestead.main_photo,
  };
}
