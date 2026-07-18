import { defineComponent, h, type SlotsType, type VNodeChild } from 'vue'
import { useDirection, useProps } from '../../../core'
import { PopoverTarget } from '../../Popover'
import { UnstyledButton } from '../../UnstyledButton'
import { useMenubarContext, useMenubarMenuContext } from '../Menubar.context'

export interface MenubarTargetProps {
  /** Key of the prop used to get element ref, useful for forwarding refs to custom components @default 'ref' */
  refProp?: string

  /** Disables the target button */
  disabled?: boolean

  [key: string]: any
}

export interface MenubarTargetSlots {
  default?: () => VNodeChild
}

const defaultProps = {
  refProp: 'ref',
} satisfies Partial<MenubarTargetProps>

function isPrintableKey(event: KeyboardEvent) {
  return (
    event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey
  )
}

function getTargetLabel(node: HTMLElement) {
  return (node.textContent ?? '').trim().toLowerCase()
}

function runComposed(userHandler: any, event: Event, internal: (event: any) => void) {
  if (Array.isArray(userHandler)) {
    userHandler.forEach((fn) => fn?.(event))
  } else {
    userHandler?.(event)
  }
  if (!event.defaultPrevented) {
    internal(event)
  }
}

export const MenubarTarget = defineComponent({
  name: 'MenubarTarget',
  inheritAttrs: false,
  slots: Object as SlotsType<MenubarTargetSlots>,
  props: {
    refProp: { type: String, default: 'ref' },
    disabled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('MenubarTarget', defaultProps, rawProps)
    const ctx = useMenubarContext()
    const menuCtx = useMenubarMenuContext()
    const { dir } = useDirection()

    const moveToAdjacent = (direction: 1 | -1) => {
      const nextIndex = ctx.getAdjacentIndex(menuCtx.index, direction)
      ctx.setActiveIndex(nextIndex)
      ctx.focusTarget(nextIndex)
      if (ctx.openIndex !== null) {
        ctx.openMenu(nextIndex, 'click')
      }
    }

    const openAndFocusItem = (position: 'first' | 'last') => {
      ctx.openMenu(menuCtx.index, 'click')
      ctx.setActiveIndex(menuCtx.index)
      ctx.focusMenuItem(menuCtx.index, position)
    }

    const typeAhead = (event: KeyboardEvent) => {
      const targets = ctx.getTargets()
      if (targets.length === 0) {
        return
      }
      const char = event.key.toLowerCase()
      for (let offset = 1; offset <= targets.length; offset += 1) {
        const index = (menuCtx.index + offset) % targets.length
        const node = targets[index]
        if (
          node &&
          !node.disabled &&
          !node.hasAttribute('data-disabled') &&
          getTargetLabel(node).startsWith(char)
        ) {
          event.preventDefault()
          ctx.setActiveIndex(index)
          node.focus()
          if (ctx.openIndex !== null) {
            ctx.openMenu(index, 'click')
          }
          break
        }
      }
    }

    return () => {
      const dataDisabled = (attrs as any)['data-disabled']
      const hasDataDisabled = dataDisabled != null && dataDisabled !== false
      const isDisabled = props.disabled || hasDataDisabled
      const isActive = ctx.activeIndex === menuCtx.index
      // Before menu indexes resolve from the DOM, keep the target focusable so keyboard
      // users can always enter the menubar.
      const isUnresolvedTabStop = menuCtx.index === -1 && !isDisabled

      const handleClick = (event: MouseEvent) =>
        runComposed((attrs as any).onClick, event, () => {
          if (isDisabled) {
            return
          }
          if (ctx.openIndex === menuCtx.index && ctx.getOpenSource() !== 'hover') {
            ctx.closeMenu()
          } else {
            ctx.openMenu(menuCtx.index, 'click')
            ctx.setActiveIndex(menuCtx.index)
          }
        })

      const handleMouseEnter = (event: MouseEvent) =>
        runComposed((attrs as any).onMouseenter, event, () => {
          if (isDisabled) {
            return
          }
          ctx.cancelClose()
          if (ctx.trigger === 'hover') {
            ctx.openMenu(menuCtx.index, 'hover')
            ctx.setActiveIndex(menuCtx.index)
          } else if (ctx.openIndex !== null && ctx.openIndex !== menuCtx.index) {
            // Hover-switching with trigger="click" keeps 'click' as the open source so the
            // next click on the target closes the menu (desktop application pattern).
            ctx.openMenu(menuCtx.index, 'click')
            ctx.setActiveIndex(menuCtx.index)
          }
        })

      const handleMouseLeave = (event: MouseEvent) =>
        runComposed((attrs as any).onMouseleave, event, () => {
          if (ctx.trigger === 'hover') {
            ctx.scheduleClose()
          }
        })

      const handleFocus = (event: FocusEvent) =>
        runComposed((attrs as any).onFocus, event, () => ctx.setActiveIndex(menuCtx.index))

      const handleKeydown = (event: KeyboardEvent) =>
        runComposed((attrs as any).onKeydown, event, () => {
          if (isDisabled) {
            return
          }
          const forwardKey = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
          const backKey = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'

          if (event.key === forwardKey) {
            event.preventDefault()
            moveToAdjacent(1)
          } else if (event.key === backKey) {
            event.preventDefault()
            moveToAdjacent(-1)
          } else if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openAndFocusItem('first')
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            openAndFocusItem('last')
          } else if (event.key === 'Home') {
            event.preventDefault()
            const enabled = ctx.getEnabledIndexes()
            if (enabled.length > 0) {
              ctx.setActiveIndex(enabled[0])
              ctx.focusTarget(enabled[0])
            }
          } else if (event.key === 'End') {
            event.preventDefault()
            const enabled = ctx.getEnabledIndexes()
            if (enabled.length > 0) {
              const last = enabled[enabled.length - 1]
              ctx.setActiveIndex(last)
              ctx.focusTarget(last)
            }
          } else if (event.key === 'Escape') {
            if (menuCtx.opened) {
              ctx.closeMenu()
            }
          } else if (event.key === 'Tab') {
            if (menuCtx.opened) {
              ctx.closeMenu()
            }
          } else if (isPrintableKey(event)) {
            typeAhead(event)
          }
        })

      const rest: Record<string, any> = { ...attrs }
      delete rest.onClick
      delete rest.onMouseenter
      delete rest.onMouseleave
      delete rest.onFocus
      delete rest.onKeydown
      delete rest.class
      delete rest.style

      return h(PopoverTarget, { refProp: props.refProp, popupType: 'menu' }, () =>
        h(
          UnstyledButton,
          {
            ...rest,
            unstyled: ctx.unstyled,
            role: 'menuitem',
            tabindex: isActive || isUnresolvedTabStop ? 0 : -1,
            disabled: props.disabled,
            'data-menubar-target': '',
            'data-menubar-id': menuCtx.id,
            'data-disabled': hasDataDisabled || undefined,
            'data-expanded': menuCtx.opened || undefined,
            'data-mantine-stop-propagation': menuCtx.opened || undefined,
            ...ctx.getStyles('target', {
              className: (attrs as any).class,
              style: (attrs as any).style,
            }),
            onClick: handleClick,
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave,
            onFocus: handleFocus,
            onKeydown: handleKeydown,
          },
          () => slots.default?.(),
        ),
      )
    }
  },
})
