import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { useId } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  hasNode,
  resolveNode,
  type MantineColor,
  type MantineNode,
  type MantineRadius,
  useProps,
  useStyles,
} from '../../core'
import { CloseButton } from '../CloseButton'
import classes from './Alert.module.css'

export type AlertVariant = 'filled' | 'light' | 'outline' | 'default' | 'transparent' | 'white'

export interface AlertSlots {
  default?: () => VNodeChild
  title?: () => VNodeChild
  icon?: () => VNodeChild
}

const varsResolver = createVarsResolver<any>((theme, { radius, color, variant, autoContrast }) => {
  const colors = theme.variantColorResolver({
    color: color || theme.primaryColor,
    theme,
    variant: variant || 'light',
    autoContrast,
  })

  return {
    root: {
      '--alert-radius': radius === undefined ? undefined : getRadius(radius),
      '--alert-bg': color || variant ? colors.background : undefined,
      '--alert-color': colors.color,
      '--alert-bd': color || variant ? colors.border : undefined,
    },
  }
})

export const Alert = withBoxProps(
  defineComponent({
    name: 'Alert',
    inheritAttrs: false,
    slots: Object as SlotsType<AlertSlots>,
    props: {
      id: { type: String, default: undefined },
      radius: [String, Number] as PropType<MantineRadius>,
      color: { type: String as PropType<MantineColor>, default: undefined },
      title: { type: null as unknown as PropType<MantineNode>, default: undefined },
      icon: { type: null as unknown as PropType<MantineNode>, default: undefined },
      withCloseButton: { type: Boolean, default: false },
      onClose: { type: Function as PropType<() => void>, default: undefined },
      closeButtonLabel: { type: String, default: undefined },
      autoContrast: { type: Boolean, default: undefined },
      variant: { type: String as PropType<AlertVariant>, default: undefined },
      role: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Alert', null, rawProps)
      const rootId = useId(props.id)
      const getStyles = useStyles({
        name: 'Alert',
        props,
        classes,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        vars: props.vars as any,
        varsResolver,
        unstyled: props.unstyled,
      })

      return () => {
        const title = resolveNode(props.title, slots.title)
        const icon = resolveNode(props.icon, slots.icon)
        const message = slots.default?.()
        const id = rootId.value || undefined
        const titleId = hasNode(title) && id ? `${id}-title` : undefined
        const bodyId = id ? `${id}-body` : undefined

        return h(
          Box,
          {
            ...attrs,
            ...getStyles('root'),
            id,
            variant: props.variant,
            role: props.role || 'alert',
            'aria-describedby': hasNode(message) ? bodyId : undefined,
            'aria-labelledby': hasNode(title) ? titleId : undefined,
          },
          () =>
            h('div', getStyles('wrapper'), [
              hasNode(icon) ? h('div', getStyles('icon'), icon as any) : null,
              h('div', getStyles('body'), [
                hasNode(title)
                  ? h(
                      'div',
                      {
                        ...getStyles('title'),
                        'data-with-close-button': props.withCloseButton ? '' : undefined,
                      },
                      [h('span', { id: titleId, ...getStyles('label') }, title as any)],
                    )
                  : null,
                hasNode(message)
                  ? h(
                      'div',
                      {
                        id: bodyId,
                        ...getStyles('message'),
                        'data-variant': props.variant,
                      },
                      message as any,
                    )
                  : null,
              ]),
              props.withCloseButton
                ? h(CloseButton, {
                    ...getStyles('closeButton'),
                    onClick: props.onClose,
                    variant: 'transparent',
                    size: 16,
                    iconSize: 16,
                    'aria-label': props.closeButtonLabel,
                    unstyled: props.unstyled,
                  })
                : null,
            ]),
        )
      }
    },
  }),
)
