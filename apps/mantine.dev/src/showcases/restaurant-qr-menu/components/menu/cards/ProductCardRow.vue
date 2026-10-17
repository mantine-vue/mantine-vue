<script setup lang="ts">
import { Badge, Group, Paper, Text, UnstyledButton } from '@mantine-vue/core'
import { useQrMenu } from '../../../app/use-qr-menu'
import type { ProductCardModel } from '../../../composables/use-product-card'
import type { LayoutPreset } from '../../../theme/presets'
import ProductTags from '../../common/ProductTags.vue'
import SmartImage from '../../common/SmartImage.vue'
import CardAddButton from './CardAddButton.vue'
import CardFavoriteButton from './CardFavoriteButton.vue'
import classes from './product-card.module.css'

/** "Classic" layout: text-first row with a thumbnail, like a printed menu. */
defineProps<{ model: ProductCardModel; layout: LayoutPreset }>()
defineEmits<{ open: []; add: []; toggleFavorite: [] }>()
const { t } = useQrMenu()
</script>

<template>
  <Paper
    component="article"
    :class="[classes.card, $style.row]"
    :data-sold-out="model.soldOut || undefined"
    p="sm"
  >
    <div :class="$style.content">
      <Group gap="xs" wrap="nowrap" align="flex-start">
        <UnstyledButton
          :class="[classes.stretched, $style.title]"
          :aria-label="t('product.viewDetails', { name: model.name })"
          @click="$emit('open')"
        >
          <Text :class="classes.name" size="md">{{ model.name }}</Text>
        </UnstyledButton>
        <CardFavoriteButton
          :active="model.favorite"
          :class="classes.above"
          @toggle="$emit('toggleFavorite')"
        />
      </Group>
      <Text
        v-if="layout.descriptionLines > 0"
        size="sm"
        :class="[classes.description, `qrm-line-clamp-${layout.descriptionLines}`]"
      >
        {{ model.description }}
      </Text>
      <Group gap="xs" :mt="6" wrap="wrap">
        <Text size="sm" :class="classes.price" c="brand">
          {{ model.priceLabel }}
          <span v-if="model.compareAtLabel" :class="classes.compareAt">{{
            model.compareAtLabel
          }}</span>
        </Text>
        <Badge v-if="model.soldOut" color="gray" size="sm" variant="outline">{{
          t('product.soldOut')
        }}</Badge>
        <ProductTags :product="model.product" :max-badges="2" />
      </Group>
    </div>
    <div :class="$style.media">
      <SmartImage
        :asset="model.product.images[0]"
        :width="112"
        :ratio="1"
        radius="md"
        :alt="model.name"
        :grayscale="model.soldOut"
      />
      <CardAddButton :model="model" size="sm" :class="$style.add" @add="$emit('add')" />
    </div>
  </Paper>
</template>

<style module>
.row {
  display: flex;
  gap: var(--mantine-spacing-md);
  align-items: flex-start;
  border-bottom: 1px solid var(--mantine-color-default-border);
  border-radius: 0;
  background: transparent;
}

.content {
  flex: 1;
  min-width: 0;
}

.title {
  flex: 1;
  min-width: 0;
}

.media {
  position: relative;
  width: 104px;
  flex-shrink: 0;
  border-radius: var(--mantine-radius-md);
  overflow: visible;

  & > div:first-child {
    border-radius: var(--mantine-radius-md);
  }
}

.add {
  position: absolute;
  inset-inline-end: -6px;
  bottom: -6px;
}
</style>
