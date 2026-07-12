import {
  cloneVNode,
  defineComponent,
  h,
  isVNode,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import { withBoxProps, Box, hasNode, resolveNode, type MantineNode, useProps } from '../../../core'
import { useListContext } from '../List.context'

export interface ListItemSlots {
  default?: () => VNodeChild
  icon?: () => VNodeChild
}

function renderListIcon(icon: any) {
  if (typeof icon === 'function') {
    return icon()
  }

  return isVNode(icon) ? cloneVNode(icon) : icon
}

export const ListItem = withBoxProps(
  defineComponent({
    name: 'ListItem',
    inheritAttrs: false,
    slots: Object as SlotsType<ListItemSlots>,
    props: {
      icon: { type: null as unknown as PropType<MantineNode>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ListItem', null, rawProps)
      const ctx = useListContext()

      return () => {
        const ownIcon = resolveNode(props.icon, slots.icon)
        const icon = hasNode(ownIcon) ? ownIcon : renderListIcon(ctx.icon)

        return h(
          Box,
          {
            ...attrs,
            ...ctx.getStyles('item', { className: attrs.class, style: attrs.style as any }),
            component: 'li',
            mod: [{ withIcon: hasNode(icon), centered: ctx.center }, props.mod],
          },
          () =>
            h('div', ctx.getStyles('itemWrapper'), [
              hasNode(icon) ? h('span', ctx.getStyles('itemIcon'), icon as any) : null,
              h('span', ctx.getStyles('itemLabel'), slots.default?.() as any),
            ]),
        )
      }
    },
  }),
)
