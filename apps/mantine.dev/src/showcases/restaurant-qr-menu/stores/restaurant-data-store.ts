import { computed, ref, shallowRef } from 'vue'
import type { KeyValueStorage } from '../../shared/persistence'
import type { Menu, MenuCategory, Product, Promotion, Restaurant } from '../domain/types'
import { ApiError, type QrMenuServices } from '../services/contracts'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

interface MenuSnapshot {
  savedAt: string
  restaurant: Restaurant
  menu: Menu
  promotions: Promotion[]
}

const cacheKey = (restaurantId: string) => `menu-cache:${restaurantId}`

/**
 * Loads the active restaurant, its menu and promotions. The last successful
 * response is cached so the menu stays browsable offline or when the API fails.
 */
export function createRestaurantDataStore(options: {
  services: QrMenuServices
  storage: KeyValueStorage
}) {
  const { services, storage } = options

  const status = ref<LoadStatus>('idle')
  const error = shallowRef<ApiError | null>(null)
  const restaurant = shallowRef<Restaurant | null>(null)
  const menu = shallowRef<Menu | null>(null)
  const promotions = shallowRef<Promotion[]>([])
  /** ISO timestamp when showing cached data, otherwise `null`. */
  const cachedAt = ref<string | null>(null)
  let requestId = 0

  const apply = (snapshot: Omit<MenuSnapshot, 'savedAt'>) => {
    restaurant.value = snapshot.restaurant
    menu.value = snapshot.menu
    promotions.value = snapshot.promotions
  }

  const load = async (restaurantId: string) => {
    const current = ++requestId
    status.value = 'loading'
    error.value = null

    const cached = storage.get<MenuSnapshot | null>(cacheKey(restaurantId), null)
    if (restaurant.value?.id !== restaurantId) {
      if (cached) {
        // Paint the cached menu immediately, then refresh it in the background.
        apply(cached)
      } else {
        restaurant.value = null
        menu.value = null
        promotions.value = []
      }
    }

    try {
      const [nextRestaurant, nextMenu, nextPromotions] = await Promise.all([
        services.restaurants.getById(restaurantId),
        services.menus.getMenu(restaurantId),
        services.promotions.listActive(restaurantId),
      ])
      if (current !== requestId) {
        return
      }
      apply({ restaurant: nextRestaurant, menu: nextMenu, promotions: nextPromotions })
      cachedAt.value = null
      status.value = 'ready'
      storage.set<MenuSnapshot>(cacheKey(restaurantId), {
        savedAt: new Date().toISOString(),
        restaurant: nextRestaurant,
        menu: nextMenu,
        promotions: nextPromotions,
      })
    } catch (caught) {
      if (current !== requestId) {
        return
      }
      const apiError = caught instanceof ApiError ? caught : new ApiError('unknown', String(caught))
      if (cached) {
        apply(cached)
        cachedAt.value = cached.savedAt
        status.value = 'ready'
        error.value = apiError
      } else {
        status.value = 'error'
        error.value = apiError
      }
    }
  }

  const products = computed<Product[]>(() => menu.value?.products ?? [])
  const categories = computed<MenuCategory[]>(() => menu.value?.categories ?? [])
  const productsById = computed(() => new Map(products.value.map((item) => [item.id, item])))
  const categoriesById = computed(() => new Map(categories.value.map((item) => [item.id, item])))

  return {
    status,
    error,
    restaurant,
    menu,
    promotions,
    cachedAt,
    products,
    categories,
    productsById,
    categoriesById,
    load,
    clearCache: (restaurantId: string) => storage.remove(cacheKey(restaurantId)),
  }
}

export type RestaurantDataStore = ReturnType<typeof createRestaurantDataStore>
