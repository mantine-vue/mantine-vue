import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { resolveNode } from '../../core'
import { InputBase, type InputBaseSlots } from '../InputBase'
import { TextareaAutosize } from './Autosize'

export interface TextareaSlots extends InputBaseSlots {
  /** Content rendered below the textarea, alternative to the `bottomSection` prop */
  bottomSection?: () => VNodeChild
}

export const Textarea = defineComponent({
  name: 'Textarea',
  inheritAttrs: false,
  slots: Object as SlotsType<TextareaSlots>,
  props: {
    modelValue: { type: String, default: undefined },
    value: { type: String, default: undefined },
    defaultValue: { type: String, default: undefined },
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
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, slots, emit }) {
    return () => {
      const shouldAutosize = props.autosize
      const autosizeProps = shouldAutosize
        ? { maxRows: props.maxRows, minRows: props.minRows }
        : { rows: props.minRows }

      return h(
        InputBase,
        {
          ...attrs,
          modelValue: props.modelValue,
          value: props.value,
          defaultValue: props.defaultValue,
          'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
          onChange: (value: string) => emit('change', value),
          component: shouldAutosize ? TextareaAutosize : 'textarea',
          __staticSelector: props.__staticSelector || 'Textarea',
          multiline: true,
          // data-no-overflow suppresses overflow scrollbar when no maxRows cap
          'data-no-overflow': shouldAutosize && props.maxRows === undefined ? true : undefined,
          __bottomSection: resolveNode(props.bottomSection, slots.bottomSection),
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
