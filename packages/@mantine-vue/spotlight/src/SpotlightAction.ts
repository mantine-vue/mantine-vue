import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  Box,
  Highlight,
  UnstyledButton,
  hasNode,
  resolveNode,
  type MantineNode,
  type SectionSlots,
  useProps,
} from '@mantine-vue/core'
import { useSpotlightContext } from './Spotlight.context'
import { spotlightActions } from './spotlight.store'
import classes from './Spotlight.module.css'

export type SpotlightActionStylesNames =
  | 'action'
  | 'actionLabel'
  | 'actionDescription'
  | 'actionSection'
  | 'actionBody'

export interface SpotlightActionProps {
  label?: string
  description?: string
  leftSection?: MantineNode
  rightSection?: MantineNode
  dimmedSections?: boolean
  highlightQuery?: boolean
  highlightColor?: string
  closeSpotlightOnTrigger?: boolean
  keywords?: string | string[]
  classNames?: Record<string, any>
  styles?: Record<string, any>
  vars?: Record<string, any>
  [key: string]: any
}

const defaultProps = {
  dimmedSections: true,
  highlightQuery: false,
} satisfies Partial<SpotlightActionProps>

export const SpotlightAction = defineComponent({
  name: 'SpotlightAction',
  inheritAttrs: false,
  slots: Object as SlotsType<SectionSlots & { default?: () => VNodeChild }>,
  props: {
    label: { type: String, default: undefined },
    description: { type: String, default: undefined },
    leftSection: { type: null as unknown as PropType<MantineNode>, default: undefined },
    rightSection: { type: null as unknown as PropType<MantineNode>, default: undefined },
    dimmedSections: { type: Boolean, default: undefined },
    highlightQuery: { type: Boolean, default: undefined },
    highlightColor: { type: String, default: undefined },
    closeSpotlightOnTrigger: { type: Boolean, default: undefined },
    keywords: { type: [String, Array] as PropType<string | string[]>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<SpotlightActionProps>('SpotlightAction', defaultProps, rawProps as any)
    const ctx = useSpotlightContext()

    return () => {
      const stylesApi = { classNames: props.classNames, styles: props.styles }
      const leftSection = resolveNode(props.leftSection, slots.leftSection)
      const rightSection = resolveNode(props.rightSection, slots.rightSection)
      const labelNode =
        props.highlightQuery && typeof props.label === 'string'
          ? h(
              Highlight,
              {
                component: 'span',
                highlight: ctx.query,
                color: props.highlightColor,
                ...ctx.getStyles('actionLabel', stylesApi),
              },
              () => props.label,
            )
          : h('span', ctx.getStyles('actionLabel', stylesApi), props.label)

      return h(
        UnstyledButton,
        {
          ...attrs,
          'data-action': true,
          ...ctx.getStyles('action', {
            className: attrs.class,
            style: attrs.style,
            ...stylesApi,
          }),
          onMousedown: (event: MouseEvent) => {
            event.preventDefault()
            ;(attrs.onMousedown as ((event: MouseEvent) => void) | undefined)?.(event)
          },
          onClick: (event: MouseEvent) => {
            ;(attrs.onClick as ((event: MouseEvent) => void) | undefined)?.(event)

            if (props.closeSpotlightOnTrigger ?? ctx.closeOnActionTrigger) {
              spotlightActions.close(ctx.store)
            }
          },
          tabindex: -1,
        },
        () =>
          slots.default?.() ?? [
            hasNode(leftSection)
              ? h(
                  Box,
                  {
                    component: 'span',
                    mod: { position: 'left', dimmed: props.dimmedSections },
                    ...ctx.getStyles('actionSection', stylesApi),
                  },
                  () => leftSection,
                )
              : null,
            h('span', ctx.getStyles('actionBody', stylesApi), [
              labelNode,
              h('span', ctx.getStyles('actionDescription', stylesApi), props.description),
            ]),
            hasNode(rightSection)
              ? h(
                  Box,
                  {
                    component: 'span',
                    mod: { position: 'right', dimmed: props.dimmedSections },
                    ...ctx.getStyles('actionSection', stylesApi),
                  },
                  () => rightSection,
                )
              : null,
          ],
      )
    }
  },
})

Object.assign(SpotlightAction, { classes })
