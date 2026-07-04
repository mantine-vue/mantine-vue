import { defineComponent, h } from 'vue'
import { PopoverDropdown } from '../../Popover'
import { useHoverCardContext } from '../HoverCard.context'
function call(handler: any, event: Event) {
  if (Array.isArray(handler)) handler.forEach((fn) => fn?.(event))
  else handler?.(event)
}
export const HoverCardDropdown = defineComponent({
  name: 'HoverCardDropdown',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const ctx = useHoverCardContext()
    return () =>
      h(
        PopoverDropdown,
        {
          ...attrs,
          onMouseenter: (event: MouseEvent) => {
            call((attrs as any).onMouseenter ?? (attrs as any).onMouseEnter, event)
            ctx.openDropdown()
          },
          onMouseleave: (event: MouseEvent) => {
            call((attrs as any).onMouseleave ?? (attrs as any).onMouseLeave, event)
            ctx.closeDropdown()
          },
        },
        slots,
      )
  },
})
export interface HoverCardDropdownProps {
  [key: string]: any
}
