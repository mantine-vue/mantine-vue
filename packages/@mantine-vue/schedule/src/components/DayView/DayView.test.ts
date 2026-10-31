import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import { DayView } from './index'

const render = (component: any, props: Record<string, any>) =>
  mount({ render: () => h(MantineProvider, { env: 'test' }, () => h(component, props)) })

describe('@mantine-vue/schedule/DayView', () => {
  const props = {
    date: '2026-03-02',
    events: [],
    startTime: '08:00:00',
    endTime: '10:00:00',
    intervalMinutes: 15,
  }

  it('renders one DayView label per hour by default', () => {
    const wrapper = render(DayView, props)
    expect(wrapper.findAll('.mantine-DayView-dayViewSlotLabel:not([data-all-day])')).toHaveLength(2)
  })

  it('renders DayView labels at the given interval and marks sub-hour labels', () => {
    const wrapper = render(DayView, { ...props, slotLabelInterval: 30 })
    const labels = wrapper.findAll('.mantine-DayView-dayViewSlotLabel:not([data-all-day])')

    expect(labels.map((label) => label.text())).toEqual(['08:00', '08:30', '09:00', '09:30'])
    expect(labels[1].attributes('data-sub-hour')).toBeDefined()
    expect(labels[0].attributes('data-sub-hour')).toBeUndefined()
    expect((labels[0].element as HTMLElement).style.getPropertyValue('--slot-label-size')).toBe(
      '0.5',
    )
  })

  it('paints a slot up to the exact minute', () => {
    const wrapper = render(DayView, {
      date: '2026-03-02',
      events: [],
      startTime: '07:00:00',
      endTime: '09:00:00',
      highlightBusinessHours: true,
      businessHours: ['07:07:30', '19:00'],
    })
    const slot = wrapper.find('.mantine-DayView-dayViewSlot[data-time-slot-index="0"]')
    const style = (slot.element as HTMLElement).style

    expect(slot.attributes('data-partial-business-hours')).toBeDefined()
    expect(style.getPropertyValue('--business-hours-from')).toBe('50%')
    expect(style.getPropertyValue('--business-hours-to')).toBe('100%')
  })
})
