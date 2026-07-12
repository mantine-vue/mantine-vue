import { computed, defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { useElementSize, useId, useUncontrolled } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  hasNode,
  rem,
  resolveNode,
  type MantineNode,
  useProps,
  useStyles,
} from '../../core'
import { Anchor } from '../Anchor'
import classes from './Spoiler.module.css'

export type SpoilerStylesNames = 'root' | 'control' | 'content'

export interface SpoilerSlots {
  default?: () => VNodeChild
  showLabel?: () => VNodeChild
  hideLabel?: () => VNodeChild
}

const defaultProps = {
  maxHeight: 100,
  defaultExpanded: false,
} as const

const varsResolver = createVarsResolver<any>((_, { transitionDuration }) => ({
  root: {
    '--spoiler-transition-duration':
      transitionDuration !== undefined ? `${transitionDuration}ms` : undefined,
  },
}))

export const Spoiler = withBoxProps(
  defineComponent({
    name: 'Spoiler',
    inheritAttrs: false,
    slots: Object as SlotsType<SpoilerSlots>,
    props: {
      maxHeight: { type: Number, default: undefined },
      showLabel: { type: null as unknown as PropType<MantineNode>, default: undefined },
      hideLabel: { type: null as unknown as PropType<MantineNode>, default: undefined },
      defaultExpanded: { type: Boolean, default: undefined },
      expanded: { type: Boolean, default: undefined },
      onExpandedChange: {
        type: Function as PropType<(expanded: boolean) => void>,
        default: undefined,
      },
      transitionDuration: { type: Number, default: undefined },
      showAriaLabel: { type: String, default: undefined },
      hideAriaLabel: { type: String, default: undefined },
      id: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Spoiler', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Spoiler',
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
      const id = useId(props.id)
      const [show, setShowState] = useUncontrolled<boolean>({
        value: computed(() => props.expanded),
        defaultValue: props.defaultExpanded,
        finalValue: false,
        onChange: (value) => props.onExpandedChange?.(value),
      })
      const { ref: contentRef, height } = useElementSize<HTMLDivElement>()

      return () => {
        const regionId = `${id.value}-region`
        const currentLabel = show.value
          ? resolveNode(props.hideLabel, slots.hideLabel)
          : resolveNode(props.showLabel, slots.showLabel)
        const maxHeight = props.maxHeight ?? defaultProps.maxHeight
        const hasSpoiler = hasNode(currentLabel) && maxHeight < height.value
        const ariaLabel = show.value ? props.hideAriaLabel : props.showAriaLabel

        return h(
          Box,
          {
            ...attrs,
            id: id.value,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
            mod: { hasSpoiler },
          },
          () => [
            hasSpoiler
              ? h(
                  Anchor,
                  {
                    component: 'button',
                    type: 'button',
                    onClick: () => setShowState(!show.value),
                    'aria-expanded': show.value,
                    'aria-controls': regionId,
                    'aria-label': ariaLabel,
                    ...getStyles('control'),
                  },
                  () => currentLabel,
                )
              : null,
            h(
              'div',
              {
                ...getStyles('content', {
                  style: {
                    maxHeight: !show.value
                      ? rem(maxHeight)
                      : height.value
                        ? rem(height.value)
                        : undefined,
                  },
                }),
                'data-reduce-motion': '',
                role: 'region',
                id: regionId,
              },
              [h('div', { ref: contentRef }, slots.default?.() as any)],
            ),
          ],
        )
      }
    },
  }),
)

Object.assign(Spoiler, { classes, varsResolver })
