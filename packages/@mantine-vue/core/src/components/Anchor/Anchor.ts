import { defineComponent, h, type PropType } from 'vue'
import { useProps } from '../../core'
import { Text } from '../Text'
import type { TextVariant } from '../Text/Text'
import classes from './Anchor.module.css'

const defaultProps = {
  underline: 'hover',
} as const

export type AnchorVariant = TextVariant

export const Anchor = defineComponent({
  name: 'Anchor',
  inheritAttrs: false,
  props: {
    component: { type: String, default: 'a' },
    underline: {
      type: String as PropType<'always' | 'hover' | 'not-hover' | 'never'>,
      default: undefined,
    },
    unstyled: { type: Boolean, default: false },
    variant: { type: String as PropType<AnchorVariant>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Anchor', defaultProps, rawProps)

    return () =>
      h(
        Text,
        {
          ...attrs,
          ...props,
          component: props.component,
          class: [props.unstyled ? null : classes.root, attrs.class],
          __staticSelector: 'Anchor',
          mod: { underline: props.underline },
        },
        slots.default,
      )
  },
})
