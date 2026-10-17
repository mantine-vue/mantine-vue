<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  Button,
  Chip,
  Drawer,
  Group,
  RangeSlider,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'
import { useIsMobile } from '../../composables/use-is-mobile'
import { getCurrencyFractionDigits } from '../../domain/money'
import {
  MENU_SORTS,
  createEmptyFilters,
  getPriceBounds,
  type MenuFilters,
  type MenuSort,
} from '../../domain/menu-query'
import type { Allergen, DietaryTag, ProductBadge } from '../../domain/types'

/** Filter & sort sheet. Changes are previewed live and applied on confirm. */
const ctx = useQrMenu()
const { t, menuFilters, data, overlays, currency } = ctx
const isMobile = useIsMobile()

const DIETARY: DietaryTag[] = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal']
const ALLERGENS: Allergen[] = [
  'gluten',
  'dairy',
  'eggs',
  'nuts',
  'sesame',
  'soy',
  'fish',
  'shellfish',
  'mustard',
]
const HIGHLIGHTS: ProductBadge[] = ['popular', 'new', 'recommended', 'chef-special', 'spicy']

const draft = reactive<MenuFilters>(createEmptyFilters())
const sort = ref<MenuSort>('recommended')
const bounds = computed(() => getPriceBounds(data.products.value))
const price = ref<[number, number]>([0, 0])

const sync = () => {
  Object.assign(draft, JSON.parse(JSON.stringify(menuFilters.filters)))
  sort.value = menuFilters.sort.value
  price.value = draft.priceRange ? [...draft.priceRange] : [...bounds.value]
}

watch(
  () => overlays.filters,
  (opened) => opened && sync(),
  { immediate: true },
)

const priceStep = computed(
  () => 10 ** Math.max(0, getCurrencyFractionDigits(currency.value) - 1) * 5,
)

const result = computed<MenuFilters>(() => ({
  ...draft,
  priceRange:
    price.value[0] <= bounds.value[0] && price.value[1] >= bounds.value[1]
      ? null
      : [...price.value],
}))

const previewCount = computed(() => menuFilters.preview(result.value))

const spiceOptions = computed(() => [
  { value: 'any', label: t('filters.anySpice') },
  ...[0, 1, 2, 3].map((level) => ({
    value: String(level),
    label: t(`spice.${level as 0 | 1 | 2 | 3}`),
  })),
])

const apply = () => {
  menuFilters.apply(result.value, sort.value)
  overlays.filters = false
}

const reset = () => {
  Object.assign(draft, createEmptyFilters())
  sort.value = 'recommended'
  price.value = [...bounds.value]
}
</script>

<template>
  <Drawer
    :opened="overlays.filters"
    :position="isMobile ? 'bottom' : 'right'"
    :size="isMobile ? '88%' : 'md'"
    :radius="isMobile ? 'lg' : 0"
    :title="t('filters.title')"
    :closeButtonProps="{ 'aria-label': t('app.close') }"
    @close="overlays.filters = false"
  >
    <Stack gap="lg" :pb="80">
      <div>
        <Title :order="3" size="h6" mb="xs">{{ t('filters.sortBy') }}</Title>
        <Chip.Group v-model="sort">
          <Group gap="xs">
            <Chip v-for="option in MENU_SORTS" :key="option" :value="option" size="sm" radius="xl">
              {{ t(`filters.sorts.${option}`) }}
            </Chip>
          </Group>
        </Chip.Group>
      </div>

      <div>
        <Title :order="3" size="h6" mb="xs">{{ t('filters.dietary') }}</Title>
        <Chip.Group v-model="draft.dietary" multiple>
          <Group gap="xs">
            <Chip
              v-for="tag in DIETARY"
              :key="tag"
              :value="tag"
              size="sm"
              radius="xl"
              color="green"
            >
              {{ t(`dietary.${tag}`) }}
            </Chip>
          </Group>
        </Chip.Group>
      </div>

      <div>
        <Title :order="3" size="h6" mb="xs">{{ t('filters.excludeAllergens') }}</Title>
        <Chip.Group v-model="draft.excludeAllergens" multiple>
          <Group gap="xs">
            <Chip
              v-for="allergen in ALLERGENS"
              :key="allergen"
              :value="allergen"
              size="sm"
              radius="xl"
              color="red"
              variant="outline"
            >
              {{ t(`allergens.${allergen}`) }}
            </Chip>
          </Group>
        </Chip.Group>
        <Text size="xs" c="dimmed" mt="xs">{{ t('menu.allergenNotice') }}</Text>
      </div>

      <div>
        <Title :order="3" size="h6" mb="xs">{{ t('filters.highlights') }}</Title>
        <Chip.Group v-model="draft.badges" multiple>
          <Group gap="xs">
            <Chip v-for="badge in HIGHLIGHTS" :key="badge" :value="badge" size="sm" radius="xl">
              {{ t(`badges.${badge}`) }}
            </Chip>
          </Group>
        </Chip.Group>
      </div>

      <div>
        <Title :order="3" size="h6" mb="xs">{{ t('filters.spice') }}</Title>
        <SegmentedControl
          :model-value="draft.maxSpice === null ? 'any' : String(draft.maxSpice)"
          :data="spiceOptions"
          fullWidth
          size="xs"
          radius="xl"
          @update:model-value="
            (value: string | number) => (draft.maxSpice = value === 'any' ? null : Number(value))
          "
        />
      </div>

      <div v-if="bounds[1] > bounds[0]">
        <Title :order="3" size="h6" mb="xs">{{ t('filters.price') }}</Title>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw="600" class="qrm-tabular">{{ ctx.price(price[0]) }}</Text>
          <Text size="sm" fw="600" class="qrm-tabular">{{ ctx.price(price[1]) }}</Text>
        </Group>
        <RangeSlider
          v-model="price"
          :min="bounds[0]"
          :max="bounds[1]"
          :step="priceStep"
          :minRange="priceStep"
          :label="(value: number) => ctx.price(value)"
          :aria-label="t('filters.price')"
          px="xs"
        />
      </div>

      <Switch v-model="draft.hideSoldOut" :label="t('filters.hideSoldOut')" size="md" />
    </Stack>

    <div :class="$style.footer">
      <Button variant="default" radius="xl" @click="reset">{{ t('filters.reset') }}</Button>
      <Button radius="xl" flex="1" :disabled="previewCount === 0" @click="apply">
        {{ t('filters.show', { count: previewCount }) }}
      </Button>
    </div>
  </Drawer>
</template>

<style module>
.footer {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: var(--mantine-spacing-sm);
  padding-block: var(--mantine-spacing-sm);
  padding-bottom: calc(var(--mantine-spacing-sm) + env(safe-area-inset-bottom));
  background-color: var(--mantine-color-body);
  border-top: 1px solid var(--mantine-color-default-border);
  margin-inline: calc(var(--mantine-spacing-md) * -1);
  padding-inline: var(--mantine-spacing-md);
}
</style>
