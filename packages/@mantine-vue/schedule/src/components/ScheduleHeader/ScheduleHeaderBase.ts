import ScheduleHeaderBaseComponent, { createHeaderNavigation } from './ScheduleHeaderBase.vue'

/**
 * Header shared by every view. Internal building block: views expose the parts of it they
 * support through their own props rather than rendering it directly.
 */
export const ScheduleHeaderBase = ScheduleHeaderBaseComponent

export { createHeaderNavigation }

export type {
  ScheduleHeaderBaseEmits,
  ScheduleHeaderBaseProps,
  ScheduleHeaderBaseSlots,
  ScheduleHeaderControl,
  ScheduleHeaderNavigationHandlers,
} from './ScheduleHeaderBase.types'
