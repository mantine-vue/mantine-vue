import type { ProductBadge } from '../domain/types'

/** Mantine color for each product badge. `brand` / `accent` follow the active theme. */
export const BADGE_COLORS: Record<ProductBadge, string> = {
  popular: 'brand',
  new: 'teal',
  spicy: 'red',
  recommended: 'accent',
  'chef-special': 'yellow',
  limited: 'gray',
}
