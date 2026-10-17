<script setup lang="ts">
import { computed } from 'vue'
import { Drawer, EmptyState, Stack } from '@mantine-vue/core'
import { PhHeart } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { useIsMobile } from '../../composables/use-is-mobile'
import type { Product } from '../../domain/types'
import ProductCard from '../menu/cards/ProductCard.vue'

/** Saved dishes for the current restaurant, rendered with compact rows. */
const ctx = useQrMenu()
const { t, overlays, customer, data } = ctx
const isMobile = useIsMobile()

const favorites = computed(() =>
  customer
    .favorites(ctx.restaurantId.value)
    .map((id) => data.productsById.value.get(id))
    .filter((product): product is Product => Boolean(product)),
)
</script>

<template>
  <Drawer
    :opened="overlays.favorites"
    :position="isMobile ? 'bottom' : 'right'"
    :size="isMobile ? '80%' : 'md'"
    :radius="isMobile ? 'lg' : 0"
    :title="t('favorites.title')"
    :closeButtonProps="{ 'aria-label': t('app.close') }"
    @close="overlays.favorites = false"
  >
    <EmptyState
      v-if="!favorites.length"
      :title="t('favorites.empty')"
      :description="t('favorites.emptyHint')"
      variant="light"
      color="red"
    >
      <template #icon><PhHeart :size="24" /></template>
    </EmptyState>
    <Stack v-else :gap="0">
      <ProductCard
        v-for="product in favorites"
        :key="product.id"
        :product="product"
        variant="row"
      />
    </Stack>
  </Drawer>
</template>
