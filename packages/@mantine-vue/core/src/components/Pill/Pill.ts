import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getSize,
  useProps,
  useStyles,
  type MantineRadius,
  type MantineSize,
} from '../../core'
import { CloseButton } from '../CloseButton'
import { usePillsInputContext } from '../PillsInput/PillsInput.context'
import { PillGroup, usePillGroupContext } from './PillGroup/PillGroup'
import classes from './Pill.module.css'

export type PillStylesNames = 'root' | 'label' | 'remove'
export type PillVariant = 'default' | 'contrast'

const varsResolver = createVarsResolver<any>((_, { radius }, ctx) => ({
  root: {
    '--pill-fz': getSize(ctx.size, 'pill-fz'),
    '--pill-height': getSize(ctx.size, 'pill-height'),
    '--pill-radius': radius === undefined ? undefined : getRadius(radius),
  },
}))

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

const PillBase = defineComponent({
  name: 'Pill',
  inheritAttrs: false,
  props: {
    size: { type: String as PropType<MantineSize>, default: undefined },
    withRemoveButton: { type: Boolean, default: false },
    onRemove: { type: Function as PropType<() => void>, default: undefined },
    removeButtonProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
    disabled: { type: Boolean, default: false },
    variant: { type: String as PropType<PillVariant>, default: 'default' },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Pill', null, rawProps)
    const groupContext = usePillGroupContext()
    const pillsInputContext = usePillsInputContext()
    const getSizeValue = () => props.size || groupContext?.size || undefined
    const getVariant = () =>
      pillsInputContext?.variant === 'filled' ? 'contrast' : props.variant || 'default'
    const getDisabled = () => props.disabled || groupContext?.disabled
    const getStyles = useStyles({
      name: 'Pill',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
      stylesCtx: {
        get size() {
          return getSizeValue()
        },
      },
    })

    return () => {
      const disabled = getDisabled()
      const removeButtonProps = props.removeButtonProps ?? {}

      return h(
        Box,
        {
          ...attrs,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          component: 'span',
          variant: getVariant(),
          'data-size': getSizeValue(),
          mod: [{ 'with-remove': props.withRemoveButton && !disabled, disabled }, props.mod],
        },
        () => [
          h('span', getStyles('label'), slots.default?.()),
          props.withRemoveButton
            ? h(CloseButton, {
                variant: 'transparent',
                radius: props.radius,
                tabIndex: -1,
                'aria-hidden': true,
                unstyled: props.unstyled,
                ...removeButtonProps,
                ...getStyles('remove', {
                  className: removeButtonProps.class,
                  style: removeButtonProps.style,
                }),
                onMousedown: (event: MouseEvent) => {
                  event.preventDefault()
                  event.stopPropagation()
                  callHandler(
                    removeButtonProps.onMousedown ??
                      removeButtonProps.onMousedown ??
                      removeButtonProps.onMouseDown,
                    event,
                  )
                },
                onClick: (event: MouseEvent) => {
                  event.stopPropagation()
                  props.onRemove?.()
                  callHandler(removeButtonProps.onClick, event)
                },
              })
            : null,
        ],
      )
    }
  },
})

export const Pill = withBoxProps(
  Object.assign(PillBase, {
    classes,
    varsResolver,
    Group: PillGroup,
  }),
)
