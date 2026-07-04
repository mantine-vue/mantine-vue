import { defineComponent, h, reactive, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  useProps,
  useRandomClassName,
  useStyles,
} from '../../core'
import { GridCol } from './GridCol/GridCol'
import { provideGridContext, type GridBreakpoints } from './Grid.context'
import { GridVariables } from './GridVariables'
import classes from './Grid.module.css'

type StyleProp<T> = T | Partial<Record<string, T>>

const defaultProps = {
  gap: 'md',
  columns: 12,
} as const

const varsResolver = createVarsResolver<any>((_, { justify, align, overflow }) => ({
  root: {
    '--grid-justify': justify,
    '--grid-align': align,
    '--grid-overflow': overflow,
  },
}))

const GridBase = defineComponent({
  name: 'Grid',
  inheritAttrs: false,
  props: {
    gap: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    rowGap: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    columnGap: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    grow: { type: Boolean, default: false },
    justify: { type: String, default: undefined },
    align: { type: String, default: undefined },
    columns: { type: Number, default: undefined },
    overflow: { type: String, default: undefined },
    type: { type: String as PropType<'media' | 'container'>, default: undefined },
    breakpoints: { type: Object as PropType<GridBreakpoints>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Grid', defaultProps, rawProps)
    const getStyles = useStyles({
      name: 'Grid',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      varsResolver,
      unstyled: props.unstyled,
    })
    const responsiveClassName = useRandomClassName()

    const ctx = reactive({
      getStyles,
      get grow() {
        return props.grow
      },
      get columns() {
        return props.columns ?? 12
      },
      get breakpoints() {
        return props.breakpoints
      },
      get type() {
        return props.type
      },
    })
    provideGridContext(ctx as any)

    return () => {
      const variables = h(GridVariables, {
        selector: `.${responsiveClassName}`,
        gap: props.gap,
        rowGap: props.rowGap,
        columnGap: props.columnGap,
        breakpoints: props.breakpoints,
        type: props.type,
      })
      const root = h(
        Box,
        {
          ...attrs,
          ...getStyles('root', { className: responsiveClassName }),
        },
        () => h('div', getStyles('inner'), slots.default?.()),
      )

      if (props.type === 'container' && props.breakpoints) {
        return [variables, h('div', getStyles('container'), root)]
      }

      return [variables, root]
    }
  },
})

export const Grid = withBoxProps(
  Object.assign(GridBase, {
    Col: GridCol,
  }),
)
