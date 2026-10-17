<script setup lang="ts">
import { ActionIcon, Badge, Button } from '@mantine-vue/core'
import { PhPlus } from '@phosphor-icons/vue'
import { useQrMenu } from '../../../app/use-qr-menu'
import type { ProductCardModel } from '../../../composables/use-product-card'
import classes from './product-card.module.css'

withDefaults(
  defineProps<{
    model: ProductCardModel
    variant?: 'icon' | 'button'
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { variant: 'icon', size: 'md' },
)
defineEmits<{ add: [] }>()

const { t, format } = useQrMenu()
</script>

<template>
  <div :class="classes.above">
    <Button
      v-if="variant === 'button'"
      :size="size === 'lg' ? 'sm' : 'xs'"
      radius="xl"
      variant="light"
      :disabled="model.soldOut"
      :aria-label="
        model.soldOut ? t('product.soldOut') : t('product.quickAdd', { name: model.name })
      "
      @click.stop="$emit('add')"
    >
      <template #leftSection><PhPlus :size="14" weight="bold" /></template>
      {{
        model.soldOut
          ? t('product.soldOut')
          : model.quickAddable
            ? t('product.add')
            : t('product.customize')
      }}
    </Button>
    <ActionIcon
      v-else
      :size="size === 'lg' ? 'xl' : size === 'md' ? 'lg' : 'md'"
      radius="xl"
      variant="filled"
      :disabled="model.soldOut"
      :aria-label="
        model.soldOut ? t('product.soldOut') : t('product.quickAdd', { name: model.name })
      "
      @click.stop="$emit('add')"
    >
      <PhPlus :size="size === 'sm' ? 14 : 18" weight="bold" />
    </ActionIcon>
    <Badge
      v-if="model.inCart > 0"
      size="xs"
      circle
      color="dark"
      :class="classes.inCart"
      :aria-label="t('product.inCart', { count: model.inCart })"
    >
      {{ format.number(model.inCart) }}
    </Badge>
  </div>
</template>
