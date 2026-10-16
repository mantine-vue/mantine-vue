<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { Box } from '../../core'
import { provideToolbarToggleGroupContext, useToolbarContext } from './Toolbar.context'
import type { ToolbarToggleGroupProps } from './Toolbar.types'
defineOptions({ name: 'ToolbarToggleGroup', inheritAttrs: false })
const props = withDefaults(defineProps<ToolbarToggleGroupProps>(), {
  disabled: false,
  modelValue: undefined,
  defaultValue: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
  change: [value: string | string[] | null]
}>()
const attrs = useAttrs()
const ctx = useToolbarContext()
const [value, setValue] = useUncontrolled<any>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: props.type === 'single' ? null : [],
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
const normalized = computed(() =>
  props.type === 'single'
    ? Array.isArray(value.value)
      ? (value.value[0] ?? null)
      : (value.value ?? null)
    : Array.isArray(value.value)
      ? value.value
      : value.value == null
        ? []
        : [value.value],
)
function change(item: string) {
  if (props.type === 'single') setValue(normalized.value === item ? null : item)
  else {
    const current = normalized.value as string[]
    setValue(current.includes(item) ? current.filter((v) => v !== item) : [...current, item])
  }
}
provideToolbarToggleGroupContext({
  get value() {
    return normalized.value
  },
  get type() {
    return props.type
  },
  get disabled() {
    return props.disabled
  },
  onChange: change,
})
</script>
<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('group', {
        className: attrs.class,
        style: attrs.style,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    role="group"
    :data-orientation="ctx.orientation"
    ><slot
  /></Box>
</template>
