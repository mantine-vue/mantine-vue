<script setup lang="ts">
import { computed, useAttrs, useSlots, type VNodeChild } from 'vue'
import { hasNode, omitAttrs, resolveNode } from '../../core'
import { UnstyledButton } from '../UnstyledButton'
import { useMenuContext } from './Menu.context'
import { call } from './menu-utils'
import type { MenuItemProps, MenuItemSlots } from './Menu.types'

defineOptions({
  name: 'MenuItem',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const props = withDefaults(defineProps<MenuItemProps>(), {
  component: 'button',
  closeMenuOnClick: undefined,
  leftSection: undefined,
  rightSection: undefined,
  indicator: undefined,
  disabled: false,
  reserveIndicator: false,
})

defineSlots<MenuItemSlots>()

const slots = useSlots()
const attrs = useAttrs()
const ctx = useMenuContext()

/**
 * The consumer handlers are chained explicitly below, so they must not also reach the
 * element through the fallthrough attributes or they would fire twice.
 */
const itemAttrs = computed(() => omitAttrs(attrs, ['onClick', 'onMousedown']))

const itemStyles = computed(() =>
  ctx.getStyles('item', { className: attrs.class, style: attrs.style }),
)

/** `all` reserves the indicator space on every item so all labels line up. */
const withIndicator = computed(() => ctx.alignItemsLabels === 'all' || props.reserveIndicator)

const leftSection = computed(() => resolveNode(props.leftSection, slots.leftSection))
const rightSection = computed(() => resolveNode(props.rightSection, slots.rightSection))

/** `data-disabled` marks an item disabled without setting the attribute on a link. */
const isDisabled = computed(() => props.disabled || (attrs as any)['data-disabled'] || undefined)

/** Prevents the dropdown from losing focus before the click is handled. */
function onMousedown(event: MouseEvent) {
  event.preventDefault()
  ;(attrs as any).onMousedown?.(event)
}

function onClick(event: MouseEvent) {
  call((attrs as any).onClick, event)

  if (
    !props.disabled &&
    !(attrs as any)['data-disabled'] &&
    (props.closeMenuOnClick ?? ctx.closeOnItemClick)
  ) {
    ctx.closeDropdownImmediately()
  }
}

/** Renderable content cannot be interpolated as text. */
const renderIndicator = (): VNodeChild => props.indicator
const renderLeftSection = (): VNodeChild => leftSection.value
const renderRightSection = (): VNodeChild => rightSection.value
</script>

<template>
  <UnstyledButton
    v-bind="{ ...itemAttrs, ...itemStyles }"
    :component="props.component"
    :type="props.component === 'button' ? 'button' : undefined"
    :role="(attrs as any).role ?? 'menuitem'"
    :tabindex="ctx.menuItemTabIndex"
    :disabled="props.disabled"
    data-menu-item=""
    :data-disabled="isDisabled"
    data-mantine-stop-propagation=""
    :unstyled="ctx.unstyled"
    @mousedown="onMousedown"
    @click="onClick"
  >
    <span v-if="withIndicator" v-bind="ctx.getStyles('itemIndicator')">
      <component :is="renderIndicator" />
    </span>

    <span v-if="hasNode(leftSection)" v-bind="ctx.getStyles('itemSection')" data-position="left">
      <component :is="renderLeftSection" />
    </span>

    <span v-bind="ctx.getStyles('itemLabel')"><slot /></span>

    <span v-if="hasNode(rightSection)" v-bind="ctx.getStyles('itemSection')" data-position="right">
      <component :is="renderRightSection" />
    </span>
  </UnstyledButton>
</template>
