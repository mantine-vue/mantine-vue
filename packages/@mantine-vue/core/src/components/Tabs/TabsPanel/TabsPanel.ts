import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { useTabsContext } from '../Tabs.context'

export type TabsPanelStylesNames = 'panel'

export const TabsPanel = withBoxProps(
  defineComponent({
    name: 'TabsPanel',
    inheritAttrs: false,
    props: {
      value: { type: String, required: true },
      keepMounted: { type: Boolean, default: false },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
    },
    setup(props, { attrs, slots }) {
      const ctx = useTabsContext()

      return () => {
        const active = ctx.value === props.value
        const shouldKeepMounted = ctx.keepMounted || props.keepMounted
        const content = shouldKeepMounted || active ? slots.default?.() : null

        return h(
          Box,
          {
            ...attrs,
            ...ctx.getStyles('panel', {
              className: attrs.class,
              classNames: props.classNames,
              styles: props.styles,
              style: {
                ...(attrs.style as Record<string, any>),
                display: !active ? 'none' : undefined,
              },
              props,
            }),
            mod: [{ orientation: ctx.orientation }, props.mod],
            role: 'tabpanel',
            id: ctx.getPanelId(props.value),
            'aria-labelledby': ctx.getTabId(props.value),
          },
          () => content,
        )
      }
    },
  }),
)
