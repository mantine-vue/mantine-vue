<script setup lang="ts">
import { Text, UnstyledButton } from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'
import { useProductCard } from '../../composables/use-product-card'
import type { Product } from '../../domain/types'
import SmartImage from '../common/SmartImage.vue'
import CardAddButton from './cards/CardAddButton.vue'
import classes from './cards/product-card.module.css'

/** Small tile used in horizontal rails (chef's picks, recently viewed, upsell). */
const props = withDefaults(defineProps<{ product: Product; width?: number }>(), { width: 148 })
const { t } = useQrMenu()
const { model, actions } = useProductCard(() => props.product)
</script>

<template>
  <article
    :class="[classes.card, $style.tile]"
    :style="{ width: `${width}px` }"
    :data-sold-out="model.soldOut || undefined"
  >
    <div :class="[classes.image, $style.media]">
      <SmartImage
        :asset="product.images[0]"
        :width="width"
        :ratio="1"
        :alt="model.name"
        :grayscale="model.soldOut"
      />
      <CardAddButton :model="model" size="sm" :class="$style.add" @add="actions.add" />
    </div>
    <UnstyledButton
      :class="classes.stretched"
      :aria-label="t('product.viewDetails', { name: model.name })"
      @click="actions.open"
    >
      <Text size="sm" :class="[classes.name, 'qrm-line-clamp-2']" :mt="6">{{ model.name }}</Text>
    </UnstyledButton>
    <Text size="sm" :class="classes.price" c="dimmed">
      {{ model.soldOut ? t('product.soldOut') : model.priceLabel }}
    </Text>
  </article>
</template>

<style module>
.tile {
  height: auto;
}

.media {
  border-radius: var(--mantine-radius-md);
  overflow: visible;

  & > div:first-child {
    border-radius: var(--mantine-radius-md);
  }
}

.add {
  position: absolute;
  inset-inline-end: 6px;
  bottom: 6px;
}
</style>
