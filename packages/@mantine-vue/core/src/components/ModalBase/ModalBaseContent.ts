import { withBoxProps } from '../../core'
import { defineComponent, h } from 'vue'
import { FocusTrap } from '../FocusTrap'
import { Paper } from '../Paper'
import { Transition } from '../Transition'
import { useModalBaseContext } from './ModalBase.context'
import classes from './ModalBase.module.css'
export const ModalBaseContent = withBoxProps(
  defineComponent({
    name: 'ModalBaseContent',
    inheritAttrs: false,
    props: {
      transitionProps: { type: Object, default: undefined },
      innerProps: { type: Object, default: () => ({}) },
    },
    setup(props, { attrs, slots }) {
      const ctx = useModalBaseContext()
      return () =>
        h(
          Transition,
          {
            mounted: ctx.opened,
            transition: 'pop',
            ...ctx.transitionProps,
            ...props.transitionProps,
            onExited: () => {
              ctx.onExitTransitionEnd?.()
              ;(ctx.transitionProps as any)?.onExited?.()
            },
            onEntered: () => {
              ctx.onEnterTransitionEnd?.()
              ;(ctx.transitionProps as any)?.onEntered?.()
            },
          },
          {
            default: (transitionStyle: any) =>
              h(
                'div',
                {
                  ...props.innerProps,
                  class: [!ctx.unstyled && classes.inner, props.innerProps.class],
                },
                [
                  h(
                    FocusTrap,
                    { active: ctx.opened && ctx.trapFocus },
                    {
                      default: () =>
                        h(
                          Paper,
                          {
                            ...attrs,
                            component: 'section',
                            role: 'dialog',
                            tabindex: -1,
                            'aria-modal': 'true',
                            'aria-describedby': ctx.bodyMounted ? ctx.getBodyId() : undefined,
                            'aria-labelledby': ctx.titleMounted ? ctx.getTitleId() : undefined,
                            style: [attrs.style, transitionStyle],
                            class: [!ctx.unstyled && classes.content, attrs.class],
                            unstyled: ctx.unstyled,
                          },
                          () => slots.default?.(),
                        ),
                    },
                  ),
                ],
              ),
          },
        )
    },
  }),
)
export interface ModalBaseContentProps {
  transitionProps?: Record<string, any>
  innerProps?: Record<string, any>
  [key: string]: any
}
