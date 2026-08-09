<script setup lang="ts">
import { cloneVNode, isVNode, useAttrs, useSlots } from 'vue'
import { Box, hasNode, resolveNode, useProps } from '../../../core'
import { useListContext } from '../List.context'
import type { ListItemOwnProps, ListItemSlots } from './ListItem.types'
defineOptions({ name: 'ListItem', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ListItemOwnProps>(), {
  icon: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<ListItemSlots>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('ListItem', null, rawProps)
const ctx = useListContext()
const renderListIcon = (icon: any) =>
  typeof icon === 'function' ? icon() : isVNode(icon) ? cloneVNode(icon) : icon
const getIcon = () => {
  const ownIcon = resolveNode(props.icon, slots.icon)
  return hasNode(ownIcon) ? ownIcon : renderListIcon(ctx.icon)
}
const styleOptions = () => ({ classNames: props.classNames, styles: props.styles }) as any
</script>
<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('item', {
        ...styleOptions(),
        className: attrs.class,
        style: attrs.style as any,
      }),
    }"
    component="li"
    :mod="[{ withIcon: hasNode(getIcon()), centered: ctx.center }, props.mod]"
    ><div v-bind="ctx.getStyles('itemWrapper', styleOptions())">
      <span v-if="hasNode(getIcon())" v-bind="ctx.getStyles('itemIcon', styleOptions())"
        ><component :is="() => getIcon()" /></span
      ><span v-bind="ctx.getStyles('itemLabel', styleOptions())"><slot /></span></div
  ></Box>
</template>
