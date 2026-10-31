import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import { MobileMonthView } from './index'

const render = (component: any, props: Record<string, any>) =>
  mount({ render: () => h(MantineProvider, { env: 'test' }, () => h(component, props)) })

describe('@mantine-vue/schedule/MobileMonthView', () => {
  const props = { date: '2026-03-01', events: [], defaultSelectedDate: '2026-03-02' }

  it('hides weekend columns with withWeekendDays={false}', () => {
    const wrapper = render(MobileMonthView, { ...props, withWeekendDays: false })
    const root = wrapper.find('.mantine-MobileMonthView-mobileMonthView')

    expect(wrapper.findAll('.mantine-MobileMonthView-mobileMonthViewWeekday')).toHaveLength(5)
    expect(root.attributes('data-without-weekend-days')).toBeDefined()
    expect(
      (root.element as HTMLElement).style.getPropertyValue('--mobile-month-view-columns'),
    ).toBe('5')
  })

  it('labels multi-day events as all day on every day', () => {
    const wrapper = render(MobileMonthView, {
      ...props,
      events: [
        {
          id: 1,
          title: 'Trip',
          start: '2026-03-01 15:00:00',
          end: '2026-03-03 11:00:00',
          color: 'blue',
        },
      ],
    })

    expect(wrapper.find('.mantine-MobileMonthView-mobileMonthViewEvent').text()).toContain(
      'All day',
    )
  })
})
