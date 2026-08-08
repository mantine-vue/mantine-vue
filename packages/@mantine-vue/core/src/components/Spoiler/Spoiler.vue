<script lang="ts">
import { createVarsResolver } from '../../core'

const defaultProps = {
  maxHeight: 100,
  defaultExpanded: false,
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { transitionDuration }) => ({
  root: {
    '--spoiler-transition-duration':
      transitionDuration !== undefined ? `${transitionDuration}ms` : undefined,
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { useElementSize, useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, hasNode, rem, resolveNode, useProps, useStyles } from '../../core'
import { Anchor } from '../Anchor'
import type { SpoilerEmits, SpoilerOwnProps, SpoilerSlots } from './Spoiler.types'
import classes from './Spoiler.module.css'

defineOptions({
  name: 'Spoiler',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<SpoilerOwnProps>(), {
  maxHeight: undefined,
  // Intentionally undefined to preserve downstream defaults
  showLabel: undefined,
  hideLabel: undefined,
  defaultExpanded: undefined,
  expanded: undefined,
  transitionDuration: undefined,
  showAriaLabel: undefined,
  hideAriaLabel: undefined,
  id: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<SpoilerSlots>()

const emit = defineEmits<SpoilerEmits>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Spoiler', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Spoiler',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const id = useId(props.id)

const [show, setShowState] = useUncontrolled<boolean>({
  value: computed(() => props.expanded),
  defaultValue: props.defaultExpanded,
  finalValue: false,
  onChange: (value) => emit('update:expanded', value),
})

const { ref: contentRef, height } = useElementSize<HTMLDivElement>()

const regionId = computed(() => `${id.value}-region`)

const currentLabel = computed(() =>
  show.value
    ? resolveNode(props.hideLabel, slots.hideLabel)
    : resolveNode(props.showLabel, slots.showLabel),
)

/** Stable functional component: `MantineNode` values are arbitrary VNode children. */
const renderLabel = () => currentLabel.value

const maxHeight = computed(() => props.maxHeight ?? defaultProps.maxHeight)
const hasSpoiler = computed(() => hasNode(currentLabel.value) && maxHeight.value < height.value)
const ariaLabel = computed(() => (show.value ? props.hideAriaLabel : props.showAriaLabel))

const contentStyle = computed(() => ({
  maxHeight: !show.value ? rem(maxHeight.value) : height.value ? rem(height.value) : undefined,
}))

function toggle() {
  setShowState(!show.value)
}
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :id="id"
    :mod="{ hasSpoiler }"
  >
    <Anchor
      v-if="hasSpoiler"
      v-bind="getStyles('control')"
      component="button"
      type="button"
      :aria-expanded="show"
      :aria-controls="regionId"
      :aria-label="ariaLabel"
      @click="toggle"
    >
      <component :is="renderLabel" />
    </Anchor>

    <div
      v-bind="getStyles('content', { style: contentStyle })"
      :id="regionId"
      data-reduce-motion=""
      role="region"
    >
      <div ref="contentRef">
        <slot />
      </div>
    </div>
  </Box>
</template>
