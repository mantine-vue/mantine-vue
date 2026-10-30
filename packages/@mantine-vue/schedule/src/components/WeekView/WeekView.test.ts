import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import { WeekView } from './index'

const render = (component: any, props: Record<string, any>) =>
  mount({ render: () => h(MantineProvider, { env: 'test' }, () => h(component, props)) })

describe('@mantine-vue/schedule/WeekView', () => {
  const props = {
    date: '2026-03-02',
    events: [],
    startTime: '08:00:00',
    endTime: '10:00:00',
    intervalMinutes: 15,
  }

  it('renders WeekView labels at the given interval', () => {
    const wrapper = render(WeekView, { ...props, slotLabelInterval: 30 })
    expect(wrapper.findAll('.mantine-WeekView-weekViewSlotLabel')).toHaveLength(4)
  })
})
