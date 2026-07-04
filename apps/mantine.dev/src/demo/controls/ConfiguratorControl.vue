<script setup lang="ts">
import { computed } from 'vue'
import type { ConfiguratorControlOptions } from '../types'
import { ConfiguratorBooleanControl } from './ConfiguratorBooleanControl'
import { ConfiguratorSegmentedControl } from './ConfiguratorSegmentedControl'
import { ConfiguratorColorControl } from './ConfiguratorColorControl'
import { ConfiguratorStringControl } from './ConfiguratorStringControl'
import { ConfiguratorSelectControl } from './ConfiguratorSelectControl'
import { ConfiguratorSizeControl } from './ConfiguratorSizeControl'
import { ConfiguratorNumberControl } from './ConfiguratorNumberControl'

const ControlComponents = {
  boolean: ConfiguratorBooleanControl,
  segmented: ConfiguratorSegmentedControl,
  color: ConfiguratorColorControl,
  string: ConfiguratorStringControl,
  select: ConfiguratorSelectControl,
  size: ConfiguratorSizeControl,
  number: ConfiguratorNumberControl,
} as const

const props = defineProps<{
  control: ConfiguratorControlOptions
  value: unknown
  onChange: (value: unknown) => void
}>()

const component = computed(() => ControlComponents[props.control.type])

const rest = computed(() => {
  const others = { ...(props.control as any) }
  delete others.initialValue
  delete others.libraryValue
  delete others.type
  return others
})
</script>

<template>
  <component :is="component" :value="value" :on-change="onChange" v-bind="rest" />
</template>
