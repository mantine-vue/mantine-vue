import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { useProps, type MantineNode, type MantineRadius, type MantineSize } from '../../core'
import { InputBase } from '../InputBase'
import { getParsedNativeSelectData, type NativeSelectData } from './get-parsed-data/get-parsed-data'
import { NativeSelectOption } from './NativeSelectOption'

export interface NativeSelectSlots {
  default?: () => VNodeChild
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  leftSection?: () => VNodeChild
  rightSection?: () => VNodeChild
}

export interface NativeSelectProps {
  data?: NativeSelectData<any>
  size?: string | number
  error?: any
  rightSection?: any
  rightSectionPointerEvents?: string
  label?: any
  description?: any
  required?: boolean
  disabled?: boolean
  id?: string
  name?: string
  form?: string
  value?: string
  defaultValue?: string
  onChange?: (event: Event) => void
  variant?: 'default' | 'filled' | 'unstyled'
  radius?: string | number
  classNames?: Record<string, string> | ((theme: any, props: any) => Record<string, string>)
  styles?: Record<string, any> | ((theme: any, props: any) => Record<string, any>)
  vars?:
    | Record<string, Record<string, string | undefined>>
    | ((theme: any, props: any) => Record<string, Record<string, string | undefined>>)
  unstyled?: boolean
}

const defaultProps = {
  size: 'sm',
  rightSectionPointerEvents: 'none',
} as const

function NativeSelectChevron() {
  return h(
    'svg',
    {
      viewBox: '0 0 15 15',
      width: '1em',
      height: '1em',
      'aria-hidden': true,
      focusable: false,
    },
    h('path', {
      d: 'M4 6l3.5 3.5L11 6',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.5,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  )
}

export const NativeSelect = defineComponent({
  name: 'NativeSelect',
  inheritAttrs: false,
  slots: Object as SlotsType<NativeSelectSlots>,
  props: {
    data: { type: Array as PropType<NativeSelectData<any>>, default: undefined },
    size: {
      type: [String, Number] as PropType<MantineSize | (string & {}) | number>,
      default: undefined,
    },
    error: {
      type: null as unknown as PropType<MantineNode | boolean>,
      default: undefined,
    },
    rightSection: {
      type: null as unknown as PropType<MantineNode>,
      default: undefined,
    },
    rightSectionPointerEvents: { type: String, default: undefined },
    label: { type: null as unknown as PropType<MantineNode>, default: undefined },
    description: { type: null as unknown as PropType<MantineNode>, default: undefined },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    form: { type: String, default: undefined },
    value: { type: String, default: undefined },
    defaultValue: { type: String, default: undefined },
    onChange: { type: Function as PropType<(event: Event) => void>, default: undefined },
    variant: { type: String as PropType<'default' | 'filled' | 'unstyled'>, default: undefined },
    radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('NativeSelect', defaultProps, rawProps)

    return () => {
      const parsedOptions = getParsedNativeSelectData(props.data).map((item, index) =>
        h(NativeSelectOption, { key: index, data: item }),
      )

      return h(
        InputBase as any,
        {
          ...attrs,
          component: 'select',
          __staticSelector: 'NativeSelect',
          size: props.size,
          pointer: true,
          error: props.error,
          unstyled: props.unstyled,
          rightSection:
            props.rightSection !== undefined || slots.rightSection
              ? props.rightSection
              : NativeSelectChevron,
          rightSectionPointerEvents: props.rightSectionPointerEvents,
          label: props.label,
          description: props.description,
          required: props.required,
          disabled: props.disabled,
          id: props.id,
          name: props.name,
          form: props.form,
          ...(props.value !== undefined ? { value: props.value } : null),
          ...(props.defaultValue !== undefined ? { value: props.defaultValue } : null),
          onChange: props.onChange,
          variant: props.variant,
          radius: props.radius,
          classNames: props.classNames,
          styles: props.styles,
          vars: props.vars,
        } as any,
        {
          default: () => slots.default?.() ?? parsedOptions,
          label: slots.label,
          description: slots.description,
          error: slots.error,
          leftSection: slots.leftSection,
          rightSection: slots.rightSection,
        },
      )
    }
  },
})

Object.assign(NativeSelect, { classes: InputBase.classes })
