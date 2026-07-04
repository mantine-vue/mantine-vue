import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { Collapse } from '../../Collapse'
import { useAccordionContext } from '../Accordion.context'
import { useAccordionItemContext } from '../AccordionItem.context'

export type AccordionPanelStylesNames = 'panel' | 'content'

export const AccordionPanel = withBoxProps(
  defineComponent({
    name: 'AccordionPanel',
    inheritAttrs: false,
    props: {
      onTransitionEnd: { type: Function as PropType<() => void>, default: undefined },
      onTransitionStart: { type: Function as PropType<() => void>, default: undefined },
      keepMounted: { type: Boolean, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
    },
    setup(props, { attrs, slots }) {
      const { value } = useAccordionItemContext()
      const ctx = useAccordionContext()

      return () =>
        h(
          Collapse,
          {
            ...attrs,
            ...ctx.getStyles('panel', { className: attrs.class, style: attrs.style as any, props }),
            expanded: ctx.isItemActive(value),
            transitionDuration: ctx.transitionDuration ?? 200,
            role: 'region',
            id: ctx.getRegionId(value),
            'aria-labelledby': ctx.getControlId(value),
            keepMounted: props.keepMounted ?? ctx.keepMounted,
            onTransitionEnd: props.onTransitionEnd,
            onTransitionStart: props.onTransitionStart,
          },
          () =>
            h(
              Box,
              {
                component: 'div',
                ...ctx.getStyles('content', { props }),
              },
              () => slots.default?.(),
            ),
        )
    },
  }),
)
