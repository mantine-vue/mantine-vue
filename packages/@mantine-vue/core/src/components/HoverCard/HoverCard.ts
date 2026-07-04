import { defineComponent, h, type PropType } from 'vue'
import { Popover, type PopoverProps } from '../Popover'
import { provideHoverCardContext } from './HoverCard.context'
import { HoverCardDropdown } from './HoverCardDropdown/HoverCardDropdown'
import { HoverCardGroup } from './HoverCardGroup/HoverCardGroup'
import { HoverCardTarget } from './HoverCardTarget/HoverCardTarget'
import { useHoverCard } from './use-hover-card'

export interface HoverCardProps extends Omit<PopoverProps, 'opened' | 'onChange'> {
  initiallyOpened?: boolean
  onOpen?: () => void
  onClose?: () => void
  openDelay?: number
  closeDelay?: number
}
const HoverCardBase = defineComponent({
  name: 'HoverCard',
  inheritAttrs: false,
  props: {
    initiallyOpened: Boolean,
    onOpen: Function as PropType<() => void>,
    onClose: Function as PropType<() => void>,
    openDelay: { type: Number, default: 0 },
    closeDelay: { type: Number, default: 150 },
  },
  setup(props, { attrs, slots }) {
    const state = useHoverCard({
      openDelay: props.openDelay,
      closeDelay: props.closeDelay,
      defaultOpened: props.initiallyOpened,
      onOpen: props.onOpen,
      onClose: props.onClose,
    })
    provideHoverCardContext({
      openDropdown: state.openDropdown,
      closeDropdown: state.closeDropdown,
    })
    return () =>
      h(Popover, { ...attrs, opened: state.opened.value, __staticSelector: 'HoverCard' }, slots)
  },
})
export const HoverCard = Object.assign(HoverCardBase, {
  Target: HoverCardTarget,
  Dropdown: HoverCardDropdown,
  Group: HoverCardGroup,
})
