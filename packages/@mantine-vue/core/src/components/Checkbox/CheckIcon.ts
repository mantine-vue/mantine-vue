import { defineComponent, h, type PropType } from 'vue'
import { rem } from '../../core'

export const CheckIcon = defineComponent({
  name: 'CheckIcon',
  inheritAttrs: false,
  props: {
    // No default on purpose: most consumers (Combobox, Select, TreeSelect,
    // Stepper, Swatches) size this purely via their own CSS class/width
    // props passed through attrs. An inline style always wins over a class,
    // so only emit a width/height style when `size` was explicitly passed
    // (e.g. by DateTimePicker's submit button) - otherwise leave existing
    // callers' sizing untouched.
    size: { type: [Number, String] as PropType<number | string>, default: undefined },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        'svg',
        {
          viewBox: '0 0 10 7',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': true,
          ...attrs,
          style:
            props.size !== undefined
              ? [
                  { width: rem(props.size), height: rem(props.size), display: 'block' },
                  attrs.style as any,
                ]
              : attrs.style,
        },
        h('path', {
          d: 'M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z',
          fill: 'currentColor',
          fillRule: 'evenodd',
          clipRule: 'evenodd',
        }),
      )
  },
})

export const CheckboxIcon = defineComponent({
  name: 'CheckboxIcon',
  inheritAttrs: false,
  props: {
    indeterminate: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    return () =>
      props.indeterminate
        ? h(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              fill: 'none',
              viewBox: '0 0 32 6',
              'aria-hidden': true,
              ...attrs,
            },
            h('rect', { width: '32', height: '6', fill: 'currentColor', rx: '3' }),
          )
        : h(CheckIcon, attrs)
  },
})
