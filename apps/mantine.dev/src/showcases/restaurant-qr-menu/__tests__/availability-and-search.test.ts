import { describe, expect, it } from 'vitest'
import { getOpenState, getScheduleSlots, isCategoryAvailable } from '../domain/availability'
import {
  createEmptyFilters,
  filterProducts,
  groupByCategory,
  normalizeSearchText,
  sortProducts,
} from '../domain/menu-query'
import { DEFAULT_MOCK_DATASET } from '../services/mock/data'
import { restaurantFixture } from './fixtures'

const saffron = restaurantFixture('saffron-house')
const menu = DEFAULT_MOCK_DATASET.menus['saffron-house']
const categories = new Map(menu.categories.map((category) => [category.id, category]))

describe('restaurant-qr-menu opening hours', () => {
  it('handles windows that end after midnight', () => {
    // Sunday 00:30 in Bahrain is still inside Saturday's 11:00 – 01:00 window.
    const state = getOpenState(
      saffron.openingHours,
      new Date('2026-10-17T21:30:00Z'),
      saffron.timeZone,
    )
    expect(state).toMatchObject({
      open: true,
      closesAt: '01:00',
      closingSoon: true,
      closesInMinutes: 30,
    })
  })

  it('returns the next opening time when closed', () => {
    const state = getOpenState(
      saffron.openingHours,
      new Date('2026-10-17T00:00:00Z'),
      saffron.timeZone,
    )
    expect(state).toMatchObject({
      open: false,
      opensAt: '11:00',
      opensDay: 6,
      opensInMinutes: 8 * 60,
    })
  })

  it('only offers schedule slots inside opening hours', () => {
    const now = new Date('2026-10-17T00:00:00Z') // 03:00 local, closed
    const slots = getScheduleSlots(saffron.openingHours, saffron.timeZone, { now, limit: 4 })
    expect(slots).toEqual([
      '2026-10-17T08:00:00.000Z',
      '2026-10-17T08:15:00.000Z',
      '2026-10-17T08:30:00.000Z',
      '2026-10-17T08:45:00.000Z',
    ])
  })

  it('checks time-limited categories such as breakfast', () => {
    const breakfast = DEFAULT_MOCK_DATASET.menus['brew-and-bloom'].categories.find(
      (item) => item.id === 'breakfast',
    )!
    expect(isCategoryAvailable(breakfast, new Date('2026-10-17T05:00:00Z'), 'Asia/Dubai')).toBe(
      true,
    ) // 09:00
    expect(isCategoryAvailable(breakfast, new Date('2026-10-17T10:00:00Z'), 'Asia/Dubai')).toBe(
      false,
    ) // 14:00
  })
})

describe('restaurant-qr-menu search, filters and sorting', () => {
  it('normalizes Arabic letter variants and diacritics', () => {
    expect(normalizeSearchText('شَاوَرْمَـا')).toBe(normalizeSearchText('شاورما'))
    expect(normalizeSearchText('كبة')).toBe(normalizeSearchText('كبه'))
    expect(normalizeSearchText('Crème Brûlée')).toBe('creme brulee')
  })

  it('finds products in any language, by keyword or by category', () => {
    const search = (query: string) =>
      filterProducts(menu.products, { ...createEmptyFilters(), query }, { categories }).map(
        (item) => item.id,
      )

    expect(search('shawarma')).toEqual(['sh-shawarma'])
    expect(search('شاورما')).toEqual(['sh-shawarma'])
    expect(search('sandwich')).toEqual(['sh-shawarma'])
    expect(search('desserts')).toEqual(['sh-baklava', 'sh-brownie', 'sh-rose-cake'])
    expect(search('chicken toum')).toContain('sh-shish-tawook')
  })

  it('filters by dietary needs, allergens, badges, spice, price and availability', () => {
    const filter = (overrides: Partial<ReturnType<typeof createEmptyFilters>>) =>
      filterProducts(menu.products, { ...createEmptyFilters(), ...overrides }, { categories })

    expect(filter({ dietary: ['vegan'] }).every((item) => item.dietary.includes('vegan'))).toBe(
      true,
    )
    expect(
      filter({ excludeAllergens: ['gluten'] }).some((item) => item.allergens.includes('gluten')),
    ).toBe(false)
    expect(filter({ badges: ['new'] }).every((item) => item.badges.includes('new'))).toBe(true)
    expect(filter({ maxSpice: 0 }).every((item) => (item.spiceLevel ?? 0) === 0)).toBe(true)
    expect(
      filter({ priceRange: [0, 1500] })
        .map((item) => item.id)
        .sort(),
    ).toEqual(
      [
        'sh-fries',
        'sh-iced-hibiscus',
        'sh-mint-lemonade',
        'sh-orange-juice',
        'sh-turkish-coffee',
      ].sort(),
    )
    expect(filter({ hideSoldOut: true }).some((item) => !item.available)).toBe(false)
  })

  it('sorts while keeping sold-out dishes last', () => {
    const desserts = menu.products.filter((item) => item.categoryId === 'desserts')
    expect(sortProducts(desserts, 'price-asc').map((item) => item.id)).toEqual([
      'sh-baklava',
      'sh-rose-cake',
      'sh-brownie',
    ])
    expect(sortProducts(desserts, 'popular')[0].id).toBe('sh-baklava')
  })

  it('groups products by category and skips empty categories', () => {
    const sections = groupByCategory(
      menu.categories,
      menu.products.filter((item) => item.dietary.includes('vegan')),
    )
    expect(sections.map((section) => section.category.id)).toEqual(['mezze', 'salads', 'drinks'])
  })
})
