<script lang="ts">
import { createVarsResolver, rem, type MantineSize } from '@mantine-vue/core'

const EMOJI_SIZES: Record<
  string,
  {
    emojiSize: number
    emojiFz: string
    previewPy: string
    skinToneSize: string
    skinToneFz: string
  }
> = {
  xs: {
    emojiSize: 28,
    emojiFz: rem(16),
    previewPy: rem(4),
    skinToneSize: rem(20),
    skinToneFz: rem(13),
  },
  sm: {
    emojiSize: 32,
    emojiFz: rem(18),
    previewPy: rem(5),
    skinToneSize: rem(22),
    skinToneFz: rem(14),
  },
  md: {
    emojiSize: 36,
    emojiFz: rem(22),
    previewPy: rem(7),
    skinToneSize: rem(24),
    skinToneFz: rem(16),
  },
  lg: {
    emojiSize: 42,
    emojiFz: rem(26),
    previewPy: rem(8),
    skinToneSize: rem(28),
    skinToneFz: rem(18),
  },
  xl: {
    emojiSize: 48,
    emojiFz: rem(30),
    previewPy: rem(10),
    skinToneSize: rem(32),
    skinToneFz: rem(20),
  },
}

const EMOJI_FONT_SIZE_RATIO = 0.6

function getSizeValues(size: MantineSize | undefined) {
  return EMOJI_SIZES[size || 'sm'] || EMOJI_SIZES.sm
}

const varsResolver = createVarsResolver<any>((_, { columns, emojiSize, size }) => {
  const sizeValues = getSizeValues(size)
  return {
    root: {
      '--ep-columns': columns?.toString() ?? '9',
      '--ep-emoji-size': emojiSize ? rem(emojiSize) : rem(sizeValues.emojiSize),
      '--ep-emoji-fz': emojiSize
        ? rem(Math.round(emojiSize * EMOJI_FONT_SIZE_RATIO))
        : sizeValues.emojiFz,
      '--ep-preview-py': sizeValues.previewPy,
      '--ep-skin-tone-size': sizeValues.skinToneSize,
      '--ep-skin-tone-fz': sizeValues.skinToneFz,
    },
  }
})

const defaultProps = {
  columns: 9,
  withSearch: true,
  withCategoryNav: true,
  withPreview: true,
  withSkinToneSelector: true,
  withUnsupportedDetection: false,
  autoFocus: false,
  size: 'sm',
} as const

export { varsResolver, defaultProps, getSizeValues }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { useEmojiGridNavigation } from '../../composables/use-emoji-grid-navigation'
import { useEmojiSearch } from '../../composables/use-emoji-search'
import {
  DEFAULT_LABELS,
  type EmojiPickerEmoji,
  type EmojiPickerLabels,
  type FlattenedRowItem,
} from '../../types'
import {
  applySkinTone,
  filterSupportedEmojis,
  flattenEmojiData,
  getEmojiItemIndex,
} from '../../utils'
import { provideEmojiPickerContext } from './EmojiPicker.context'
import EmojiPickerCategoryNav from './EmojiPickerCategoryNav.vue'
import EmojiPickerGrid from './EmojiPickerGrid.vue'
import EmojiPickerSearch from './EmojiPickerSearch.vue'
import EmojiPickerSkinTone from './EmojiPickerSkinTone.vue'
import type { EmojiPickerEmits, EmojiPickerOwnProps } from './EmojiPicker.types'
import classes from './EmojiPicker.module.css'

defineOptions({ name: 'EmojiPicker', inheritAttrs: false })
const rawProps = withDefaults(defineProps<EmojiPickerOwnProps>(), {
  withSearch: undefined,
  withCategoryNav: undefined,
  withPreview: undefined,
  withSkinToneSelector: undefined,
  withUnsupportedDetection: undefined,
  autoFocus: undefined,
  skinTone: undefined,
  searchValue: undefined,
  unstyled: false,
})
const emit = defineEmits<EmojiPickerEmits>()
const slots = useSlots()
const attrs = useAttrs()
const props = useProps('EmojiPicker', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'EmojiPicker',
  classes,
  props,
  attrs,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const [skinTone, setSkinTone] = useUncontrolled<number>({
  value: () => props.skinTone,
  defaultValue: props.defaultSkinTone ?? 0,
  finalValue: 0,
  onChange: (value) => {
    emit('update:skinTone', value)
    emit('skinToneChange', value)
  },
})

const cols = computed(() => Math.max(props.columns ?? 9, 1))
const baseId = useId()
const idPrefix = computed(() => `${baseId.value}-emoji`)
const gridId = computed(() => `${baseId.value}-grid`)
const activeDescendant = ref<string | undefined>(undefined)

const filteredData = computed(() => {
  if (!props.withUnsupportedDetection) {
    return props.data
  }
  return {
    emojis: props.data.emojis,
    categories: props.data.categories.map((category) => ({
      ...category,
      emojis: filterSupportedEmojis(props.data.emojis, category.emojis),
    })),
  }
})

const { query, setQuery, results, isSearching } = useEmojiSearch({
  data: () => filteredData.value,
  searchValue: () => props.searchValue,
  onSearchChange: (value) => {
    emit('update:searchValue', value)
    emit('searchChange', value)
  },
})

const mergedLabels = computed<Required<EmojiPickerLabels>>(() => ({
  ...DEFAULT_LABELS,
  ...props.labels,
}))

provideEmojiPickerContext({
  getStyles: getStyles as any,
  get labels() {
    return mergedLabels.value
  },
  get size() {
    return props.size
  },
})

const categoryItems = computed<FlattenedRowItem[]>(() =>
  flattenEmojiData(filteredData.value, cols.value, props.categoryLabels),
)

const searchItems = computed<FlattenedRowItem[]>(() =>
  flattenEmojiData(
    {
      emojis: filteredData.value.emojis,
      categories: [
        {
          id: 'search',
          label: mergedLabels.value.searchResults,
          emojis: results.value.map((emoji) => emoji.id),
        },
      ],
    },
    cols.value,
  ),
)

const flattenedItems = computed(() => (isSearching.value ? searchItems.value : categoryItems.value))

const navCategories = computed(() =>
  categoryItems.value.reduce<{ id: string; label: string }[]>((acc, item) => {
    if (item.type === 'header') {
      acc.push({ id: item.categoryId, label: item.label })
    }
    return acc
  }, []),
)

const grid = ref<any>(null)
const search = ref<any>(null)

function handleEmojiSelect(emoji: EmojiPickerEmoji) {
  emit('emojiSelect', emoji)
}

const navigation = useEmojiGridNavigation({
  items: () => flattenedItems.value,
  resetKey: () => query.value,
  skinTone: () => skinTone.value,
  onEmojiSelect: handleEmojiSelect,
  scrollToItem: (itemIndex) => grid.value?.scrollToItem(itemIndex, 'auto'),
})

function handleGridKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    const focusStayedInGrid = (event.currentTarget as HTMLElement).contains(document.activeElement)
    if (props.withSearch && focusStayedInGrid && search.value) {
      event.preventDefault()
      search.value.focus()
    }
    return
  }
  navigation.handleKeydown(event)
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (event.isComposing) {
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
    navigation.handleKeydown(event)
  }
}

function handleEmojiClick(index: number) {
  const emoji = navigation.model.value.emojis[index]
  if (emoji) {
    navigation.setPointerIndex(index)
    handleEmojiSelect(applySkinTone(emoji, skinTone.value))
  }
}

function scrollToCategory(categoryId: string) {
  const itemIndex = flattenedItems.value.findIndex(
    (item) => item.type === 'header' && item.categoryId === categoryId,
  )
  if (itemIndex !== -1) {
    navigation.setAnchorIndex(navigation.model.value.itemOffsets[itemIndex])
    grid.value?.scrollToItem(itemIndex, 'start')
  }
}

let pendingCategory: string | null = null

function handleCategoryClick(categoryId: string) {
  if (isSearching.value) {
    pendingCategory = categoryId
    setQuery('')
    return
  }
  scrollToCategory(categoryId)
}

watch(
  isSearching,
  (searching) => {
    if (!searching && pendingCategory !== null) {
      const categoryId = pendingCategory
      pendingCategory = null
      scrollToCategory(categoryId)
    }
  },
  { flush: 'post' },
)

const focusedIndex = computed(() =>
  navigation.keyboardActive.value ? navigation.activeIndex.value : -1,
)
const focusedItemIndex = computed(() =>
  navigation.keyboardActive.value
    ? getEmojiItemIndex(navigation.model.value, navigation.activeIndex.value)
    : -1,
)
const displayEmoji = computed(() =>
  navigation.activeEmoji.value ? applySkinTone(navigation.activeEmoji.value, skinTone.value) : null,
)
const emojiSizeValue = computed(() => props.emojiSize ?? getSizeValues(props.size).emojiSize)
const emptyContent = computed(() =>
  slots.empty ? slots.empty() : props.emptySearchContent || mergedLabels.value.noResults,
)
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('root') }">
    <EmojiPickerSearch
      v-if="props.withSearch"
      ref="search"
      :query="query"
      :placeholder="props.searchPlaceholder"
      :auto-focus="props.autoFocus"
      :controls="flattenedItems.length > 0 ? gridId : undefined"
      :active-descendant="activeDescendant"
      :search-input-props="props.searchInputProps"
      @query-change="setQuery"
      @keydown="handleSearchKeydown"
    />

    <EmojiPickerCategoryNav
      v-if="props.withCategoryNav"
      :categories="navCategories"
      @category-click="handleCategoryClick"
    />

    <EmojiPickerGrid
      ref="grid"
      :items="flattenedItems"
      :item-offsets="navigation.model.value.itemOffsets"
      :columns="cols"
      :skin-tone="skinTone"
      :focused-index="focusedIndex"
      :focused-item-index="focusedItemIndex"
      :id-prefix="idPrefix"
      :grid-id="gridId"
      :emoji-size="emojiSizeValue"
      :empty-content="emptyContent"
      :scroll-area-props="props.scrollAreaProps"
      @keydown="handleGridKeydown"
      @pointer-index="navigation.setPointerIndex"
      @emoji-click="handleEmojiClick"
      @active-descendant-change="activeDescendant = $event"
    />

    <div
      v-if="props.withPreview || props.withSkinToneSelector"
      v-bind="getStyles('preview')"
      :role="props.withPreview ? 'group' : undefined"
      :aria-label="props.withPreview ? mergedLabels.preview : undefined"
    >
      <template v-if="props.withPreview">
        <span v-bind="getStyles('previewEmoji')">{{ displayEmoji?.emoji }}</span>
        <span v-bind="getStyles('previewName')">{{ displayEmoji?.name }}</span>
      </template>
      <EmojiPickerSkinTone
        v-if="props.withSkinToneSelector"
        :skin-tone="skinTone"
        @skin-tone-change="setSkinTone"
      />
    </div>
  </Box>
</template>
