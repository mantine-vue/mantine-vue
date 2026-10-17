import { computed, reactive, ref } from 'vue'
import {
  countActiveFilters,
  createEmptyFilters,
  filterProducts,
  groupByCategory,
  sortProducts,
  type MenuFilters,
  type MenuSort,
} from '../domain/menu-query'
import type { MenuCategory, Product } from '../domain/types'

/** Search, filter and sort state of the menu (session only, not persisted). */
export function createMenuFilterStore(source: {
  products: () => Product[]
  categories: () => MenuCategory[]
  categoriesById: () => Map<string, MenuCategory>
}) {
  const filters = reactive<MenuFilters>(createEmptyFilters())
  const sort = ref<MenuSort>('recommended')

  const filteredProducts = computed(() =>
    sortProducts(
      filterProducts(source.products(), filters, { categories: source.categoriesById() }),
      sort.value,
    ),
  )

  const sections = computed(() => groupByCategory(source.categories(), filteredProducts.value))
  const activeCount = computed(() => countActiveFilters(filters))
  const isFiltering = computed(
    () => activeCount.value > 0 || filters.query.trim().length > 0 || sort.value !== 'recommended',
  )

  return {
    filters,
    sort,
    filteredProducts,
    sections,
    activeCount,
    isFiltering,
    /** Applies a complete filter set at once (used by the filters drawer). */
    apply(next: MenuFilters, nextSort: MenuSort) {
      Object.assign(filters, next)
      sort.value = nextSort
    },
    preview(next: MenuFilters) {
      return filterProducts(source.products(), next, { categories: source.categoriesById() }).length
    },
    setQuery(query: string) {
      filters.query = query
    },
    reset() {
      Object.assign(filters, createEmptyFilters())
      sort.value = 'recommended'
    },
  }
}

export type MenuFilterStore = ReturnType<typeof createMenuFilterStore>
