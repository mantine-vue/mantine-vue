import { defineComponent, h, ref } from 'vue'
import type { PropType } from 'vue'
import { Box, useForwardedRef, useStyles } from '../../core'
import classes from './UnstyledButton.module.css'

export const UnstyledButton = defineComponent({
  name: 'UnstyledButton',
  inheritAttrs: false,
  props: {
    component: { type: String, default: 'button' },
    __staticSelector: { type: String, default: undefined },
    variant: { type: String, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = rawProps
    const getStyles = useStyles({
      name: props.__staticSelector ?? 'UnstyledButton',
      classes,
      props,
      get className() {
        return attrs.class
      },
      get style() {
        return attrs.style as any
      },
      get classNames() {
        return props.classNames as any
      },
      get styles() {
        return props.styles as any
      },
      get vars() {
        return props.vars as any
      },
      get unstyled() {
        return props.unstyled
      },
    })
    const elementRef = ref<HTMLElement | null>(null)
    useForwardedRef(elementRef)

    return () =>
      h(
        Box,
        {
          ...attrs,
          ...getStyles('root', { focusable: true }),
          component: props.component,
          variant: props.variant,
          mod: props.mod,
          type: props.component === 'button' ? 'button' : undefined,
          ref: elementRef,
        },
        () => slots.default?.(),
      )
  },
})
