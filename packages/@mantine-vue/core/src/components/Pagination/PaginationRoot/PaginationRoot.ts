import { defineComponent, h, type PropType } from 'vue'
import { usePagination } from '@mantine-vue/hooks'
import {
  Box,
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getFontSize,
  getRadius,
  getSize,
  getThemeColor,
  useProps,
  useStyles,
} from '../../../core'
import { providePaginationContext } from '../Pagination.context'
import classes from '../Pagination.module.css'

export type PaginationRootStylesNames = 'root' | 'control' | 'dots' | 'items' | 'label'
export type PaginationLayout = 'default' | 'responsive'

const defaultProps = {
  siblings: 1,
  boundaries: 1,
  size: 'md',
  color: 'var(--mantine-primary-color-filled)',
  layout: 'default',
} as const

const varsResolver = createVarsResolver<any>((theme, { size, radius, color, autoContrast }) => ({
  root: {
    '--pagination-control-radius': radius === undefined ? undefined : getRadius(radius),
    '--pagination-control-size': getSize(size, 'pagination-control-size'),
    '--pagination-control-fz': getFontSize(size),
    '--pagination-active-bg': color ? getThemeColor(color, theme) : undefined,
    '--pagination-active-color': getAutoContrastValue(autoContrast, theme)
      ? getContrastColor({ color, theme, autoContrast })
      : undefined,
  },
}))

export const PaginationRoot = defineComponent({
  name: 'PaginationRoot',
  inheritAttrs: false,
  props: {
    total: { type: Number, required: true },
    value: { type: Number, default: undefined },
    defaultValue: { type: Number, default: undefined },
    onChange: { type: Function as PropType<(page: number) => void>, default: undefined },
    siblings: { type: Number, default: undefined },
    boundaries: { type: Number, default: undefined },
    color: { type: String, default: undefined },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
    disabled: { type: Boolean, default: false },
    autoContrast: { type: Boolean, default: undefined },
    getItemProps: {
      type: Function as PropType<(page: number) => Record<string, any>>,
      default: undefined,
    },
    layout: { type: String as PropType<PaginationLayout>, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('PaginationRoot', defaultProps, rawProps)
    const pagination = usePagination({
      total: props.total,
      page: () => props.value,
      initialPage: props.defaultValue,
      siblings: props.siblings,
      boundaries: props.boundaries,
      onChange: props.onChange,
    })
    const getStyles = useStyles({
      name: 'Pagination',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    providePaginationContext({
      total: props.total,
      disabled: props.disabled,
      getItemProps: props.getItemProps,
      getStyles,
      get range() {
        return pagination.range.value
      },
      get active() {
        return pagination.active.value
      },
      onChange: pagination.setPage,
      onNext: pagination.next,
      onPrevious: pagination.previous,
      onFirst: pagination.first,
      onLast: pagination.last,
    } as any)

    return () =>
      h(
        Box,
        {
          ...attrs,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          mod: [{ disabled: props.disabled }, props.mod],
          'data-layout': props.layout,
        },
        () => slots.default?.(),
      )
  },
})

Object.assign(PaginationRoot, { classes, varsResolver })
