<script setup lang="ts">
import { nextTick, ref, watch, useAttrs } from 'vue'
import { Box, CloseButton, InputBase, Modal, Popover } from '@mantine-vue/core'
import type { PickerInputBaseEmits, PickerInputBaseProps, PickerInputBaseSlots } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'PickerInputBase', inheritAttrs: false })
const props = withDefaults(defineProps<PickerInputBaseProps>(), {
  formattedValue: '',
  dropdownType: 'popover',
  clearable: false,
  disabled: false,
  required: false,
  size: 'sm',
  withPresets: false,
})
const emit = defineEmits<PickerInputBaseEmits>()
defineSlots<PickerInputBaseSlots>()
const attrs = useAttrs()
const opened = ref(props.dropdownOpened ?? false)
watch(
  () => props.dropdownOpened,
  (value) => {
    if (value !== undefined) opened.value = value
  },
)
const inputElement = ref<HTMLElement | null>(null)
let dropdownElement: HTMLElement | null = null
let keyboardInteraction = false

function setInputRef(node: any) {
  inputElement.value = node?.$el ?? node ?? null
  const userRef = (attrs as any).rootRef
  if (typeof userRef === 'function') userRef(inputElement.value)
  else if (userRef && typeof userRef === 'object') userRef.value = inputElement.value
}

function onDropdownKeydown(event: KeyboardEvent) {
  dropdownElement = event.currentTarget as HTMLElement
  keyboardInteraction = true
}

function onDropdownPointerdown() {
  keyboardInteraction = false
}

watch(opened, (value) => {
  if (value) {
    keyboardInteraction = false
    return
  }

  if (!keyboardInteraction || typeof document === 'undefined') {
    return
  }

  keyboardInteraction = false
  nextTick(() => {
    const activeElement = document.activeElement
    const focusLost =
      !activeElement ||
      activeElement === document.body ||
      !activeElement.isConnected ||
      !!dropdownElement?.contains(activeElement)

    if (focusLost) {
      inputElement.value?.focus({ preventScroll: true })
    }
  })
})

function close() {
  opened.value = false
  emit('dropdown-close')
}
function open() {
  if (!props.disabled) {
    opened.value = true
    emit('dropdown-open')
  }
}
function updateOpened(value: boolean) {
  if (value) open()
  else close()
}
function clickTarget(event: MouseEvent) {
  emit('click', event)
  open()
}
function clear(event: MouseEvent) {
  event.stopPropagation()
  emit('clear')
}
</script>

<template>
  <Box v-if="props.dropdownType === 'modal'">
    <InputBase
      v-bind="attrs"
      component="button"
      type="button"
      :label="props.label"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :required="props.required"
      :error="props.error"
      pointer
      :size="props.size"
      :variant="props.variant"
      :right-section-pointer-events="props.clearable && props.formattedValue ? 'all' : undefined"
      @click="clickTarget"
    >
      <span v-if="props.formattedValue">{{ props.formattedValue }}</span
      ><span v-else :class="classes.placeholder">{{ props.placeholder }}</span>
      <template v-if="props.clearable && props.formattedValue" #rightSection
        ><CloseButton :size="props.size" @mousedown.stop @click="clear"
      /></template>
    </InputBase>
    <Modal :opened="opened" :title="props.label" size="auto" @close="close"
      ><slot :close="close" :open="open" :opened="opened"
    /></Modal>
  </Box>
  <Popover
    v-else
    :opened="opened"
    position="bottom-start"
    trap-focus
    :return-focus="false"
    @update:opened="updateOpened"
  >
    <Popover.Target>
      <InputBase
        v-bind="attrs"
        component="button"
        type="button"
        :label="props.label"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :required="props.required"
        :error="props.error"
        pointer
        :size="props.size"
        :variant="props.variant"
        :right-section-pointer-events="props.clearable && props.formattedValue ? 'all' : undefined"
        :root-ref="setInputRef"
        @click="clickTarget"
      >
        <span v-if="props.formattedValue">{{ props.formattedValue }}</span
        ><span v-else :class="classes.placeholder">{{ props.placeholder }}</span>
        <template v-if="props.clearable && props.formattedValue" #rightSection
          ><CloseButton :size="props.size" @mousedown.stop @click="clear"
        /></template>
      </InputBase>
    </Popover.Target>
    <Popover.Dropdown
      :class="classes.dropdown"
      data-dates-dropdown
      :data-with-presets="props.withPresets || undefined"
      @keydown="onDropdownKeydown"
      @pointerdown="onDropdownPointerdown"
      ><slot :close="close" :open="open" :opened="opened"
    /></Popover.Dropdown>
  </Popover>
</template>
