import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSpacing,
  hasNode,
  resolveNode,
  type MantineColor,
  type MantineNode,
  type MantineSpacing,
  type SectionSlots,
  useStyles,
} from '../../core'
import { AccordionChevron } from '../Accordion'
import { Collapse } from '../Collapse'
import { UnstyledButton } from '../UnstyledButton'
import classes from './NavLink.module.css'

export type NavLinkStylesNames =
  | 'root'
  | 'section'
  | 'body'
  | 'label'
  | 'description'
  | 'chevron'
  | 'collapse'
  | 'children'
export type NavLinkVariant = 'filled' | 'light' | 'subtle'

export interface NavLinkSlots extends SectionSlots {
  default?: () => VNodeChild
  label?: () => VNodeChild
  description?: () => VNodeChild
}

const varsResolver = createVarsResolver<any>(
  (theme, { variant, color, childrenOffset, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      variant: variant || 'light',
      autoContrast,
    })

    return {
      root: {
        '--nl-bg': color || variant ? colors.background : undefined,
        '--nl-hover': color || variant ? colors.hover : undefined,
        '--nl-color': color || variant ? colors.color : undefined,
      },
      children: {
        '--nl-offset': getSpacing(childrenOffset),
      },
    }
  },
)

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

export const NavLink = withBoxProps(
  defineComponent({
    name: 'NavLink',
    inheritAttrs: false,
    slots: Object as SlotsType<NavLinkSlots>,
    props: {
      component: { type: String, default: 'a' },
      label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      description: {
        type: null as unknown as PropType<MantineNode>,
        default: undefined,
      },
      leftSection: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      rightSection: {
        type: null as unknown as PropType<MantineNode>,
        default: undefined,
      },
      active: { type: Boolean, default: false },
      color: { type: String as PropType<MantineColor>, default: undefined },
      noWrap: { type: Boolean, default: false },
      opened: { type: Boolean, default: undefined },
      defaultOpened: { type: Boolean, default: undefined },
      onChange: { type: Function as PropType<(opened: boolean) => void>, default: undefined },
      disableRightSectionRotation: { type: Boolean, default: false },
      childrenOffset: { type: [String, Number] as PropType<MantineSpacing>, default: 'lg' },
      disabled: { type: Boolean, default: false },
      autoContrast: { type: Boolean, default: undefined },
      keepMounted: { type: Boolean, default: undefined },
      variant: { type: String as PropType<NavLinkVariant>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      const [opened, setOpened] = useUncontrolled<boolean>({
        value: () => props.opened,
        defaultValue: props.defaultOpened,
        finalValue: false,
        onChange: (value) => props.onChange?.(value),
      })
      const getStyles = useStyles({
        name: 'NavLink',
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

      return () => {
        const children = slots.default?.() ?? []
        const withChildren = hasNode(children)
        const rightSection = resolveNode(props.rightSection, slots.rightSection)
        const leftSection = resolveNode(props.leftSection, slots.leftSection)

        const toggle = (event: Event) => {
          if (withChildren) {
            event.preventDefault()
            setOpened(!opened.value)
          }
        }

        return [
          h(
            UnstyledButton,
            {
              ...attrs,
              ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
              component: props.component,
              unstyled: props.unstyled,
              variant: props.variant,
              mod: [
                { disabled: props.disabled, active: props.active, expanded: opened.value },
                props.mod,
              ],
              onClick: (event: MouseEvent) => {
                callHandler((attrs as any).onClick, event)
                toggle(event)
              },
              onKeydown: (event: KeyboardEvent) => {
                callHandler((attrs as any).onKeydown ?? (attrs as any).onKeyDown, event)

                if (event.code === 'Space' && withChildren) {
                  toggle(event)
                }
              },
            },
            () => [
              hasNode(leftSection)
                ? h(
                    Box,
                    { component: 'span', ...getStyles('section'), mod: { position: 'left' } },
                    () => renderContent(leftSection),
                  )
                : null,
              h(Box, { ...getStyles('body'), mod: { 'no-wrap': props.noWrap } }, () => [
                h(Box, { component: 'span', ...getStyles('label') }, () =>
                  renderContent(props.label ?? slots.label?.()),
                ),
                props.description || slots.description
                  ? h(
                      Box,
                      {
                        component: 'span',
                        mod: { active: props.active },
                        ...getStyles('description'),
                      },
                      () => renderContent(props.description ?? slots.description?.()),
                    )
                  : null,
              ]),
              withChildren || hasNode(rightSection)
                ? h(
                    Box,
                    {
                      ...getStyles('section'),
                      component: 'span',
                      mod: {
                        rotate: opened.value && !props.disableRightSectionRotation,
                        position: 'right',
                      },
                    },
                    () =>
                      withChildren
                        ? hasNode(rightSection)
                          ? renderContent(rightSection)
                          : h(AccordionChevron, getStyles('chevron'))
                        : renderContent(rightSection),
                  )
                : null,
            ],
          ),
          withChildren
            ? h(
                Collapse,
                {
                  expanded: opened.value,
                  keepMounted: props.keepMounted,
                  ...getStyles('collapse'),
                },
                () => h('div', getStyles('children'), children),
              )
            : null,
        ]
      }
    },
  }),
)

Object.assign(NavLink, { classes, varsResolver })
