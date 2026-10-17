<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  CopyButton,
  Group,
  Radio,
  Rating,
  Spoiler,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine-vue/core'
import {
  PhCheck,
  PhClock,
  PhFire,
  PhPepper,
  PhShareNetwork,
  PhWarningCircle,
  PhX,
} from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { useCartActions } from '../../composables/use-cart-actions'
import {
  createDefaultSelection,
  toggleModifierOption,
  validateSelection,
} from '../../domain/modifiers'
import { getUnitPrice } from '../../domain/pricing'
import type { CartLine, ModifierGroup, Product, ProductSelection } from '../../domain/types'
import ProductTags from '../common/ProductTags.vue'
import QuantityStepper from '../common/QuantityStepper.vue'
import CardFavoriteButton from '../menu/cards/CardFavoriteButton.vue'
import ProductRail from '../menu/ProductRail.vue'
import ModifierGroupField from './ModifierGroupField.vue'
import NutritionPanel from './NutritionPanel.vue'
import ProductGallery from './ProductGallery.vue'

const props = defineProps<{ product: Product; editingLine?: CartLine | null }>()
const emit = defineEmits<{ done: [] }>()

const ctx = useQrMenu()
const { t, localize, format, data, openState } = ctx
const cartActions = useCartActions()

const NOTES_LIMIT = 200

/* ----------------------------- Selection state ---------------------------- */

const initialSelection = (): ProductSelection =>
  props.editingLine
    ? JSON.parse(JSON.stringify(props.editingLine.selection))
    : createDefaultSelection(props.product)

const selection = reactive<ProductSelection>(initialSelection())
// Groups added later (or missing in a saved line) default to "nothing selected".
for (const group of props.product.modifierGroups ?? []) {
  selection.modifiers[group.id] ??= []
}

const quantity = ref(props.editingLine?.quantity ?? 1)
const notes = ref(props.editingLine?.notes ?? '')
const showErrors = ref(false)
const root = ref<HTMLElement | null>(null)

const validation = computed(() => validateSelection(props.product, selection))
const groupError = (group: ModifierGroup) =>
  showErrors.value
    ? (validation.value.groupErrors.find((error) => error.groupId === group.id) ?? null)
    : null

const unitPrice = computed(() => getUnitPrice(props.product, selection))
const totalPrice = computed(() => unitPrice.value * quantity.value)
const maxQuantity = computed(() => cartActions.maxQuantity())

const toggleOption = (group: ModifierGroup, optionId: string) => {
  Object.assign(selection, toggleModifierOption(selection, group, optionId))
}
const clearGroup = (group: ModifierGroup) => {
  selection.modifiers[group.id] = []
}

/* --------------------------------- Display -------------------------------- */

const name = computed(() => localize(props.product.name))
const pairings = computed(() =>
  (props.product.pairsWith ?? [])
    .map((id) => data.productsById.value.get(id))
    .filter((item): item is Product => Boolean(item && item.available)),
)
const alternatives = computed(() =>
  data.products.value
    .filter(
      (item) =>
        item.categoryId === props.product.categoryId &&
        item.id !== props.product.id &&
        item.available,
    )
    .slice(0, 6),
)
const favorite = computed(() => ctx.customer.isFavorite(ctx.restaurantId.value, props.product.id))
const shareUrl = computed(() => {
  if (typeof window === 'undefined') {
    return ''
  }
  const url = new URL(window.location.href)
  url.searchParams.set('item', props.product.id)
  url.searchParams.set('r', ctx.restaurantId.value)
  url.searchParams.delete('line')
  return url.toString()
})

const variantLabel = (price: number) => ctx.price(price)

/* --------------------------------- Submit --------------------------------- */

const submit = async () => {
  const result = cartActions.addToCart({
    product: props.product,
    selection,
    quantity: quantity.value,
    notes: notes.value,
    lineId: props.editingLine?.id,
  })

  if (result.ok) {
    emit('done')
    return
  }

  showErrors.value = true
  await nextTick()
  const firstError = validation.value.groupErrors[0]
  const target = firstError
    ? root.value?.querySelector<HTMLElement>(`[data-group-id="${firstError.groupId}"]`)
    : root.value?.querySelector<HTMLElement>('[data-variant-group]')
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  target?.querySelector<HTMLElement>('input:not(:disabled)')?.focus({ preventScroll: true })
}
</script>

<template>
  <div ref="root" :class="$style.root">
    <ProductGallery :product="product">
      <div :class="$style.topActions">
        <CardFavoriteButton
          :active="favorite"
          floating
          @toggle="cartActions.toggleFavorite(product)"
        />
        <CopyButton :value="shareUrl">
          <template #default="{ copied, copy }">
            <Tooltip
              :label="copied ? t('app.linkCopied') : t('app.share')"
              :opened="copied || undefined"
            >
              <ActionIcon
                variant="default"
                radius="xl"
                size="md"
                :aria-label="t('app.share')"
                @click="copy"
              >
                <PhCheck v-if="copied" :size="16" />
                <PhShareNetwork v-else :size="16" />
              </ActionIcon>
            </Tooltip>
          </template>
        </CopyButton>
        <ActionIcon
          variant="default"
          radius="xl"
          size="md"
          :aria-label="t('app.close')"
          @click="emit('done')"
        >
          <PhX :size="16" />
        </ActionIcon>
      </div>
    </ProductGallery>

    <Stack gap="md" p="md" :class="$style.content">
      <div>
        <ProductTags :product="product" :max-badges="6" size="sm" />
        <Title :order="2" mt="xs" :class="$style.title">{{ name }}</Title>
        <Group gap="md" :mt="6" wrap="wrap">
          <Group
            v-if="product.rating"
            :gap="4"
            wrap="nowrap"
            :aria-label="t('product.rating', { rating: format.decimal(product.rating.average) })"
          >
            <Rating :model-value="product.rating.average" :fractions="10" readonly size="xs" />
            <Text size="xs" c="dimmed"
              >{{ format.decimal(product.rating.average) }} ({{
                format.number(product.rating.count)
              }})</Text
            >
          </Group>
          <Text v-if="product.preparationMinutes" size="xs" c="dimmed" :class="$style.meta">
            <PhClock :size="14" /> {{ t('product.minutes', { count: product.preparationMinutes }) }}
          </Text>
          <Text v-if="product.calories" size="xs" c="dimmed" :class="$style.meta">
            <PhFire :size="14" /> {{ t('product.calories', { count: product.calories }) }}
          </Text>
          <Text v-if="product.spiceLevel" size="xs" c="red" :class="$style.meta">
            <PhPepper v-for="level in product.spiceLevel" :key="level" :size="13" weight="fill" />
            {{ t(`spice.${product.spiceLevel}`) }}
          </Text>
        </Group>
      </div>

      <Spoiler :maxHeight="72" :showLabel="t('app.readMore')" :hideLabel="t('app.readLess')">
        <Text size="sm" c="dimmed" lh="1.6">{{ localize(product.description) }}</Text>
      </Spoiler>

      <Alert
        v-if="!product.available"
        color="gray"
        variant="light"
        radius="md"
        :title="t('details.soldOut')"
      >
        <template #icon><PhWarningCircle :size="20" /></template>
        {{ t('details.soldOutHint') }}
      </Alert>
      <Alert v-else-if="!openState.open" color="orange" variant="light" radius="md">
        <template #icon><PhClock :size="20" /></template>
        {{ t('details.closedNotice') }}
      </Alert>

      <template v-if="product.available">
        <fieldset v-if="product.variants?.length" data-variant-group :class="$style.fieldset">
          <Group justify="space-between" mb="xs">
            <Text component="legend" fw="700">{{ t('details.size') }}</Text>
            <Badge variant="light" size="sm" tt="none">{{ t('details.required') }}</Badge>
          </Group>
          <Radio.Group v-model="selection.variantId" :name="`variant-${product.id}`">
            <div :class="$style.variants">
              <Radio.Card
                v-for="variant in product.variants"
                :key="variant.id"
                :value="variant.id"
                :disabled="variant.available === false"
                radius="md"
                :class="$style.variant"
              >
                <Text size="sm" fw="600">{{ localize(variant.name) }}</Text>
                <Text size="sm" c="dimmed" class="qrm-tabular">{{
                  variantLabel(variant.price)
                }}</Text>
              </Radio.Card>
            </div>
          </Radio.Group>
          <Text v-if="showErrors && validation.variantError" size="sm" c="red" mt="xs" role="alert">
            {{ t('errors.variant') }}
          </Text>
        </fieldset>

        <ModifierGroupField
          v-for="group in product.modifierGroups ?? []"
          :key="group.id"
          :group="group"
          :selected="selection.modifiers[group.id] ?? []"
          :error="groupError(group)"
          @toggle="(optionId: string) => toggleOption(group, optionId)"
          @clear="clearGroup(group)"
        />

        <Textarea
          v-model="notes"
          :label="t('details.instructions')"
          :description="t('details.instructionsHint')"
          :placeholder="t('details.instructionsPlaceholder')"
          :maxlength="NOTES_LIMIT"
          autosize
          :minRows="2"
          :maxRows="4"
          radius="md"
        >
          <template #rightSection>
            <Text size="xs" c="dimmed" :class="$style.counter"
              >{{ notes.length }}/{{ NOTES_LIMIT }}</Text
            >
          </template>
        </Textarea>
      </template>

      <NutritionPanel :product="product" />

      <ProductRail
        v-if="product.available ? pairings.length : alternatives.length"
        :title="t('details.pairsWith')"
        :products="product.available ? pairings : alternatives"
        :item-width="128"
      />
    </Stack>

    <footer v-if="product.available" :class="$style.footer">
      <Text
        v-if="showErrors && !validation.valid"
        :id="`${product.id}-errors`"
        size="xs"
        c="red"
        ta="center"
        role="status"
      >
        {{ t('errors.fixSelection') }}
      </Text>
      <div :class="$style.footerRow">
        <QuantityStepper v-model="quantity" :max="maxQuantity" size="sm" />
        <Button
          size="md"
          radius="xl"
          flex="1"
          px="md"
          :class="$style.submit"
          :classNames="{ inner: $style.fullWidth, label: $style.fullWidth }"
          :aria-describedby="showErrors && !validation.valid ? `${product.id}-errors` : undefined"
          @click="submit"
        >
          <span :class="$style.submitLabel">
            <span>{{ editingLine ? t('details.update') : t('details.addToCart') }}</span>
            <span class="qrm-tabular" aria-live="polite">{{ ctx.price(totalPrice) }}</span>
          </span>
        </Button>
      </div>
    </footer>
  </div>
</template>

<style module>
.root {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.topActions {
  position: absolute;
  top: var(--mantine-spacing-sm);
  inset-inline-end: var(--mantine-spacing-sm);
  z-index: 2;
  display: flex;
  gap: 6px;
}

.content {
  flex: 1;
}

.title {
  font-size: clamp(1.35rem, 4.5vw, 1.75rem);
  line-height: 1.2;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.variants {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--mantine-spacing-xs);
}

.variant {
  padding: 10px 12px;

  &[data-checked] {
    border-color: var(--mantine-primary-color-filled);
    background-color: var(--mantine-primary-color-light);
  }
}

.counter {
  padding-inline-end: 6px;
  align-self: flex-end;
  padding-bottom: 6px;
}

.footer {
  position: sticky;
  bottom: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
  padding-bottom: calc(var(--mantine-spacing-sm) + env(safe-area-inset-bottom));
  background-color: var(--mantine-color-body);
  border-top: 1px solid var(--mantine-color-default-border);
  box-shadow: 0 -6px 16px rgba(0, 0, 0, 0.06);
}

.footerRow {
  display: flex;
  align-items: center;
  gap: var(--mantine-spacing-sm);
}

.submit {
  min-width: 0;
}

.fullWidth {
  width: 100%;
}

.submitLabel {
  display: flex;
  justify-content: space-between;
  gap: var(--mantine-spacing-xs);
  width: 100%;
}
</style>
