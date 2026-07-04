import { computed, defineComponent, h, ref, toRef, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, useStyles } from '../../core'
import { useFloatingIndicator } from './use-floating-indicator'
import classes from './FloatingIndicator.module.css'

export type FloatingIndicatorStylesNames = 'root'

const varsResolver = createVarsResolver<any>((_, { transitionDuration }) => ({
  root: {
    '--transition-duration':
      typeof transitionDuration === 'number'
        ? `${transitionDuration}ms`
        : transitionDuration || '150ms',
  },
}))

export const FloatingIndicator = withBoxProps(
  defineComponent({
    name: 'FloatingIndicator',
    inheritAttrs: false,
    props: {
      target: { type: Object as PropType<HTMLElement | null | undefined>, default: undefined },
      parent: { type: Object as PropType<HTMLElement | null | undefined>, default: undefined },
      transitionDuration: {
        type: [Number, String] as PropType<number | string>,
        default: undefined,
      },
      displayAfterTransitionEnd: { type: Boolean, default: false },
      onTransitionStart: { type: Function as PropType<() => void>, default: undefined },
      onTransitionEnd: { type: Function as PropType<() => void>, default: undefined },
      component: { type: String, default: 'div' },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      const floatingRef = ref<HTMLElement | null>(null)
      const target = toRef(props, 'target')
      const parent = toRef(props, 'parent')
      const getStyles = useStyles({
        name: 'FloatingIndicator',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        unstyled: props.unstyled,
        vars: props.vars as any,
        varsResolver,
      })
      const state = useFloatingIndicator({
        target,
        parent,
        floatingRef,
        displayAfterTransitionEnd: props.displayAfterTransitionEnd,
        onTransitionStart: props.onTransitionStart,
        onTransitionEnd: props.onTransitionEnd,
      })
      const shouldRender = computed(() => Boolean(props.target && props.parent))

      return () =>
        shouldRender.value
          ? h(
              Box,
              {
                ...attrs,
                ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
                component: props.component,
                ref: (node: any) => {
                  floatingRef.value = node?.$el ?? node ?? null
                },
                mod: [
                  { initialized: state.initialized.value, hidden: state.hidden.value },
                  props.mod,
                ],
              },
              () => slots.default?.(),
            )
          : null
    },
  }),
)

Object.assign(FloatingIndicator, { classes, varsResolver })
