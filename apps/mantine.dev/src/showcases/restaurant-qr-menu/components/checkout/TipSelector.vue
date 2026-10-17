<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Chip, Group, NumberInput, Stack, Text } from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'
import { getCurrencyFractionDigits, toMajorUnits, toMinorUnits } from '../../domain/money'

/** Tip presets (percentages from the restaurant settings) plus a custom amount. */
const ctx = useQrMenu()
const { t, cart, settings, currency, format, totals } = ctx

const options = computed(() => settings.value?.tipOptions ?? [])
const tip = computed(() => cart.cart.value.tip)

const selected = computed(() =>
  tip.value.kind === 'amount' ? 'custom' : tip.value.rate === 0 ? 'none' : String(tip.value.rate),
)
const customAmount = ref<number | string>(
  tip.value.kind === 'amount' ? toMajorUnits(tip.value.amount, currency.value) : '',
)

const select = (value: string | string[] | null) => {
  const next = (Array.isArray(value) ? value[0] : value) ?? 'none'
  if (next === 'custom') {
    cart.setTip({
      kind: 'amount',
      amount: toMinorUnits(Number(customAmount.value) || 0, currency.value),
    })
  } else {
    cart.setTip({ kind: 'rate', rate: next === 'none' ? 0 : Number(next) })
  }
}

watch(customAmount, (value) => {
  if (selected.value === 'custom') {
    const amount = Math.max(0, Number(value) || 0)
    cart.setTip({ kind: 'amount', amount: toMinorUnits(amount, currency.value) })
  }
})
</script>

<template>
  <Stack v-if="options.length" gap="xs">
    <Chip.Group :model-value="selected" @update:model-value="select">
      <Group gap="xs">
        <Chip value="none" radius="xl" size="sm">{{ t('checkout.tipNone') }}</Chip>
        <Chip v-for="rate in options" :key="rate" :value="String(rate)" radius="xl" size="sm">
          {{ format.percent(rate) }}
        </Chip>
        <Chip value="custom" radius="xl" size="sm">{{ t('checkout.tipCustom') }}</Chip>
      </Group>
    </Chip.Group>
    <NumberInput
      v-if="selected === 'custom'"
      v-model="customAmount"
      :label="t('checkout.tipAmount')"
      :min="0"
      :max="1000"
      :decimalScale="getCurrencyFractionDigits(currency)"
      :prefix="`${currency} `"
      :allowNegative="false"
      radius="md"
      :maw="220"
    />
    <Text size="xs" c="dimmed">
      {{ t('checkout.tipHint') }}
      <template v-if="totals && totals.tip > 0"> · {{ ctx.price(totals.tip) }}</template>
    </Text>
  </Stack>
</template>
