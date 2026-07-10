import { paths } from '@/app/paths';

const DEFAULT_ORIGIN = 'https://larysa1387.github.io';

/**
 * Stripe Checkout success_url for the backend.
 * Must include the GitHub Pages base path (/Spadshchyna_landing/).
 */
export function buildStripeCheckoutSuccessUrl(): string {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin =
    typeof window !== 'undefined' ? window.location.origin : DEFAULT_ORIGIN;

  return `${origin}${basePath}${paths.bookingSuccess}?session_id={CHECKOUT_SESSION_ID}`;
}
