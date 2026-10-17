import { getStartingPrice } from './pricing'
import type {
  Allergen,
  DietaryTag,
  LocalizedText,
  MenuCategory,
  Money,
  Product,
  ProductBadge,
} from './types'

export type MenuSort = 'recommended' | 'popular' | 'rating' | 'price-asc' | 'price-desc' | 'newest'

export const MENU_SORTS: MenuSort[] = [
  'recommended',
  'popular',
  'rating',
  'price-asc',
  'price-desc',
  'newest',
]

export interface MenuFilters {
  query: string
  dietary: DietaryTag[]
  excludeAllergens: Allergen[]
  badges: ProductBadge[]
  /** Maximum spice level, `null` for any. */
  maxSpice: number | null
  /** Inclusive price range in minor units, `null` for any. */
  priceRange: [Money, Money] | null
  hideSoldOut: boolean
}

export function createEmptyFilters(): MenuFilters {
  return {
    query: '',
    dietary: [],
    excludeAllergens: [],
    badges: [],
    maxSpice: null,
    priceRange: null,
    hideSoldOut: false,
  }
}

/** Number of active filters, excluding the free text query. */
export function countActiveFilters(filters: MenuFilters) {
  return (
    filters.dietary.length +
    filters.excludeAllergens.length +
    filters.badges.length +
    (filters.maxSpice !== null ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.hideSoldOut ? 1 : 0)
  )
}

const ARABIC_DIACRITICS = /[ً-ٰٟـ]/g

/**
 * Lower-cases, strips Latin accents and Arabic diacritics/tatweel and unifies common
 * Arabic letter variants so "شاورما" matches "شاورمــا" and "كبة" matches "كبه".
 */
export function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(ARABIC_DIACRITICS, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim()
}

function textValues(text: LocalizedText | undefined) {
  return text ? Object.values(text).filter((value): value is string => Boolean(value)) : []
}

/** Searchable text of a product across every content language. */
export function getProductSearchText(product: Product, category?: MenuCategory) {
  return normalizeSearchText(
    [
      ...textValues(product.name),
      ...textValues(product.description),
      ...textValues(product.keywords),
      ...textValues(category?.name),
    ].join(' '),
  )
}

export function matchesQuery(searchText: string, query: string) {
  const terms = normalizeSearchText(query).split(' ').filter(Boolean)
  return terms.every((term) => searchText.includes(term))
}

export interface FilterContext {
  categories: Map<string, MenuCategory>
}

export function filterProducts(products: Product[], filters: MenuFilters, context: FilterContext) {
  return products.filter((product) => {
    if (filters.hideSoldOut && !product.available) {
      return false
    }

    if (filters.dietary.some((tag) => !product.dietary.includes(tag))) {
      return false
    }

    if (filters.excludeAllergens.some((allergen) => product.allergens.includes(allergen))) {
      return false
    }

    if (filters.badges.length && !filters.badges.some((badge) => product.badges.includes(badge))) {
      return false
    }

    if (filters.maxSpice !== null && (product.spiceLevel ?? 0) > filters.maxSpice) {
      return false
    }

    if (filters.priceRange) {
      const price = getStartingPrice(product)
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false
      }
    }

    if (filters.query.trim()) {
      return matchesQuery(
        getProductSearchText(product, context.categories.get(product.categoryId)),
        filters.query,
      )
    }

    return true
  })
}

/** Returns a sorted copy. `recommended` keeps the restaurant's own ordering. */
export function sortProducts(products: Product[], sort: MenuSort): Product[] {
  const indexed = products.map((product, index) => ({ product, index }))
  const availableFirst = (a: Product, b: Product) => Number(b.available) - Number(a.available)

  const comparators: Record<MenuSort, (a: Product, b: Product) => number> = {
    recommended: () => 0,
    popular: (a, b) => b.popularity - a.popularity,
    rating: (a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0),
    'price-asc': (a, b) => getStartingPrice(a) - getStartingPrice(b),
    'price-desc': (a, b) => getStartingPrice(b) - getStartingPrice(a),
    newest: (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  }

  return indexed
    .sort(
      (a, b) =>
        availableFirst(a.product, b.product) ||
        comparators[sort](a.product, b.product) ||
        a.index - b.index,
    )
    .map((item) => item.product)
}

export interface MenuSection {
  category: MenuCategory
  products: Product[]
}

/** Groups products by category, preserving category order and dropping empty sections. */
export function groupByCategory(categories: MenuCategory[], products: Product[]): MenuSection[] {
  const byCategory = new Map<string, Product[]>()
  for (const product of products) {
    const list = byCategory.get(product.categoryId) ?? []
    list.push(product)
    byCategory.set(product.categoryId, list)
  }

  return categories
    .map((category) => ({ category, products: byCategory.get(category.id) ?? [] }))
    .filter((section) => section.products.length > 0)
}

/** Min / max starting price of the menu, used by the price range filter. */
export function getPriceBounds(products: Product[]): [Money, Money] {
  if (products.length === 0) {
    return [0, 0]
  }
  const prices = products.map(getStartingPrice)
  return [Math.min(...prices), Math.max(...prices)]
}
