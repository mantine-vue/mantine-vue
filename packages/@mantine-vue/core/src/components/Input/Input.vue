<script lang="ts">
import { createVarsResolver, getFontSize, getRadius, getSize, rem } from '../../core'
import type { InputStylesCtx } from './Input.types'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, props, ctx: InputStylesCtx) => ({
  wrapper: {
    '--input-margin-top': ctx.offsetTop ? 'calc(var(--mantine-spacing-xs) / 2)' : undefined,
    '--input-margin-bottom': ctx.offsetBottom ? 'calc(var(--mantine-spacing-xs) / 2)' : undefined,
    '--input-height': getSize(props.size, 'input-height'),
    '--input-fz': getFontSize(props.size),
    '--input-radius': props.radius === undefined ? undefined : getRadius(props.radius),
    '--input-left-section-width':
      props.leftSectionWidth !== undefined ? rem(props.leftSectionWidth) : undefined,
    '--input-right-section-width':
      props.rightSectionWidth !== undefined ? rem(props.rightSectionWidth) : undefined,
    '--input-padding-y': props.multiline ? getSize(props.size, 'input-padding-y') : undefined,
    '--input-left-section-pointer-events': props.leftSectionPointerEvents,
    '--input-right-section-pointer-events': props.rightSectionPointerEvents,
  },
}))

/** Section content may be a value or a render function. */
function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

const defaultProps = {
  component: 'input',
  leftSectionPointerEvents: 'none',
  rightSectionPointerEvents: 'none',
  size: 'sm',
  __clearSectionMode: 'both',
  loadingPosition: 'right',
  variant: 'default',
  withAria: true,
} as const

export { varsResolver, renderContent, defaultProps }
</script>

<script setup lang="ts">
import { computed, h, reactive, useAttrs, useSlots, watchEffect } from 'vue'
import { assignRef, useUncontrolled } from '@mantine-vue/hooks'
import { Box, omitAttrs, resolveNode, useProps, useStyles } from '../../core'
import { Loader } from '../Loader'
import { InputClearSection } from './InputClearSection/InputClearSection'
import { provideInputContext } from './Input.context'
import { useInputWrapperContext } from './InputWrapper.context'
import type { InputOwnProps, InputSlots } from './Input.types'
import classes from './Input.module.css'

defineOptions({
  name: 'Input',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<InputOwnProps>(), {
  leftSection: undefined,
  rightSection: undefined,
  __clearSection: undefined,
  __defaultRightSection: undefined,
  __bottomSection: undefined,
  required: false,
  disabled: false,
  pointer: false,
  withErrorStyles: true,
  __clearable: false,
  loading: false,
  multiline: false,
  // Tri-state: `undefined` lets `defaultProps` supply `true`.
  withAria: undefined,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
}>()

defineSlots<InputSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Input', defaultProps, rawProps)

const [value, setValue] = useUncontrolled<any>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: undefined,
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

const wrapperCtx = useInputWrapperContext()
const stylesCtx = reactive<InputStylesCtx>({ offsetBottom: false, offsetTop: false })

/**
 * The wrapper reports its offsets through context; the render function used to copy
 * them on every render. `watchEffect` keeps the same values in sync reactively.
 */
watchEffect(() => {
  stylesCtx.offsetBottom = wrapperCtx.offsetBottom
  stylesCtx.offsetTop = wrapperCtx.offsetTop
})

const getStyles = useStyles({
  name: ['Input', props.__staticSelector],
  props: props.__stylesApiProps || props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  rootSelector: 'wrapper',
  varsResolver,
  stylesCtx,
})

provideInputContext({ size: props.size || 'sm' })

/**
 * Built as a VNode rather than a flag: it is handed to `InputClearSection` as the
 * right-section content, which expects renderable content and not a sentinel.
 */
const loadingIndicator = computed(() =>
  props.loading
    ? h(Loader, {
        size:
          props.loadingPosition === 'left'
            ? 'calc(var(--input-left-section-size) / 2)'
            : 'calc(var(--input-right-section-size) / 2)',
      })
    : null,
)

const resolvedLeftSection = computed(() => resolveNode(props.leftSection, slots.leftSection))
const resolvedRightSection = computed(() => resolveNode(props.rightSection, slots.rightSection))

const leftSection = computed(() =>
  props.loading && props.loadingPosition === 'left'
    ? loadingIndicator.value
    : resolvedLeftSection.value,
)

const rightSection = computed(() =>
  InputClearSection({
    __clearable: props.__clearable,
    __clearSection: props.__clearSection,
    rightSection:
      props.loading && props.loadingPosition === 'right'
        ? loadingIndicator.value
        : resolvedRightSection.value,
    __defaultRightSection: props.__defaultRightSection,
    size: props.size,
    __clearSectionMode: props.__clearSectionMode,
  }),
)

/** Stable functional components: section content is an arbitrary VNode child. */
const renderLeftSection = () => renderContent(leftSection.value)
const renderRightSection = () => renderContent(rightSection.value)
const renderBottomSection = () => renderContent(props.__bottomSection)

const ariaAttributes = computed(() =>
  props.withAria
    ? {
        required: props.required,
        disabled: props.disabled,
        'aria-invalid': props.error ? true : undefined,
        'aria-describedby': wrapperCtx.describedBy,
        id: wrapperCtx.inputId || props.id,
      }
    : {},
)

function setRootRef(node: any) {
  assignRef(props.rootRef, node?.$el ?? node ?? null)
}

/** Fallthrough listeners arrive as a handler or an array of handlers. */
function callHandler(handler: unknown, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else if (typeof handler === 'function') {
    handler(event)
  }
}

function onInput(event: Event) {
  callHandler(attrs.onInput, event)

  if (props.component !== 'select') {
    setValue((event.currentTarget as HTMLInputElement).value)
  }
}

function onChange(event: Event) {
  if (props.component === 'select') {
    setValue((event.currentTarget as HTMLSelectElement).value)
  }
}

/**
 * `onInput` is forwarded explicitly by the handler above, and `onChange` is reserved
 * for the `select` case; leaving them in the spread would make Vue merge the two and
 * invoke a consumer handler twice.
 */
const inputAttrs = computed(() => omitAttrs(attrs, ['onInput', 'onChange']))

const inputValue = computed(() =>
  props.component === 'button' || props.component === 'div' ? undefined : value.value,
)
</script>

<template>
  <Box
    :ref="setRootRef"
    v-bind="{ ...props.wrapperProps, ...getStyles('wrapper') }"
    :mod="[
      {
        error: Boolean(props.error) && props.withErrorStyles,
        pointer: props.pointer,
        disabled: props.disabled,
        multiline: props.multiline,
        withRightSection: Boolean(rightSection),
        withLeftSection: Boolean(leftSection),
        withBottomSection: Boolean(props.__bottomSection),
      },
      props.mod,
    ]"
    :variant="props.variant"
    :data-size="props.size"
  >
    <div
      v-if="leftSection"
      v-bind="{
        ...props.leftSectionProps,
        ...getStyles('section', {
          className: props.leftSectionProps?.class,
          style: props.leftSectionProps?.style,
        }),
      }"
      data-position="left"
    >
      <component :is="renderLeftSection" />
    </div>

    <Box
      v-bind="{ ...inputAttrs, ...ariaAttributes, ...getStyles('input') }"
      :value="inputValue"
      :component="props.component"
      :required="props.required"
      :disabled="props.disabled"
      :__size="props.inputSize"
      :mod="{
        disabled: props.disabled,
        error: Boolean(props.error) && props.withErrorStyles,
      }"
      :variant="props.variant"
      @input="onInput"
      @change="onChange"
    >
      <slot />
    </Box>

    <div
      v-if="props.__bottomSection"
      v-bind="{
        ...props.__bottomSectionProps,
        ...getStyles('bottomSection', {
          className: props.__bottomSectionProps?.class,
          style: props.__bottomSectionProps?.style,
        }),
      }"
    >
      <component :is="renderBottomSection" />
    </div>

    <div
      v-if="rightSection"
      v-bind="{
        ...props.rightSectionProps,
        ...getStyles('section', {
          className: props.rightSectionProps?.class,
          style: props.rightSectionProps?.style,
        }),
      }"
      data-position="right"
    >
      <component :is="renderRightSection" />
    </div>
  </Box>
</template>
