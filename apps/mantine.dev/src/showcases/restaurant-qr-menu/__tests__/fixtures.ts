import type { OrderingSettings, Product, Restaurant } from '../domain/types'
import { DEFAULT_MOCK_DATASET } from '../services/mock/data'

/** Deep copy of a mock restaurant so tests can tweak settings safely. */
export function restaurantFixture(id = 'saffron-house'): Restaurant {
  const restaurant = DEFAULT_MOCK_DATASET.restaurants.find((item) => item.id === id)
  if (!restaurant) {
    throw new Error(`Unknown restaurant ${id}`)
  }
  return JSON.parse(JSON.stringify(restaurant))
}

export function productFixture(id: string, restaurantId = 'saffron-house'): Product {
  const product = DEFAULT_MOCK_DATASET.menus[restaurantId].products.find((item) => item.id === id)
  if (!product) {
    throw new Error(`Unknown product ${id}`)
  }
  return JSON.parse(JSON.stringify(product))
}

export function settingsFixture(overrides: Partial<OrderingSettings> = {}): OrderingSettings {
  return { ...restaurantFixture().ordering, ...overrides }
}

/** A Saturday at 20:00 in Bahrain (UTC+3), when Saffron House is open. */
export const SAFFRON_OPEN = new Date('2026-10-17T17:00:00.000Z')
/** A Saturday at 03:00 in Bahrain, when Saffron House is closed. */
export const SAFFRON_CLOSED = new Date('2026-10-17T00:00:00.000Z')
