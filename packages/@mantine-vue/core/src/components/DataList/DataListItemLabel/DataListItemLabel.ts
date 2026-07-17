import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useDataListContext } from '../DataList.context'

export type DataListItemLabelStylesNames = 'itemLabel'

export interface DataListItemLabelProps {
  classNames?: any
  styles?: any
  mod?: any
  [key: string]: any
}

export interface DataListItemLabelSlots {
  default?: () => VNodeChild
}

export const DataListItemLabel = withBoxProps(
  defineComponent({
    name: 'DataListItemLabel',
    inheritAttrs: false,
    slots: Object as SlotsType<DataListItemLabelSlots>,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('DataListItemLabel', null, rawProps)
      const ctx = useDataListContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            component: 'dt',
            mod: props.mod,
            ...ctx.getStyles('itemLabel', {
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
