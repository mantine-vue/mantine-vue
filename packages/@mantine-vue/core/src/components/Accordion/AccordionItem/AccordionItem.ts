import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { useAccordionContext } from '../Accordion.context'
import { provideAccordionItemContext } from '../AccordionItem.context'

export type AccordionItemStylesNames = 'item'

export const AccordionItem = withBoxProps(
  defineComponent({
    name: 'AccordionItem',
    inheritAttrs: false,
    props: {
      value: { type: String, required: true },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
    },
    setup(props, { attrs, slots }) {
      const ctx = useAccordionContext()
      provideAccordionItemContext({ value: props.value })

      return () =>
        h(
          Box,
          {
            ...attrs,
            ...ctx.getStyles('item', { className: attrs.class, style: attrs.style as any, props }),
            variant: ctx.variant,
            mod: [{ active: ctx.isItemActive(props.value) }, props.mod],
          },
          () => slots.default?.(),
        )
    },
  }),
)
