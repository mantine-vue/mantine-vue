import { defineComponent, h, type SlotsType, type VNodeChild } from 'vue'
import { useDirection } from '../../../core'
import { MenuDropdown } from '../../Menu'
import { useMenubarContext, useMenubarMenuContext } from '../Menubar.context'

export interface MenubarDropdownProps {
  [key: string]: any
}

export interface MenubarDropdownSlots {
  default?: () => VNodeChild
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

export const MenubarDropdown = defineComponent({
  name: 'MenubarDropdown',
  inheritAttrs: false,
  slots: Object as SlotsType<MenubarDropdownSlots>,
  setup(_, { attrs, slots }) {
    const ctx = useMenubarContext()
    const menuCtx = useMenubarMenuContext()
    const { dir } = useDirection()

    const switchToAdjacent = (direction: 1 | -1) => {
      const nextIndex = ctx.getAdjacentIndex(menuCtx.index, direction)
      if (nextIndex !== menuCtx.index) {
        ctx.setActiveIndex(nextIndex)
        ctx.openMenu(nextIndex, 'click')
        ctx.focusMenuItem(nextIndex, 'first')
      }
    }

    const handleKeydown = (event: KeyboardEvent) =>
      runComposed((attrs as any).onKeydown, event, () => {
        const target = event.target as HTMLElement

        // Tabbing out of an open menu dismisses it. Focus is moved to the trigger first so
        // the browser continues the tab sequence from the menubar position.
        if (event.key === 'Tab') {
          ctx.focusTarget(menuCtx.index)
          ctx.closeMenu()
          return
        }

        // Only handle navigation when focus is on a top-level item of this dropdown; submenu
        // items keep ArrowLeft/ArrowRight for their own open/close behavior.
        if (target.closest('[data-menu-dropdown]') !== event.currentTarget) {
          return
        }

        const forwardKey = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
        const backKey = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'

        if (event.key === forwardKey) {
          if (target.closest('[data-menu-item]')?.hasAttribute('data-sub-menu-item')) {
            return
          }
          event.preventDefault()
          switchToAdjacent(1)
        } else if (event.key === backKey) {
          event.preventDefault()
          switchToAdjacent(-1)
        } else if (event.key === 'Escape') {
          const index = menuCtx.index
          ctx.setActiveIndex(index)
          window.setTimeout(() => ctx.focusTarget(index), 0)
        }
      })

    const handleMouseEnter = (event: MouseEvent) =>
      runComposed((attrs as any).onMouseenter, event, () => ctx.cancelClose())

    const handleMouseLeave = (event: MouseEvent) =>
      runComposed((attrs as any).onMouseleave, event, () => {
        if (ctx.trigger === 'hover') {
          ctx.scheduleClose()
        }
      })

    return () => {
      const rest: Record<string, any> = { ...attrs }
      delete rest.onKeydown
      delete rest.onMouseenter
      delete rest.onMouseleave
      return h(
        MenuDropdown,
        {
          ...rest,
          'data-menubar-dropdown': ctx.id,
          'data-mantine-stop-propagation': '',
          onKeydown: handleKeydown,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
        },
        slots,
      )
    }
  },
})
