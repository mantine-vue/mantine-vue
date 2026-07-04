import { defineComponent, h, type PropType, type Ref } from 'vue'
import {
  assignRef,
  useId,
  useScrollSpy,
  type UseScrollSpyHeadingData,
  type UseScrollSpyOptions,
} from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getFontSize,
  getRadius,
  rem,
  useProps,
  useStyles,
} from '../../core'
import { UnstyledButton } from '../UnstyledButton'
import classes from './TableOfContents.module.css'

export type TableOfContentsStylesNames = 'root' | 'control'
export type TableOfContentsVariant = 'filled' | 'light' | 'none'
export interface InitialTableOfContentsData {
  depth: number
  value: string
  id?: string
}

const defaultProps = {
  variant: 'filled',
  getControlProps: ({ data }: any) => ({ children: data.value }),
} as const

const varsResolver = createVarsResolver<any>(
  (theme, { color, size, variant, autoContrast, depthOffset, radius }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      variant: variant || 'filled',
      autoContrast,
    })
    return {
      root: {
        '--toc-bg': variant !== 'none' ? colors.background : undefined,
        '--toc-color': variant !== 'none' ? colors.color : undefined,
        '--toc-size': getFontSize(size),
        '--toc-depth-offset': rem(depthOffset),
        '--toc-radius': getRadius(radius),
      },
    }
  },
)

export const TableOfContents = withBoxProps(
  defineComponent({
    name: 'TableOfContents',
    inheritAttrs: false,
    props: {
      color: { type: String, default: undefined },
      size: { type: [String, Number] as PropType<string | number>, default: undefined },
      autoContrast: { type: Boolean, default: undefined },
      scrollSpyOptions: { type: Object as PropType<UseScrollSpyOptions>, default: undefined },
      initialData: { type: Array as PropType<InitialTableOfContentsData[]>, default: undefined },
      getControlProps: {
        type: Function as PropType<
          (payload: { active: boolean; data: UseScrollSpyHeadingData }) => Record<string, any>
        >,
        default: undefined,
      },
      minDepthToOffset: { type: Number, default: undefined },
      depthOffset: { type: [String, Number] as PropType<string | number>, default: undefined },
      radius: { type: [String, Number] as PropType<string | number>, default: undefined },
      reinitializeRef: { type: Object as PropType<Ref<(() => void) | null>>, default: undefined },
      variant: { type: String as PropType<TableOfContentsVariant>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs }) {
      const props = useProps('TableOfContents', defaultProps, rawProps)
      const id = useId()
      const spy = useScrollSpy(props.scrollSpyOptions ?? {})
      assignRef(props.reinitializeRef, spy.reinitialize)
      const getStyles = useStyles({
        name: 'TableOfContents',
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

      return () => {
        const headings = (
          spy.initialized.value ? spy.data.value : (props.initialData ?? [])
        ) as Array<UseScrollSpyHeadingData | InitialTableOfContentsData>
        return h(
          Box,
          {
            ...attrs,
            variant: props.variant,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          },
          () =>
            headings.map((data, index) => {
              const normalized = {
                ...data,
                id: data.id ?? `${id.value}-${index}`,
                getNode: 'getNode' in data ? data.getNode : () => null as any,
              } as UseScrollSpyHeadingData
              const controlProps =
                props.getControlProps?.({ active: index === spy.active.value, data: normalized }) ??
                {}
              const { children, ...restControlProps } = controlProps
              return h(
                UnstyledButton,
                {
                  ...restControlProps,
                  key: normalized.id,
                  variant: props.variant,
                  'data-active': index === spy.active.value || undefined,
                  style: [
                    { '--depth-offset': data.depth - (props.minDepthToOffset ?? 1) },
                    controlProps.style,
                    getStyles('control').style,
                  ],
                  class: [getStyles('control').class, controlProps.class, controlProps.className],
                },
                () => (typeof children === 'function' ? children() : children),
              )
            }),
        )
      }
    },
  }),
)

Object.assign(TableOfContents, { classes, varsResolver })
