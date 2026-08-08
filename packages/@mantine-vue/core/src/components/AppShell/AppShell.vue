<script lang="ts">
import { createVarsResolver, getDefaultZIndex } from '../../core'

const defaults = {
  withBorder: true,
  padding: 0,
  transitionDuration: 200,
  transitionTimingFunction: 'ease',
  zIndex: getDefaultZIndex('app'),
  mode: 'fixed',
  offsetScrollbars: true,
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (_, { transitionDuration, transitionTimingFunction }) => ({
    root: {
      '--app-shell-transition-duration': `${transitionDuration}ms`,
      '--app-shell-transition-timing-function': transitionTimingFunction,
    },
  }),
)

/**
 * The generated media styles are scoped by `#id` in `static` mode, so every shell
 * needs an id even when the consumer did not set one.
 */
const appShellId = { current: 0 }

export { appShellId, defaults, varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { provideAppShellContext } from './AppShell.context'
import { AppShellMediaStyles } from './AppShellMediaStyles/AppShellMediaStyles'
import { useResizing } from './use-resizing/use-resizing'
import type { AppShellOwnProps, AppShellSlots } from './AppShell.types'
import classes from './AppShell.module.css'

defineOptions({
  name: 'AppShell',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<AppShellOwnProps>(), {
  withBorder: undefined,
  offsetScrollbars: undefined,
  layout: 'default',
  disabled: false,
  unstyled: false,
})

defineSlots<AppShellSlots>()

const attrs = useAttrs()
const props = useProps('AppShell', defaults as any, rawProps) as any

const id = (attrs.id as string | undefined) ?? `mantine-app-shell-${++appShellId.current}`

const getStyles = useStyles({
  name: 'AppShell',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames,
  styles: props.styles,
  vars: props.vars,
  unstyled: props.unstyled,
  varsResolver,
})

const resizing = useResizing({
  transitionDuration: () => props.transitionDuration,
  disabled: () => props.disabled,
})

provideAppShellContext({
  getStyles,
  get withBorder() {
    return props.withBorder
  },
  get zIndex() {
    return props.zIndex
  },
  get disabled() {
    return props.disabled
  },
  get offsetScrollbars() {
    return props.offsetScrollbars
  },
  get mode() {
    return props.mode
  },
} as any)

const rootStyles = computed(() => getStyles('root', { className: attrs.class, style: attrs.style }))

const rootMod = computed(() => [
  {
    resizing: resizing.value,
    layout: props.layout,
    disabled: props.disabled,
    mode: props.mode,
  },
  props.mod,
])

/** `fixed` shells share one global stylesheet; `static` ones are scoped to the root. */
const mediaSelector = computed(() => (props.mode === 'static' ? `#${id}` : undefined))
</script>

<template>
  <Box v-bind="{ ...attrs, ...rootStyles }" :id="id" :mod="rootMod">
    <AppShellMediaStyles
      :navbar="props.navbar"
      :aside="props.aside"
      :header="props.header"
      :footer="props.footer"
      :padding="props.padding"
      :mode="props.mode"
      :selector="mediaSelector"
    />
    <slot />
  </Box>
</template>
