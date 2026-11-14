<script setup lang="ts">
import { computed, ref } from 'vue'
import { UnstyledButton } from '@mantine-vue/core'
import classes from '../../Dates.module.css'
import type { PresetsListPreset } from './PresetsList.types'

defineOptions({ name: 'PresetsList' })
const props = withDefaults(
  defineProps<{
    /** Presets to render */
    presets: PresetsListPreset[]
    /** Props added to every preset button */
    buttonProps?: Record<string, any>
    /** Determines whether `data-mantine-stop-propagation` attribute is added to buttons */
    stopPropagation?: boolean
  }>(),
  { stopPropagation: false },
)
const emit = defineEmits<{ 'preset-select': [value: any] }>()
const tabIndex = ref(0)
const buttons: (HTMLElement | null)[] = []
const activeIndex = computed(() => Math.min(tabIndex.value, props.presets.length - 1))

function setButtonRef(index: number, node: any) {
  buttons[index] = node?.$el ?? node ?? null
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  buttons[event.key === 'ArrowDown' ? index + 1 : index - 1]?.focus()
}
</script>

<template>
  <div :class="classes.presetsList">
    <UnstyledButton
      v-for="(preset, index) in props.presets"
      :key="index"
      v-bind="props.buttonProps"
      :ref="(node: any) => setButtonRef(index, node)"
      :class="[classes.presetButton, props.buttonProps?.class]"
      data-preset
      :tabindex="index === activeIndex ? 0 : -1"
      :data-mantine-stop-propagation="props.stopPropagation || undefined"
      @click="emit('preset-select', preset.value)"
      @focus="tabIndex = index"
      @keydown="onKeydown($event, index)"
      @mousedown.prevent
      ><component :is="() => preset.label"
    /></UnstyledButton>
  </div>
</template>
