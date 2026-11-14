<script setup lang="ts">
import { computed, h, ref, useAttrs, useSlots, watch } from 'vue'
import { Input, InputBase, Popover, useProps, useStyles } from '@mantine-vue/core'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import type { EmojiPickerEmoji } from '../../types'
import EmojiPicker from '../EmojiPicker/EmojiPicker.vue'
import type { EmojiPickerInputEmits, EmojiPickerInputOwnProps } from './EmojiPickerInput.types'
import classes from './EmojiPickerInput.module.css'

defineOptions({ name: 'EmojiPickerInput', inheritAttrs: false })
const rawProps = withDefaults(defineProps<EmojiPickerInputOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  clearable: undefined,
  opened: undefined,
  defaultOpened: undefined,
  closeOnSelect: undefined,
  readOnly: false,
  disabled: false,
  unstyled: false,
})
const emit = defineEmits<EmojiPickerInputEmits>()
const slots = useSlots()
const attrs = useAttrs()
const props = useProps(
  'EmojiPickerInput',
  { closeOnSelect: true, clearable: false, size: 'sm' } as const,
  rawProps,
)

const getStyles = useStyles({
  name: 'EmojiPickerInput',
  props,
  classes,
  attrs,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
})

const inputId = useId((attrs as any).id)
const inputElement = ref<HTMLElement | null>(null)

const [value, setValue] = useUncontrolled<string | null>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue ?? null,
  finalValue: null,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})

const [opened, setOpened] = useUncontrolled<boolean>({
  value: () => props.opened,
  defaultValue: props.defaultOpened,
  finalValue: false,
  onChange: (next) => {
    emit('update:opened', next)
    emit('openedChange', next)
  },
})

const [skinTone, setSkinTone] = useUncontrolled<number>({
  value: () => props.pickerProps?.skinTone,
  defaultValue: props.pickerProps?.defaultSkinTone,
  finalValue: 0,
  onChange: (next) => props.pickerProps?.onSkinToneChange?.(next),
})

const selectedEmoji = computed(() => (value.value ? props.data.emojis[value.value] : null))
const tonedEmoji = ref<{ id: string; emoji: string } | null>(null)

watch(value, (next) => {
  if (tonedEmoji.value && tonedEmoji.value.id !== next) {
    tonedEmoji.value = null
  }
})

const displayedEmoji = computed(() =>
  tonedEmoji.value && tonedEmoji.value.id === value.value
    ? tonedEmoji.value.emoji
    : selectedEmoji.value?.emoji,
)

function handleEmojiSelect(emoji: EmojiPickerEmoji) {
  setValue(emoji.id)
  tonedEmoji.value = { id: emoji.id, emoji: emoji.emoji }
  emit('emojiSelect', emoji)
  if (props.closeOnSelect) {
    setOpened(false)
  }
}

function handleClear() {
  setValue(null)
  tonedEmoji.value = null
  inputElement.value?.focus()
}

function handleInputClick(event: MouseEvent) {
  ;(attrs as any).onClick?.(event)
  if (!props.readOnly && !props.disabled) {
    setOpened(!opened.value)
  }
}

function setInputRef(node: any) {
  inputElement.value = node?.$el ?? node ?? null
}

const clearButton = computed(() =>
  props.clearable && selectedEmoji.value && !props.readOnly && !props.disabled
    ? h(Input.ClearButton, {
        'aria-label': 'Clear emoji',
        ...props.clearButtonProps,
        'data-clear': true,
        onClick: (event: MouseEvent) => {
          event.stopPropagation()
          handleClear()
          props.clearButtonProps?.onClick?.(event)
        },
      })
    : undefined,
)

const inputAttrs = computed(() => {
  const { onClick, id, rightSection, ...rest } = attrs as Record<string, any>
  void onClick
  void id
  void rightSection
  return rest
})

const pickerAttrs = computed(() => {
  const {
    skinTone: _skinTone,
    defaultSkinTone,
    onSkinToneChange,
    ...rest
  } = props.pickerProps || {}
  void _skinTone
  void defaultSkinTone
  void onSkinToneChange
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
    :disabled="props.readOnly || props.disabled"
    @update:opened="setOpened"
  >
    <Popover.Target>
      <InputBase
        v-bind="inputAttrs"
        :id="inputId"
        component="button"
        type="button"
        pointer
        :root-ref="setInputRef"
        __static-selector="EmojiPickerInput"
        :__styles-api-props="props"
        :class-names="props.classNames"
        :styles="props.styles"
        :unstyled="props.unstyled"
        :size="props.size"
        :disabled="props.disabled"
        :right-section="(attrs as any).rightSection || clearButton"
        :right-section-pointer-events="clearButton ? 'all' : undefined"
        :aria-expanded="opened"
        @click="handleInputClick"
      >
        <span v-if="selectedEmoji" v-bind="getStyles('inputValue')"
          ><span v-bind="getStyles('inputEmoji')">{{ displayedEmoji }}</span
          ><span v-bind="getStyles('inputEmojiName')">{{ selectedEmoji.name }}</span></span
        >
        <Input.Placeholder v-else>{{ props.placeholder }}</Input.Placeholder>
        <template v-if="slots.label" #label><slot name="label" /></template>
        <template v-if="slots.description" #description><slot name="description" /></template>
        <template v-if="slots.error" #error><slot name="error" /></template>
      </InputBase>
    </Popover.Target>
    <Popover.Dropdown v-bind="getStyles('dropdown')">
      <EmojiPicker
        v-bind="pickerAttrs"
        :data="props.data"
        :skin-tone="skinTone"
        auto-focus
        @skin-tone-change="setSkinTone"
        @emoji-select="handleEmojiSelect"
      />
    </Popover.Dropdown>
  </Popover>
</template>
