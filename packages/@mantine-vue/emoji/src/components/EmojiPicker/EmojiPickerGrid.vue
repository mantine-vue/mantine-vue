<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { ScrollArea, UnstyledButton } from '@mantine-vue/core'
import type { EmojiPickerEmoji, FlattenedRowItem } from '../../types'
import { applySkinTone } from '../../utils'
import { useEmojiPickerContext } from './EmojiPicker.context'

defineOptions({ name: 'EmojiPickerGrid' })

const props = defineProps<{
  items: FlattenedRowItem[]
  itemOffsets: number[]
  columns: number
  skinTone: number
  focusedIndex: number
  focusedItemIndex: number
  idPrefix: string
  gridId: string
  emojiSize: number
  emptyContent: any
  scrollAreaProps?: Record<string, any>
}>()

const emit = defineEmits<{
  keydown: [event: KeyboardEvent]
  pointerIndex: [index: number]
  emojiClick: [index: number]
  activeDescendantChange: [id: string | undefined]
}>()

const HEADER_HEIGHT = 32
const DEFAULT_SCROLL_AREA_HEIGHT = 300

const ctx = useEmojiPickerContext()
const scrollArea = ref<any>(null)
let lastPointer: { x: number; y: number } | null = null

const virtualizer = useVirtualizer(
  computed(() => ({
    count: props.items.length,
    getScrollElement: () => (scrollArea.value?.viewport ?? null) as HTMLDivElement | null,
    estimateSize: (index: number) =>
      props.items[index]?.type === 'header' ? HEADER_HEIGHT : props.emojiSize,
    overscan: 10,
  })),
)

watch(
  () => props.emojiSize,
  () => virtualizer.value.measure(),
)

const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const hasEmojis = computed(() => props.items.length > 0)
const focusedItemMounted = computed(
  () =>
    props.focusedIndex !== -1 &&
    virtualItems.value.some((item) => item.index === props.focusedItemIndex),
)
const activeDescendant = computed(() =>
  hasEmojis.value && focusedItemMounted.value
    ? `${props.idPrefix}-${props.focusedIndex}`
    : undefined,
)

watch(activeDescendant, (id) => emit('activeDescendantChange', id), { immediate: true })

function rowEmojis(index: number): EmojiPickerEmoji[] {
  const item = props.items[index]
  return item?.type === 'row' ? item.emojis : []
}

function getEmojiIndexFromEvent(event: Event) {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-emoji-index]')
  return target ? Number(target.dataset.emojiIndex) : -1
}

function handleMousemove(event: MouseEvent) {
  if (lastPointer && lastPointer.x === event.clientX && lastPointer.y === event.clientY) {
    return
  }
  lastPointer = { x: event.clientX, y: event.clientY }
  const index = getEmojiIndexFromEvent(event)
  if (index !== -1) emit('pointerIndex', index)
}

function handleMousedown(event: MouseEvent) {
  if (getEmojiIndexFromEvent(event) !== -1) event.preventDefault()
}

function handleClick(event: MouseEvent) {
  const index = getEmojiIndexFromEvent(event)
  if (index !== -1) emit('emojiClick', index)
}

const viewportProps = computed(() => ({
  ...props.scrollAreaProps?.viewportProps,
  ...(hasEmojis.value
    ? {
        id: props.gridId,
        role: 'grid',
        tabindex: 0,
        'aria-label': ctx.labels.emojis,
        'aria-colcount': props.columns,
        'aria-activedescendant': activeDescendant.value,
        onKeydown: (event: KeyboardEvent) => emit('keydown', event),
        onMousemove: handleMousemove,
        onMousedown: handleMousedown,
        onClick: handleClick,
      }
    : { tabindex: -1 }),
}))

const positionStyle = (size: number, start: number) => ({
  position: 'absolute' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: `${size}px`,
  transform: `translateY(${start}px)`,
})

defineExpose({
  scrollToItem: (itemIndex: number, align: 'auto' | 'start') =>
    virtualizer.value.scrollToIndex(itemIndex, { align }),
})
</script>

<template>
  <ScrollArea
    ref="scrollArea"
    scrollbars="y"
    v-bind="{
      ...props.scrollAreaProps,
      ...ctx.getStyles('content', {
        style: { height: `${DEFAULT_SCROLL_AREA_HEIGHT}px`, ...props.scrollAreaProps?.style },
      }),
    }"
    :viewport-props="viewportProps"
  >
    <div
      v-if="hasEmojis"
      :style="{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }"
    >
      <template v-for="virtualItem in virtualItems" :key="virtualItem.key">
        <div
          v-if="props.items[virtualItem.index]?.type === 'header'"
          role="row"
          v-bind="
            ctx.getStyles('categoryLabel', {
              style: positionStyle(virtualItem.size, virtualItem.start),
            })
          "
          :data-category="(props.items[virtualItem.index] as any).categoryId"
        >
          <span role="columnheader" :aria-colspan="props.columns">{{
            (props.items[virtualItem.index] as any).label
          }}</span>
        </div>
        <div
          v-else-if="props.items[virtualItem.index]"
          role="row"
          v-bind="
            ctx.getStyles('grid', { style: positionStyle(virtualItem.size, virtualItem.start) })
          "
        >
          <UnstyledButton
            v-for="(emoji, colIndex) in rowEmojis(virtualItem.index)"
            :key="emoji.id"
            v-bind="ctx.getStyles('emoji')"
            role="gridcell"
            :aria-label="emoji.name"
            :title="emoji.name"
            :id="`${props.idPrefix}-${props.itemOffsets[virtualItem.index] + colIndex}`"
            :tabindex="-1"
            :data-focused="
              props.itemOffsets[virtualItem.index] + colIndex === props.focusedIndex || undefined
            "
            :data-emoji-index="props.itemOffsets[virtualItem.index] + colIndex"
            >{{ applySkinTone(emoji, props.skinTone).emoji }}</UnstyledButton
          >
        </div>
      </template>
    </div>
    <div v-else v-bind="ctx.getStyles('empty')">
      <component :is="() => props.emptyContent" />
    </div>
  </ScrollArea>
</template>
