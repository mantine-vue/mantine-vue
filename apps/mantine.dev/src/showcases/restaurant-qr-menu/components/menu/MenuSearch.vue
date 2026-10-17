<script setup lang="ts">
import { computed, h } from 'vue'
import { Avatar, Text } from '@mantine-vue/core'
import {
  Spotlight,
  type SpotlightActionData,
  type SpotlightActionGroupData,
  type SpotlightActions,
  type SpotlightStore,
} from '@mantine-vue/spotlight'
import { PhListMagnifyingGlass, PhMagnifyingGlass, PhSquaresFour } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { useProductSheet } from '../../composables/use-product-sheet'
import { getProductSearchText, matchesQuery, normalizeSearchText } from '../../domain/menu-query'
import { getStartingPrice } from '../../domain/pricing'
import { imageSrc } from '../../utils/images'

/**
 * Menu search built on Mantine Spotlight. Matches dishes and categories in every
 * menu language (Arabic letter variants and diacritics are normalized).
 */
const props = defineProps<{ store: SpotlightStore }>()
const emit = defineEmits<{ category: [categoryId: string]; showAll: [query: string] }>()

const ctx = useQrMenu()
const { t, data, localize } = ctx
const sheet = useProductSheet()

const SHOW_ALL_ID = '__show-all__'
let lastQuery = ''

const actions = computed<SpotlightActions[]>(() => {
  const categories: SpotlightActionGroupData = {
    group: t('menu.categories'),
    actions: data.categories.value.map((category) => ({
      id: `category:${category.id}`,
      label: localize(category.name),
      keywords: normalizeSearchText(Object.values(category.name).join(' ')),
      leftSection: h(PhSquaresFour, { size: 20 }),
      onClick: () => emit('category', category.id),
    })),
  }

  const dishes: SpotlightActionGroupData = {
    group: t('menu.dishes'),
    actions: data.products.value.map<SpotlightActionData>((product) => ({
      id: `product:${product.id}`,
      label: localize(product.name),
      description: `${ctx.price(getStartingPrice(product))} · ${localize(data.categoriesById.value.get(product.categoryId)?.name)}${product.available ? '' : ` · ${t('product.soldOut')}`}`,
      keywords: getProductSearchText(product, data.categoriesById.value.get(product.categoryId)),
      leftSection: h(Avatar, {
        src: imageSrc(product.images[0], 80),
        radius: 'md',
        size: 44,
        alt: '',
      }),
      onClick: () => sheet.open(product.id),
    })),
  }

  return [categories, dishes]
})

/** Custom filter: normalized, multi-language, all terms must match. */
const filter = (query: string, list: SpotlightActions[]): SpotlightActions[] => {
  lastQuery = query
  if (!query.trim()) {
    return list
  }
  const groups = list
    .map((group) => {
      const grouped = group as SpotlightActionGroupData
      return {
        ...grouped,
        actions: grouped.actions.filter((action) =>
          matchesQuery(
            `${normalizeSearchText(action.label ?? '')} ${String(action.keywords ?? '')}`,
            query,
          ),
        ),
      }
    })
    .filter((group) => group.actions.length > 0)

  if (groups.some((group) => group.actions.some((action) => action.id.startsWith('product:')))) {
    groups.push({
      group: t('menu.resultsFor', { query }),
      actions: [
        {
          id: SHOW_ALL_ID,
          label: t('menu.resultsFor', { query }),
          leftSection: h(PhListMagnifyingGlass, { size: 20 }),
          onClick: () => emit('showAll', lastQuery),
        },
      ],
    })
  }
  return groups
}
</script>

<template>
  <Spotlight
    :store="props.store"
    :actions="actions"
    :filter="filter"
    :limit="40"
    highlightQuery
    scrollable
    maxHeight="70vh"
    shortcut="mod + K"
    :nothingFound="
      () => h(Text, { c: 'dimmed', ta: 'center', size: 'sm' }, () => t('menu.noResults'))
    "
    :searchProps="{
      leftSection: () => h(PhMagnifyingGlass, { size: 20 }),
      placeholder: t('header.searchPlaceholder'),
      'aria-label': t('header.search'),
    }"
  />
</template>
