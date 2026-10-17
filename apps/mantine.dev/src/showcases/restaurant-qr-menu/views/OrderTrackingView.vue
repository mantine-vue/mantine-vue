<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  Grid,
  Group,
  Loader,
  Paper,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import {
  PhArrowClockwise,
  PhArrowLeft,
  PhBellRinging,
  PhCheckCircle,
  PhFlask,
  PhReceipt,
} from '@phosphor-icons/vue'
import { useQrMenu } from '../app/use-qr-menu'
import ConfirmButton from '../components/common/ConfirmButton.vue'
import SmartImage from '../components/common/SmartImage.vue'
import PriceSummary from '../components/cart/PriceSummary.vue'
import OrderFeedback from '../components/order/OrderFeedback.vue'
import OrderProgress from '../components/order/OrderProgress.vue'
import { QR_MENU_CONFIG } from '../config'
import { canCancelOrder, isFinalStatus } from '../domain/order-rules'
import type { Order } from '../domain/types'
import { isApiError } from '../services/contracts'

const ctx = useQrMenu()
const { t, services, localize, format, data, settings } = ctx
const route = useRoute()
const router = useRouter()

const order = shallowRef<Order | null>(null)
const loading = ref(true)
const error = ref<'not-found' | 'network' | null>(null)
const updatedAt = ref<Date | null>(null)
const cancelling = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const orderId = computed(() => String(route.params.orderId ?? ''))
const justPlaced = computed(() => route.query.placed === '1')
const timeZone = computed(() => data.restaurant.value?.timeZone)
const currency = computed(() => order.value?.totals.currency ?? ctx.currency.value)

const load = async () => {
  clearTimeout(timer)
  try {
    order.value = await services.orders.getOrder(orderId.value)
    error.value = null
    updatedAt.value = new Date()
  } catch (caught) {
    error.value = isApiError(caught) && caught.code === 'not-found' ? 'not-found' : 'network'
  } finally {
    loading.value = false
  }
  // Poll like a real tracking page until the order reaches a final state.
  if (error.value !== 'not-found' && !(order.value && isFinalStatus(order.value.status))) {
    timer = setTimeout(load, QR_MENU_CONFIG.orderPollingMs)
  }
}

watch(
  orderId,
  () => {
    loading.value = true
    order.value = null
    void load()
  },
  { immediate: true },
)
onBeforeUnmount(() => clearTimeout(timer))

const final = computed(() => (order.value ? isFinalStatus(order.value.status) : false))
const statusColor = computed(() =>
  order.value?.status === 'cancelled' ? 'red' : final.value ? 'teal' : 'brand',
)

const cancel = async () => {
  if (!order.value) {
    return
  }
  cancelling.value = true
  try {
    order.value = await services.orders.cancelOrder(order.value.id)
    notifications.show({ color: 'orange', message: t('order.cancelled') })
  } catch (caught) {
    notifications.show({
      color: 'red',
      message:
        isApiError(caught) && caught.code === 'conflict'
          ? t('order.cannotCancel')
          : t('errors.network'),
    })
    void load()
  } finally {
    cancelling.value = false
  }
}

const reorder = () => {
  const current = order.value
  if (!current) {
    return
  }
  let added = 0
  for (const line of current.lines) {
    const product = data.productsById.value.get(line.productId)
    if (product?.available) {
      ctx.cart.addItem({
        product,
        selection: line.selection,
        quantity: line.quantity,
        notes: line.notes,
        maxQuantity: settings.value?.maxQuantityPerLine ?? 20,
      })
      added += 1
    }
  }
  notifications.show({
    color: added ? 'teal' : 'orange',
    message: added ? t('order.reordered') : t('cart.unavailableHint'),
  })
  if (added) {
    ctx.overlays.cart = true
  }
}

const paymentText = computed(() => {
  const current = order.value
  if (!current) {
    return ''
  }
  if (current.payment.status === 'simulated') {
    return t('order.paymentSimulated')
  }
  return t('order.paymentDue', {
    method: t(`checkout.paymentMethods.${current.payment.method}`),
    when: current.mode === 'delivery' ? t('order.paymentDueDelivery') : t('order.paymentDueDineIn'),
  })
})
</script>

<template>
  <div class="qrm-container" :class="$style.page">
    <Button variant="subtle" size="compact-md" mb="md" @click="router.push({ name: 'rqm-menu' })">
      <template #leftSection><PhArrowLeft :size="16" class="qrm-flip-rtl" /></template>
      {{ t('order.backToMenu') }}
    </Button>

    <Stack v-if="loading" gap="md" role="status" aria-busy="true">
      <Skeleton :height="120" radius="lg" />
      <Skeleton :height="260" radius="lg" />
    </Stack>

    <EmptyState
      v-else-if="!order"
      variant="light"
      color="red"
      :title="error === 'not-found' ? t('order.notFound') : t('app.errorTitle')"
      :description="error === 'not-found' ? t('errors.notFound') : t('errors.network')"
      :class="$style.empty"
    >
      <template #icon><PhReceipt :size="28" /></template>
      <Group justify="center" mt="md">
        <Button v-if="error === 'network'" radius="xl" @click="load">
          <template #leftSection><PhArrowClockwise :size="16" /></template>
          {{ t('app.retry') }}
        </Button>
        <Button variant="light" radius="xl" @click="router.push({ name: 'rqm-menu' })">{{
          t('order.backToMenu')
        }}</Button>
      </Group>
    </EmptyState>

    <template v-else>
      <Paper v-if="justPlaced" radius="lg" p="lg" mb="md" :class="$style.thanks">
        <Group wrap="nowrap" gap="md">
          <ThemeIcon :size="56" radius="xl" color="teal" variant="light">
            <PhCheckCircle :size="32" weight="fill" />
          </ThemeIcon>
          <div>
            <Title :order="1" size="h3">
              {{
                order.customer.name
                  ? t('order.thanks', { name: order.customer.name.split(' ')[0] })
                  : t('order.thanksAnonymous')
              }}
            </Title>
            <Text c="dimmed" size="sm">{{ t('order.placed') }}</Text>
          </div>
        </Group>
      </Paper>

      <Grid gutter="lg">
        <Grid.Col :span="{ base: 12, md: 7 }">
          <Paper withBorder radius="lg" p="md">
            <Group justify="space-between" align="flex-start" mb="md">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw="600">{{
                  t(`modes.${order.mode}`)
                }}</Text>
                <Title :order="2" size="h3">{{ t('order.title', { number: order.number }) }}</Title>
                <Text size="sm" c="dimmed">{{
                  t('order.placedAt', { time: format.dateTime(order.createdAt, timeZone) })
                }}</Text>
              </div>
              <Badge :color="statusColor" size="lg" variant="light" tt="none">
                {{ t(`order.statuses.${order.status}`) }}
              </Badge>
            </Group>

            <Alert
              v-if="order.status !== 'cancelled' && !final"
              color="brand"
              variant="light"
              radius="md"
              mb="md"
            >
              <Group gap="xs" wrap="nowrap">
                <Loader size="xs" type="dots" />
                <Text size="sm" fw="600">
                  {{
                    order.scheduledFor
                      ? t('order.scheduledFor', {
                          time: format.dateTime(order.scheduledFor, timeZone),
                        })
                      : order.mode === 'delivery'
                        ? t('order.estimatedDelivery', {
                            time: format.time(order.estimatedReadyAt, timeZone),
                          })
                        : t('order.estimatedReady', {
                            time: format.time(order.estimatedReadyAt, timeZone),
                          })
                  }}
                </Text>
              </Group>
            </Alert>

            <OrderProgress :order="order" />

            <Group justify="space-between" mt="md">
              <Text size="xs" c="dimmed" aria-live="polite">
                <template v-if="!final">{{ t('order.liveUpdates') }} · </template>
                <template v-if="updatedAt">{{
                  t('order.updatedAt', { time: format.time(updatedAt, timeZone) })
                }}</template>
                <template v-if="error === 'network'"> · {{ t('errors.network') }}</template>
              </Text>
              <Group gap="xs">
                <Button
                  v-if="order.mode === 'dine-in' && !final && order.table"
                  size="xs"
                  radius="xl"
                  variant="light"
                  color="accent"
                  @click="ctx.overlays.service = true"
                >
                  <template #leftSection><PhBellRinging :size="14" /></template>
                  {{ t('service.button') }}
                </Button>
                <ConfirmButton
                  v-if="canCancelOrder(order.status)"
                  :message="t('order.cancelConfirm')"
                  size="xs"
                  :class="{ [$style.disabled]: cancelling }"
                  @confirm="cancel"
                >
                  {{ t('order.cancel') }}
                </ConfirmButton>
              </Group>
            </Group>
          </Paper>

          <OrderFeedback
            v-if="final && order.status !== 'cancelled'"
            :order="order"
            :class="$style.block"
            @updated="(updated: Order) => (order = updated)"
          />
        </Grid.Col>

        <Grid.Col :span="{ base: 12, md: 5 }">
          <Paper withBorder radius="lg" p="md">
            <Title :order="2" size="h5" mb="sm">{{ t('order.details') }}</Title>
            <Stack gap="xs" mb="md">
              <Text v-if="order.table" size="sm">
                <strong>{{ t('order.dineInAt') }}:</strong>
                {{ t('table.label', { table: order.table.label }) }} ·
                {{ localize(order.table.area) }}
              </Text>
              <Text v-if="order.mode === 'takeaway' && data.restaurant.value" size="sm">
                <strong>{{ t('order.pickupFrom') }}:</strong>
                {{ localize(data.restaurant.value.address.line) }}
              </Text>
              <Text v-if="order.deliveryAddress" size="sm">
                <strong>{{ t('order.deliverTo') }}:</strong>
                {{ order.deliveryAddress.building }}, {{ order.deliveryAddress.street }},
                {{ order.deliveryAddress.area }}
              </Text>
              <Text v-if="order.customer.phone" size="sm" dir="auto">
                <strong>{{ t('order.contact') }}:</strong> {{ order.customer.name }} ·
                <span dir="ltr">{{ order.customer.phone }}</span>
              </Text>
            </Stack>

            <Stack gap="sm">
              <Group
                v-for="(line, index) in order.lines"
                :key="index"
                wrap="nowrap"
                align="flex-start"
                gap="sm"
              >
                <div :class="$style.thumb">
                  <SmartImage :asset="line.image" :width="48" :ratio="1" radius="sm" alt="" />
                </div>
                <div :class="$style.lineBody">
                  <Group justify="space-between" wrap="nowrap" gap="xs">
                    <Text size="sm" fw="600"
                      >{{ format.number(line.quantity) }} × {{ localize(line.name) }}</Text
                    >
                    <Text size="sm" class="qrm-tabular">{{
                      format.price(line.total, currency)
                    }}</Text>
                  </Group>
                  <Text v-if="line.options.length" size="xs" c="dimmed">{{
                    line.options.map(localize).join(' · ')
                  }}</Text>
                  <Text v-if="line.notes" size="xs" c="dimmed" fs="italic">“{{ line.notes }}”</Text>
                </div>
              </Group>
            </Stack>

            <PriceSummary
              v-if="settings"
              :totals="order.totals"
              :tax-label="settings.taxLabel"
              :tax-rate="settings.taxRate"
              :promo-code="order.promoCode"
              :is-delivery="order.mode === 'delivery'"
              mt="md"
            />

            <Alert
              :color="order.payment.status === 'simulated' ? 'blue' : 'gray'"
              variant="light"
              radius="md"
              mt="md"
              :title="t('order.payment')"
            >
              <template #icon><PhFlask :size="18" /></template>
              {{ paymentText }}
              <Text size="xs" c="dimmed" :mt="4">{{
                t('order.reference', { reference: order.payment.reference })
              }}</Text>
            </Alert>

            <Button v-if="final" fullWidth radius="xl" variant="light" mt="md" @click="reorder">
              {{ t('order.reorder') }}
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </template>
  </div>
</template>

<style module>
.page {
  padding-block: var(--mantine-spacing-lg) calc(var(--mantine-spacing-xl) * 2);
}

.empty {
  padding-block: 48px;
}

.thanks {
  background: linear-gradient(
    135deg,
    var(--mantine-color-teal-light),
    var(--mantine-primary-color-light)
  );
}

.block {
  margin-top: var(--mantine-spacing-lg);
}

.thumb {
  width: 48px;
  flex-shrink: 0;

  & > div {
    border-radius: var(--mantine-radius-sm);
  }
}

.lineBody {
  flex: 1;
  min-width: 0;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
