<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import {
  createScopedKeydownHandler,
  getThemeColor,
  hasNode,
  resolveNode,
  omitAttrs,
  useDirection,
  useMantineTheme,
  useProps,
} from '../../../core'
import { UnstyledButton } from '../../UnstyledButton'
import { useTabsContext } from '../Tabs.context'
import type { TabsTabEmits, TabsTabOwnProps, TabsTabSlots } from './TabsTab.types'

defineOptions({
  name: 'TabsTab',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<TabsTabOwnProps>(), {
  // Intentionally undefined to preserve downstream defaults.
  rightSection: undefined,
  leftSection: undefined,
  color: undefined,
  disabled: false,
  tabIndex: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
})

defineSlots<TabsTabSlots>()

const emit = defineEmits<TabsTabEmits>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('TabsTab', null, rawProps)
const theme = useMantineTheme()
const { dir } = useDirection()
const ctx = useTabsContext()

const active = computed(() => props.value === ctx.value)
const leftSection = computed(() => resolveNode(props.leftSection, slots.leftSection))
const rightSection = computed(() => resolveNode(props.rightSection, slots.rightSection))

/** Stable functional components: `MantineNode` values are arbitrary VNode children. */
const renderLeftSection = () => leftSection.value
const renderRightSection = () => rightSection.value

const stylesApiProps = computed(() => ({
  classNames: props.classNames,
  styles: props.styles,
  props,
}))

const rootStyles = computed(() =>
  ctx.getStyles('tab', {
    ...stylesApiProps.value,
    className: attrs.class,
    variant: ctx.variant,
    style: {
      '--tabs-color': props.color ? getThemeColor(props.color, theme.value) : undefined,
      ...(attrs.style as Record<string, any>),
    },
  }),
)

const tabIndex = computed(() =>
  props.tabIndex !== undefined ? props.tabIndex : active.value || ctx.value === null ? 0 : -1,
)

function activateTab(event: MouseEvent) {
  ctx.onChange(
    ctx.allowTabDeactivation ? (props.value === ctx.value ? null : props.value) : props.value,
  )
  emit('click', event)
}

const onKeydown = computed(() =>
  createScopedKeydownHandler({
    parentSelector: '[role="tablist"]',
    siblingSelector: '[role="tab"]',
    orientation: ctx.orientation || 'horizontal',
    dir: dir.value,
    activateOnFocus: ctx.activateTabWithKeyboard,
    loop: ctx.loop,
    onKeydown: (event: KeyboardEvent) => emit('keydown', event),
  }),
)

/**
 * `onClick` / `onKeydown` are declared props rather than fallthrough listeners, but a
 * consumer can still pass them as attributes. Dropping them from the forwarded object
 * keeps Vue from merging the two and invoking the consumer handler twice.
 */
const forwardedAttrs = computed(() => omitAttrs(attrs, ['onClick', 'onKeydown', 'onKeyDown']))
</script>

<template>
  <UnstyledButton
    v-bind="{ ...forwardedAttrs, ...rootStyles }"
    :disabled="props.disabled"
    :unstyled="ctx.unstyled"
    :variant="ctx.variant"
    :mod="[
      {
        active,
        disabled: props.disabled,
        orientation: ctx.orientation,
        inverted: ctx.inverted,
        placement: ctx.orientation === 'vertical' && ctx.placement,
      },
      props.mod,
    ]"
    role="tab"
    :id="ctx.getTabId(props.value)"
    :aria-selected="active"
    :tabindex="tabIndex"
    :aria-controls="ctx.getPanelId(props.value)"
    @click="activateTab"
    @keydown="onKeydown"
  >
    <span
      v-if="hasNode(leftSection)"
      v-bind="ctx.getStyles('tabSection', stylesApiProps)"
      data-position="left"
    >
      <component :is="renderLeftSection" />
    </span>

    <span v-if="slots.default" v-bind="ctx.getStyles('tabLabel', stylesApiProps)">
      <slot />
    </span>

    <span
      v-if="hasNode(rightSection)"
      v-bind="ctx.getStyles('tabSection', stylesApiProps)"
      data-position="right"
    >
      <component :is="renderRightSection" />
    </span>
  </UnstyledButton>
</template>
