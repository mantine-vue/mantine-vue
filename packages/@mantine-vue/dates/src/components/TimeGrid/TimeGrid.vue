<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, SimpleGrid, UnstyledButton } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { compareTime, isSameTime } from '../../utils'
import type { TimeGridProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'TimeGrid', inheritAttrs: false })
const props = withDefaults(defineProps<TimeGridProps>(), {
  data: () => [],
  allowDeselect: false,
  disabled: false,
})
const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  change: [value: string | null]
}>()
const attrs = useAttrs()
const [value, setValue] = useUncontrolled<string | null>({
  value: computed(() => props.modelValue),
  defaultValue: props.defaultValue,
  finalValue: null,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
const controlProps = (item: string) => props.getControlProps?.(item) || {}
const disabled = (item: string) =>
  !!(
    props.disabled ||
    (props.minTime && compareTime(item, props.minTime) < 0) ||
    (props.maxTime && compareTime(item, props.maxTime) > 0)
  )
const active = (item: string) => isSameTime(value.value ?? undefined, item)
function select(item: string, event: MouseEvent) {
  controlProps(item).onClick?.(event)
  if (disabled(item)) return
  const next = props.allowDeselect && active(item) ? null : item
  if (next !== value.value) setValue(next)
}
</script>

<template>
  <Box v-bind="attrs" :class="[classes.timeGridRoot, attrs.class]">
    <SimpleGrid :cols="3" spacing="xs" :class="classes.timeGrid">
      <UnstyledButton
        v-for="item in props.data"
        :key="item"
        v-bind="controlProps(item)"
        :class="[classes.timeGridControl, controlProps(item).class]"
        :disabled="disabled(item) || controlProps(item).disabled"
        :data-active="active(item) || undefined"
        :data-disabled="disabled(item) || controlProps(item).disabled || undefined"
        @click="select(item, $event)"
        >{{ item }}</UnstyledButton
      >
    </SimpleGrid>
  </Box>
</template>
