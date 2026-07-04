import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { useSplitterContext } from '../Splitter.context'
import classes from '../Splitter.module.css'

export type SplitterPaneStylesNames = 'pane'

export interface SplitterPaneProps {
  defaultSize: number
  min?: number
  max?: number
  collapsible?: boolean
  collapseThreshold?: number
  __index?: number
  mod?: any
  classNames?: any
  styles?: any
  vars?: any
}

export const SplitterPane = withBoxProps(
  defineComponent({
    name: 'SplitterPane',
    inheritAttrs: false,
    props: {
      defaultSize: { type: Number, required: true },
      min: { type: Number, default: undefined },
      max: { type: Number, default: undefined },
      collapsible: { type: Boolean, default: false },
      collapseThreshold: { type: Number, default: undefined },
      __index: { type: Number, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
    },
    setup(props, { attrs, slots }) {
      const context = useSplitterContext()
      return () => {
        const index = props.__index ?? 0
        const sizeStyle = { flexBasis: `${context.sizes[index] ?? 0}%` }
        const paneStyles = context.getStyles('pane', {
          className: attrs.class,
          classNames: props.classNames,
          styles: props.styles,
          props,
        })
        return h(
          Box,
          {
            ...attrs,
            mod: [{ collapsed: context.collapsed[index] || undefined }, props.mod],
            ...paneStyles,
            style: [paneStyles.style, sizeStyle, attrs.style],
          },
          () => slots.default?.(),
        )
      }
    },
  }),
)

Object.assign(SplitterPane, { classes })
