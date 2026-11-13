import { computed, ref, watch, type ComputedRef } from 'vue'
import type { EmojiPickerEmoji, FlattenedRowItem } from '../types'
import {
  applySkinTone,
  createEmojiGridModel,
  getEmojiItemIndex,
  getNextEmojiIndex,
  type EmojiGridDirection,
  type EmojiGridModel,
} from '../utils'

type ActiveEmojiSource = 'anchor' | 'pointer' | 'keyboard'

interface ActiveEmojiState {
  index: number
  source: ActiveEmojiSource
}

interface UseEmojiGridNavigationInput {
  items: () => FlattenedRowItem[]
  resetKey: () => string
  skinTone: () => number
  onEmojiSelect: (emoji: EmojiPickerEmoji) => void
  scrollToItem?: (itemIndex: number) => void
}

const INITIAL_STATE: ActiveEmojiState = { index: 0, source: 'anchor' }

const KEY_DIRECTIONS: Record<string, EmojiGridDirection> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
}

/** Keyboard and pointer navigation of the virtualized emoji grid */
export function useEmojiGridNavigation({
  items,
  resetKey,
  skinTone,
  onEmojiSelect,
  scrollToItem,
}: UseEmojiGridNavigationInput) {
  const model: ComputedRef<EmojiGridModel> = computed(() => createEmojiGridModel(items()))
  const state = ref<ActiveEmojiState>(INITIAL_STATE)

  watch(resetKey, () => {
    state.value = INITIAL_STATE
  })

  const isCurrent = computed(() => state.value.index < model.value.emojis.length)
  const source = computed<ActiveEmojiSource>(() =>
    isCurrent.value ? state.value.source : 'anchor',
  )
  const activeIndex = computed(() =>
    model.value.emojis.length === 0 ? -1 : isCurrent.value ? state.value.index : 0,
  )
  const keyboardActive = computed(() => source.value === 'keyboard' && activeIndex.value !== -1)
  const activeEmoji = computed(() =>
    activeIndex.value === -1 ? null : model.value.emojis[activeIndex.value],
  )

  const setActive = (index: number, nextSource: ActiveEmojiSource) => {
    if (state.value.index !== index || state.value.source !== nextSource) {
      state.value = { index, source: nextSource }
    }
  }

  const setPointerIndex = (index: number) => setActive(index, 'pointer')
  const setAnchorIndex = (index: number) => setActive(index, 'anchor')

  const handleKeydown = (event: KeyboardEvent) => {
    if (activeIndex.value === -1) {
      return
    }

    const direction = KEY_DIRECTIONS[event.key]
    if (direction) {
      event.preventDefault()
      const nextIndex =
        source.value === 'anchor'
          ? activeIndex.value
          : getNextEmojiIndex(model.value, activeIndex.value, direction)
      setActive(nextIndex, 'keyboard')
      scrollToItem?.(getEmojiItemIndex(model.value, nextIndex))
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onEmojiSelect(applySkinTone(model.value.emojis[activeIndex.value], skinTone()))
    }
  }

  return {
    model,
    activeIndex,
    activeEmoji,
    keyboardActive,
    handleKeydown,
    setPointerIndex,
    setAnchorIndex,
  }
}
