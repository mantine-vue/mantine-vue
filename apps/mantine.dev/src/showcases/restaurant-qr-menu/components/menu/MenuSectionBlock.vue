<script setup lang="ts">
import { computed } from 'vue'
import { Badge, Group, SimpleGrid, Text, Title } from '@mantine-vue/core'
import { PhClock } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { isCategoryAvailable } from '../../domain/availability'
import type { MenuSection } from '../../domain/menu-query'
import SmartImage from '../common/SmartImage.vue'
import ProductCard from './cards/ProductCard.vue'

/** One category of the menu rendered with the active layout preset. */
const props = defineProps<{ section: MenuSection; anchorId: string }>()
const { t, layout, localize, format, data, clock } = useQrMenu()

const headingId = computed(() => `${props.anchorId}-title`)
const serviceWindow = computed(() => props.section.category.availableBetween)
const availableNow = computed(() => {
  const restaurant = data.restaurant.value
  return (
    !restaurant || isCategoryAvailable(props.section.category, clock.value, restaurant.timeZone)
  )
})
</script>

<template>
  <section
    :id="anchorId"
    class="qrm-section"
    :class="$style.section"
    :data-title="layout.sectionTitle"
    :aria-labelledby="headingId"
  >
    <div v-if="layout.showSectionImages && section.category.image" :class="$style.banner">
      <SmartImage :asset="section.category.image" :width="1100" :ratio="4" :alt="''" />
    </div>

    <header :class="$style.header">
      <Title :id="headingId" :order="2" :class="$style.title">
        {{ localize(section.category.name) }}
      </Title>
      <Group
        gap="xs"
        :justify="layout.sectionTitle === 'ornament' ? 'center' : 'flex-start'"
        :class="$style.meta"
      >
        <Text v-if="section.category.description" size="sm" c="dimmed">
          {{ localize(section.category.description) }}
        </Text>
        <Text size="xs" c="dimmed"
          >· {{ t('menu.items', { count: section.products.length }) }}</Text
        >
        <Badge
          v-if="serviceWindow"
          size="sm"
          radius="xl"
          variant="light"
          :color="availableNow ? 'teal' : 'gray'"
          tt="none"
        >
          <PhClock :size="12" :class="$style.icon" />
          {{
            availableNow
              ? t('menu.availableBetween', {
                  from: format.clock(serviceWindow.from),
                  to: format.clock(serviceWindow.to),
                })
              : `${t('menu.notAvailableNow')} · ${t('menu.availableBetween', { from: format.clock(serviceWindow.from), to: format.clock(serviceWindow.to) })}`
          }}
        </Badge>
      </Group>
    </header>

    <SimpleGrid
      :cols="layout.columns"
      :spacing="layout.gap"
      :vertical-spacing="layout.gap"
      role="list"
    >
      <div v-for="product in section.products" :key="product.id" role="listitem">
        <ProductCard :product="product" />
      </div>
    </SimpleGrid>
  </section>
</template>

<style module>
.section {
  padding-block: var(--mantine-spacing-lg);
}

.banner {
  margin-bottom: var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-lg);
  overflow: hidden;
}

.header {
  margin-bottom: var(--mantine-spacing-sm);
}

.title {
  font-size: var(--mantine-h3-font-size);
}

.icon {
  margin-inline-end: 4px;
  vertical-align: -2px;
}

.section[data-title='ornament'] .header {
  text-align: center;
  margin-bottom: var(--mantine-spacing-lg);
}

.section[data-title='ornament'] .title {
  font-size: var(--mantine-h2-font-size);
  font-weight: 500;

  &::before,
  &::after {
    content: '✦';
    margin-inline: 12px;
    font-size: 0.5em;
    vertical-align: middle;
    color: var(--mantine-primary-color-filled);
  }
}

.section[data-title='compact'] {
  padding-block: var(--mantine-spacing-sm);
}

.section[data-title='compact'] .title {
  font-size: var(--mantine-font-size-md);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--mantine-primary-color-filled);
}
</style>
