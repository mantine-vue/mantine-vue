import { defineComponent, h, type PropType } from 'vue'
import {
  useProps,
  type MantineColor,
  type MantineRadius,
  type MantineSize,
  type MantineSpacing,
} from '../../core'
import { Group } from '../Group'
import {
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from './PaginationEdges/PaginationEdges'
import { PaginationItems, PaginationItemsGroup } from './PaginationItems/PaginationItems'
import { PaginationLabel } from './PaginationLabel/PaginationLabel'
import { PaginationRoot, type PaginationLayout } from './PaginationRoot/PaginationRoot'
import { PaginationControl } from './PaginationControl/PaginationControl'
import { PaginationDots } from './PaginationDots/PaginationDots'
import classes from './Pagination.module.css'

export type PaginationStylesNames = 'root' | 'control' | 'dots' | 'items' | 'label'

const defaultProps = {
  withControls: true,
  withPages: true,
  siblings: 1,
  boundaries: 1,
  gap: 8,
} as const

const PaginationBase = defineComponent({
  name: 'Pagination',
  inheritAttrs: false,
  props: {
    total: { type: Number, required: true },
    value: { type: Number, default: undefined },
    defaultValue: { type: Number, default: undefined },
    onChange: { type: Function as PropType<(page: number) => void>, default: undefined },
    siblings: { type: Number, default: undefined },
    boundaries: { type: Number, default: undefined },
    withControls: { type: Boolean, default: undefined },
    withEdges: { type: Boolean, default: false },
    withPages: { type: Boolean, default: undefined },
    hideWithOnePage: { type: Boolean, default: false },
    gap: { type: [String, Number] as PropType<MantineSpacing>, default: undefined },
    color: { type: String as PropType<MantineColor>, default: undefined },
    radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
    size: {
      type: [String, Number] as PropType<
        MantineSize | `input-${MantineSize}` | (string & {}) | number
      >,
      default: undefined,
    },
    disabled: { type: Boolean, default: false },
    autoContrast: { type: Boolean, default: undefined },
    getItemProps: {
      type: Function as PropType<(page: number) => Record<string, any>>,
      default: undefined,
    },
    layout: { type: String as PropType<PaginationLayout>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs }) {
    const props = useProps('Pagination', defaultProps, rawProps)

    return () => {
      if (props.total <= 0 || (props.hideWithOnePage && props.total === 1)) {
        return null
      }

      const pages =
        props.withPages && props.layout === 'responsive'
          ? [h(PaginationItemsGroup), h(PaginationLabel)]
          : props.withPages
            ? h(PaginationItems)
            : null

      return h(
        PaginationRoot,
        {
          ...attrs,
          total: props.total,
          value: props.value,
          defaultValue: props.defaultValue,
          onChange: props.onChange,
          siblings: props.siblings,
          boundaries: props.boundaries,
          color: props.color,
          radius: props.radius,
          size: props.size,
          disabled: props.disabled,
          autoContrast: props.autoContrast,
          getItemProps: props.getItemProps,
          layout: props.layout,
          classNames: props.classNames,
          styles: props.styles,
          vars: props.vars,
          unstyled: props.unstyled,
        },
        () =>
          h(Group, { gap: props.gap, wrap: 'nowrap' }, () => [
            props.withEdges ? h(PaginationFirst) : null,
            props.withControls ? h(PaginationPrevious) : null,
            pages,
            props.withControls ? h(PaginationNext) : null,
            props.withEdges ? h(PaginationLast) : null,
          ]),
      )
    }
  },
})

export const Pagination = Object.assign(PaginationBase, {
  classes,
  Root: PaginationRoot,
  Control: PaginationControl,
  Dots: PaginationDots,
  First: PaginationFirst,
  Last: PaginationLast,
  Next: PaginationNext,
  Previous: PaginationPrevious,
  Items: PaginationItems,
  Label: PaginationLabel,
})
