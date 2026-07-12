import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { withBoxProps, Box, hasNode, resolveNode, type MantineNode } from '../../../core'
import { UnstyledButton } from '../../UnstyledButton'
import { useAccordionContext } from '../Accordion.context'
import { useAccordionItemContext } from '../AccordionItem.context'

export type AccordionControlStylesNames = 'control' | 'chevron' | 'label' | 'itemTitle' | 'icon'

export interface AccordionControlSlots {
  default?: () => VNodeChild
  chevron?: () => VNodeChild
  icon?: () => VNodeChild
}

function createAccordionKeydownHandler(loop?: boolean, onKeydown?: (event: KeyboardEvent) => void) {
  return (event: KeyboardEvent) => {
    onKeydown?.(event)

    if (event.defaultPrevented || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) {
      return
    }

    const controls = Array.from(
      (event.currentTarget as HTMLElement)
        .closest('[data-accordion]')
        ?.querySelectorAll<HTMLElement>('[data-accordion-control]') ?? [],
    ).filter(
      (item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true',
    )
    const currentIndex = controls.indexOf(event.currentTarget as HTMLElement)

    if (currentIndex === -1) {
      return
    }

    const lastIndex = controls.length - 1
    const nextIndex =
      event.key === 'ArrowDown'
        ? currentIndex === lastIndex
          ? loop
            ? 0
            : currentIndex
          : currentIndex + 1
        : currentIndex === 0
          ? loop
            ? lastIndex
            : currentIndex
          : currentIndex - 1

    if (nextIndex !== currentIndex) {
      event.preventDefault()
      controls[nextIndex]?.focus()
    }
  }
}

export const AccordionControl = withBoxProps(
  defineComponent({
    name: 'AccordionControl',
    inheritAttrs: false,
    slots: Object as SlotsType<AccordionControlSlots>,
    props: {
      disabled: { type: Boolean, default: false },
      chevron: {
        type: null as unknown as PropType<MantineNode>,
        default: undefined,
      },
      icon: { type: null as unknown as PropType<MantineNode>, default: undefined },
      onClick: { type: Function as PropType<(event: MouseEvent) => void>, default: undefined },
      onKeydown: { type: Function as PropType<(event: KeyboardEvent) => void>, default: undefined },
      onKeyDown: { type: Function as PropType<(event: KeyboardEvent) => void>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
    },
    setup(props, { attrs, slots }) {
      const { value } = useAccordionItemContext()
      const ctx = useAccordionContext()

      const renderControl = () => {
        const isActive = ctx.isItemActive(value)
        const chevron =
          props.chevron !== undefined || slots.chevron
            ? resolveNode(props.chevron, slots.chevron)
            : typeof ctx.chevron === 'function'
              ? ctx.chevron()
              : ctx.chevron
        const icon = resolveNode(props.icon, slots.icon)

        return h(
          UnstyledButton,
          {
            ...attrs,
            ...ctx.getStyles('control', {
              className: attrs.class,
              style: attrs.style as any,
              classNames: props.classNames,
              styles: props.styles,
              props,
              variant: ctx.variant,
            }),
            unstyled: ctx.unstyled,
            variant: ctx.variant,
            mod: [
              { active: isActive, chevronPosition: ctx.chevronPosition, disabled: props.disabled },
              props.mod,
            ],
            'data-accordion-control': true,
            onClick: (event: MouseEvent) => {
              props.onClick?.(event)
              if (!props.disabled) {
                ctx.onChange(value)
              }
            },
            type: 'button',
            disabled: props.disabled,
            'aria-expanded': isActive,
            'aria-controls': ctx.getRegionId(value),
            id: ctx.getControlId(value),
            onKeydown: createAccordionKeydownHandler(ctx.loop, props.onKeydown ?? props.onKeyDown),
          },
          () => [
            h(
              Box,
              {
                component: 'span',
                mod: {
                  rotate: !ctx.disableChevronRotation && isActive,
                  position: ctx.chevronPosition,
                },
                ...ctx.getStyles('chevron', {
                  classNames: props.classNames,
                  styles: props.styles,
                  props,
                }),
              },
              () => chevron,
            ),
            h(
              'span',
              ctx.getStyles('label', {
                classNames: props.classNames,
                styles: props.styles,
                props,
              }),
              slots.default?.() as any,
            ),
            hasNode(icon)
              ? h(
                  Box,
                  {
                    component: 'span',
                    mod: { chevronPosition: ctx.chevronPosition },
                    ...ctx.getStyles('icon', {
                      classNames: props.classNames,
                      styles: props.styles,
                      props,
                    }),
                  },
                  () => icon,
                )
              : null,
          ],
        )
      }

      return () =>
        typeof ctx.order === 'number'
          ? h(
              `h${ctx.order}`,
              ctx.getStyles('itemTitle', {
                classNames: props.classNames,
                styles: props.styles,
                props,
              }),
              renderControl(),
            )
          : renderControl()
    },
  }),
)
