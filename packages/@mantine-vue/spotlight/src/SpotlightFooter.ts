import { defineComponent, h, type PropType } from 'vue'
import { Box, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from './Spotlight.context'
import classes from './Spotlight.module.css'

export type SpotlightFooterStylesNames = 'footer'

export interface SpotlightFooterProps {
  classNames?: Record<string, any>
  styles?: Record<string, any>
  [key: string]: any
}

export const SpotlightFooter = defineComponent({
  name: 'SpotlightFooter',
  inheritAttrs: false,
  props: {
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function] as PropType<any>, default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<SpotlightFooterProps>('SpotlightFooter', null, rawProps as any)
    const ctx = useSpotlightContext()

    return () =>
      h(
        Box,
        {
          ...attrs,
          ...ctx.getStyles('footer', {
            className: attrs.class,
            style: attrs.style,
            classNames: props.classNames,
            styles: props.styles,
          }),
        },
        () => slots.default?.(),
      )
  },
})

Object.assign(SpotlightFooter, { classes })
