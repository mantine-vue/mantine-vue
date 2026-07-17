import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getFontSize,
  getLineHeight,
  getSpacing,
  useProps,
  useStyles,
  type MantineSize,
  type MantineSpacing,
} from '../../core'
import { provideDataListContext } from './DataList.context'
import { DataListItem } from './DataListItem/DataListItem'
import { DataListItemLabel } from './DataListItemLabel/DataListItemLabel'
import { DataListItemValue } from './DataListItemValue/DataListItemValue'
import classes from './DataList.module.css'

export type DataListStylesNames = 'root' | 'item' | 'itemLabel' | 'itemValue'

export type DataListCssVariables = {
  root: '--data-list-fz' | '--data-list-lh' | '--data-list-gap' | '--data-list-label-width'
}

export interface DataListProps {
  /** Controls `font-size` and `line-height` @default 'sm' */
  size?: MantineSize | (string & {})

  /** Key of `theme.spacing` or any valid CSS value to set gap between items @default 'sm' */
  gap?: MantineSpacing

  /** Controls arrangement of label and value within each item. `horizontal` renders label and value side by side, `vertical` stacks label on top of value @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'

  /** Adds border between items @default false */
  withDivider?: boolean

  /** Controls min-width of the label (dt) element, any valid CSS value @default '120px' */
  labelWidth?: string | number

  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  mod?: any
  [key: string]: any
}

export interface DataListSlots {
  default?: () => VNodeChild
}

const defaultProps = {
  orientation: 'horizontal',
} satisfies Partial<DataListProps>

const varsResolver = createVarsResolver<any>((_, { size, gap, labelWidth }) => ({
  root: {
    '--data-list-fz': getFontSize(size),
    '--data-list-lh': getLineHeight(size),
    '--data-list-gap': getSpacing(gap),
    '--data-list-label-width':
      labelWidth !== undefined
        ? typeof labelWidth === 'number'
          ? `${labelWidth}px`
          : labelWidth
        : undefined,
  },
}))

const DataListBase = defineComponent({
  name: 'DataList',
  inheritAttrs: false,
  slots: Object as SlotsType<DataListSlots>,
  props: {
    size: { type: String as PropType<MantineSize | (string & {})>, default: undefined },
    gap: {
      type: [String, Number] as PropType<MantineSpacing>,
      default: undefined,
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: undefined,
    },
    withDivider: { type: Boolean, default: undefined },
    labelWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('DataList', defaultProps, rawProps)
    const getStyles = useStyles({
      name: 'DataList',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    provideDataListContext({ getStyles })

    return () =>
      h(
        Box,
        {
          ...attrs,
          component: 'dl',
          ...getStyles('root'),
          mod: [{ orientation: props.orientation, 'with-divider': props.withDivider }, props.mod],
        },
        () => slots.default?.(),
      )
  },
})

export const DataList = withBoxProps(
  Object.assign(DataListBase, {
    classes,
    varsResolver,
    Item: DataListItem,
    ItemLabel: DataListItemLabel,
    ItemValue: DataListItemValue,
  }),
)
