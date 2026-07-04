import { defineComponent, h, type PropType } from 'vue'
import { Box, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from './Spotlight.context'
import classes from './Spotlight.module.css'

export type SpotlightEmptyStylesNames = 'empty'

export interface SpotlightEmptyProps {
  classNames?: Record<string, any>
  styles?: Record<string, any>
  [key: string]: any
}

export const SpotlightEmpty = defineComponent({
  name: 'SpotlightEmpty',
  inheritAttrs: false,
  props: {
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function] as PropType<any>, default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<SpotlightEmptyProps>('SpotlightEmpty', null, rawProps as any)
    const ctx = useSpotlightContext()

    return () =>
      h(
        Box,
        {
          ...attrs,
          ...ctx.getStyles('empty', {
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

Object.assign(SpotlightEmpty, { classes })
