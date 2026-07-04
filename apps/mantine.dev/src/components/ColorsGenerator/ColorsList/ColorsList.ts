import { defineComponent, h, type PropType } from 'vue'
import type { Color } from 'chroma-js'
import { ColorSwatch, Group, isLightColor } from '@mantine-vue/core'
import classes from './ColorsList.module.css'

export const ColorsList = defineComponent({
  name: 'ColorsList',
  props: {
    colors: { type: Array as PropType<Color[]>, required: true },
    baseColorIndex: { type: Number, required: true },
    displayColorsInfo: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  },
  setup(props) {
    return () => {
      const items = props.colors.map((color, index) =>
        h(
          'div',
          { key: index, class: classes.item },
          h(
            ColorSwatch,
            {
              color: color.hex(),
              radius: 0,
              class: classes.swatch,
              withShadow: false,
              'data-base': index === props.baseColorIndex || undefined,
              c: isLightColor(color.hex()) ? 'black' : 'white',
            },
            () =>
              props.displayColorsInfo
                ? h('div', { class: classes.label }, [
                    h('span', { class: classes.index }, String(index)),
                    h('span', { class: classes.hex }, color.hex()),
                  ])
                : null,
          ),
        ),
      )

      return h(Group, { gap: 0, wrap: 'nowrap', class: classes.root }, () => items)
    }
  },
})
