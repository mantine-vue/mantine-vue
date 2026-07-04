import { defineComponent, h, type PropType } from 'vue'
import { Box, Highlight, UnstyledButton, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from './Spotlight.context'
import { spotlightActions } from './spotlight.store'
import { renderContent } from './style-api'
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
  leftSection?: any
  rightSection?: any
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
  props: {
    label: { type: String, default: undefined },
    description: { type: String, default: undefined },
    leftSection: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    rightSection: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
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
            props.leftSection
              ? h(
                  Box,
                  {
                    component: 'span',
                    mod: { position: 'left', dimmed: props.dimmedSections },
                    ...ctx.getStyles('actionSection', stylesApi),
                  },
                  () => renderContent(props.leftSection),
                )
              : null,
            h('span', ctx.getStyles('actionBody', stylesApi), [
              labelNode,
              h('span', ctx.getStyles('actionDescription', stylesApi), props.description),
            ]),
            props.rightSection
              ? h(
                  Box,
                  {
                    component: 'span',
                    mod: { position: 'right', dimmed: props.dimmedSections },
                    ...ctx.getStyles('actionSection', stylesApi),
                  },
                  () => renderContent(props.rightSection),
                )
              : null,
          ],
      )
    }
  },
})

Object.assign(SpotlightAction, { classes })
