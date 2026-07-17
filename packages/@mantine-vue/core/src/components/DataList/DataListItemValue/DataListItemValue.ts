import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useDataListContext } from '../DataList.context'

export type DataListItemValueStylesNames = 'itemValue'

export interface DataListItemValueProps {
  classNames?: any
  styles?: any
  mod?: any
  [key: string]: any
}

export interface DataListItemValueSlots {
  default?: () => VNodeChild
}

export const DataListItemValue = withBoxProps(
  defineComponent({
    name: 'DataListItemValue',
    inheritAttrs: false,
    slots: Object as SlotsType<DataListItemValueSlots>,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('DataListItemValue', null, rawProps)
      const ctx = useDataListContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            component: 'dd',
            mod: props.mod,
            ...ctx.getStyles('itemValue', {
              className: attrs.class,
              style: attrs.style as any,
              classNames: props.classNames,
              styles: props.styles,
            }),
          },
          () => slots.default?.(),
        )
    },
  }),
)
