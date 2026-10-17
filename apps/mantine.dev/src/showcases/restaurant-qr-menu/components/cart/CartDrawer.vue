<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Alert,
  Badge,
  Button,
  Drawer,
  EmptyState,
  Group,
  Stack,
  Text,
  Textarea,
} from '@mantine-vue/core'
import { useNetwork } from '@mantine-vue/hooks'
import { PhArrowRight, PhShoppingBag, PhWarningCircle } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { useIsMobile } from '../../composables/use-is-mobile'
import type { Product } from '../../domain/types'
import ConfirmButton from '../common/ConfirmButton.vue'
import ProductRail from '../menu/ProductRail.vue'
import CartLineItem from './CartLineItem.vue'
import PriceSummary from './PriceSummary.vue'
import PromoCodeField from './PromoCodeField.vue'

/** Cart review: lines, upsell, notes, promo code and the price breakdown. */
const ctx = useQrMenu()
const { t, cart, overlays, data, totals, settings, pricedLines, mode } = ctx
const router = useRouter()
const isMobile = useIsMobile()
const network = useNetwork()

const hasIssues = computed(() => pricedLines.value.some((line) => line.issue))

/** Pairings of what is already in the cart, then popular dishes. */
const upsell = computed<Product[]>(() => {
  const inCart = new Set(cart.lines.value.map((line) => line.productId))
  const products = data.productsById.value
  const pairings = cart.lines.value.flatMap((line) => products.get(line.productId)?.pairsWith ?? [])
  const popular = [...data.products.value]
    .sort((a, b) => b.popularity - a.popularity)
    .map((item) => item.id)
  return [...new Set([...pairings, ...popular])]
    .filter((id) => !inCart.has(id))
    .map((id) => products.get(id))
    .filter((item): item is Product => Boolean(item && item.available))
    .slice(0, 8)
})

const minimumShortfall = computed(() => {
  const delivery = settings.value?.delivery
  if (mode.value !== 'delivery' || !delivery || !totals.value) {
    return 0
  }
  return Math.max(0, delivery.minimumOrder - totals.value.subtotal)
})

const canCheckout = computed(
  () =>
    !cart.isEmpty.value && !hasIssues.value && minimumShortfall.value === 0 && network.value.online,
)

const checkout = () => {
  overlays.cart = false
  router.push({ name: 'rqm-checkout' })
}

const browse = () => {
  overlays.cart = false
  router.push({ name: 'rqm-menu' })
}
</script>

<template>
  <Drawer
    :opened="overlays.cart"
    :position="isMobile ? 'bottom' : 'right'"
    :size="isMobile ? '92%' : 'md'"
    :radius="isMobile ? 'lg' : 0"
    :closeButtonProps="{ 'aria-label': t('app.close') }"
    @close="overlays.cart = false"
  >
    <template #title>
      <Group gap="xs">
        <Text fw="700" size="lg">{{ t('cart.title') }}</Text>
        <Badge variant="light" tt="none">{{ t(`modes.${mode}`) }}</Badge>
        <Badge v-if="mode === 'dine-in' && ctx.table.value" variant="outline" tt="none">
          {{ t('table.label', { table: ctx.table.value.label }) }}
        </Badge>
      </Group>
    </template>

    <EmptyState
      v-if="cart.isEmpty.value"
      size="md"
      variant="light"
      :title="t('cart.empty')"
      :description="t('cart.emptyHint')"
      :class="$style.empty"
    >
      <template #icon><PhShoppingBag :size="28" /></template>
      <Button mt="md" radius="xl" @click="browse">{{ t('cart.browse') }}</Button>
    </EmptyState>

    <Stack v-else gap="md" :class="$style.content">
      <div>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">{{ t('cart.items', { count: cart.itemCount.value }) }}</Text>
          <ConfirmButton :message="t('cart.clearConfirm')" @confirm="cart.clear()">
            {{ t('cart.clear') }}
          </ConfirmButton>
        </Group>
        <CartLineItem v-for="priced in pricedLines" :key="priced.line.id" :priced="priced" />
      </div>

      <Alert v-if="hasIssues" color="red" variant="light" radius="md">
        <template #icon><PhWarningCircle :size="20" /></template>
        {{ t('cart.unavailableHint') }}
      </Alert>

      <ProductRail :title="t('cart.upsell')" :products="upsell" :item-width="120" />

      <Textarea
        :model-value="cart.cart.value.notes"
        :label="t('cart.notes')"
        :placeholder="t('cart.notesPlaceholder')"
        :maxlength="300"
        autosize
        :minRows="2"
        radius="md"
        @update:model-value="(value: string) => cart.setNotes(value)"
      />

      <PromoCodeField />

      <PriceSummary
        v-if="totals && settings"
        :totals="totals"
        :tax-label="settings.taxLabel"
        :tax-rate="settings.taxRate"
        :promo-code="cart.cart.value.promoCode"
        :is-delivery="mode === 'delivery'"
      />

      <Alert
        v-if="minimumShortfall > 0 && settings?.delivery"
        color="orange"
        variant="light"
        radius="md"
      >
        {{
          t('cart.minimumOrder', {
            amount: ctx.price(minimumShortfall),
            minimum: ctx.price(settings.delivery.minimumOrder),
          })
        }}
      </Alert>
      <Alert v-if="!network.online" color="orange" variant="light" radius="md">
        {{ t('checkout.offline') }}
      </Alert>
    </Stack>

    <div v-if="!cart.isEmpty.value" :class="$style.footer">
      <Button
        size="md"
        radius="xl"
        fullWidth
        :disabled="!canCheckout"
        :classNames="{ inner: $style.fullWidth, label: $style.fullWidth }"
        @click="checkout"
      >
        <span :class="$style.checkoutLabel">
          <span>{{ t('cart.checkout') }}</span>
          <span class="qrm-tabular">
            {{ totals ? ctx.price(totals.total) : '' }}
            <PhArrowRight :size="16" class="qrm-flip-rtl" :class="$style.arrow" />
          </span>
        </span>
      </Button>
    </div>
  </Drawer>
</template>

<style module>
.content {
  padding-bottom: var(--mantine-spacing-md);
}

.empty {
  padding-block: 48px;
}

.footer {
  position: sticky;
  bottom: 0;
  padding-block: var(--mantine-spacing-sm);
  padding-bottom: calc(var(--mantine-spacing-sm) + env(safe-area-inset-bottom));
  background-color: var(--mantine-color-body);
  border-top: 1px solid var(--mantine-color-default-border);
}

.fullWidth {
  width: 100%;
}

.checkoutLabel {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: var(--mantine-spacing-md);
}

.arrow {
  vertical-align: -3px;
  margin-inline-start: 4px;
}
</style>
