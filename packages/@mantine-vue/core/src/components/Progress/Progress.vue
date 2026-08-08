<script setup lang="ts">
import { useAttrs } from 'vue'
import { useProps } from '../../core'
import { ProgressRoot } from './ProgressRoot/ProgressRoot'
import { ProgressSection } from './ProgressSection/ProgressSection'
import type { ProgressOwnProps } from './Progress.types'

defineOptions({ name: 'Progress', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ProgressOwnProps>(), {
  color: undefined,
  size: undefined,
  radius: undefined,
  autoContrast: undefined,
  transitionDuration: undefined,
  orientation: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
const attrs = useAttrs()
const props = useProps('Progress', null, rawProps)
</script>

<template>
  <ProgressRoot
    v-bind="attrs"
    :class-names="props.classNames as any"
    :styles="props.styles as any"
    :vars="props.vars as any"
    :unstyled="props.unstyled"
    :size="props.size"
    :radius="props.radius"
    :auto-contrast="props.autoContrast"
    :transition-duration="props.transitionDuration"
    :orientation="props.orientation"
  >
    <ProgressSection
      :value="props.value"
      :color="props.color"
      :striped="props.striped"
      :animated="props.animated"
      :aria-label="attrs['aria-label']"
    />
  </ProgressRoot>
</template>
