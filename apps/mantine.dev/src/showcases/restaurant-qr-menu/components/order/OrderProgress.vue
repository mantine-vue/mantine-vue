<script setup lang="ts">
import { computed } from 'vue'
import { Progress, Text, Timeline } from '@mantine-vue/core'
import { PhCheck, PhCookingPot, PhMoped, PhReceipt, PhSealCheck, PhX } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { ORDER_FLOWS } from '../../domain/order-rules'
import type { Order, OrderStatus } from '../../domain/types'

/** Vertical status timeline with timestamps for each completed step. */
const props = defineProps<{ order: Order }>()
const { t, format, data } = useQrMenu()

const flow = computed(() => ORDER_FLOWS[props.order.mode])
const cancelled = computed(() => props.order.status === 'cancelled')
const reached = computed(
  () => new Map(props.order.history.map((event) => [event.status, event.at])),
)
const activeIndex = computed(() =>
  cancelled.value ? props.order.history.length - 2 : flow.value.indexOf(props.order.status),
)
const progress = computed(() => ((activeIndex.value + 1) / flow.value.length) * 100)
const timeZone = computed(() => data.restaurant.value?.timeZone)

const icons: Partial<Record<OrderStatus, unknown>> = {
  received: PhReceipt,
  accepted: PhSealCheck,
  preparing: PhCookingPot,
  'out-for-delivery': PhMoped,
}

const hint = (status: OrderStatus) => t(`order.statusHints.${status}`)
</script>

<template>
  <div>
    <Progress
      :value="cancelled ? 100 : progress"
      :color="cancelled ? 'red' : 'brand'"
      size="sm"
      radius="xl"
      :striped="!cancelled && progress < 100"
      :animated="!cancelled && progress < 100"
      :aria-label="t('order.progress')"
      mb="lg"
    />
    <Timeline
      :active="activeIndex"
      :bulletSize="28"
      :lineWidth="2"
      :color="cancelled ? 'gray' : 'brand'"
    >
      <Timeline.Item
        v-for="(status, index) in flow"
        :key="status"
        :title="t(`order.statuses.${status}`)"
        :active="index <= activeIndex"
        :lineActive="index < activeIndex"
      >
        <template #bullet>
          <component :is="icons[status] ?? PhCheck" :size="14" />
        </template>
        <Text size="xs" c="dimmed">{{ hint(status) }}</Text>
        <Text v-if="reached.get(status)" size="xs" :mt="2" class="qrm-tabular">
          {{ format.time(reached.get(status)!, timeZone) }}
        </Text>
      </Timeline.Item>
      <Timeline.Item v-if="cancelled" :title="t('order.statuses.cancelled')" color="red">
        <template #bullet><PhX :size="14" /></template>
        <Text size="xs" c="dimmed">{{ hint('cancelled') }}</Text>
      </Timeline.Item>
    </Timeline>
  </div>
</template>
