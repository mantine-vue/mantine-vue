<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { resolveScheduleRadius } from '../../shared'

const defaultProps = {
  interactive: true,
} as const

const varsResolver = createVarsResolver<any>((_theme, { radius }) => ({
  headerControl: {
    '--control-radius': resolveScheduleRadius(radius),
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import type { HeaderControlOwnProps, HeaderControlSlots } from './HeaderControl.types'
import classes from './HeaderControl.module.css'

defineOptions({
  name: 'HeaderControl',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<HeaderControlOwnProps>(), {
  interactive: undefined,
  radius: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<HeaderControlSlots>()

const attrs = useAttrs()

const props = useProps('HeaderControl', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'HeaderControl',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
  rootSelector: 'headerControl',
})

const rootStyles = computed(() => getStyles('headerControl', { active: props.interactive }))

const rootMod = computed(() => [
  { active: props.active, square: props.square, interactive: props.interactive },
  (attrs as any).mod,
])

/** A non-interactive control stays in the DOM as a button but out of the tab order. */
const tabindex = computed(() =>
  props.interactive ? (attrs as { tabindex?: number | string }).tabindex : -1,
)
</script>

<template>
  <UnstyledButton v-bind="{ ...attrs, ...rootStyles }" :mod="rootMod" :tabindex="tabindex">
    <slot />
  </UnstyledButton>
</template>
