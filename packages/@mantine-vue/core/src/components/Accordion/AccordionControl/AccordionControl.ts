import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { UnstyledButton } from '../../UnstyledButton'
import { useAccordionContext } from '../Accordion.context'
import { useAccordionItemContext } from '../AccordionItem.context'

export type AccordionControlStylesNames = 'control' | 'chevron' | 'label' | 'itemTitle' | 'icon'

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
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
    props: {
      disabled: { type: Boolean, default: false },
      chevron: {
        type: [String, Number, Object, Function, null] as PropType<any>,
        default: undefined,
      },
      icon: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
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
              () => renderContent(props.chevron === undefined ? ctx.chevron : props.chevron),
            ),
            h(
              'span',
              ctx.getStyles('label', {
                classNames: props.classNames,
                styles: props.styles,
                props,
              }),
              slots.default?.(),
            ),
            props.icon
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
                  () => renderContent(props.icon),
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
