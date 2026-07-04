import { createSafeContext } from '../../core'

export interface TimelineContextValue {
  getStyles: (selector: string, options?: { className?: any; style?: any; props?: any }) => any
}

export const [provideTimelineContext, useTimelineContext] = createSafeContext<TimelineContextValue>(
  'Timeline component was not found in tree',
)
