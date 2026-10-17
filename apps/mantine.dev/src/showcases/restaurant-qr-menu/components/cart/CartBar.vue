<script setup lang="ts">
import { computed } from 'vue'
import { Affix, Badge, Transition as MantineTransition, UnstyledButton } from '@mantine-vue/core'
import { PhShoppingBag } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'

/** Floating "view cart" bar shown at the bottom of the menu once items are added. */
const ctx = useQrMenu()
const { t, cart, totals, overlays, format } = ctx

const total = computed(() => ctx.price(totals.value?.subtotal ?? 0))
const label = computed(() =>
  t('cart.viewSummary', { count: cart.itemCount.value, total: total.value }),
)
</script>

<template>
  <Affix :position="{ bottom: 0, left: 0, right: 0 }" :z-index="150">
    <MantineTransition transition="slide-up" :mounted="cart.itemCount.value > 0" :duration="200">
      <template #default="style">
        <div :class="$style.wrap" :style="style">
          <UnstyledButton :class="$style.bar" :aria-label="label" @click="overlays.cart = true">
            <span :class="$style.icon">
              <PhShoppingBag :size="20" weight="fill" />
              <Badge size="sm" circle color="white" c="dark" :class="$style.count">
                {{ format.number(cart.itemCount.value) }}
              </Badge>
            </span>
            <span :class="$style.label">{{ t('cart.view') }}</span>
            <span :class="$style.total">{{ total }}</span>
          </UnstyledButton>
        </div>
      </template>
    </MantineTransition>
  </Affix>
</template>

<style module>
.wrap {
  padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
  padding-bottom: calc(var(--mantine-spacing-sm) + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, transparent, var(--mantine-color-body) 40%);
  pointer-events: none;
}

.bar {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: var(--mantine-spacing-sm);
  width: 100%;
  max-width: 560px;
  min-height: 52px;
  margin-inline: auto;
  padding-inline: var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-xl);
  background-color: var(--mantine-primary-color-filled);
  color: var(--mantine-primary-color-contrast);
  box-shadow: var(--mantine-shadow-lg);
  font-weight: 700;
  transition: transform 120ms ease;

  &:active {
    transform: scale(0.98);
  }

  @mixin hover {
    background-color: var(--mantine-primary-color-filled-hover);
  }
}

.icon {
  position: relative;
  display: inline-flex;
}

.count {
  position: absolute;
  top: -8px;
  inset-inline-end: -10px;
}

.label {
  flex: 1;
  text-align: center;
}

.total {
  font-variant-numeric: tabular-nums;
}
</style>
