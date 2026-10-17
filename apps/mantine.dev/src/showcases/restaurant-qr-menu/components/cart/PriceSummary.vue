<script setup lang="ts">
import { Divider, Group, Stack, Text } from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'
import type { LocalizedText, OrderTotals } from '../../domain/types'

/** Order breakdown shared by the cart, checkout and order tracking. */
defineProps<{
  totals: OrderTotals
  taxLabel: LocalizedText
  taxRate: number
  promoCode?: string | null
  /** Shows the delivery row (including "Free") for delivery orders. */
  isDelivery?: boolean
}>()

const { t, localize, format } = useQrMenu()
const money = (amount: number, currency: string) => format.price(amount, currency)
</script>

<template>
  <Stack :gap="6" :class="$style.summary">
    <Group justify="space-between">
      <Text size="sm" c="dimmed">{{ t('summary.subtotal') }}</Text>
      <Text size="sm" class="qrm-tabular">{{ money(totals.subtotal, totals.currency) }}</Text>
    </Group>
    <Group v-if="totals.discount > 0" justify="space-between">
      <Text size="sm" c="teal">
        {{ promoCode ? t('summary.discountCode', { code: promoCode }) : t('summary.discount') }}
      </Text>
      <Text size="sm" c="teal" class="qrm-tabular"
        >− {{ money(totals.discount, totals.currency) }}</Text
      >
    </Group>
    <Group v-for="fee in totals.fees" :key="fee.id" justify="space-between">
      <Text size="sm" c="dimmed">{{ localize(fee.label) }}</Text>
      <Text size="sm" class="qrm-tabular">{{ money(fee.amount, totals.currency) }}</Text>
    </Group>
    <Group
      v-if="totals.deliveryFee > 0 || (isDelivery && totals.subtotal > 0)"
      justify="space-between"
    >
      <Text size="sm" c="dimmed">{{ t('summary.deliveryFee') }}</Text>
      <Text size="sm" class="qrm-tabular">
        {{
          totals.deliveryFee > 0 ? money(totals.deliveryFee, totals.currency) : t('summary.free')
        }}
      </Text>
    </Group>
    <Group v-if="!totals.taxIncluded" justify="space-between">
      <Text size="sm" c="dimmed">{{
        t('summary.tax', { label: localize(taxLabel), rate: format.percent(taxRate) })
      }}</Text>
      <Text size="sm" class="qrm-tabular">{{ money(totals.tax, totals.currency) }}</Text>
    </Group>
    <Group v-if="totals.tip > 0" justify="space-between">
      <Text size="sm" c="dimmed">{{ t('summary.tip') }}</Text>
      <Text size="sm" class="qrm-tabular">{{ money(totals.tip, totals.currency) }}</Text>
    </Group>
    <Divider my="4" />
    <Group justify="space-between">
      <Text fw="700">{{ t('summary.total') }}</Text>
      <Text fw="800" size="lg" class="qrm-tabular" aria-live="polite">{{
        money(totals.total, totals.currency)
      }}</Text>
    </Group>
    <Text v-if="totals.taxIncluded && totals.tax > 0" size="xs" c="dimmed" ta="end">
      {{ t('summary.taxIncluded', { label: localize(taxLabel), rate: format.percent(taxRate) }) }}:
      {{ money(totals.tax, totals.currency) }}
    </Text>
  </Stack>
</template>

<style module>
.summary {
  font-variant-numeric: tabular-nums;
}
</style>
