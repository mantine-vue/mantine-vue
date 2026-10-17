<script setup lang="ts">
import { computed } from 'vue'
import { Button, Group, Pill, Text } from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'

interface ActiveChip {
  key: string
  label: string
  remove: () => void
}

/** Removable pills summarising the search query, filters and sort order. */
const ctx = useQrMenu()
const { t, menuFilters } = ctx
const filters = menuFilters.filters

const chips = computed<ActiveChip[]>(() => {
  const list: ActiveChip[] = []
  if (filters.query.trim()) {
    list.push({
      key: 'query',
      label: `“${filters.query.trim()}”`,
      remove: () => (filters.query = ''),
    })
  }
  if (menuFilters.sort.value !== 'recommended') {
    list.push({
      key: 'sort',
      label: t(`filters.sorts.${menuFilters.sort.value}`),
      remove: () => (menuFilters.sort.value = 'recommended'),
    })
  }
  filters.dietary.forEach((tag) =>
    list.push({
      key: `diet-${tag}`,
      label: t(`dietary.${tag}`),
      remove: () => filters.dietary.splice(filters.dietary.indexOf(tag), 1),
    }),
  )
  filters.excludeAllergens.forEach((allergen) =>
    list.push({
      key: `allergen-${allergen}`,
      label: `− ${t(`allergens.${allergen}`)}`,
      remove: () => filters.excludeAllergens.splice(filters.excludeAllergens.indexOf(allergen), 1),
    }),
  )
  filters.badges.forEach((badge) =>
    list.push({
      key: `badge-${badge}`,
      label: t(`badges.${badge}`),
      remove: () => filters.badges.splice(filters.badges.indexOf(badge), 1),
    }),
  )
  if (filters.maxSpice !== null) {
    list.push({
      key: 'spice',
      label: `≤ ${t(`spice.${filters.maxSpice as 0 | 1 | 2 | 3}`)}`,
      remove: () => (filters.maxSpice = null),
    })
  }
  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    list.push({
      key: 'price',
      label: `${ctx.price(min)} – ${ctx.price(max)}`,
      remove: () => (filters.priceRange = null),
    })
  }
  if (filters.hideSoldOut) {
    list.push({
      key: 'sold-out',
      label: t('filters.hideSoldOut'),
      remove: () => (filters.hideSoldOut = false),
    })
  }
  return list
})
</script>

<template>
  <div v-if="chips.length" :class="$style.root" role="region" :aria-label="t('filters.title')">
    <Group gap="xs" justify="space-between" wrap="nowrap" align="flex-start">
      <Group :gap="6" wrap="wrap">
        <Text size="sm" fw="600" aria-live="polite">
          {{ t('menu.results', { count: menuFilters.filteredProducts.value.length }) }}
        </Text>
        <Pill
          v-for="chip in chips"
          :key="chip.key"
          withRemoveButton
          :removeButtonProps="{ 'aria-label': t('filters.removeFilter', { name: chip.label }) }"
          @remove="chip.remove"
        >
          {{ chip.label }}
        </Pill>
      </Group>
      <Button variant="subtle" size="compact-sm" @click="menuFilters.reset()">
        {{ t('filters.reset') }}
      </Button>
    </Group>
  </div>
</template>

<style module>
.root {
  padding-top: var(--mantine-spacing-md);
}
</style>
