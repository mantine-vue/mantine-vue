import { defineComponent, h, type PropType } from 'vue'
import { Box, getFontSize, getSize, useStyles } from '../../core'
import { Input } from '../../components/Input'
import classes from './InlineInput.module.css'

export const InlineInputClasses = classes

export type InlineInputStylesNames =
  | 'root'
  | 'body'
  | 'labelWrapper'
  | 'label'
  | 'description'
  | 'error'

export const InlineInput = defineComponent({
  name: 'InlineInput',
  inheritAttrs: false,
  props: {
    __staticSelector: { type: String, required: true },
    __stylesApiProps: { type: Object as PropType<Record<string, any>>, required: true },
    label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    description: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    id: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    error: {
      type: [String, Number, Object, Function, Boolean] as PropType<any>,
      default: undefined,
    },
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
    labelPosition: { type: String as PropType<'left' | 'right'>, default: 'right' },
    bodyElement: { type: String, default: 'div' },
    labelElement: { type: String, default: 'label' },
    variant: { type: String, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const getStyles = useStyles({
      name: props.__staticSelector,
      props: props.__stylesApiProps,
      className: attrs.class,
      style: attrs.style as any,
      classes,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
    })

    return () => {
      const descriptionId = props.description ? `${props.id}-description` : undefined
      const errorId =
        props.error && typeof props.error !== 'boolean' ? `${props.id}-error` : undefined

      return h(
        Box,
        {
          ...attrs,
          ...getStyles('root', {
            className: attrs.class,
            style: {
              '--label-fz': getFontSize(props.size),
              '--label-lh': getSize(props.size, 'label-lh'),
              ...(attrs.style as Record<string, any>),
            },
          }),
          mod: [{ labelPosition: props.labelPosition }, props.mod],
          variant: props.variant,
          'data-size': props.size,
        },
        () =>
          h(
            Box,
            {
              component: props.bodyElement,
              htmlFor: props.bodyElement === 'label' ? props.id : undefined,
              ...getStyles('body'),
            },
            () => [
              slots.default?.(),
              h(
                'div',
                { ...getStyles('labelWrapper'), 'data-disabled': props.disabled || undefined },
                [
                  props.label
                    ? h(
                        Box,
                        {
                          component: props.labelElement,
                          htmlFor: props.labelElement === 'label' ? props.id : undefined,
                          ...getStyles('label'),
                          'data-disabled': props.disabled || undefined,
                        },
                        () => (typeof props.label === 'function' ? props.label() : props.label),
                      )
                    : null,
                  props.description
                    ? h(
                        Input.Description,
                        {
                          id: descriptionId,
                          size: props.size,
                          __inheritStyles: false,
                          ...getStyles('description'),
                        },
                        () =>
                          typeof props.description === 'function'
                            ? props.description()
                            : props.description,
                      )
                    : null,
                  props.error && typeof props.error !== 'boolean'
                    ? h(
                        Input.Error,
                        {
                          id: errorId,
                          size: props.size,
                          __inheritStyles: false,
                          ...getStyles('error'),
                        },
                        () => (typeof props.error === 'function' ? props.error() : props.error),
                      )
                    : null,
                ],
              ),
            ],
          ),
      )
    }
  },
})
