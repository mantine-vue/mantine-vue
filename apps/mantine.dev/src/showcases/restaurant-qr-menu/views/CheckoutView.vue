<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Accordion,
  Affix,
  Alert,
  Anchor,
  Button,
  Checkbox,
  EmptyState,
  Grid,
  Group,
  List,
  LoadingOverlay,
  Paper,
  Radio,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine-vue/core'
import { useForm } from '@mantine-vue/form'
import { useNetwork } from '@mantine-vue/hooks'
import { notifications } from '@mantine-vue/notifications'
import {
  PhArrowLeft,
  PhCreditCard,
  PhFlask,
  PhMoney,
  PhShoppingBag,
  PhStorefront,
  PhWarningCircle,
} from '@phosphor-icons/vue'
import { useQrMenu } from '../app/use-qr-menu'
import PriceSummary from '../components/cart/PriceSummary.vue'
import TipSelector from '../components/checkout/TipSelector.vue'
import { getScheduleSlots } from '../domain/availability'
import { isValidEmail, isValidPhone, type CheckoutIssue } from '../domain/order-rules'
import type { OrderDraft, OrderMode, PaymentMethod } from '../domain/types'
import { isApiError } from '../services/contracts'
import { useOpenStatusLabel } from '../composables/use-open-status-label'

interface CheckoutValues {
  tableId: string | null
  when: 'asap' | 'schedule'
  slot: string | null
  name: string
  phone: string
  email: string
  area: string
  street: string
  building: string
  instructions: string
  payment: PaymentMethod | null
  remember: boolean
}

const ctx = useQrMenu()
const { t, cart, settings, mode, totals, pricedLines, data, customer, localize, openState } = ctx
const router = useRouter()
const network = useNetwork()
const status = useOpenStatusLabel()

const restaurant = computed(() => data.restaurant.value)
const profile = customer.state.profile

/* ------------------------------ Form & rules ------------------------------ */

const paymentMethods = computed<PaymentMethod[]>(
  () => settings.value?.paymentMethods[mode.value] ?? [],
)
const canSchedule = computed(
  () => Boolean(settings.value?.allowScheduling) && mode.value !== 'dine-in',
)
const mustSchedule = computed(() => !openState.value.open && canSchedule.value)
const blockedByHours = computed(() => !openState.value.open && !canSchedule.value)

const form = useForm<CheckoutValues>({
  initialValues: {
    tableId: ctx.table.value?.id ?? null,
    when: 'asap',
    slot: null,
    name: profile?.customer.name ?? '',
    phone: profile?.customer.phone ?? '',
    email: profile?.customer.email ?? '',
    area: profile?.address.area ?? '',
    street: profile?.address.street ?? '',
    building: profile?.address.building ?? '',
    instructions: profile?.address.instructions ?? '',
    payment: null,
    remember: Boolean(profile),
  },
  validateInputOnBlur: true,
  validate: (values) => {
    const errors: Record<string, string> = {}
    const contactRequired = mode.value !== 'dine-in'
    if (mode.value === 'dine-in' && !values.tableId) {
      errors.tableId = t('checkout.validation.table')
    }
    if (contactRequired && values.name.trim().length < 2) {
      errors.name = t('checkout.validation.name')
    }
    if ((contactRequired || values.phone.trim()) && !isValidPhone(values.phone)) {
      errors.phone = t('checkout.validation.phone')
    }
    if (values.email.trim() && !isValidEmail(values.email)) {
      errors.email = t('checkout.validation.email')
    }
    if (mode.value === 'delivery') {
      for (const field of ['area', 'street', 'building'] as const) {
        if (!values[field].trim()) {
          errors[field] = t('checkout.validation.requiredField')
        }
      }
    }
    if (values.when === 'schedule' && !values.slot) {
      errors.slot = t('checkout.validation.slot')
    }
    if (!values.payment || !paymentMethods.value.includes(values.payment)) {
      errors.payment = t('checkout.validation.payment')
    }
    return errors
  },
})

// Keep the form consistent with the order mode and restaurant state.
watch(
  [mode, paymentMethods, mustSchedule],
  () => {
    if (!form.values.value.payment || !paymentMethods.value.includes(form.values.value.payment)) {
      form.setFieldValue('payment', paymentMethods.value[0] ?? null)
    }
    if (mustSchedule.value) {
      form.setFieldValue('when', 'schedule')
    }
    if (!canSchedule.value) {
      form.setFieldValue('when', 'asap')
    }
    form.clearErrors()
  },
  { immediate: true },
)

watch(
  () => form.values.value.tableId,
  (tableId) => {
    if (tableId !== (ctx.table.value?.id ?? null)) {
      ctx.setTable(tableId)
    }
  },
)

/* --------------------------------- Options -------------------------------- */

const modeOptions = computed(() =>
  (settings.value?.modes ?? []).map((value) => ({ value, label: t(`modes.${value}`) })),
)

const tableOptions = computed(() =>
  (settings.value?.tables ?? []).map((table) => ({
    value: table.id,
    label: `${t('table.label', { table: table.label })} · ${localize(table.area)}`,
  })),
)

const slots = computed(() => {
  const current = restaurant.value
  if (!current || !canSchedule.value) {
    return []
  }
  return getScheduleSlots(current.openingHours, current.timeZone, {
    now: ctx.clock.value,
    leadMinutes: current.ordering.preparationMinutes + 10,
  }).map((value) => ({ value, label: ctx.format.dateTime(value, current.timeZone) }))
})

const paymentIcons: Record<PaymentMethod, unknown> = {
  cash: PhMoney,
  'card-on-delivery': PhCreditCard,
  'pay-at-counter': PhStorefront,
  'demo-online': PhFlask,
}

/* -------------------------------- Submission ------------------------------ */

const submitting = ref(false)
const serverIssues = ref<string[]>([])
const hasUnavailable = computed(() => pricedLines.value.some((line) => line.issue))

const issueMessage = (issue: CheckoutIssue | { code: 'promo-invalid' | 'schedule-in-past' }) => {
  if (issue.code === 'minimum-order') {
    return t('checkout.issues.minimum-order', { amount: ctx.price(issue.minimum) })
  }
  return t(`checkout.issues.${issue.code}`)
}

const submit = form.onSubmit(
  async (values) => {
    const current = restaurant.value
    if (!current || !network.value.online) {
      return
    }
    serverIssues.value = []
    submitting.value = true

    const promotionUsable = ctx.promotion.value && ctx.promotionEligibility.value?.eligible
    const tip = cart.cart.value.tip
    const draft: OrderDraft = {
      restaurantId: current.id,
      mode: mode.value,
      tableId: mode.value === 'dine-in' ? (values.tableId ?? undefined) : undefined,
      lines: cart.lines.value.map((line) => ({ ...line })),
      customer: { name: values.name, phone: values.phone, email: values.email || undefined },
      deliveryAddress:
        mode.value === 'delivery'
          ? {
              area: values.area,
              street: values.street,
              building: values.building,
              instructions: values.instructions || undefined,
            }
          : undefined,
      scheduledFor: values.when === 'schedule' ? values.slot : null,
      notes: cart.cart.value.notes,
      promoCode: promotionUsable ? (cart.cart.value.promoCode ?? undefined) : undefined,
      tipRate: tip.kind === 'rate' ? tip.rate : 0,
      tipAmount: tip.kind === 'amount' ? tip.amount : undefined,
      paymentMethod: values.payment!,
      locale: ctx.i18n.locale.value,
    }

    try {
      const order = await ctx.services.orders.placeOrder(draft)
      customer.addOrder(current.id, order.id)
      customer.saveProfile(
        values.remember
          ? {
              customer: {
                name: values.name.trim(),
                phone: values.phone.trim(),
                email: values.email.trim() || undefined,
              },
              address: {
                area: values.area.trim(),
                street: values.street.trim(),
                building: values.building.trim(),
                instructions: values.instructions.trim() || undefined,
              },
            }
          : null,
      )
      cart.clear()
      ctx.removePromoCode()
      router.replace({ name: 'rqm-order', params: { orderId: order.id }, query: { placed: '1' } })
    } catch (error) {
      if (isApiError(error) && error.code === 'validation') {
        const issues = ((error.details as { issues?: CheckoutIssue[] })?.issues ??
          []) as CheckoutIssue[]
        serverIssues.value = issues.length ? issues.map(issueMessage) : [t('errors.unknown')]
        if (issues.some((issue) => (issue.code as string) === 'promo-invalid')) {
          ctx.removePromoCode()
        }
      } else {
        serverIssues.value = [
          isApiError(error) && error.code === 'network' ? t('errors.network') : t('errors.unknown'),
        ]
        notifications.show({
          color: 'red',
          title: t('checkout.errorTitle'),
          message: serverIssues.value[0],
        })
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      submitting.value = false
    }
  },
  () => {
    notifications.show({ color: 'orange', message: t('checkout.fixErrors') })
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>('[data-checkout] [aria-invalid="true"]')?.focus(),
    )
  },
)

const backToMenu = () => router.push({ name: 'rqm-menu' })
</script>

<template>
  <div class="qrm-container" :class="$style.page" data-checkout>
    <Group gap="xs" mb="md">
      <Button variant="subtle" size="compact-md" @click="backToMenu">
        <template #leftSection><PhArrowLeft :size="16" class="qrm-flip-rtl" /></template>
        {{ t('checkout.backToMenu') }}
      </Button>
    </Group>
    <Title :order="1" size="h2" mb="md">{{ t('checkout.title') }}</Title>

    <EmptyState
      v-if="cart.isEmpty.value || !restaurant || !settings || !totals"
      :title="t('cart.empty')"
      :description="t('cart.emptyHint')"
      variant="light"
      :class="$style.empty"
    >
      <template #icon><PhShoppingBag :size="28" /></template>
      <Button mt="md" radius="xl" @click="backToMenu">{{ t('cart.browse') }}</Button>
    </EmptyState>

    <form v-else id="qrm-checkout-form" novalidate @submit="submit">
      <Alert
        v-if="serverIssues.length"
        color="red"
        variant="light"
        radius="md"
        mb="md"
        :title="t('checkout.errorTitle')"
        role="alert"
      >
        <template #icon><PhWarningCircle :size="20" /></template>
        <List size="sm" spacing="2">
          <List.Item v-for="issue in serverIssues" :key="issue">{{ issue }}</List.Item>
        </List>
      </Alert>

      <Grid gutter="lg">
        <Grid.Col :span="{ base: 12, md: 7 }">
          <Stack gap="lg">
            <Paper withBorder radius="lg" p="md">
              <Title :order="2" size="h5" mb="sm">{{ t('checkout.orderType') }}</Title>
              <SegmentedControl
                v-if="modeOptions.length > 1"
                :model-value="mode"
                :data="modeOptions"
                fullWidth
                radius="xl"
                @update:model-value="(value: string | number) => ctx.setMode(value as OrderMode)"
              />

              <Select
                v-if="mode === 'dine-in'"
                v-bind="form.getInputProps('tableId')"
                :data="tableOptions"
                :label="t('table.title')"
                :placeholder="t('table.select')"
                :description="t('table.scanHint')"
                searchable
                mt="md"
                radius="md"
                withAsterisk
              />

              <template v-if="canSchedule">
                <Text size="sm" fw="600" mt="md" mb="xs">{{ t('checkout.when') }}</Text>
                <Radio.Group
                  :model-value="form.values.value.when"
                  :name="'qrm-when'"
                  @update:model-value="
                    (value: string | null) =>
                      form.setFieldValue('when', value === 'schedule' ? 'schedule' : 'asap')
                  "
                >
                  <Group gap="md">
                    <Radio value="asap" :label="t('checkout.asap')" :disabled="mustSchedule" />
                    <Radio value="schedule" :label="t('checkout.schedule')" />
                  </Group>
                </Radio.Group>
                <Select
                  v-if="form.values.value.when === 'schedule'"
                  v-bind="form.getInputProps('slot')"
                  :data="slots"
                  :label="
                    mode === 'delivery' ? t('checkout.deliveryTime') : t('checkout.pickupTime')
                  "
                  :nothingFoundMessage="t('checkout.noSlots')"
                  :placeholder="slots.length ? undefined : t('checkout.noSlots')"
                  :disabled="slots.length === 0"
                  mt="sm"
                  radius="md"
                  withAsterisk
                />
              </template>

              <Alert v-if="!openState.open" color="orange" variant="light" radius="md" mt="md">
                {{ t('checkout.closed', { restaurant: localize(restaurant.name) }) }}
                {{
                  mustSchedule
                    ? t('checkout.closedSchedule')
                    : t('checkout.closedNoOrders', { when: status.detail })
                }}
              </Alert>
            </Paper>

            <Paper withBorder radius="lg" p="md">
              <Title :order="2" size="h5" :mb="4">{{ t('checkout.contact') }}</Title>
              <Text v-if="mode === 'dine-in'" size="xs" c="dimmed" mb="sm">{{
                t('checkout.contactOptional')
              }}</Text>
              <Stack gap="sm">
                <TextInput
                  v-bind="form.getInputProps('name')"
                  :label="t('checkout.name')"
                  autocomplete="name"
                  radius="md"
                  :withAsterisk="mode !== 'dine-in'"
                />
                <TextInput
                  v-bind="form.getInputProps('phone')"
                  :label="t('checkout.phone')"
                  :description="t('checkout.phoneHint')"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  dir="ltr"
                  radius="md"
                  :withAsterisk="mode !== 'dine-in'"
                />
                <TextInput
                  v-bind="form.getInputProps('email')"
                  :label="t('checkout.email')"
                  type="email"
                  autocomplete="email"
                  dir="ltr"
                  radius="md"
                />
              </Stack>
            </Paper>

            <Paper v-if="mode === 'delivery'" withBorder radius="lg" p="md">
              <Title :order="2" size="h5" mb="sm">{{ t('checkout.address') }}</Title>
              <Stack gap="sm">
                <Select
                  v-bind="form.getInputProps('area')"
                  :data="(settings.delivery?.areas ?? []).map((area) => localize(area))"
                  :label="t('checkout.area')"
                  searchable
                  radius="md"
                  withAsterisk
                />
                <TextInput
                  v-bind="form.getInputProps('street')"
                  :label="t('checkout.street')"
                  autocomplete="address-line1"
                  radius="md"
                  withAsterisk
                />
                <TextInput
                  v-bind="form.getInputProps('building')"
                  :label="t('checkout.building')"
                  autocomplete="address-line2"
                  radius="md"
                  withAsterisk
                />
                <Textarea
                  v-bind="form.getInputProps('instructions')"
                  :label="t('checkout.instructions')"
                  autosize
                  :minRows="2"
                  radius="md"
                  :maxlength="200"
                />
              </Stack>
            </Paper>

            <Paper withBorder radius="lg" p="md">
              <Title :order="2" size="h5" mb="sm">{{ t('checkout.payment') }}</Title>
              <Radio.Group
                :model-value="form.values.value.payment"
                :error="form.errors.value.payment"
                :name="'qrm-payment'"
                data-path="payment"
                @update:model-value="
                  (value: string | null) =>
                    form.setFieldValue('payment', value as PaymentMethod | null)
                "
              >
                <Stack gap="xs">
                  <Radio.Card
                    v-for="method in paymentMethods"
                    :key="method"
                    :value="method"
                    radius="md"
                    :class="$style.payment"
                  >
                    <Group wrap="nowrap" align="flex-start" gap="sm">
                      <Radio.Indicator :mt="2" />
                      <component
                        :is="paymentIcons[method]"
                        :size="22"
                        :class="$style.paymentIcon"
                      />
                      <div>
                        <Text size="sm" fw="600">{{ t(`checkout.paymentMethods.${method}`) }}</Text>
                        <Text size="xs" c="dimmed">{{ t(`checkout.paymentHints.${method}`) }}</Text>
                      </div>
                    </Group>
                  </Radio.Card>
                </Stack>
              </Radio.Group>
              <Alert color="blue" variant="light" radius="md" mt="sm">
                <template #icon><PhFlask :size="18" /></template>
                {{ t('checkout.demoPaymentNotice') }}
              </Alert>
            </Paper>

            <Paper v-if="settings.tipOptions.length" withBorder radius="lg" p="md">
              <Title :order="2" size="h5" mb="sm">{{ t('checkout.tip') }}</Title>
              <TipSelector />
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col :span="{ base: 12, md: 5 }">
          <Paper withBorder radius="lg" p="md" :class="$style.summary">
            <Title :order="2" size="h5" mb="sm">{{ t('checkout.summary') }}</Title>
            <Accordion variant="default" chevronPosition="right">
              <Accordion.Item value="items">
                <Accordion.Control>{{
                  t('cart.items', { count: cart.itemCount.value })
                }}</Accordion.Control>
                <Accordion.Panel>
                  <Stack :gap="6">
                    <Group
                      v-for="priced in pricedLines"
                      :key="priced.line.id"
                      justify="space-between"
                      wrap="nowrap"
                    >
                      <Text size="sm" :td="priced.issue ? 'line-through' : undefined">
                        {{ ctx.format.number(priced.line.quantity) }} ×
                        {{ priced.product ? localize(priced.product.name) : '' }}
                      </Text>
                      <Text size="sm" class="qrm-tabular">{{ ctx.price(priced.total) }}</Text>
                    </Group>
                    <Anchor
                      component="button"
                      type="button"
                      size="sm"
                      @click="ctx.overlays.cart = true"
                    >
                      {{ t('app.edit') }}
                    </Anchor>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Text v-if="cart.cart.value.notes" size="xs" c="dimmed" mt="xs" fs="italic"
              >“{{ cart.cart.value.notes }}”</Text
            >
            <PriceSummary
              :totals="totals"
              :tax-label="settings.taxLabel"
              :tax-rate="settings.taxRate"
              :promo-code="
                ctx.promotionEligibility.value?.eligible ? cart.cart.value.promoCode : null
              "
              :is-delivery="mode === 'delivery'"
              mt="md"
            />
            <Checkbox
              v-bind="form.getInputProps('remember', { type: 'checkbox' })"
              :label="t('checkout.remember')"
              mt="md"
            />
            <Alert v-if="hasUnavailable" color="red" variant="light" mt="md" radius="md">{{
              t('checkout.issues.unavailable-items')
            }}</Alert>
            <Alert v-if="!network.online" color="orange" variant="light" mt="md" radius="md">{{
              t('checkout.offline')
            }}</Alert>
            <Button
              type="submit"
              size="lg"
              radius="xl"
              fullWidth
              mt="md"
              :loading="submitting"
              :disabled="!network.online || hasUnavailable || blockedByHours"
              visibleFrom="md"
            >
              {{ t('checkout.placeOrder', { total: ctx.price(totals.total) }) }}
            </Button>
            <Text size="xs" c="dimmed" ta="center" mt="xs">{{
              t('checkout.demoPaymentNotice')
            }}</Text>
          </Paper>
        </Grid.Col>
      </Grid>
      <Affix :position="{ bottom: 0, left: 0, right: 0 }" :zIndex="150" hiddenFrom="md">
        <div :class="$style.mobileBar">
          <Button
            type="submit"
            form="qrm-checkout-form"
            size="lg"
            radius="xl"
            fullWidth
            :loading="submitting"
            :disabled="!network.online || hasUnavailable || blockedByHours"
          >
            {{ t('checkout.placeOrder', { total: ctx.price(totals.total) }) }}
          </Button>
        </div>
      </Affix>
      <LoadingOverlay
        :visible="submitting"
        :overlayProps="{ blur: 2 }"
        :loaderProps="{ type: 'dots' }"
        :zIndex="300"
      />
    </form>
  </div>
</template>

<style module>
.page {
  padding-block: var(--mantine-spacing-lg) 120px;
}

.empty {
  padding-block: 48px;
}

.payment {
  padding: 12px 14px;

  &[data-checked] {
    border-color: var(--mantine-primary-color-filled);
    background-color: var(--mantine-primary-color-light);
  }
}

.paymentIcon {
  flex-shrink: 0;
  color: var(--mantine-primary-color-filled);
}

.summary {
  position: sticky;
  top: calc(var(--qrm-header-height) + var(--mantine-spacing-md));
}

.mobileBar {
  padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
  padding-bottom: calc(var(--mantine-spacing-sm) + env(safe-area-inset-bottom));
  background-color: var(--mantine-color-body);
  border-top: 1px solid var(--mantine-color-default-border);
  box-shadow: 0 -6px 16px rgba(0, 0, 0, 0.08);
}
</style>
