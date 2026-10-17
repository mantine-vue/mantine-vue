<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Badge,
  Button,
  Drawer,
  EmptyState,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine-vue/core'
import { PhArrowClockwise, PhReceipt } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { useIsMobile } from '../../composables/use-is-mobile'
import { isFinalStatus } from '../../domain/order-rules'
import type { Order } from '../../domain/types'

/** Orders placed from this device for the current restaurant. */
const ctx = useQrMenu()
const { t, overlays, services, format, data } = ctx
const router = useRouter()
const isMobile = useIsMobile()

const orders = ref<Order[]>([])
const loading = ref(false)
const failed = ref(false)

const load = async () => {
  loading.value = true
  failed.value = false
  try {
    orders.value = await services.orders.listOrders(ctx.restaurantId.value)
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => overlays.orders,
  (opened) => opened && load(),
  { immediate: true },
)

const open = (order: Order) => {
  overlays.orders = false
  router.push({ name: 'rqm-order', params: { orderId: order.id } })
}
</script>

<template>
  <Drawer
    :opened="overlays.orders"
    :position="isMobile ? 'bottom' : 'right'"
    :size="isMobile ? '80%' : 'md'"
    :radius="isMobile ? 'lg' : 0"
    :title="t('order.myOrders')"
    :closeButtonProps="{ 'aria-label': t('app.close') }"
    @close="overlays.orders = false"
  >
    <Stack v-if="loading && !orders.length" gap="sm">
      <Skeleton v-for="index in 3" :key="index" :height="72" radius="md" />
    </Stack>
    <EmptyState
      v-else-if="failed"
      :title="t('app.errorTitle')"
      :description="t('errors.network')"
      variant="light"
      color="red"
    >
      <template #icon><PhReceipt :size="24" /></template>
      <Button mt="md" variant="light" radius="xl" @click="load">
        <template #leftSection><PhArrowClockwise :size="16" /></template>
        {{ t('app.retry') }}
      </Button>
    </EmptyState>
    <EmptyState
      v-else-if="!orders.length"
      :title="t('order.noOrders')"
      :description="t('order.noOrdersHint')"
      variant="light"
    >
      <template #icon><PhReceipt :size="24" /></template>
    </EmptyState>
    <Stack v-else gap="sm">
      <UnstyledButton v-for="order in orders" :key="order.id" @click="open(order)">
        <Paper withBorder radius="md" p="sm" :class="$style.item">
          <Group justify="space-between" wrap="nowrap">
            <div>
              <Text fw="700" size="sm">{{ t('order.title', { number: order.number }) }}</Text>
              <Text size="xs" c="dimmed">
                {{ t(`modes.${order.mode}`) }} ·
                {{ format.dateTime(order.createdAt, data.restaurant.value?.timeZone) }}
              </Text>
            </div>
            <Stack :gap="4" align="flex-end">
              <Badge
                :color="
                  order.status === 'cancelled'
                    ? 'red'
                    : isFinalStatus(order.status)
                      ? 'teal'
                      : 'brand'
                "
                variant="light"
                tt="none"
              >
                {{ t(`order.statuses.${order.status}`) }}
              </Badge>
              <Text size="sm" fw="600" class="qrm-tabular">{{
                format.price(order.totals.total, order.totals.currency)
              }}</Text>
            </Stack>
          </Group>
        </Paper>
      </UnstyledButton>
    </Stack>
  </Drawer>
</template>

<style module>
.item {
  transition: border-color 120ms ease;

  @mixin hover {
    border-color: var(--mantine-primary-color-filled);
  }
}
</style>
