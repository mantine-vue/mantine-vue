import { defineComponent, h, nextTick, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, UnstyledButton } from '@mantine-vue/core'
import { describe, expect, it, vi } from 'vitest'
import {
  DayView,
  CurrentTimeIndicator,
  HeaderControl,
  MobileMonthView,
  MonthYearSelect,
  MonthView,
  ResourcesDayView,
  ResourcesMonthView,
  ResourcesWeekView,
  Schedule,
  ScheduleEvent,
  WeekView,
  YearView,
} from '..'
import type { ScheduleEventData } from '../types'

const resources = [
  { id: 'room-a', label: 'Room A' },
  { id: 'room-b', label: 'Room B' },
]

const events: ScheduleEventData[] = [
  {
    id: 1,
    title: 'Planning',
    start: '2026-07-15 09:00:00',
    end: '2026-07-15 10:00:00',
    color: 'blue',
  },
]

function mountWithProvider(component: Component, props: Record<string, unknown>) {
  return mount(
    defineComponent({
      setup: () => () => h(MantineProvider, null, () => h(component, props)),
    }),
  )
}

function mountWithProviderAttached(component: Component, props: Record<string, unknown>) {
  return mount(
    defineComponent({
      setup: () => () => h(MantineProvider, null, () => h(component, props)),
    }),
    { attachTo: document.body },
  )
}

function createDataTransfer(): DataTransfer {
  const data = new Map<string, string>()
  const types: string[] = []
  return {
    dropEffect: 'none',
    effectAllowed: 'uninitialized',
    files: [] as unknown as FileList,
    items: [] as unknown as DataTransferItemList,
    types,
    clearData: (format?: string) => (format ? data.delete(format) : data.clear()),
    getData: (format: string) => data.get(format) || '',
    setData: (format: string, value: string) => {
      data.set(format, value)
      if (!types.includes(format)) types.push(format)
    },
    setDragImage: () => {},
  } as DataTransfer
}

function dispatchDragEvent(
  element: Element,
  type: string,
  dataTransfer: DataTransfer,
  clientY = 0,
  clientX = 0,
) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientY, clientX })
  Object.defineProperty(event, 'dataTransfer', { value: dataTransfer })
  element.dispatchEvent(event)
}

function clickWithPointer(element: HTMLElement) {
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }))
  element.click()
}

function pressKey(element: HTMLElement, key: string) {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
}

describe('@mantine-vue/schedule', () => {
  it('uses Mantine core UnstyledButton for interactive schedule controls', () => {
    const header = mountWithProvider(HeaderControl, {})
    const event = mountWithProvider(ScheduleEvent, { event: events[0] })

    expect(header.findComponent(UnstyledButton).exists()).toBe(true)
    expect(event.findComponent(UnstyledButton).exists()).toBe(true)
    expect(event.findAll('button')).toHaveLength(1)
  })

  it('keeps the month/year dropdown open after month and year selection', async () => {
    const onMonthChange = vi.fn()
    const onYearChange = vi.fn()
    const wrapper = mountWithProvider(MonthYearSelect, {
      monthValue: 6,
      yearValue: 2026,
      startYear: 2025,
      endYear: 2027,
      onMonthChange,
      onYearChange,
    })

    const target = wrapper.get('button')
    await target.trigger('click')
    expect(target.attributes('aria-expanded')).toBe('true')

    const month = document.querySelector<HTMLButtonElement>('button[data-type="month"]')!
    clickWithPointer(month)
    await nextTick()
    expect(onMonthChange).toHaveBeenCalledWith(0)
    expect(target.attributes('aria-expanded')).toBe('true')

    const year = document.querySelector<HTMLButtonElement>('button[data-type="year"]')!
    clickWithPointer(year)
    await nextTick()
    expect(onYearChange).toHaveBeenCalledWith(2025)
    expect(target.attributes('aria-expanded')).toBe('true')

    wrapper.unmount()
  })

  it('closes the month/year dropdown after year selection when months are hidden', async () => {
    const wrapper = mountWithProvider(MonthYearSelect, {
      withMonths: false,
      startYear: 2025,
      endYear: 2027,
    })

    const target = wrapper.get('button')
    await target.trigger('click')
    expect(target.attributes('aria-expanded')).toBe('true')

    clickWithPointer(document.querySelector<HTMLButtonElement>('button[data-type="year"]')!)
    await nextTick()
    expect(target.attributes('aria-expanded')).toBe('false')

    wrapper.unmount()
  })

  it('keeps the MonthView month/year dropdown open when its date changes', async () => {
    const wrapper = mountWithProvider(Schedule, {
      defaultDate: '2026-07-15',
      defaultView: 'month',
    })

    const target = wrapper.get('button[aria-haspopup="dialog"]')
    await target.trigger('click')
    expect(target.attributes('aria-expanded')).toBe('true')

    clickWithPointer(document.querySelector<HTMLButtonElement>('button[data-type="month"]')!)
    await nextTick()

    expect(wrapper.get('button[aria-haspopup="dialog"]').attributes('aria-expanded')).toBe('true')

    wrapper.unmount()
  })

  it('supports scoped keyboard navigation for month and year controls', async () => {
    const onMonthKeydown = vi.fn()
    const wrapper = mountWithProvider(MonthYearSelect, {
      monthValue: 10,
      yearValue: 2026,
      startYear: 2025,
      endYear: 2027,
      getMonthControlProps: (month: number) =>
        month === 1 ? { disabled: true } : month === 11 ? { onKeydown: onMonthKeydown } : {},
    })

    await wrapper.get('button').trigger('click')
    const month = (value: string) =>
      document.querySelector<HTMLButtonElement>(`button[aria-label="Select month ${value}"]`)!
    const year = (value: number) =>
      document.querySelector<HTMLButtonElement>(`button[aria-label="Select year ${value}"]`)!

    month('December').focus()
    pressKey(month('December'), 'ArrowDown')
    expect(document.activeElement).toBe(month('January'))
    expect(onMonthKeydown).toHaveBeenCalledOnce()

    pressKey(month('January'), 'ArrowDown')
    expect(document.activeElement).toBe(month('March'))

    pressKey(month('March'), 'ArrowUp')
    expect(document.activeElement).toBe(month('January'))

    pressKey(month('January'), 'End')
    expect(document.activeElement).toBe(month('December'))

    year(2027).focus()
    pressKey(year(2027), 'ArrowDown')
    expect(document.activeElement).toBe(year(2025))

    pressKey(year(2025), 'ArrowUp')
    expect(document.activeElement).toBe(year(2027))

    pressKey(year(2027), 'Home')
    expect(document.activeElement).toBe(year(2025))

    wrapper.unmount()
  })

  it('supports arrow-key navigation in DayView', async () => {
    const wrapper = mountWithProviderAttached(DayView, {
      date: '2026-07-15',
      startTime: '09:00:00',
      endTime: '11:00:00',
      intervalMinutes: 60,
    })
    const first = wrapper.get('button[aria-label="Time slot 09:00:00 - 10:00:00"]')
    const second = wrapper.get('button[aria-label="Time slot 10:00:00 - 11:00:00"]')

    first.element.focus()
    pressKey(first.element, 'ArrowDown')
    expect(document.activeElement).toBe(second.element)
    pressKey(second.element, 'ArrowUp')
    expect(document.activeElement).toBe(first.element)
    wrapper.unmount()
  })

  it('supports arrow-key navigation across WeekView focus regions', () => {
    const wrapper = mountWithProviderAttached(WeekView, {
      date: '2026-07-15',
      startTime: '09:00:00',
      endTime: '11:00:00',
      intervalMinutes: 60,
    })
    const weekday = (date: string) => wrapper.get(`button[aria-label="Weekday ${date}"]`).element
    const allDay = (date: string) => wrapper.get(`button[aria-label="All day ${date}"]`).element
    const slot = (date: string, start: string, end: string) =>
      wrapper.get(`button[aria-label="Time slot ${date} ${start} - ${end}"]`).element

    weekday('2026-07-13').focus()
    pressKey(weekday('2026-07-13'), 'ArrowRight')
    expect(document.activeElement).toBe(weekday('2026-07-14'))

    allDay('2026-07-13').focus()
    pressKey(allDay('2026-07-13'), 'ArrowDown')
    expect(document.activeElement).toBe(slot('2026-07-13', '09:00:00', '10:00:00'))

    pressKey(slot('2026-07-13', '09:00:00', '10:00:00'), 'ArrowRight')
    expect(document.activeElement).toBe(slot('2026-07-14', '09:00:00', '10:00:00'))
    pressKey(slot('2026-07-14', '09:00:00', '10:00:00'), 'ArrowDown')
    expect(document.activeElement).toBe(slot('2026-07-14', '10:00:00', '11:00:00'))
    wrapper.unmount()
  })

  it.each([
    [WeekView, 'Weekday 2026-07-13', 'Weekday 2026-07-14', 'Weekday 2026-07-15'],
    [MonthView, 'July 13, 2026', 'July 14, 2026', 'July 15, 2026'],
  ] as const)('marks configured weekend days in %s', (component, first, second, regular) => {
    const wrapper = mountWithProvider(component, {
      date: '2026-07-15',
      weekendDays: [1, 2],
    })
    const getDay = (label: string) => {
      const button = wrapper.get(`button[aria-label="${label}"]`).element
      return component === MonthView ? button.parentElement! : button
    }

    expect(getDay(first).getAttribute('data-weekend')).toBe('true')
    expect(getDay(second).getAttribute('data-weekend')).toBe('true')
    expect(getDay(regular).hasAttribute('data-weekend')).toBe(false)
  })

  it.each([
    [MonthView, 'button[aria-label="July 15, 2026"]', 'button[aria-label="July 16, 2026"]'],
    [
      YearView,
      'button[aria-label="January 1, 2026"]:not([data-outside])',
      'button[aria-label="January 2, 2026"]:not([data-outside])',
    ],
  ])(
    'supports calendar-grid arrow navigation in %s',
    (component, currentSelector, nextSelector) => {
      const wrapper = mountWithProviderAttached(component, { date: '2026-07-15' })
      const current = wrapper.get(currentSelector as string).element
      const next = wrapper.get(nextSelector as string).element

      current.focus()
      pressKey(current, 'ArrowRight')
      expect(document.activeElement).toBe(next)
      pressKey(next, 'ArrowLeft')
      expect(document.activeElement).toBe(current)
      wrapper.unmount()
    },
  )

  it('renders and changes views in uncontrolled mode', async () => {
    const onViewChange = vi.fn()
    const wrapper = mountWithProvider(Schedule, {
      defaultDate: '2026-07-15',
      defaultView: 'week',
      events,
      onViewChange,
    })

    expect(wrapper.findComponent(WeekView).exists()).toBe(true)
    await wrapper.get('[data-type="month"]').trigger('click')
    expect(onViewChange).toHaveBeenCalledWith('month')
    expect(wrapper.findComponent(MonthView).exists()).toBe(true)
  })

  it('emits time slot and event click callbacks', async () => {
    const onTimeSlotClick = vi.fn()
    const onEventClick = vi.fn()
    const wrapper = mountWithProvider(DayView, {
      date: '2026-07-15',
      events,
      startTime: '09:00:00',
      endTime: '11:00:00',
      intervalMinutes: 60,
      onTimeSlotClick,
      onEventClick,
    })

    await wrapper.get('button[aria-label="Time slot 09:00:00 - 10:00:00"]').trigger('click')
    expect(onTimeSlotClick).toHaveBeenCalledWith(
      expect.objectContaining({
        slotStart: '2026-07-15 09:00:00',
        slotEnd: '2026-07-15 10:00:00',
      }),
    )
    await wrapper.get('button[data-event-id="1"]').trigger('click')
    expect(onEventClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: events[0].id }),
      expect.anything(),
    )
  })

  it.each([DayView, WeekView])('moves events with drag and drop in %s', async (component) => {
    const onEventDrop = vi.fn()
    const wrapper = mountWithProvider(component, {
      date: '2026-07-15',
      events,
      startTime: '09:00:00',
      endTime: '11:00:00',
      intervalMinutes: 60,
      withEventsDragAndDrop: true,
      onEventDrop,
    })
    const eventButton = wrapper.get('button[data-event-id="1"]')
    const dataTransfer = createDataTransfer()
    dispatchDragEvent(eventButton.element, 'dragstart', dataTransfer)
    await nextTick()
    expect(eventButton.attributes('data-dragging')).toBe('true')

    const dropTarget =
      component === DayView
        ? wrapper.get('button[aria-label="Time slot 10:00:00 - 11:00:00"]').element
        : (eventButton.element.parentElement?.children[1] as Element)
    dispatchDragEvent(dropTarget, 'drop', dataTransfer)

    expect(dataTransfer.getData('application/json')).toBe('{"eventId":1}')
    expect(onEventDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 1,
        newStart: '2026-07-15 10:00:00',
        newEnd: '2026-07-15 11:00:00',
      }),
    )
    dispatchDragEvent(eventButton.element, 'dragend', dataTransfer)
    await nextTick()
    expect(eventButton.attributes('data-dragging')).toBeUndefined()
  })

  it.each([DayView, WeekView])(
    'moves events when they are dropped over another event in %s',
    async (component) => {
      const onEventDrop = vi.fn()
      const wrapper = mountWithProvider(component, {
        date: '2026-07-15',
        events: [
          events[0],
          {
            id: 2,
            title: 'Review',
            start: '2026-07-15 10:00:00',
            end: '2026-07-15 11:00:00',
            color: 'green',
          },
        ],
        startTime: '09:00:00',
        endTime: '11:00:00',
        intervalMinutes: 60,
        withEventsDragAndDrop: true,
        onEventDrop,
      })
      const draggedEvent = wrapper.get('button[data-event-id="1"]')
      const dropEvent = wrapper.get('button[data-event-id="2"]')
      const slots =
        draggedEvent.element.parentElement!.querySelectorAll<HTMLElement>('[data-time-slot-index]')
      vi.spyOn(slots[0], 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: 0,
        top: 0,
        right: 100,
        bottom: 64,
        left: 0,
        width: 100,
        height: 64,
        toJSON: () => ({}),
      })
      vi.spyOn(slots[1], 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: 64,
        top: 64,
        right: 100,
        bottom: 128,
        left: 0,
        width: 100,
        height: 64,
        toJSON: () => ({}),
      })
      const dataTransfer = createDataTransfer()

      dispatchDragEvent(draggedEvent.element, 'dragstart', dataTransfer)
      dispatchDragEvent(dropEvent.element, 'dragover', dataTransfer, 96)
      await nextTick()

      expect(slots[1].getAttribute('data-drop-target')).toBe('true')
      expect(dataTransfer.dropEffect).toBe('move')

      dispatchDragEvent(dropEvent.element, 'drop', dataTransfer, 96)
      await nextTick()

      expect(onEventDrop).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 1,
          newStart: '2026-07-15 10:00:00',
          newEnd: '2026-07-15 11:00:00',
        }),
      )
      expect(slots[1].hasAttribute('data-drop-target')).toBe(false)
    },
  )

  it('positions week events inside their assigned day column', () => {
    const wrapper = mountWithProvider(WeekView, {
      date: '2026-07-15',
      events,
      startTime: '09:00:00',
      endTime: '11:00:00',
      intervalMinutes: 60,
    })
    const eventButton = wrapper.get('button[data-event-id="1"]')
    const daySlots = eventButton.element.parentElement

    expect(daySlots).not.toBeNull()
    expect(daySlots?.children).toHaveLength(3)
    expect(daySlots?.children[0].hasAttribute('data-event-id')).toBe(false)
    expect(daySlots?.children[1].hasAttribute('data-event-id')).toBe(false)
    expect(daySlots?.children[2]).toBe(eventButton.element)
  })

  it('positions multi-day events inside the all-day slots list', () => {
    const wrapper = mountWithProvider(WeekView, {
      date: '2026-07-20',
      events: [
        {
          id: 4,
          title: 'Company offsite',
          start: '2026-07-20 00:00:00',
          end: '2026-07-22 00:00:00',
          color: 'orange',
        },
      ],
    })
    const eventButton = wrapper.get('button[data-event-id="4"]')
    const eventLayer = eventButton.element.parentElement
    const slotsList = eventLayer?.parentElement
    const directAllDaySlots = Array.from(slotsList?.children || []).filter((element) =>
      element.getAttribute('aria-label')?.startsWith('All day '),
    )
    const daySlotClass = wrapper
      .get('button[data-time-slot-index="0"]')
      .classes()
      .find((className) => className.includes('weekViewDaySlot'))

    expect(directAllDaySlots).toHaveLength(7)
    expect(daySlotClass).toBeDefined()
    directAllDaySlots.forEach((slot) => expect(slot.classList).toContain(daySlotClass!))
    expect(eventButton.attributes('style')).toContain('inset-inline-start: 0%')
    expect(eventButton.attributes('style')).toContain('width: 28.5714')
    expect(eventButton.attributes('style')).toContain('top: 0px')
  })

  it('keeps the week header, all-day row, and timed grid in one scroll viewport', () => {
    const wrapper = mountWithProvider(WeekView, {
      date: '2026-07-15',
      startTime: '09:00:00',
      endTime: '11:00:00',
    })
    const viewport = wrapper
      .get('button[aria-label="Weekday 2026-07-13"]')
      .element.closest('.mantine-ScrollArea-viewport')

    expect(viewport).not.toBeNull()
    expect(
      wrapper
        .get('button[aria-label="All day 2026-07-13"]')
        .element.closest('.mantine-ScrollArea-viewport'),
    ).toBe(viewport)
    expect(
      wrapper
        .get('button[aria-label="Time slot 2026-07-13 09:00:00 - 10:00:00"]')
        .element.closest('.mantine-ScrollArea-viewport'),
    ).toBe(viewport)
  })

  it('preserves event time when it is dropped on another month day', () => {
    const onEventDrop = vi.fn()
    const wrapper = mountWithProvider(MonthView, {
      date: '2026-07-15',
      events,
      withEventsDragAndDrop: true,
      onEventDrop,
    })
    const eventButton = wrapper.get('button[data-event-id="1"]')
    const targetLabel = wrapper.findAll('button').find((button) => button.text() === '16')
    const dataTransfer = createDataTransfer()
    dispatchDragEvent(eventButton.element, 'dragstart', dataTransfer)
    dispatchDragEvent(targetLabel!.element.parentElement!, 'drop', dataTransfer)

    expect(onEventDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 1,
        newStart: '2026-07-16 09:00:00',
        newEnd: '2026-07-16 10:00:00',
      }),
    )
  })

  it.each([DayView, WeekView])(
    'updates event height while it is being resized in %s',
    async (component) => {
      const onEventResize = vi.fn()
      const wrapper = mountWithProvider(component, {
        date: '2026-07-15',
        events,
        startTime: '09:00:00',
        endTime: '11:00:00',
        intervalMinutes: 30,
        withEventResize: true,
        onEventResize,
      })
      const eventButton = wrapper.get('button[data-event-id="1"]')
      const eventParent = eventButton.element.parentElement as HTMLElement
      const container = eventParent
      vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: 100,
        top: 100,
        right: 100,
        bottom: 228,
        left: 0,
        width: 100,
        height: 128,
        toJSON: () => ({}),
      })

      eventButton
        .get('[data-edge="bottom"]')
        .element.dispatchEvent(new MouseEvent('pointerdown', { clientY: 164, bubbles: true }))
      document.dispatchEvent(new MouseEvent('pointermove', { clientY: 196 }))
      await nextTick()

      expect(eventButton.attributes('style')).toContain('height: 75%')
      expect(eventButton.attributes('data-resizing')).toBe('true')
      expect(onEventResize).not.toHaveBeenCalled()

      document.dispatchEvent(new MouseEvent('pointerup', { clientY: 196 }))
      await nextTick()

      expect(onEventResize).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 1,
          newStart: '2026-07-15 09:00:00',
          newEnd: '2026-07-15 10:30:00',
        }),
      )
    },
  )

  it('uses getCurrentTime to render and position current time indicators', () => {
    const getCurrentTime = () => '2026-07-15 14:30:00'
    const day = mountWithProvider(DayView, {
      date: '2026-07-15',
      startTime: '08:00:00',
      endTime: '18:00:00',
      getCurrentTime,
    })
    const week = mountWithProvider(WeekView, {
      date: '2026-07-15',
      startTime: '08:00:00',
      endTime: '18:00:00',
      getCurrentTime,
    })

    expect(day.findComponent(CurrentTimeIndicator).find('div').exists()).toBe(true)
    expect(week.findAllComponents(CurrentTimeIndicator)).toHaveLength(1)
    expect(week.findComponent(CurrentTimeIndicator).find('div').exists()).toBe(true)
  })

  it('renders resource rows and only places events in their assigned resource', () => {
    const resourceEvents: ScheduleEventData[] = [
      {
        ...events[0],
        resourceId: 'room-b',
      },
    ]
    const wrapper = mountWithProvider(ResourcesDayView, {
      date: '2026-07-15',
      resources,
      events: resourceEvents,
      startTime: '08:00:00',
      endTime: '10:00:00',
    })
    const rows = wrapper.findAll('[class*="resourcesDayViewRowSlots"]')

    expect(rows).toHaveLength(2)
    expect(rows[0].text()).not.toContain('Planning')
    expect(rows[1].text()).toContain('Planning')
    expect(wrapper.findAll('button[class*="resourcesDayViewRowSlot"]')).toHaveLength(4)
  })

  it('includes resource and date-time data in resource slot callbacks', async () => {
    const onTimeSlotClick = vi.fn()
    const wrapper = mountWithProvider(ResourcesWeekView, {
      date: '2026-07-15',
      resources,
      startTime: '08:00:00',
      endTime: '09:00:00',
      onTimeSlotClick,
    })

    await wrapper.find('button[class*="resourcesWeekViewRowSlot"]').trigger('click')

    expect(onTimeSlotClick).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'room-a',
        slotStart: '2026-07-13 08:00:00',
        slotEnd: '2026-07-13 09:00:00',
      }),
    )
  })

  it('supports VNode resource labels and named section slots', () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(MantineProvider, null, () =>
            h(
              ResourcesDayView,
              {
                date: '2026-07-15',
                resources: [{ id: 'room-a', label: h('strong', 'VNode room') }],
                startTime: '08:00:00',
                endTime: '09:00:00',
              },
              {
                resourceLabel: ({ resource }) => h('em', `Slot: ${String(resource.id)}`),
                timeSlot: ({ startTime }) => h('span', `Custom ${startTime}`),
              },
            ),
          ),
      }),
    )

    expect(wrapper.find('em').text()).toBe('Slot: room-a')
    expect(wrapper.text()).toContain('Custom 08:00:00')
    expect(wrapper.text()).not.toContain('VNode room')
  })

  it('keeps resource views non-interactive in static mode', async () => {
    const onTimeSlotClick = vi.fn()
    const onEventClick = vi.fn()
    const wrapper = mountWithProvider(ResourcesDayView, {
      date: '2026-07-15',
      resources,
      events: [{ ...events[0], resourceId: 'room-a' }],
      mode: 'static',
      startTime: '08:00:00',
      endTime: '10:00:00',
      onTimeSlotClick,
      onEventClick,
    })

    await wrapper.find('button[class*="resourcesDayViewRowSlot"]').trigger('click')
    await wrapper.find('[data-event-id="1"]').trigger('click')

    expect(onTimeSlotClick).not.toHaveBeenCalled()
    expect(onEventClick).not.toHaveBeenCalled()
  })

  it('moves events between resource rows with row-level drop handling', () => {
    const onEventDrop = vi.fn()
    const wrapper = mountWithProviderAttached(ResourcesDayView, {
      date: '2026-07-15',
      resources,
      events: [{ ...events[0], resourceId: 'room-a' }],
      startTime: '08:00:00',
      endTime: '10:00:00',
      withEventsDragAndDrop: true,
      onEventDrop,
    })
    const rows = wrapper.findAll('[class*="resourcesDayViewRowSlots"]')
    Object.defineProperty(rows[1].element, 'getBoundingClientRect', {
      value: () => ({ left: 0, right: 200, top: 0, bottom: 64, width: 200, height: 64 }),
    })
    const transfer = createDataTransfer()

    dispatchDragEvent(wrapper.get('[data-event-id="1"]').element, 'dragstart', transfer, 0, 50)
    dispatchDragEvent(rows[1].element, 'dragover', transfer, 0, 50)
    dispatchDragEvent(rows[1].element, 'drop', transfer, 0, 50)

    expect(onEventDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 1,
        resourceId: 'room-b',
        newStart: '2026-07-15 08:00:00',
      }),
    )
    wrapper.unmount()
  })

  it('moves week events between resources with one row-level drop target', () => {
    const onEventDrop = vi.fn()
    const wrapper = mountWithProviderAttached(ResourcesWeekView, {
      date: '2026-07-15',
      resources,
      events: [{ ...events[0], resourceId: 'room-a' }],
      startTime: '08:00:00',
      endTime: '10:00:00',
      withEventsDragAndDrop: true,
      onEventDrop,
    })
    const rows = wrapper.findAll('[class*="resourcesWeekViewRowSlots"]')
    Object.defineProperty(rows[1].element, 'getBoundingClientRect', {
      value: () => ({ left: 0, right: 1400, top: 0, bottom: 64, width: 1400, height: 64 }),
    })
    const transfer = createDataTransfer()

    dispatchDragEvent(wrapper.get('[data-event-id="1"]').element, 'dragstart', transfer, 0, 550)
    dispatchDragEvent(rows[1].element, 'dragover', transfer, 0, 550)
    dispatchDragEvent(rows[1].element, 'drop', transfer, 0, 550)

    expect(onEventDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 1,
        resourceId: 'room-b',
        newStart: '2026-07-15 09:00:00',
      }),
    )
    wrapper.unmount()
  })

  it('updates resource event width while resizing and emits the resized range', async () => {
    const onEventResize = vi.fn()
    const wrapper = mountWithProviderAttached(ResourcesDayView, {
      date: '2026-07-15',
      resources: [resources[0]],
      events: [{ ...events[0], resourceId: 'room-a' }],
      startTime: '08:00:00',
      endTime: '18:00:00',
      withEventResize: true,
      onEventResize,
    })
    const row = wrapper.get('[class*="resourcesDayViewRowSlots"]')
    Object.defineProperty(row.element, 'getBoundingClientRect', {
      value: () => ({ left: 0, right: 1000, top: 0, bottom: 64, width: 1000, height: 64 }),
    })
    const eventWrapper = wrapper.get('[class*="resourcesDayViewEventWrapper"]')
    const endHandle = wrapper.get('[aria-label="Resize event end Planning"]')

    endHandle.element.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, cancelable: true, clientX: 200 }),
    )
    document.dispatchEvent(
      new MouseEvent('pointermove', { bubbles: true, cancelable: true, clientX: 300 }),
    )
    await nextTick()

    expect(eventWrapper.attributes('style')).toContain('width: calc(20% - 2px)')
    expect(onEventResize).not.toHaveBeenCalled()

    document.dispatchEvent(
      new MouseEvent('pointerup', { bubbles: true, cancelable: true, clientX: 300 }),
    )
    await nextTick()

    expect(onEventResize).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 1,
        newStart: '2026-07-15 09:00:00',
        newEnd: '2026-07-15 11:00:00',
      }),
    )
    wrapper.unmount()
  })

  it('renders resource resize handles and business-hour slot modifiers', () => {
    const wrapper = mountWithProvider(ResourcesDayView, {
      date: '2026-07-15',
      resources,
      events: [{ ...events[0], resourceId: 'room-a' }],
      startTime: '08:00:00',
      endTime: '18:00:00',
      withEventResize: true,
      highlightBusinessHours: true,
    })

    expect(wrapper.findAll('[class*="resourcesDayViewResizeHandle"]')).toHaveLength(2)
    expect(wrapper.findAll('button[data-business-hours="true"]')).toHaveLength(16)
    expect(wrapper.findAll('button[data-non-business-hours="true"]')).toHaveLength(4)
  })

  it('renders ResourcesMonthView rows, assigned events, and named cell slots', () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(MantineProvider, null, () =>
            h(
              ResourcesMonthView,
              {
                date: '2026-07-15',
                resources,
                events: [{ ...events[0], resourceId: 'room-b' }],
              },
              { dayCell: ({ date }) => h('span', { class: 'custom-month-cell' }, date) },
            ),
          ),
      }),
    )
    const rows = wrapper.findAll('[class*="resourcesMonthViewRowSlots"]')

    expect(rows).toHaveLength(2)
    expect(rows[0].text()).not.toContain('Planning')
    expect(rows[1].text()).toContain('Planning')
    expect(wrapper.findAll('button[class*="resourcesMonthViewCell"]')).toHaveLength(62)
    expect(wrapper.findAll('.custom-month-cell')).toHaveLength(62)
  })

  it('supports forcing the week indicator onto the matching weekday', () => {
    const wrapper = mountWithProvider(WeekView, {
      date: '2026-07-15',
      startTime: '08:00:00',
      endTime: '18:00:00',
      withCurrentTimeIndicator: true,
      forceCurrentTimeIndicator: true,
      getCurrentTime: () => '2026-07-22 14:30:00',
    })

    expect(wrapper.findAllComponents(CurrentTimeIndicator)).toHaveLength(1)
    expect(wrapper.findComponent(CurrentTimeIndicator).find('div').exists()).toBe(true)
  })

  it('shows events for the initially selected mobile month date', () => {
    const wrapper = mountWithProvider(MobileMonthView, {
      date: '2026-07-15',
      selectedDate: '2026-07-15',
      events,
    })

    expect(wrapper.get('button[aria-selected="true"]').attributes('aria-label')).toBe(
      'July 15, 2026',
    )
    const eventButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Planning'))
    expect(eventButton?.text()).toContain('09:00 – 10:00')
    expect(eventButton?.findAll('p')).toHaveLength(2)
    expect(eventButton?.attributes('data-event-id')).toBeUndefined()
  })

  it.each([MonthView, YearView, MobileMonthView])('mounts %s with event data', (component) => {
    const wrapper = mountWithProvider(component, { date: '2026-07-15', events })

    expect(wrapper.text()).toContain('July')
  })
})
