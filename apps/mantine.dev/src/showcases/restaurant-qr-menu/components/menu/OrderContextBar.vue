<script setup lang="ts">
import { computed } from 'vue'
import { Button, Group, Paper, SegmentedControl, Select, Text } from '@mantine-vue/core'
import { PhArmchair, PhBellRinging, PhClock, PhMoped } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import type { OrderMode } from '../../domain/types'

/** Order type switcher plus dine-in table context and the call-waiter entry point. */
const ctx = useQrMenu()
const { t, settings, mode, table, overlays, localize, format } = ctx

const modeOptions = computed(() =>
  (settings.value?.modes ?? []).map((value) => ({ value, label: t(`modes.${value}`) })),
)

const hint = computed(() => {
  const ordering = settings.value
  if (!ordering) {
    return ''
  }
  if (mode.value === 'delivery' && ordering.delivery) {
    const [min, max] = ordering.delivery.estimatedMinutes
    return t('modes.hint.delivery', { min: format.number(min), max: format.number(max) })
  }
  if (mode.value === 'takeaway') {
    return t('modes.hint.takeaway', { minutes: format.number(ordering.preparationMinutes) })
  }
  return t('modes.hint.dine-in')
})

const tableOptions = computed(() => {
  const groups = new Map<string, { value: string; label: string }[]>()
  for (const item of settings.value?.tables ?? []) {
    const area = localize(item.area)
    const list = groups.get(area) ?? []
    list.push({ value: item.id, label: t('table.label', { table: item.label }) })
    groups.set(area, list)
  }
  return [...groups.entries()].map(([group, items]) => ({ group, items }))
})
</script>

<template>
  <Paper v-if="settings" withBorder radius="lg" p="sm" :class="$style.bar" shadow="xs">
    <SegmentedControl
      v-if="modeOptions.length > 1"
      :model-value="mode"
      :data="modeOptions"
      fullWidth
      radius="xl"
      size="sm"
      :aria-label="t('modes.label')"
      @update:model-value="(value: string | number) => ctx.setMode(value as OrderMode)"
    />
    <Text size="xs" c="dimmed" mt="xs" :class="$style.hint">
      <PhMoped v-if="mode === 'delivery'" :size="14" />
      <PhClock v-else-if="mode === 'takeaway'" :size="14" />
      <PhArmchair v-else :size="14" />
      {{ hint }}
    </Text>

    <Group v-if="mode === 'dine-in'" gap="xs" wrap="nowrap" mt="xs">
      <Select
        :model-value="table?.id ?? null"
        :data="tableOptions"
        :placeholder="t('table.select')"
        :aria-label="t('table.title')"
        size="sm"
        radius="xl"
        flex="1"
        :allow-deselect="false"
        :comboboxProps="{ withinPortal: true }"
        @update:model-value="(value: string | null) => ctx.setTable(value)"
      >
        <template #leftSection><PhArmchair :size="16" /></template>
      </Select>
      <Button
        v-if="settings.allowServiceRequests"
        size="sm"
        radius="xl"
        variant="light"
        color="accent"
        :class="$style.service"
        @click="overlays.service = true"
      >
        <template #leftSection><PhBellRinging :size="16" /></template>
        {{ t('service.button') }}
      </Button>
    </Group>
  </Paper>
</template>

<style module>
.bar {
  background-color: var(--mantine-color-body);
}

.service {
  flex-shrink: 0;
}

.hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
