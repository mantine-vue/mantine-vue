import { reactive, readonly } from 'vue'
import type { KeyValueStorage } from '../../shared/persistence'
import type { CustomerDetails, DeliveryAddress, OrderMode } from '../domain/types'

export interface SavedProfile {
  customer: CustomerDetails
  address: DeliveryAddress
}

interface RestaurantSession {
  mode: OrderMode | null
  tableId: string | null
}

interface CustomerState {
  favorites: Record<string, string[]>
  recentlyViewed: Record<string, string[]>
  orders: Record<string, string[]>
  sessions: Record<string, RestaurantSession>
  dismissedAnnouncements: string[]
  profile: SavedProfile | null
}

const STORAGE_KEY = 'customer'
const MAX_RECENT = 10

function createEmptyState(): CustomerState {
  return {
    favorites: {},
    recentlyViewed: {},
    orders: {},
    sessions: {},
    dismissedAnnouncements: [],
    profile: null,
  }
}

/**
 * Everything the guest accumulates on this device: favorites, recently viewed
 * dishes, order history, the dine-in session (mode + table) and saved details.
 */
export function createCustomerStore(options: { storage: KeyValueStorage }) {
  const state = reactive<CustomerState>({
    ...createEmptyState(),
    ...options.storage.get<Partial<CustomerState>>(STORAGE_KEY, {}),
  })

  const persist = () => options.storage.set(STORAGE_KEY, state)

  const listFor = (record: Record<string, string[]>, restaurantId: string) => {
    if (!record[restaurantId]) {
      record[restaurantId] = []
    }
    return record[restaurantId]
  }

  const getSession = (restaurantId: string): RestaurantSession =>
    state.sessions[restaurantId] ?? { mode: null, tableId: null }

  return {
    state: readonly(state),

    favorites: (restaurantId: string) => state.favorites[restaurantId] ?? [],
    isFavorite: (restaurantId: string, productId: string) =>
      (state.favorites[restaurantId] ?? []).includes(productId),
    /** Toggles a favorite and returns the new state. */
    toggleFavorite(restaurantId: string, productId: string) {
      const list = listFor(state.favorites, restaurantId)
      const index = list.indexOf(productId)
      if (index === -1) {
        list.unshift(productId)
      } else {
        list.splice(index, 1)
      }
      persist()
      return index === -1
    },

    recentlyViewed: (restaurantId: string) => state.recentlyViewed[restaurantId] ?? [],
    markViewed(restaurantId: string, productId: string) {
      const list = listFor(state.recentlyViewed, restaurantId)
      const next = [productId, ...list.filter((id) => id !== productId)].slice(0, MAX_RECENT)
      state.recentlyViewed[restaurantId] = next
      persist()
    },

    orderIds: (restaurantId: string) => state.orders[restaurantId] ?? [],
    addOrder(restaurantId: string, orderId: string) {
      const list = listFor(state.orders, restaurantId)
      if (!list.includes(orderId)) {
        list.unshift(orderId)
      }
      persist()
    },

    getSession,
    setMode(restaurantId: string, mode: OrderMode) {
      state.sessions[restaurantId] = { ...getSession(restaurantId), mode }
      persist()
    },
    setTable(restaurantId: string, tableId: string | null) {
      state.sessions[restaurantId] = { ...getSession(restaurantId), tableId }
      persist()
    },

    isAnnouncementDismissed: (id: string) => state.dismissedAnnouncements.includes(id),
    dismissAnnouncement(id: string) {
      if (!state.dismissedAnnouncements.includes(id)) {
        state.dismissedAnnouncements.push(id)
        persist()
      }
    },

    saveProfile(profile: SavedProfile | null) {
      state.profile = profile
      persist()
    },

    reset() {
      Object.assign(state, createEmptyState())
      persist()
    },
  }
}

export type CustomerStore = ReturnType<typeof createCustomerStore>
