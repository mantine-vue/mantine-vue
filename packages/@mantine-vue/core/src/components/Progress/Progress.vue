<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
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
const ariaLabel = attrs['aria-label'] as string | undefined
const props = useProps('Progress', null, rawProps)

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <ProgressRoot
    :root-ref="setRootRef"
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
      :aria-label="ariaLabel"
    />
  </ProgressRoot>
</template>
