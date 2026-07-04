import { defineComponent, h, ref, type PropType } from 'vue'
import { Box } from '../../../core'
import { useSliderContext } from '../Slider.context'

export const Thumb = defineComponent({
  name: 'SliderThumb',
  inheritAttrs: false,
  props: {
    max: { type: Number, required: true },
    min: { type: Number, required: true },
    value: { type: Number, required: true },
    position: { type: Number, required: true },
    dragging: { type: Boolean, default: false },
    label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    thumbValueText: {
      type: [String, Function] as PropType<string | ((value: number) => string)>,
      default: undefined,
    },
    labelTransitionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    labelAlwaysOn: { type: Boolean, default: false },
    thumbLabel: { type: String, default: undefined },
    showLabelOnHover: { type: Boolean, default: true },
    isHovered: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  },
  emits: ['focus', 'blur', 'mousedown'],
  setup(props, { attrs, slots, emit }) {
    const ctx = useSliderContext()
    const focused = ref(false)
    return () => {
      const visible =
        props.label != null &&
        (props.labelAlwaysOn ||
          props.dragging ||
          focused.value ||
          (props.showLabelOnHover && props.isHovered))
      return h(
        Box,
        {
          ...attrs,
          ...ctx.getStyles('thumb', { className: attrs.class, style: attrs.style }),
          tabindex: props.disabled ? -1 : 0,
          role: 'slider',
          'aria-label': props.thumbLabel,
          'aria-valuemax': props.max,
          'aria-valuemin': props.min,
          'aria-valuenow': props.value,
          'aria-valuetext':
            typeof props.thumbValueText === 'function'
              ? props.thumbValueText(props.value)
              : props.thumbValueText,
          'aria-disabled': props.disabled || undefined,
          'aria-orientation': props.orientation,
          mod: { dragging: props.dragging, disabled: props.disabled },
          style: [
            ctx.getStyles('thumb').style,
            { '--slider-thumb-offset': `${props.position}%` },
            attrs.style,
          ],
          onFocus: (event: FocusEvent) => {
            focused.value = true
            emit('focus', event)
          },
          onBlur: (event: FocusEvent) => {
            focused.value = false
            emit('blur', event)
          },
          onMousedown: (event: MouseEvent) => emit('mousedown', event),
          onTouchstart: (event: TouchEvent) => emit('mousedown', event),
          onClick: (event: MouseEvent) => event.stopPropagation(),
        },
        () => [
          slots.default?.(),
          visible
            ? h(
                'div',
                ctx.getStyles('label'),
                typeof props.label === 'function' ? props.label() : props.label,
              )
            : null,
        ],
      )
    }
  },
})
