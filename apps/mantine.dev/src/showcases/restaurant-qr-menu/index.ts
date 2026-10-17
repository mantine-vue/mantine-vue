import type { RouteRecordRaw } from 'vue-router'
import type { ShowcaseDefinition } from '../types'
import { QR_MENU_CONFIG } from './config'

/**
 * Routes of the Restaurant QR Menu showcase. The whole showcase is lazy loaded,
 * and the checkout / order tracking views are split into their own chunks.
 */
const routes: RouteRecordRaw[] = [
  {
    path: QR_MENU_CONFIG.basePath,
    component: () => import('./RestaurantQrMenuApp.vue'),
    // Rendered without the docs shell and providers – the showcase owns its theme.
    meta: { standalone: true },
    children: [
      { path: '', name: 'rqm-menu', component: () => import('./views/MenuView.vue') },
      {
        path: 'checkout',
        name: 'rqm-checkout',
        component: () => import('./views/CheckoutView.vue'),
      },
      {
        path: 'orders/:orderId',
        name: 'rqm-order',
        component: () => import('./views/OrderTrackingView.vue'),
      },
      { path: ':pathMatch(.*)*', redirect: { name: 'rqm-menu' } },
    ],
  },
]

export const restaurantQrMenuShowcase: ShowcaseDefinition = {
  id: 'restaurant-qr-menu',
  path: QR_MENU_CONFIG.basePath,
  title: 'Restaurant QR Menu',
  description:
    'A mobile-first digital menu for restaurants: bilingual (English / Arabic, LTR / RTL), themeable, with product customization, cart, checkout and live order tracking on a mock API.',
  tags: ['Mobile first', 'i18n + RTL', 'Theming', 'Carousel', 'Lightbox', 'Spotlight', 'Forms'],
  cover:
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=960&q=70',
  routes,
}
