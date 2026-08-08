<script lang="ts">
import type { VNodeChild } from 'vue'
import { createVarsResolver, getFontSize, rem, type MantineNode } from '../../../core'
import type { InputWrapperOrderPart } from './get-input-offsets/get-input-offsets'

const defaultOrder: InputWrapperOrderPart[] = ['label', 'description', 'input', 'error']

/**
 * Determines whether renderable content is present, honouring prop-over-slot
 * precedence. Truthiness rather than nullishness, so an empty string or `false`
 * counts as "no content".
 */
function nodePresent(prop: MantineNode | boolean | undefined, slot?: () => VNodeChild): boolean {
  if (prop !== undefined) {
    return Boolean(prop)
  }

  return Boolean(slot)
}

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size }) => ({
  label: {
    '--input-label-size': getFontSize(size),
    '--input-asterisk-color': undefined,
  },
  error: {
    '--input-error-size': size === undefined ? undefined : `calc(${getFontSize(size)} - ${rem(2)})`,
  },
  description: {
    '--input-description-size':
      size === undefined ? undefined : `calc(${getFontSize(size)} - ${rem(2)})`,
  },
}))

export { defaultOrder, nodePresent, varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Box, resolveNode, useProps, useStyles } from '../../../core'
import { useSlotRevision } from '../../../utils/use-slot-revision'
import { InputDescription } from '../InputDescription/InputDescription'
import { InputError } from '../InputError/InputError'
import { InputLabel } from '../InputLabel/InputLabel'
import { provideInputWrapperContext } from '../InputWrapper.context'
import { getInputOffsets } from './get-input-offsets/get-input-offsets'
import type { InputWrapperOwnProps, InputWrapperSlots } from './InputWrapper.types'
import classes from '../Input.module.css'

defineOptions({
  name: 'InputWrapper',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<InputWrapperOwnProps>(), {
  label: undefined,
  description: undefined,
  error: undefined,
  required: false,
  // Tri-state: `undefined` inherits `required`.
  withAsterisk: undefined,
  unstyled: false,
})

defineSlots<InputWrapperSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('InputWrapper', { labelElement: 'label' }, rawProps)

const idBase = useId(props.id)

const getStyles = useStyles({
  name: 'InputWrapper',
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

const ids = computed(() => {
  const errorId = props.errorProps?.id || `${idBase.value}-error`
  const descriptionId = props.descriptionProps?.id || `${idBase.value}-description`
  // An `error` of `true` styles the input but renders no message, so it does not
  // contribute an id to `aria-describedby`.
  const hasError =
    props.error !== undefined
      ? Boolean(props.error) && typeof props.error !== 'boolean'
      : Boolean(slots.error)
  const hasDescription = nodePresent(props.description, slots.description)
  const describedBy = `${hasError ? errorId : ''} ${hasDescription ? descriptionId : ''}`.trim()

  return {
    errorId,
    descriptionId,
    inputId: idBase.value,
    labelId: props.labelProps?.id || `${idBase.value}-label`,
    hasError,
    hasDescription,
    describedBy: describedBy || undefined,
  }
})

const offsets = computed(() =>
  getInputOffsets(props.inputWrapperOrder ?? defaultOrder, {
    hasDescription: ids.value.hasDescription,
    hasError: ids.value.hasError,
  }),
)

/** Getters keep the provided object reactive without changing the shape consumers read. */
provideInputWrapperContext({
  getStyles,
  get describedBy() {
    return ids.value.describedBy
  },
  get inputId() {
    return ids.value.inputId
  },
  get labelId() {
    return ids.value.labelId
  },
  get offsetBottom() {
    return offsets.value.offsetBottom
  },
  get offsetTop() {
    return offsets.value.offsetTop
  },
} as any)

const order = computed(() => props.inputWrapperOrder ?? defaultOrder)
const isRequired = computed(() =>
  typeof props.withAsterisk === 'boolean' ? props.withAsterisk : props.required,
)
const sharedProps = computed(() => ({ size: props.size, variant: props.variant }))

const labelContent = computed(() => resolveNode(props.label, slots.label))
const descriptionContent = computed(() => resolveNode(props.description, slots.description))
const errorContent = computed(() => resolveNode(props.error, slots.error))

/** Stable functional components: `MantineNode` values are arbitrary VNode children. */
const renderLabel = () => labelContent.value
const renderDescription = () => descriptionContent.value
const renderError = () => errorContent.value

const slotRevision = useSlotRevision()

/**
 * `inputContainer` receives the rendered default slot, so the call has to happen during
 * render.
 *
 * The default slot is not reactive state, so `slotRevision` is what subscribes this
 * render root to `InputWrapper` receiving new content — without it a parent that builds
 * the input outside its slot closure, as the docs configurators do, would render it once
 * and never again.
 */
const renderInput = () => {
  void slotRevision.value

  return (
    props.inputContainer ? props.inputContainer(slots.default?.()) : slots.default?.()
  ) as VNodeChild
}

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...rootStyles }"
    :variant="props.variant"
    :data-size="props.size"
    :mod="[{ error: nodePresent(props.error, slots.error) }, props.mod]"
    :id="props.labelElement === 'label' ? undefined : props.id"
  >
    <template v-for="part in order" :key="part">
      <InputLabel
        v-if="part === 'label' && labelContent"
        :label-element="props.labelElement"
        :id="ids.labelId"
        :html-for="ids.inputId"
        :required="isRequired"
        v-bind="{ ...sharedProps, ...props.labelProps }"
      >
        <component :is="renderLabel" />
      </InputLabel>

      <InputDescription
        v-else-if="part === 'description' && ids.hasDescription"
        v-bind="{ ...props.descriptionProps, ...sharedProps }"
        :size="props.descriptionProps?.size || props.size"
        :id="props.descriptionProps?.id || ids.descriptionId"
      >
        <component :is="renderDescription" />
      </InputDescription>

      <InputError
        v-else-if="part === 'error' && ids.hasError"
        v-bind="{ ...props.errorProps, ...sharedProps }"
        :size="props.errorProps?.size || props.size"
        :id="props.errorProps?.id || ids.errorId"
      >
        <component :is="renderError" />
      </InputError>

      <component :is="renderInput" v-else-if="part === 'input'" />
    </template>
  </Box>
</template>
