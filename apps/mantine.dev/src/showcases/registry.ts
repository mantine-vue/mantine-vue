import type { RouteRecordRaw } from 'vue-router'
import { restaurantQrMenuShowcase } from './restaurant-qr-menu'
import type { ShowcaseDefinition } from './types'

/**
 * Every showcase available in the documentation site. To add one, create
 * `src/showcases/<id>/index.ts` exporting a `ShowcaseDefinition` and list it here.
 */
export const SHOWCASES: ShowcaseDefinition[] = [restaurantQrMenuShowcase]

export const SHOWCASES_INDEX_PATH = '/showcases'

export const KITCHEN_SINK_URL = import.meta.env.DEV ? 'http://127.0.0.1:4180/' : '/showcase'

export const showcaseRoutes: RouteRecordRaw[] = [
  {
    path: SHOWCASES_INDEX_PATH,
    name: 'showcases',
    component: () => import('./ShowcasesPage.vue'),
  },
  ...SHOWCASES.flatMap((showcase) => showcase.routes),
]

export type { ShowcaseDefinition }
