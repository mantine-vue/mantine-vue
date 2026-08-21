import dayjs from 'dayjs'
import { computed, onScopeDispose, type ComputedRef } from 'vue'
import type { EventSlots, RenderEvent, RenderEventBody } from '../component-props'
import type {
  DateLabelFormat,
  DateStringValue,
  DateTimeStringValue,
  ScheduleEventData,
} from '../types'
import { expandRecurringEvents, formatDate, toDateString } from '../utils'

/**
 * Resolves a schedule `radius` prop to a CSS value.
 *
 * Deliberately not `getRadius` from the core package: this accepts any CSS length
 * (`12px`, `1em`, `clamp(...)`) alongside the `theme.radius` keys, and treats a plain
 * number as pixels rather than rem.
 */
export function resolveScheduleRadius(radius: string | number | undefined): string | undefined {
  if (radius === undefined) {
    return undefined
  }

  if (typeof radius === 'number') {
    return `${radius}px`
  }

  return ['xs', 'sm', 'md', 'lg', 'xl'].includes(radius)
    ? `var(--mantine-radius-${radius})`
    : radius
}

/** A callback coalesced to one animation frame, with the pending frame cancellable. */
export interface RafThrottled<Args extends unknown[]> {
  (...args: Args): void

  /** Drops the pending frame. Call this the moment the gesture ends. */
  cancel: () => void
}

/**
 * Runs `callback` at most once per animation frame with the most recent arguments.
 *
 * Pointer and drag events fire far faster than the browser paints. Handling every one of them
 * means the schedule reads layout and re-renders several times per frame, which makes the drag
 * fall behind the pointer and keep catching up after it has stopped. Coalescing to one frame
 * keeps the work bounded, and `cancel` guarantees nothing lands after the drop.
 */
export function rafThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void,
): RafThrottled<Args> {
  let frame = 0
  let pending: Args | null = null

  const run = () => {
    frame = 0
    const args = pending
    pending = null

    if (args) {
      callback(...args)
    }
  }

  const throttled = ((...args: Args) => {
    pending = args

    if (frame === 0) {
      frame = requestAnimationFrame(run)
    }
  }) as RafThrottled<Args>

  throttled.cancel = () => {
    if (frame !== 0) {
      cancelAnimationFrame(frame)
    }

    frame = 0
    pending = null
  }

  onScopeDispose(throttled.cancel, true)

  return throttled
}

/**
 * Styles produced by `getStyles` for one selector. `any` matches the core signature: the value
 * is spread onto an element, where `class` and `style` accept every shape Vue supports.
 */
export type SelectorStyles = { class: any; style: any }

/**
 * Memoizes `getStyles(selector)` for selectors that take no per-element options.
 *
 * A view renders the same selector for hundreds of slots, and every `getStyles` call rebuilds
 * the class list and merges the resolved styles and CSS variables. Wrapping each selector in a
 * `computed` turns that into one evaluation per selector per change of the theme or the props,
 * instead of one per element per render — which is what a drag re-render is made of.
 */
export function useStaticStyles<Selector extends string>(
  getStyles: (selector: Selector) => SelectorStyles,
) {
  const cache = new Map<Selector, ComputedRef<SelectorStyles>>()

  return (selector: Selector): SelectorStyles => {
    let entry = cache.get(selector)

    if (!entry) {
      entry = computed(() => getStyles(selector))
      cache.set(selector, entry)
    }

    return entry.value
  }
}

/** Converts a `slotHeight` / `rowHeight` style prop to a CSS length. */
export function cssSize(value: string | number | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value
}

export function getExpandedEvents(
  events: ScheduleEventData[] | undefined,
  rangeStart: Date | string,
  rangeEnd: Date | string,
  expansionLimit: number,
) {
  return expandRecurringEvents({ events, rangeStart, rangeEnd, expansionLimit })
}

export function formatLabel(
  date: Date | string,
  locale: string | undefined,
  format: DateLabelFormat,
) {
  return formatDate({ date, locale: locale || 'en', format })
}

/** The `renderEvent` / `renderEventBody` pair a view hands down to `ScheduleEvent`. */
export interface EventRenderers {
  renderEvent?: RenderEvent
  renderEventBody?: RenderEventBody
}

/**
 * Folds the `event` / `eventBody` scoped slots into the equivalent render props, so a view
 * forwards a single object down to every `ScheduleEvent` it renders instead of re-declaring
 * the slots at each call site. Slots win over props, matching the rest of the library.
 */
export function resolveEventRenderers(props: EventRenderers, slots: EventSlots): EventRenderers {
  return {
    renderEvent: slots.event
      ? (event, renderProps) => slots.event!({ ...renderProps, event })
      : props.renderEvent,
    renderEventBody: slots.eventBody
      ? (event) => slots.eventBody!({ event })
      : props.renderEventBody,
  }
}

/** Reads the event referenced by a native drag payload, if the drag started inside a schedule. */
export function getDropEvent(
  events: ScheduleEventData[] | undefined,
  transfer: DataTransfer | null,
) {
  const raw = transfer?.getData('application/json')

  if (!raw) {
    return undefined
  }

  try {
    const data: unknown = JSON.parse(raw)

    if (typeof data !== 'object' || data === null || !('eventId' in data)) {
      return undefined
    }

    const eventId = (data as { eventId: unknown }).eventId

    if (typeof eventId !== 'string' && typeof eventId !== 'number') {
      return undefined
    }

    return events?.find((event) => String(event.id) === String(eventId))
  } catch {
    return undefined
  }
}

/**
 * Attribute the views put on their `ScrollArea` viewport so they can find it again without
 * depending on Mantine static classes, which a consumer can turn off.
 */
export const SCROLL_VIEWPORT_ATTRIBUTE = 'data-schedule-viewport'

/** Props spread onto the viewport of a view's `ScrollArea`. */
export const scheduleViewportProps = { [SCROLL_VIEWPORT_ATTRIBUTE]: '' }

/** Finds the `ScrollArea` viewport that contains `node`. */
export function getScrollAreaViewport(node: HTMLElement | null | undefined) {
  return node?.closest<HTMLElement>(`[${SCROLL_VIEWPORT_ATTRIBUTE}]`) ?? null
}

/**
 * Scrolls the viewport around `target` so that `target` sits at its start.
 *
 * The second pass runs a frame later because a `ScrollArea` viewport is still being laid out
 * on the tick it mounts, so the first offsets it reports are not final.
 */
export function scrollSlotIntoView(target: HTMLElement | null | undefined, axis: 'x' | 'y' = 'y') {
  const viewport = getScrollAreaViewport(target)

  if (!viewport || !target) {
    return
  }

  const scroll = () => {
    if (axis === 'x') {
      viewport.scrollLeft = target.offsetLeft
    } else {
      viewport.scrollTop = target.offsetTop
    }
  }

  scroll()
  requestAnimationFrame(scroll)
}

export function moveEventTo(event: ScheduleEventData, newStart: dayjs.ConfigType) {
  const start = dayjs(event.start)
  const duration = dayjs(event.end).diff(start, 'second')
  const nextStart = dayjs(newStart)

  return {
    eventId: event.id,
    newStart: nextStart.format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    newEnd: nextStart.add(duration, 'second').format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    event,
  }
}

export function moveEventToAllDay(event: ScheduleEventData, date: dayjs.ConfigType) {
  const dayStart = dayjs(date).startOf('day')
  const spanDays = Math.max(
    1,
    dayjs(event.end).startOf('day').diff(dayjs(event.start).startOf('day'), 'day'),
  )

  return {
    eventId: event.id,
    newStart: dayStart.format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    newEnd: dayStart.add(spanDays, 'day').format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    event,
  }
}

export function todayString(): DateStringValue {
  return toDateString(dayjs())
}
