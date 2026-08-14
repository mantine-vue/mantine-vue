<script lang="ts">
const defaultProps = { withAria: true } as const
</script>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import {
  Box,
  getAutoContrastValue,
  getContrastColor,
  getThemeColor,
  useMantineTheme,
  useProps,
} from '../../../core'
import { useProgressContext } from '../Progress.context'
import type { ProgressSectionOwnProps, ProgressSectionSlots } from './ProgressSection.types'

defineOptions({ name: 'ProgressSection', inheritAttrs: false })

const rawProps = withDefaults(defineProps<ProgressSectionOwnProps>(), {
  rootRef: undefined,
  withAria: undefined,
  color: undefined,
  striped: false,
  animated: false,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<ProgressSectionSlots>()

const attrs = useAttrs()
const props = useProps('ProgressSection', defaultProps, rawProps)
const ctx = useProgressContext()
const theme = useMantineTheme()
const ariaAttributes = computed(() =>
  props.withAria === false
    ? {}
    : {
        role: 'progressbar',
        'aria-valuemax': 100,
        'aria-valuemin': 0,
        'aria-valuenow': props.value,
        'aria-valuetext': `${props.value}%`,
      },
)
const sectionStyle = computed(() => ({
  '--progress-section-size': `${props.value}%`,
  '--progress-section-color': getThemeColor(props.color, theme.value),
  '--progress-label-color': getAutoContrastValue(ctx.autoContrast, theme.value)
    ? getContrastColor({ color: props.color, theme: theme.value, autoContrast: ctx.autoContrast })
    : undefined,
  ...(attrs.style as Record<string, any>),
}))

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
    v-bind="{
      ...attrs,
      ...ariaAttributes,
      ...ctx.getStyles('section', {
        className: attrs.class,
        classNames: props.classNames,
        styles: props.styles,
        style: sectionStyle,
        props,
      }),
    }"
    :mod="[{ striped: props.striped || props.animated, animated: props.animated }, props.mod]"
  >
    <slot />
  </Box>
</template>
