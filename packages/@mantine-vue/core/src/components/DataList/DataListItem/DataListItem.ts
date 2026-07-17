import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useDataListContext } from '../DataList.context'

export type DataListItemStylesNames = 'item'

export interface DataListItemProps {
  classNames?: any
  styles?: any
  mod?: any
  [key: string]: any
}

export interface DataListItemSlots {
  default?: () => VNodeChild
}

export const DataListItem = withBoxProps(
  defineComponent({
    name: 'DataListItem',
    inheritAttrs: false,
    slots: Object as SlotsType<DataListItemSlots>,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('DataListItem', null, rawProps)
      const ctx = useDataListContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            mod: props.mod,
            ...ctx.getStyles('item', {
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
