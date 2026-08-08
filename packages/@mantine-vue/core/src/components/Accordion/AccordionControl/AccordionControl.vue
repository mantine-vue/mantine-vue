<script lang="ts">
import type { SetupContext, VNodeChild } from 'vue'

/**
 * Renders its children without a wrapper element. Used when the parent `Accordion`
 * has no `order`, so the control is not wrapped in a heading. Declared at module
 * scope so the component identity is stable and Vue never remounts the subtree.
 */
const PassThrough = (_props: unknown, { slots }: SetupContext): VNodeChild =>
  slots.default?.() as VNodeChild

PassThrough.displayName = 'AccordionControlPassThrough'

export { PassThrough }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import {
  Box,
  createScopedKeydownHandler,
  hasNode,
  omitAttrs,
  resolveNode,
  useProps,
} from '../../../core'
import { UnstyledButton } from '../../UnstyledButton'
import { useAccordionContext } from '../Accordion.context'
import { useAccordionItemContext } from '../AccordionItem.context'
import type { AccordionControlOwnProps, AccordionControlSlots } from './AccordionControl.types'

defineOptions({
  name: 'AccordionControl',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<AccordionControlOwnProps>(), {
  disabled: false,
  // Intentionally undefined to preserve downstream defaults
  chevron: undefined,
  icon: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
})

defineSlots<AccordionControlSlots>()

const emit = defineEmits<{
  click: [MouseEvent]
  keydown: [KeyboardEvent]
}>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('AccordionControl', null, rawProps)
const { value } = useAccordionItemContext()
const ctx = useAccordionContext()

const isActive = computed(() => ctx.isItemActive(value))

/**
 * An explicit `null` chevron means "no chevron"; only an absent prop and slot fall
 * back to the chevron configured on the parent `Accordion`.
 */
const chevron = computed(() => {
  if (props.chevron !== undefined || slots.chevron) {
    return resolveNode(props.chevron, slots.chevron)
  }

  return typeof ctx.chevron === 'function' ? ctx.chevron() : ctx.chevron
})

const icon = computed(() => resolveNode(props.icon, slots.icon))

/** Stable functional components: `MantineNode` values are arbitrary VNode children. */
const renderChevron = () => chevron.value
const renderIcon = () => icon.value

const stylesApiProps = computed(() => ({
  classNames: props.classNames,
  styles: props.styles,
  props,
}))

const controlStyles = computed(() =>
  ctx.getStyles('control', {
    ...stylesApiProps.value,
    className: attrs.class,
    style: attrs.style as any,
    variant: ctx.variant,
  }),
)

/** `h2`–`h6` wrapper, or no wrapper at all when the parent `Accordion` has no `order`. */
const hasHeading = computed(() => typeof ctx.order === 'number')
const headingTag = computed(() => (hasHeading.value ? `h${ctx.order}` : PassThrough))
const headingAttrs = computed(() =>
  hasHeading.value ? ctx.getStyles('itemTitle', stylesApiProps.value) : undefined,
)

function onClick(event: MouseEvent) {
  emit('click', event)

  if (!props.disabled) {
    ctx.onChange(value)
  }
}

const onKeydown = computed(() =>
  createScopedKeydownHandler({
    siblingSelector: '[data-accordion-control]',
    parentSelector: '[data-accordion]',
    activateOnFocus: false,
    loop: ctx.loop,
    orientation: 'vertical',
    onKeydown: (event: KeyboardEvent) => emit('keydown', event),
  }),
)

const forwardedAttrs = computed(() => omitAttrs(attrs, ['onClick', 'onKeydown', 'onKeyDown']))
</script>

<template>
  <component :is="headingTag" v-bind="headingAttrs">
    <UnstyledButton
      v-bind="{ ...forwardedAttrs, ...controlStyles }"
      :unstyled="ctx.unstyled"
      :variant="ctx.variant"
      :mod="[
        { active: isActive, chevronPosition: ctx.chevronPosition, disabled: props.disabled },
        props.mod,
      ]"
      data-accordion-control
      type="button"
      :disabled="props.disabled"
      :aria-expanded="isActive"
      :aria-controls="ctx.getRegionId(value)"
      :id="ctx.getControlId(value)"
      @click="onClick"
      @keydown="onKeydown"
    >
      <Box
        component="span"
        :mod="{ rotate: !ctx.disableChevronRotation && isActive, position: ctx.chevronPosition }"
        v-bind="ctx.getStyles('chevron', stylesApiProps)"
      >
        <component :is="renderChevron" />
      </Box>

      <span v-bind="ctx.getStyles('label', stylesApiProps)">
        <slot />
      </span>

      <Box
        v-if="hasNode(icon)"
        component="span"
        :mod="{ chevronPosition: ctx.chevronPosition }"
        v-bind="ctx.getStyles('icon', stylesApiProps)"
      >
        <component :is="renderIcon" />
      </Box>
    </UnstyledButton>
  </component>
</template>
