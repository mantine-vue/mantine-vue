import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, useDirection } from '../../../core'
import { useRatingContext } from '../Rating.context'
import { StarSymbol } from '../StarSymbol/StarSymbol'

export const RatingItem = withBoxProps(
  defineComponent({
    name: 'RatingItem',
    inheritAttrs: false,
    props: {
      getSymbolLabel: { type: Function as PropType<(value: number) => string>, default: undefined },
      emptyIcon: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      fullIcon: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      full: { type: Boolean, required: true },
      active: { type: Boolean, required: true },
      checked: { type: Boolean, required: true },
      readOnly: { type: Boolean, default: false },
      fractionValue: { type: Number, required: true },
      value: { type: Number, required: true },
      id: { type: String, required: true },
      name: { type: String, required: true },
      onChangeValue: { type: Function as PropType<(value: number) => void>, required: true },
      onInputChange: { type: Function as PropType<(value: number) => void>, required: true },
      onItemBlur: { type: Function as PropType<() => void>, default: undefined },
    },
    setup(props) {
      const ctx = useRatingContext()
      const { dir } = useDirection()
      const renderIcon = (icon: any) => (typeof icon === 'function' ? icon(props.value) : icon)

      return () => {
        const icon = props.full
          ? renderIcon(props.fullIcon) || h(StarSymbol, { type: 'full' })
          : renderIcon(props.emptyIcon) || h(StarSymbol, { type: 'empty' })
        const clipPath =
          props.fractionValue === 1
            ? undefined
            : dir.value === 'ltr'
              ? `inset(0 ${props.active ? 100 - props.fractionValue * 100 : 100}% 0 0)`
              : `inset(0 0 0 ${props.active ? 100 - props.fractionValue * 100 : 100}% )`

        return [
          !props.readOnly
            ? h('input', {
                ...ctx.getStyles('input'),
                id: props.id,
                type: 'radio',
                name: props.name,
                value: props.value,
                checked: props.checked,
                'data-active': props.active ? true : undefined,
                'aria-label': props.getSymbolLabel?.(props.value),
                onBlur: props.onItemBlur,
                onChange: () => props.onInputChange(props.value),
                onKeydown: (event: KeyboardEvent) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    props.onChangeValue(props.value)
                  }
                },
              })
            : null,
          h(
            Box,
            {
              component: props.readOnly ? 'div' : 'label',
              ...ctx.getStyles('label', {
                style: {
                  '--rating-item-z-index':
                    props.fractionValue === 1 ? undefined : props.active ? '2' : '0',
                },
              }),
              'data-read-only': props.readOnly ? true : undefined,
              for: props.id,
              onClick: props.readOnly ? undefined : () => props.onChangeValue(props.value),
            },
            () =>
              h(
                Box,
                {
                  ...ctx.getStyles('symbolBody', {
                    style: {
                      '--rating-symbol-clip-path': clipPath,
                    },
                  }),
                },
                () => icon,
              ),
          ),
        ]
      }
    },
  }),
)
