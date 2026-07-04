import { defineComponent, h, type PropType } from 'vue'
import { Box, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from './Spotlight.context'
import classes from './Spotlight.module.css'

export type SpotlightActionsGroupStylesNames = 'actionsGroup'

export interface SpotlightActionsGroupProps {
  label?: string
  classNames?: Record<string, any>
  styles?: Record<string, any>
  [key: string]: any
}

export const SpotlightActionsGroup = defineComponent({
  name: 'SpotlightActionsGroup',
  inheritAttrs: false,
  props: {
    label: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function] as PropType<any>, default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<SpotlightActionsGroupProps>(
      'SpotlightActionsGroup',
      null,
      rawProps as any,
    )
    const ctx = useSpotlightContext()

    return () =>
      h(
        Box,
        {
          ...attrs,
          ...ctx.getStyles('actionsGroup', {
            className: attrs.class,
            style: attrs.style,
            classNames: props.classNames,
            styles: props.styles,
          }),
          style: [
            ctx.getStyles('actionsGroup', { styles: props.styles }).style,
            attrs.style as any,
            {
              '--spotlight-label': `'${props.label?.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`,
            },
          ],
        },
        () => slots.default?.(),
      )
  },
})

Object.assign(SpotlightActionsGroup, { classes })
