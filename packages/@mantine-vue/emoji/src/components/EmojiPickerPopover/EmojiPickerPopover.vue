<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Popover, useProps } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import type { EmojiPickerEmoji } from '../../types'
import EmojiPicker from '../EmojiPicker/EmojiPicker.vue'
import type { EmojiPickerPopoverOwnProps } from './EmojiPickerPopover.types'
import classes from './EmojiPickerPopover.module.css'

defineOptions({ name: 'EmojiPickerPopover', inheritAttrs: false })
const rawProps = withDefaults(defineProps<EmojiPickerPopoverOwnProps>(), {
  opened: undefined,
  defaultOpened: undefined,
  closeOnSelect: undefined,
  skinTone: undefined,
  searchValue: undefined,
  withSearch: undefined,
  withCategoryNav: undefined,
  withPreview: undefined,
  withSkinToneSelector: undefined,
  withUnsupportedDetection: undefined,
  autoFocus: undefined,
  unstyled: undefined,
})
const emit = defineEmits<{
  'update:opened': [opened: boolean]
  openedChange: [opened: boolean]
  emojiSelect: [emoji: EmojiPickerEmoji]
  'update:skinTone': [skinTone: number]
  skinToneChange: [skinTone: number]
}>()
const slots = useSlots()
const attrs = useAttrs()
const props = useProps('EmojiPickerPopover', { closeOnSelect: true }, rawProps)

const [opened, setOpened] = useUncontrolled<boolean>({
  value: () => props.opened,
  defaultValue: props.defaultOpened,
  finalValue: false,
  onChange: (value) => {
    emit('update:opened', value)
    emit('openedChange', value)
  },
})

const [skinTone, setSkinTone] = useUncontrolled<number>({
  value: () => props.skinTone,
  defaultValue: props.defaultSkinTone,
  finalValue: 0,
  onChange: (value) => {
    emit('update:skinTone', value)
    emit('skinToneChange', value)
  },
})

const isUncontrolled = computed(() => props.opened === undefined)

function handleTargetClick() {
  if (isUncontrolled.value) {
    setOpened(!opened.value)
  }
}

function handleEmojiSelect(emoji: EmojiPickerEmoji) {
  emit('emojiSelect', emoji)
  if (props.closeOnSelect) {
    setOpened(false)
  }
}

const pickerProps = computed(() => {
  const {
    popoverProps,
    opened: _opened,
    defaultOpened,
    closeOnSelect,
    skinTone: _skinTone,
    defaultSkinTone,
    ...rest
  } = props as any
  void popoverProps
  void _opened
  void defaultOpened
  void closeOnSelect
  void _skinTone
  void defaultSkinTone
  return rest
})
</script>

<template>
  <Popover
    position="bottom-start"
    :offset="5"
    trap-focus
    return-focus
    v-bind="props.popoverProps"
    :opened="opened"
    @update:opened="setOpened"
  >
    <Popover.Target @click="handleTargetClick">
      <slot />
    </Popover.Target>
    <Popover.Dropdown :class="classes.dropdown">
      <EmojiPicker
        v-bind="{ ...attrs, ...pickerProps }"
        :skin-tone="skinTone"
        auto-focus
        @skin-tone-change="setSkinTone"
        @emoji-select="handleEmojiSelect"
      >
        <template v-if="slots.empty" #empty><slot name="empty" /></template>
      </EmojiPicker>
    </Popover.Dropdown>
  </Popover>
</template>
