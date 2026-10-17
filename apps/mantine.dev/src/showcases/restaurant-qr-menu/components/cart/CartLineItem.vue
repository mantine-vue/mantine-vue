<script setup lang="ts">
import { computed } from 'vue'
import { ActionIcon, Badge, Group, Text } from '@mantine-vue/core'
import { PhPencilSimple } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { useCartActions } from '../../composables/use-cart-actions'
import { useProductSheet } from '../../composables/use-product-sheet'
import type { PricedLine } from '../../domain/pricing'
import SmartImage from '../common/SmartImage.vue'
import QuantityStepper from '../common/QuantityStepper.vue'

/** A cart line with its options, notes, quantity controls and availability state. */
const props = defineProps<{ priced: PricedLine }>()
const ctx = useQrMenu()
const { t, localize } = ctx
const actions = useCartActions()
const sheet = useProductSheet()

const product = computed(() => props.priced.product)
const name = computed(() => (product.value ? localize(product.value.name) : t('cart.unavailable')))

/** Variant + selected option names, localized at render time so language switches apply. */
const options = computed(() => {
  const item = product.value
  if (!item) {
    return ''
  }
  const parts: string[] = []
  const variant = item.variants?.find((entry) => entry.id === props.priced.line.selection.variantId)
  if (variant) {
    parts.push(localize(variant.name))
  }
  for (const group of item.modifierGroups ?? []) {
    for (const optionId of props.priced.line.selection.modifiers[group.id] ?? []) {
      const option = group.options.find((entry) => entry.id === optionId)
      if (option) {
        parts.push(localize(option.name))
      }
    }
  }
  return parts.join(' · ')
})

const edit = () => {
  if (product.value) {
    ctx.overlays.cart = false
    sheet.open(product.value.id, props.priced.line.id)
  }
}
</script>

<template>
  <article :class="$style.line" :data-unavailable="priced.issue ? true : undefined">
    <div :class="$style.thumb">
      <SmartImage
        :asset="product?.images[0]"
        :width="64"
        :ratio="1"
        radius="md"
        :alt="''"
        :grayscale="Boolean(priced.issue)"
      />
    </div>
    <div :class="$style.body">
      <Group justify="space-between" wrap="nowrap" align="flex-start" gap="xs">
        <Text fw="600" size="sm" :class="$style.name">{{ name }}</Text>
        <Text
          fw="700"
          size="sm"
          class="qrm-tabular"
          :td="priced.issue ? 'line-through' : undefined"
        >
          {{ ctx.price(priced.total) }}
        </Text>
      </Group>
      <Text v-if="options" size="xs" c="dimmed">{{ options }}</Text>
      <Text v-if="priced.line.notes" size="xs" c="dimmed" fs="italic"
        >“{{ priced.line.notes }}”</Text
      >
      <Badge v-if="priced.issue" color="red" variant="light" size="sm" :mt="4" tt="none">{{
        t('cart.unavailable')
      }}</Badge>

      <Group justify="space-between" mt="xs" wrap="nowrap">
        <Text size="xs" c="dimmed" class="qrm-tabular">{{
          t('cart.each', { price: ctx.price(priced.unitPrice) })
        }}</Text>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            v-if="product && !priced.issue"
            variant="subtle"
            color="gray"
            radius="xl"
            :aria-label="t('cart.edit', { name })"
            @click="edit"
          >
            <PhPencilSimple :size="16" />
          </ActionIcon>
          <QuantityStepper
            :model-value="priced.line.quantity"
            :max="actions.maxQuantity()"
            size="sm"
            removable
            :label="name"
            @update:model-value="(value: number) => actions.setQuantity(priced.line.id, value)"
            @remove="actions.removeLine(priced.line.id)"
          />
        </Group>
      </Group>
    </div>
  </article>
</template>

<style module>
.line {
  display: flex;
  gap: var(--mantine-spacing-sm);
  padding-block: var(--mantine-spacing-sm);
  border-bottom: 1px solid var(--mantine-color-default-border);

  &[data-unavailable] .name {
    color: var(--mantine-color-dimmed);
  }
}

.thumb {
  width: 64px;
  flex-shrink: 0;

  & > div {
    border-radius: var(--mantine-radius-md);
  }
}

.body {
  flex: 1;
  min-width: 0;
}

.name {
  min-width: 0;
}
</style>
