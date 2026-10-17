<script setup lang="ts">
import { Badge, Card, Group, Text, UnstyledButton } from '@mantine-vue/core'
import type { ProductCardModel } from '../../../composables/use-product-card'
import { useQrMenu } from '../../../app/use-qr-menu'
import type { LayoutPreset } from '../../../theme/presets'
import ProductTags from '../../common/ProductTags.vue'
import SmartImage from '../../common/SmartImage.vue'
import CardAddButton from './CardAddButton.vue'
import CardFavoriteButton from './CardFavoriteButton.vue'
import classes from './product-card.module.css'

/** "Modern" layout: image-first card. */
defineProps<{ model: ProductCardModel; layout: LayoutPreset }>()
defineEmits<{ open: []; add: []; toggleFavorite: [] }>()
const { t } = useQrMenu()
</script>

<template>
  <Card
    component="article"
    withBorder
    padding="0"
    :class="[classes.card, $style.tile]"
    :data-sold-out="model.soldOut || undefined"
  >
    <div :class="classes.image">
      <SmartImage
        :asset="model.product.images[0]"
        :width="320"
        :ratio="layout.imageRatio"
        :alt="model.name"
        :grayscale="model.soldOut"
      />
      <Badge v-if="model.soldOut" color="dark" size="sm" :class="classes.soldOut">
        {{ t('product.soldOut') }}
      </Badge>
      <CardFavoriteButton
        :active="model.favorite"
        floating
        :class="classes.favorite"
        @toggle="$emit('toggleFavorite')"
      />
    </div>
    <div :class="$style.body">
      <ProductTags :product="model.product" :max-badges="1" />
      <UnstyledButton
        :class="[classes.stretched]"
        :aria-label="t('product.viewDetails', { name: model.name })"
        @click="$emit('open')"
      >
        <Text :class="[classes.name, 'qrm-line-clamp-2']" size="sm">{{ model.name }}</Text>
      </UnstyledButton>
      <Text
        v-if="layout.descriptionLines > 0"
        size="xs"
        :class="[classes.description, `qrm-line-clamp-${layout.descriptionLines}`]"
      >
        {{ model.description }}
      </Text>
      <Group justify="space-between" wrap="nowrap" gap="xs" mt="auto" pt="xs">
        <Text size="sm" :class="classes.price">
          {{ model.priceLabel }}
          <span v-if="model.compareAtLabel" :class="classes.compareAt">{{
            model.compareAtLabel
          }}</span>
        </Text>
        <CardAddButton :model="model" size="sm" @add="$emit('add')" />
      </Group>
    </div>
  </Card>
</template>

<style module>
.tile {
  display: flex;
  flex-direction: column;
  box-shadow: var(--mantine-shadow-xs);

  @mixin hover {
    box-shadow: var(--mantine-shadow-md);
    transform: translateY(-2px);
  }
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding: var(--mantine-spacing-sm);
}
</style>
