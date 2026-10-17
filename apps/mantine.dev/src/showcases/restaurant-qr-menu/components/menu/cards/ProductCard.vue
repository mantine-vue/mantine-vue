<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useQrMenu } from '../../../app/use-qr-menu'
import { useProductCard } from '../../../composables/use-product-card'
import type { Product } from '../../../domain/types'
import type { LayoutPreset } from '../../../theme/presets'
import ProductCardDense from './ProductCardDense.vue'
import ProductCardFeature from './ProductCardFeature.vue'
import ProductCardRow from './ProductCardRow.vue'
import ProductCardTile from './ProductCardTile.vue'

/**
 * Picks the card presentation for the active layout preset. Every variant gets the
 * same view model and actions from `useProductCard`.
 */
const props = defineProps<{ product: Product; variant?: LayoutPreset['card'] }>()

const VARIANTS: Record<LayoutPreset['card'], Component> = {
  row: ProductCardRow,
  card: ProductCardTile,
  feature: ProductCardFeature,
  dense: ProductCardDense,
}

const { layout } = useQrMenu()
const { model, actions } = useProductCard(() => props.product)
const component = computed(() => VARIANTS[props.variant ?? layout.value.card])
</script>

<template>
  <component
    :is="component"
    :model="model"
    :layout="layout"
    @open="actions.open"
    @add="actions.add"
    @toggle-favorite="actions.toggleFavorite"
  />
</template>
