<script setup lang="ts">
import { Group, Text, UnstyledButton } from '@mantine-vue/core'
import { useQrMenu } from '../../../app/use-qr-menu'
import type { ProductCardModel } from '../../../composables/use-product-card'
import type { LayoutPreset } from '../../../theme/presets'
import ProductTags from '../../common/ProductTags.vue'
import SmartImage from '../../common/SmartImage.vue'
import CardAddButton from './CardAddButton.vue'
import classes from './product-card.module.css'

/** "Compact" layout: dense rows for quick scanning and ordering. */
defineProps<{ model: ProductCardModel; layout: LayoutPreset }>()
defineEmits<{ open: []; add: []; toggleFavorite: [] }>()
const { t } = useQrMenu()
</script>

<template>
  <article :class="[classes.card, $style.dense]" :data-sold-out="model.soldOut || undefined">
    <div :class="$style.thumb">
      <SmartImage
        :asset="model.product.images[0]"
        :width="48"
        :ratio="1"
        radius="sm"
        :alt="''"
        :grayscale="model.soldOut"
      />
    </div>
    <div :class="$style.text">
      <Group :gap="6" wrap="nowrap">
        <UnstyledButton
          :class="[classes.stretched, $style.title]"
          :aria-label="t('product.viewDetails', { name: model.name })"
          @click="$emit('open')"
        >
          <Text size="sm" :class="classes.name" truncate>{{ model.name }}</Text>
        </UnstyledButton>
        <ProductTags :product="model.product" :max-badges="0" />
      </Group>
      <Text
        v-if="layout.descriptionLines > 0"
        size="xs"
        :class="[classes.description, 'qrm-line-clamp-1']"
      >
        {{ model.soldOut ? t('product.soldOut') : model.description }}
      </Text>
    </div>
    <Text size="sm" :class="classes.price">{{ model.priceLabel }}</Text>
    <CardAddButton :model="model" size="sm" @add="$emit('add')" />
  </article>
</template>

<style module>
.dense {
  display: flex;
  align-items: center;
  gap: var(--mantine-spacing-sm);
  padding-block: 10px;
  padding-inline: 4px;
  border-bottom: 1px dashed var(--mantine-color-default-border);
}

.thumb {
  width: 44px;
  flex-shrink: 0;

  & > div {
    border-radius: var(--mantine-radius-sm);
  }
}

.text {
  flex: 1;
  min-width: 0;
}

.title {
  min-width: 0;
}
</style>
