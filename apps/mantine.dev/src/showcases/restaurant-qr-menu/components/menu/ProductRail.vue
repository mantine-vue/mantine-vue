<script setup lang="ts">
import { Group, Title } from '@mantine-vue/core'
import type { Product } from '../../domain/types'
import ProductRailItem from './ProductRailItem.vue'

/** Horizontally scrolling list of dishes with native scroll-snap (fast on low-end phones). */
withDefaults(defineProps<{ title: string; products: Product[]; itemWidth?: number }>(), {
  itemWidth: 148,
})
</script>

<template>
  <section v-if="products.length" :aria-label="title" :class="$style.rail">
    <Group justify="space-between" mb="xs" px="md">
      <Title :order="2" size="h4">{{ title }}</Title>
      <slot name="action" />
    </Group>
    <div class="qrm-scroll-x" role="list">
      <div v-for="product in products" :key="product.id" role="listitem">
        <ProductRailItem :product="product" :width="itemWidth" />
      </div>
    </div>
  </section>
</template>

<style module>
.rail {
  margin-inline: calc(var(--mantine-spacing-md) * -1);
}
</style>
