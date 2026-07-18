import { computed, defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { provideMenubarMenuContext, useMenubarContext } from '../Menubar.context'
import { Menu } from '../../Menu/Menu'

export interface MenubarMenuProps {
  /** Props passed down to the underlying transition */
  transitionProps?: { duration?: number; exitDuration?: number; [key: string]: any }
  [key: string]: any
}

export interface MenubarMenuSlots {
  default?: () => VNodeChild
}

const DEFAULT_TRANSITION_DURATION = 150

export const MenubarMenu = defineComponent({
  name: 'MenubarMenu',
  inheritAttrs: false,
  slots: Object as SlotsType<MenubarMenuSlots>,
  props: {
    transitionProps: {
      type: Object as PropType<{ duration?: number; exitDuration?: number; [key: string]: any }>,
      default: undefined,
    },
    __index: { type: Number, default: -1 },
  },
  setup(props, { attrs, slots }) {
    const ctx = useMenubarContext()
    const id = useId()

    const index = computed(() => props.__index)

    const opened = computed(
      () => ctx.openIndex !== null && index.value !== -1 && ctx.openIndex === index.value,
    )

    provideMenubarMenuContext({
      get id() {
        return id.value
      },
      get index() {
        return index.value
      },
      get opened() {
        return opened.value
      },
    })

    const handleChange = (value: boolean) => {
      if (value) {
        ctx.openMenu(index.value, 'click')
        ctx.setActiveIndex(index.value)
      } else {
        ctx.closeMenu()
      }
    }

    return () => {
      // Transitions should only play when the whole bar opens or closes, not when switching
      // between sibling menus while one is already open.
      const baseDuration = props.transitionProps?.duration ?? DEFAULT_TRANSITION_DURATION
      const baseExitDuration = props.transitionProps?.exitDuration ?? baseDuration
      const animateEnter = ctx.getPreviousOpenIndex() === null
      const animateExit = ctx.openIndex === null
      const resolvedTransitionProps = {
        ...props.transitionProps,
        duration: animateEnter ? baseDuration : 0,
        exitDuration: animateExit ? baseExitDuration : 0,
      }

      return h(
        Menu,
        {
          position: ctx.position,
          loop: ctx.loop,
          unstyled: ctx.unstyled,
          menuItemTabIndex: -1,
          trapFocus: false,
          ...attrs,
          transitionProps: resolvedTransitionProps,
          opened: opened.value,
          onChange: handleChange,
          trigger: 'click',
          returnFocus: false,
        },
        slots,
      )
    }
  },
})
