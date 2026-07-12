import { defineComponent, h, type PropType } from 'vue'
import { InputBase } from '../InputBase'
import { TextareaAutosize } from './Autosize'

export const Textarea = defineComponent({
  name: 'Textarea',
  inheritAttrs: false,
  props: {
    autosize: { type: Boolean, default: false },
    maxRows: { type: Number, default: undefined },
    minRows: { type: Number, default: undefined },
    resize: {
      type: String as PropType<'none' | 'both' | 'horizontal' | 'vertical'>,
      default: undefined,
    },
    bottomSection: {
      type: [String, Number, Object, Function] as PropType<any>,
      default: undefined,
    },
    bottomSectionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    __staticSelector: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const shouldAutosize = props.autosize
      const autosizeProps = shouldAutosize
        ? { maxRows: props.maxRows, minRows: props.minRows }
        : { rows: props.minRows }

      return h(
        InputBase,
        {
          ...attrs,
          component: shouldAutosize ? TextareaAutosize : 'textarea',
          __staticSelector: props.__staticSelector || 'Textarea',
          multiline: true,
          // data-no-overflow suppresses overflow scrollbar when no maxRows cap
          'data-no-overflow': shouldAutosize && props.maxRows === undefined ? true : undefined,
          __bottomSection: props.bottomSection,
          __bottomSectionProps: props.bottomSectionProps,
          style: [{ '--input-resize': props.resize }, (attrs as any).style],
          ...autosizeProps,
        },
        slots,
      )
    }
  },
})

Object.assign(Textarea, { classes: InputBase.classes })
