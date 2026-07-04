import { cloneVNode, defineComponent, h, isVNode, type PropType } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useListContext } from '../List.context'

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
    props: {
      icon: { type: [String, Number, Object, Function], default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ListItem', null, rawProps)
      const ctx = useListContext()

      return () => {
        const icon = props.icon ?? ctx.icon

        return h(
          Box,
          {
            ...attrs,
            ...ctx.getStyles('item', { className: attrs.class, style: attrs.style as any }),
            component: 'li',
            mod: [{ withIcon: Boolean(icon), centered: ctx.center }, props.mod],
          },
          () =>
            h('div', ctx.getStyles('itemWrapper'), [
              icon ? h('span', ctx.getStyles('itemIcon'), renderListIcon(icon)) : null,
              h('span', ctx.getStyles('itemLabel'), slots.default?.()),
            ]),
        )
      }
    },
  }),
)
