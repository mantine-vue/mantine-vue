import { MantineProvider } from '@mantine-vue/core'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { ResourcesDayView, ResourcesMonthView, ResourcesSchedule, ResourcesWeekView } from '..'
import type { ScheduleEventData } from '../types'

const resources = [
  { id: 'room-a', label: 'Room A' },
  { id: 'room-b', label: 'Room B' },
]

const events: ScheduleEventData[] = [
  {
    id: 1,
    title: 'Test Event',
    start: '2025-01-15 09:00:00',
    end: '2025-01-15 10:00:00',
    color: 'blue',
    resourceId: 'room-a',
  },
]

function mountSchedule(props: Record<string, unknown>, slots?: Record<string, unknown>) {
  return mount(
    defineComponent({
      setup: () => () => h(MantineProvider, null, () => h(ResourcesSchedule, props, slots)),
    }),
  )
}

// Mounts through a `forward` prop so props can be updated to test controlled behaviour
function mountControllable(initial: Record<string, unknown>) {
  return mount(
    defineComponent({
      props: { forward: { type: Object as () => Record<string, unknown>, default: () => ({}) } },
      setup: (p) => () => h(MantineProvider, null, () => h(ResourcesSchedule, p.forward)),
    }),
    { props: { forward: initial } },
  )
}

const tab = (wrapper: ReturnType<typeof mountSchedule>, view: string) =>
  wrapper.get(`[data-type="${view}"]`)

describe('@mantine-vue/schedule/ResourcesSchedule', () => {
  it('renders ResourcesDayView by default (defaultView="day")', () => {
    const wrapper = mountSchedule({ resources, defaultDate: '2025-01-15' })
    expect(wrapper.findComponent(ResourcesDayView).exists()).toBe(true)
  })

  it('shows only day, week and month in the view selector', () => {
    const wrapper = mountSchedule({ resources, defaultDate: '2025-01-15' })
    expect(wrapper.find('[data-type="day"]').exists()).toBe(true)
    expect(wrapper.find('[data-type="week"]').exists()).toBe(true)
    expect(wrapper.find('[data-type="month"]').exists()).toBe(true)
    expect(wrapper.find('[data-type="year"]').exists()).toBe(false)
  })

  it.each(['week', 'month'] as const)('defaultView="%s" renders the matching view', (view) => {
    const wrapper = mountSchedule({ resources, defaultDate: '2025-01-15', defaultView: view })
    const component = view === 'week' ? ResourcesWeekView : ResourcesMonthView
    expect(wrapper.findComponent(component).exists()).toBe(true)
  })

  it('switches views in uncontrolled mode and calls onViewChange once per click', async () => {
    const onViewChange = vi.fn()
    const wrapper = mountSchedule({
      resources,
      defaultDate: '2025-01-15',
      defaultView: 'day',
      onViewChange,
    })

    await tab(wrapper, 'week').trigger('click')
    expect(onViewChange).toHaveBeenCalledTimes(1)
    expect(onViewChange).toHaveBeenLastCalledWith('week')
    expect(wrapper.findComponent(ResourcesWeekView).exists()).toBe(true)

    await tab(wrapper, 'month').trigger('click')
    expect(onViewChange).toHaveBeenCalledTimes(2)
    expect(onViewChange).toHaveBeenLastCalledWith('month')
    expect(wrapper.findComponent(ResourcesMonthView).exists()).toBe(true)
  })

  it('respects the controlled view prop', async () => {
    const wrapper = mountControllable({ resources, defaultDate: '2025-01-15', view: 'day' })
    expect(wrapper.findComponent(ResourcesDayView).exists()).toBe(true)

    await wrapper.setProps({ forward: { resources, defaultDate: '2025-01-15', view: 'month' } })
    expect(wrapper.findComponent(ResourcesMonthView).exists()).toBe(true)
    expect(wrapper.findComponent(ResourcesDayView).exists()).toBe(false)
  })

  it('passes events to the active view', () => {
    const wrapper = mountSchedule({
      resources,
      defaultDate: '2025-01-15',
      events,
      defaultView: 'day',
    })
    expect(wrapper.text()).toContain('Test Event')
  })

  it('forwards renderResourceLabel to the active view', () => {
    const wrapper = mountSchedule({
      resources,
      defaultDate: '2025-01-15',
      defaultView: 'day',
      renderResourceLabel: (resource: (typeof resources)[number]) =>
        h('span', `Custom: ${resource.label}`),
    })
    expect(wrapper.text()).toContain('Custom: Room A')
    expect(wrapper.text()).toContain('Custom: Room B')
  })

  it('supports the resourceLabel named slot', () => {
    const wrapper = mountSchedule(
      { resources, defaultDate: '2025-01-15', defaultView: 'day' },
      {
        resourceLabel: ({ resource }: { resource: (typeof resources)[number] }) =>
          h('em', `Slot: ${resource.id}`),
      },
    )
    expect(wrapper.find('em').text()).toBe('Slot: room-a')
  })

  it.each(['day', 'week'] as const)('forwards onTimeSlotClick in %s view', async (view) => {
    const onTimeSlotClick = vi.fn()
    const wrapper = mountSchedule({
      resources,
      defaultDate: '2025-01-15',
      defaultView: view,
      onTimeSlotClick,
    })
    const cls = view === 'day' ? 'resourcesDayViewRowSlot' : 'resourcesWeekViewRowSlot'
    await wrapper.find(`button[class*="${cls}"]`).trigger('click')
    expect(onTimeSlotClick).toHaveBeenCalledWith(expect.objectContaining({ resourceId: 'room-a' }))
  })

  it('forwards onDayClick to the month view only', async () => {
    const onDayClick = vi.fn()
    const wrapper = mountSchedule({
      resources,
      defaultDate: '2025-01-15',
      defaultView: 'month',
      onDayClick,
    })
    await wrapper.find('button[class*="resourcesMonthViewCell"]').trigger('click')
    expect(onDayClick).toHaveBeenCalledWith(expect.objectContaining({ resourceId: 'room-a' }))
  })

  it('applies dayViewProps only to the day view', async () => {
    const onViewChange = vi.fn()
    const wrapper = mountSchedule({
      resources,
      defaultDate: '2025-01-15',
      defaultView: 'day',
      onViewChange,
      dayViewProps: { startTime: '10:00:00', endTime: '12:00:00', intervalMinutes: 60 },
    })
    expect(wrapper.findAll('button[class*="resourcesDayViewRowSlot"]')).toHaveLength(2 * 2)

    await tab(wrapper, 'week').trigger('click')
    expect(wrapper.findAll('button[class*="resourcesWeekViewRowSlot"]').length).toBeGreaterThan(
      2 * 2 * 7,
    )
  })

  it('disables interactions when mode="static"', () => {
    const wrapper = mountSchedule({
      resources,
      defaultDate: '2025-01-15',
      defaultView: 'day',
      mode: 'static',
    })
    wrapper.findAll('button[class*="resourcesDayViewRowSlot"]').forEach((slot) => {
      expect(slot.attributes('tabindex')).toBe('-1')
    })
  })

  it('renders the controlled date in the active view header', async () => {
    const wrapper = mountControllable({ resources, date: '2025-01-15', view: 'day' })
    expect(wrapper.text()).toContain('January 15, 2025')

    await wrapper.setProps({ forward: { resources, date: '2025-02-20', view: 'day' } })
    expect(wrapper.text()).toContain('February 20, 2025')
  })

  it('calls onDateChange from header navigation', async () => {
    const onDateChange = vi.fn()
    const wrapper = mountSchedule({
      resources,
      defaultDate: '2025-01-15',
      defaultView: 'day',
      onDateChange,
    })
    await wrapper.find('[data-type="previous"]').trigger('click')
    expect(onDateChange).toHaveBeenCalled()
  })
})
