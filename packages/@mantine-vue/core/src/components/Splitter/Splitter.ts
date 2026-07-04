import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  shallowRef,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue'
import { assignRef, type VueRefTarget } from '@mantine-vue/hooks'
import { rem } from '@mantine-vue/utils'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getThemeColor,
  useDirection,
  useProps,
  useStyles,
} from '../../core'
import { GripHorizontalIcon, GripVerticalIcon } from './GripIcon'
import { provideSplitterContext } from './Splitter.context'
import { SplitterPane } from './SplitterPane/SplitterPane'
import {
  useSplitter,
  type UseSplitterRedistributeFn,
  type UseSplitterReturnValue,
} from './use-splitter'
import classes from './Splitter.module.css'

export type SplitterStylesNames = 'root' | 'handle' | 'thumb' | 'pane'
export type SplitterCssVariables = '--splitter-line-size' | '--splitter-handle-color'

export interface SplitterProps {
  orientation?: 'horizontal' | 'vertical'
  sizes?: number[]
  onSizeChange?: (sizes: number[]) => void
  onResizeStart?: (handleIndex: number) => void
  onResizeEnd?: (handleIndex: number, sizes: number[]) => void
  onCollapseChange?: (panelIndex: number, collapsed: boolean) => void
  redistribute?: 'nearest' | 'equal' | UseSplitterRedistributeFn
  step?: number
  shiftStep?: number
  lineSize?: number | string
  handleColor?: string
  handleIcon?: VNodeChild
  withHandle?: boolean
  resetOnDoubleClick?: boolean
  splitterRef?: VueRefTarget<UseSplitterReturnValue>
  mod?: any
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
}

const defaultProps = {
  orientation: 'horizontal',
  lineSize: 2,
  withHandle: true,
  resetOnDoubleClick: true,
  step: 1,
  shiftStep: 10,
} as const

const varsResolver = createVarsResolver<any>((theme, { lineSize, handleColor }) => ({
  root: {
    '--splitter-line-size': rem(lineSize),
    '--splitter-handle-color': handleColor ? getThemeColor(handleColor, theme) : undefined,
  },
}))

function flattenChildren(children: VNode[]): VNode[] {
  return children.flatMap((child) =>
    typeof child.type === 'symbol' && Array.isArray(child.children)
      ? flattenChildren(child.children as VNode[])
      : [child],
  )
}

const SplitterBase = defineComponent({
  name: 'Splitter',
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
    sizes: { type: Array as PropType<number[]>, default: undefined },
    onSizeChange: { type: Function as PropType<(sizes: number[]) => void>, default: undefined },
    onResizeStart: { type: Function as PropType<(index: number) => void>, default: undefined },
    onResizeEnd: {
      type: Function as PropType<(index: number, sizes: number[]) => void>,
      default: undefined,
    },
    onCollapseChange: {
      type: Function as PropType<(index: number, collapsed: boolean) => void>,
      default: undefined,
    },
    redistribute: {
      type: [String, Function] as PropType<'nearest' | 'equal' | UseSplitterRedistributeFn>,
      default: undefined,
    },
    step: { type: Number, default: undefined },
    shiftStep: { type: Number, default: undefined },
    lineSize: { type: [String, Number] as PropType<string | number>, default: undefined },
    handleColor: { type: String, default: undefined },
    handleIcon: { type: null as unknown as PropType<VNodeChild>, default: undefined },
    withHandle: { type: Boolean, default: undefined },
    resetOnDoubleClick: { type: Boolean, default: undefined },
    splitterRef: {
      type: [Object, Function] as PropType<VueRefTarget<UseSplitterReturnValue>>,
      default: undefined,
    },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots, expose }) {
    const props = useProps('Splitter', defaultProps, rawProps)
    const { dir } = useDirection()
    const paneChildren = shallowRef<VNode[]>([])
    const panels = computed(() =>
      paneChildren.value.map((child) => ({
        defaultSize: Number(
          (child.props as any)?.defaultSize ?? (child.props as any)?.['default-size'] ?? 0,
        ),
        min: (child.props as any)?.min,
        max: (child.props as any)?.max,
        collapsible: (child.props as any)?.collapsible,
        collapseThreshold:
          (child.props as any)?.collapseThreshold ?? (child.props as any)?.['collapse-threshold'],
      })),
    )
    const splitter = useSplitter({
      panels,
      orientation: () => props.orientation ?? 'horizontal',
      sizes: () => props.sizes,
      onSizeChange: (sizes) => props.onSizeChange?.(sizes),
      onResizeStart: (index) => props.onResizeStart?.(index),
      onResizeEnd: (index, sizes) => props.onResizeEnd?.(index, sizes),
      onCollapseChange: (index, collapsed) => props.onCollapseChange?.(index, collapsed),
      redistribute: () => props.redistribute,
      step: () => props.step ?? 1,
      shiftStep: () => props.shiftStep ?? 10,
      dir: () => dir.value,
      resetOnDoubleClick: () => props.resetOnDoubleClick ?? true,
    })
    assignRef(props.splitterRef, splitter)
    expose(splitter)

    const getStyles = useStyles({
      name: 'Splitter',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      unstyled: props.unstyled,
      varsResolver,
    })

    provideSplitterContext({
      getStyles,
      get sizes() {
        return splitter.sizes
      },
      get collapsed() {
        return splitter.collapsed
      },
      get orientation() {
        return props.orientation ?? 'horizontal'
      },
    })

    return () => {
      paneChildren.value = flattenChildren((slots.default?.() ?? []) as VNode[])
      const items: VNode[] = []
      paneChildren.value.forEach((child, index) => {
        if (index > 0) {
          const handleIndex = index - 1
          items.push(
            h(
              Box,
              {
                key: `handle-${handleIndex}`,
                ...getStyles('handle'),
                ...splitter.getHandleProps(handleIndex),
              },
              () =>
                props.withHandle
                  ? h(
                      'div',
                      {
                        ...getStyles('thumb'),
                        'data-orientation': props.orientation,
                        'data-active': splitter.activeHandle === handleIndex || undefined,
                      },
                      [
                        props.handleIcon !== undefined
                          ? props.handleIcon
                          : h(
                              props.orientation === 'vertical'
                                ? GripHorizontalIcon
                                : GripVerticalIcon,
                            ),
                      ],
                    )
                  : undefined,
            ),
          )
        }
        items.push(cloneVNode(child, { key: `pane-${index}`, __index: index }, true))
      })

      return h(
        Box,
        {
          ...attrs,
          ref: splitter.setContainer,
          mod: [{ orientation: props.orientation }, props.mod],
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
        },
        () => items,
      )
    }
  },
})

export const Splitter = withBoxProps(
  Object.assign(SplitterBase, {
    classes,
    varsResolver,
    Pane: SplitterPane,
  }),
)
