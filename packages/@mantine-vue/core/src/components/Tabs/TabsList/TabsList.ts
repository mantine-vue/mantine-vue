import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { useTabsContext } from '../Tabs.context'

export type TabsListStylesNames = 'list'

export const TabsList = withBoxProps(
  defineComponent({
    name: 'TabsList',
    inheritAttrs: false,
    props: {
      grow: { type: Boolean, default: false },
      justify: { type: String, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
    },
    setup(props, { attrs, slots }) {
      const ctx = useTabsContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            ...ctx.getStyles('list', {
              className: attrs.class,
              classNames: props.classNames,
              styles: props.styles,
              style: {
                '--tabs-justify': props.justify,
                ...(attrs.style as Record<string, any>),
              },
              props,
              variant: ctx.variant,
            }),
            role: 'tablist',
            variant: ctx.variant,
            mod: [
              {
                grow: props.grow,
                orientation: ctx.orientation,
                placement: ctx.orientation === 'vertical' && ctx.placement,
                inverted: ctx.inverted,
              },
              props.mod,
            ],
            'aria-orientation': ctx.orientation,
          },
          () => slots.default?.(),
        )
    },
  }),
)
