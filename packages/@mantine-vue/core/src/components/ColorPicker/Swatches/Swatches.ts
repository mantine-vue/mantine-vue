import { defineComponent, h, type PropType } from 'vue'
import { Box, luminance } from '../../../core'
import { CheckIcon } from '../../Checkbox'
import { ColorSwatch } from '../../ColorSwatch'
import { useColorPickerContext } from '../ColorPicker.context'

export const Swatches = defineComponent({
  name: 'Swatches',
  props: {
    data: { type: Array as PropType<string[]>, required: true },
    focusable: { type: Boolean, default: true },
    value: { type: String, default: undefined },
    setValue: { type: Function as PropType<(value: string) => void>, required: true },
    onChangeEnd: { type: Function as PropType<(value: string) => void>, default: undefined },
  },
  setup(props, { attrs }) {
    const ctx = useColorPickerContext()!
    return () =>
      h(Box, { ...attrs, ...ctx.getStyles('swatches') }, () =>
        props.data.map((color, index) =>
          h(
            ColorSwatch,
            {
              ...ctx.getStyles('swatch'),
              component: 'button',
              type: 'button',
              color,
              key: index,
              radius: 'sm',
              unstyled: ctx.unstyled,
              'aria-label': color,
              tabindex: props.focusable ? 0 : -1,
              'data-swatch': '',
              onClick: () => {
                props.setValue(color)
                props.onChangeEnd?.(color)
              },
            },
            () =>
              props.value === color
                ? h(CheckIcon, {
                    width: '35%',
                    color: luminance(color) < 0.5 ? 'white' : 'black',
                  })
                : null,
          ),
        ),
      )
  },
})
