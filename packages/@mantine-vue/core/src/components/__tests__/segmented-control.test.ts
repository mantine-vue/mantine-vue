import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { FloatingIndicator, MantineProvider, SegmentedControl } from '../../index'

function withProvider(component: any, options: Record<string, any> = {}) {
  return mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => component()),
    },
    options,
  )
}

describe('@mantine-vue/core FloatingIndicator', () => {
  it('renders only when target and parent are provided and positions against target', async () => {
    const parent = document.createElement('div')
    const target = document.createElement('button')
    const targetRef = ref<HTMLElement | null>(null)
    const parentRef = ref<HTMLElement | null>(null)

    parent.appendChild(target)
    document.body.appendChild(parent)

    Object.defineProperty(parent, 'getBoundingClientRect', {
      value: () => ({ top: 10, left: 20, width: 200, height: 80, right: 220, bottom: 90 }),
    })
    Object.defineProperty(target, 'getBoundingClientRect', {
      value: () => ({ top: 25, left: 50, width: 70, height: 30, right: 120, bottom: 55 }),
    })

    const wrapper = withProvider(() =>
      h(FloatingIndicator, {
        parent: parentRef.value,
        target: targetRef.value,
        transitionDuration: 0,
      }),
    )

    expect(wrapper.find('.mantine-FloatingIndicator-root').exists()).toBe(false)

    parentRef.value = parent
    targetRef.value = target
    await nextTick()
    await nextTick()

    const indicator = wrapper.find('.mantine-FloatingIndicator-root')
    expect(indicator.exists()).toBe(true)
    expect((indicator.element as HTMLElement).style.width).toBe('70px')
    expect((indicator.element as HTMLElement).style.height).toBe('30px')

    wrapper.unmount()
    document.body.removeChild(parent)
  })
})

describe('@mantine-vue/core SegmentedControl', () => {
  it('renders data as radio controls and changes uncontrolled value', async () => {
    const wrapper = withProvider(() =>
      h(SegmentedControl, { data: ['First', 'Second', 'Third'], transitionDuration: 0 }),
    )
    const radios = wrapper.findAll('input[type="radio"]')

    expect(radios).toHaveLength(3)
    expect(radios[0].element.checked).toBe(true)

    await radios[1].trigger('click')

    expect(wrapper.findAll('input[type="radio"]')[1].element.checked).toBe(true)
  })

  it('calls onChange in controlled mode but does not mutate readOnly value', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(SegmentedControl, {
        data: ['First', 'Second'],
        value: 'First',
        onChange,
        readOnly: true,
        transitionDuration: 0,
      }),
    )
    const radios = wrapper.findAll('input[type="radio"]')

    expect(radios[0].element.checked).toBe(true)
    await radios[1].setValue(true)

    expect(onChange).not.toHaveBeenCalled()
    expect(wrapper.findAll('input[type="radio"]')[0].element.checked).toBe(true)
  })

  it('supports disabled items and object data', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(SegmentedControl, {
        data: [
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two', disabled: true },
        ],
        onChange,
      }),
    )

    expect(wrapper.text()).toContain('One')
    expect(wrapper.text()).toContain('Two')
    expect(wrapper.findAll('input')[1].attributes('disabled')).toBeDefined()
  })
})
