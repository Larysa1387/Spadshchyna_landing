export const ICON_SPRITE_URL = '/assets/sprites/icons.svg';

export const iconSpriteHref = (symbolId: string) =>
  `${ICON_SPRITE_URL}#${symbolId}`;

export const iconSpriteIds = {
  logoIcon: 'logo-icon',
  detailsArrow: 'details-arrow',
  locationPin: 'location-pin',
  priceTag: 'price-tag',
  ratingStar: 'rating-star',
} as const;
