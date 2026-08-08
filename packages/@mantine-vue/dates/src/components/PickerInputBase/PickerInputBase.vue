<script setup lang="ts">
import { ref, watch, useAttrs } from 'vue'
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
        @click="clickTarget"
      >
        <span v-if="props.formattedValue">{{ props.formattedValue }}</span
        ><span v-else :class="classes.placeholder">{{ props.placeholder }}</span>
        <template v-if="props.clearable && props.formattedValue" #rightSection
          ><CloseButton :size="props.size" @mousedown.stop @click="clear"
        /></template>
      </InputBase>
    </Popover.Target>
    <Popover.Dropdown :class="classes.dropdown"
      ><slot :close="close" :open="open" :opened="opened"
    /></Popover.Dropdown>
  </Popover>
</template>
