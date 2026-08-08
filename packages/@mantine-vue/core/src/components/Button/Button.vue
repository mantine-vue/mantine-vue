<script lang="ts">
import { createVarsResolver, getFontSize, getRadius, getSize, rem } from '../../core'
import type { MantineTransition } from '../Transition'

/** The loader slides in from above the label instead of replacing it. */
const loaderTransition: MantineTransition = {
  in: { opacity: 1, transform: `translate(-50%, calc(-50% + ${rem(1)}))` },
  out: { opacity: 0, transform: 'translate(-50%, -200%)' },
  common: { transformOrigin: 'center' },
  transitionProperty: 'opacity, transform',
}

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, gradient, variant, size, justify, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    // `compact-sm` shares the font size of `sm`, only the paddings differ.
    const compactSize =
      typeof size === 'string' && size.includes('compact-') ? size.replace('compact-', '') : size

    return {
      root: {
        '--button-justify': justify,
        '--button-height': getSize(size, 'button-height'),
        '--button-padding-x': getSize(size, 'button-padding-x'),
        '--button-fz': getFontSize(compactSize),
        '--button-radius': radius === undefined ? undefined : getRadius(radius),
        '--button-bg': color || variant ? colors.background : undefined,
        '--button-hover': color || variant ? colors.hover : undefined,
        '--button-color': colors.color,
        '--button-bd': color || variant ? colors.border : undefined,
        '--button-hover-color': color || variant ? colors.hoverColor : undefined,
      },
    }
  },
)

export { loaderTransition, varsResolver }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import { Box, hasNode, resolveNode, useForwardedRef, useProps, useStyles } from '../../core'
import { Loader } from '../Loader'
import { Transition as MantineTransitionComponent } from '../Transition'
import { UnstyledButton } from '../UnstyledButton'
import type { ButtonOwnProps, ButtonSlots } from './Button.types'
import classes from './Button.module.css'

defineOptions({
  name: 'Button',
  inheritAttrs: false,
})

/**
 * `leftSection` and `rightSection` keep `undefined` because `MantineNode` resolves to a
 * runtime type array containing `Boolean` – a cast to `false` would make `resolveNode`
 * ignore the matching slot.
 */
const rawProps = withDefaults(defineProps<ButtonOwnProps>(), {
  component: 'button',
  leftSection: undefined,
  rightSection: undefined,
  autoContrast: undefined,
  fullWidth: false,
  disabled: false,
  loading: false,
  'data-disabled': false,
  dataDisabled: false,
  unstyled: false,
})

defineSlots<ButtonSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('Button', null, rawProps)

const elementRef = ref<HTMLElement | null>(null)
useForwardedRef(elementRef)

const getStyles = useStyles({
  name: 'Button',
  props,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classes,
  get classNames() {
    return props.classNames as any
  },
  get styles() {
    return props.styles as any
  },
  get unstyled() {
    return props.unstyled
  },
  get vars() {
    return props.vars as any
  },
  varsResolver,
})

const leftSection = computed(() => resolveNode(props.leftSection, slots.leftSection))
const rightSection = computed(() => resolveNode(props.rightSection, slots.rightSection))

/** A loading button is always disabled, regardless of the `disabled` prop. */
const disabled = computed(() => props.disabled || props.loading)

/**
 * Disabled styles are also applied when only the `data-disabled` attribute is set, so a
 * disabled looking button can stay focusable.
 */
const dataDisabled = computed(
  () => disabled.value || props['data-disabled'] || props.dataDisabled || attrs['data-disabled'],
)

const rootStyles = computed(() =>
  getStyles('root', {
    active: !props.disabled && !props.loading && !attrs['data-disabled'],
  }),
)

const rootMod = computed(() => [
  {
    disabled: !!dataDisabled.value,
    loading: props.loading,
    block: props.fullWidth,
    withLeftSection: hasNode(leftSection.value),
    withRightSection: hasNode(rightSection.value),
  },
  props.mod,
])

const loaderStyleProps = computed(() => ({
  color: 'var(--button-color)',
  size: 'calc(var(--button-height) / 1.8)',
  ...props.loaderProps,
}))
</script>

<template>
  <UnstyledButton
    ref="elementRef"
    v-bind="{ ...attrs, ...rootStyles }"
    :component="props.component"
    :unstyled="props.unstyled"
    :variant="props.variant"
    :disabled="disabled"
    :mod="rootMod"
  >
    <!-- Aliased: a bare `<Transition>` in a template resolves to Vue's built-in. -->
    <MantineTransitionComponent
      :mounted="props.loading"
      :transition="loaderTransition"
      :duration="150"
    >
      <template #default="transitionStyles">
        <Box
          v-if="props.loading"
          component="span"
          v-bind="getStyles('loader', { style: transitionStyles })"
          aria-hidden="true"
        >
          <Loader v-bind="loaderStyleProps" />
        </Box>
      </template>
    </MantineTransitionComponent>

    <span v-bind="getStyles('inner')">
      <Box
        v-if="hasNode(leftSection)"
        component="span"
        v-bind="getStyles('section')"
        :mod="{ position: 'left' }"
      >
        <component :is="() => leftSection" />
      </Box>

      <Box component="span" :mod="{ loading: props.loading }" v-bind="getStyles('label')">
        <slot />
      </Box>

      <Box
        v-if="hasNode(rightSection)"
        component="span"
        v-bind="getStyles('section')"
        :mod="{ position: 'right' }"
      >
        <component :is="() => rightSection" />
      </Box>
    </span>
  </UnstyledButton>
</template>
