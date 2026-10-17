/**
 * Static configuration of the Restaurant QR Menu showcase. Visual presets live
 * in `theme/presets.ts`, languages in `i18n/index.ts` and restaurants in the
 * mock dataset.
 */
export const QR_MENU_CONFIG = {
  /** Base route of the showcase inside the documentation site. */
  basePath: '/showcases/restaurant-qr-menu',
  /** Namespace for everything persisted in `localStorage`. */
  storageNamespace: 'mantine-vue:qr-menu',
  defaultLocale: 'en',
  defaultRestaurantId: 'saffron-house',
  /** Simulated API latency in milliseconds. */
  mockLatency: [200, 600] as [number, number],
  /** How often order tracking polls for status updates. */
  orderPollingMs: 4000,
} as const
