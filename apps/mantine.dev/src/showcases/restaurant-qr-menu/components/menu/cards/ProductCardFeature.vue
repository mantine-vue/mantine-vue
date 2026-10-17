<script setup lang="ts">
import { Badge, Divider, Group, Stack, Text, UnstyledButton } from '@mantine-vue/core'
import { useQrMenu } from '../../../app/use-qr-menu'
import type { ProductCardModel } from '../../../composables/use-product-card'
import type { LayoutPreset } from '../../../theme/presets'
import ProductTags from '../../common/ProductTags.vue'
import SmartImage from '../../common/SmartImage.vue'
import CardAddButton from './CardAddButton.vue'
import CardFavoriteButton from './CardFavoriteButton.vue'
import classes from './product-card.module.css'

/** "Elegant" layout: large photography and refined, centered typography. */
defineProps<{ model: ProductCardModel; layout: LayoutPreset }>()
defineEmits<{ open: []; add: []; toggleFavorite: [] }>()
const { t } = useQrMenu()
</script>

<template>
  <article :class="[classes.card, $style.feature]" :data-sold-out="model.soldOut || undefined">
    <div :class="[classes.image, $style.media]">
      <SmartImage
        :asset="model.product.images[0]"
        :width="560"
        :ratio="layout.imageRatio"
        :alt="model.name"
        :grayscale="model.soldOut"
      />
      <Badge v-if="model.soldOut" color="dark" size="md" :class="classes.soldOut">
        {{ t('product.soldOut') }}
      </Badge>
      <CardFavoriteButton
        :active="model.favorite"
        floating
        :class="classes.favorite"
        @toggle="$emit('toggleFavorite')"
      />
    </div>
    <Stack :gap="6" align="center" ta="center" px="sm" pt="md">
      <ProductTags :product="model.product" :max-badges="1" />
      <UnstyledButton
        :class="classes.stretched"
        :aria-label="t('product.viewDetails', { name: model.name })"
        @click="$emit('open')"
      >
        <Text :class="[classes.name, $style.name]">{{ model.name }}</Text>
      </UnstyledButton>
      <Divider :w="40" color="brand" size="sm" />
      <Text
        v-if="layout.descriptionLines > 0"
        size="sm"
        :class="[
          classes.description,
          `qrm-line-clamp-${layout.descriptionLines}`,
          $style.description,
        ]"
      >
        {{ model.description }}
      </Text>
      <Group gap="md" justify="center" mt="xs">
        <Text :class="[classes.price, $style.price]">
          {{ model.priceLabel }}
          <span v-if="model.compareAtLabel" :class="classes.compareAt">{{
            model.compareAtLabel
          }}</span>
        </Text>
        <CardAddButton :model="model" variant="button" size="md" @add="$emit('add')" />
      </Group>
    </Stack>
  </article>
</template>

<style module>
.feature {
  padding-bottom: var(--mantine-spacing-md);
}

.media {
  border-radius: var(--mantine-radius-md);
}

.name {
  font-size: var(--mantine-font-size-xl);
  font-weight: 600;
  letter-spacing: 0.01em;
}

.description {
  max-width: 34ch;
  font-style: italic;
}

.price {
  font-size: var(--mantine-font-size-lg);
  font-family: var(--mantine-font-family-headings);
  color: var(--mantine-color-brand-text);
}
</style>
