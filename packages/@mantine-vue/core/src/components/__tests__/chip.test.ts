import { describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { Chip, ChipGroup, MantineProvider } from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

describe('@mantine-vue/core Chip', () => {
  it('renders checked state, default icon and rootRef', () => {
    const rootRef = ref<HTMLElement | null>(null)
    const wrapper = withProvider(() =>
      h(Chip, { value: 'chip', checked: true, rootRef }, () => 'Chip label'),
    )

    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(true)
    expect(wrapper.find('.mantine-Chip-checkIcon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Chip label')
    expect(rootRef.value?.className).toContain('mantine-Chip-root')
  })

  it('supports uncontrolled standalone state and custom icon', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(
        Chip,
        {
          value: 'chip',
          onChange,
          icon: (attrs: any) =>
            h('span', { ...attrs, class: ['custom-chip-icon', attrs.class] }, 'ok'),
        },
        () => 'Standalone chip',
      ),
    )
    const input = wrapper.find('input[type="checkbox"]')

    expect(input.element.checked).toBe(false)
    expect(wrapper.find('.custom-chip-icon').exists()).toBe(false)

    await input.setValue(true)

    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(input.element.checked).toBe(true)
    expect(wrapper.find('.custom-chip-icon').text()).toBe('ok')
  })

  it('Chip.Group uses radio inputs by default and controls single selection', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(ChipGroup, { defaultValue: 'first', onChange }, () => [
        h(Chip, { value: 'first' }, () => 'First'),
        h(Chip, { value: 'second' }, () => 'Second'),
      ]),
    )
    const chips = wrapper.findAll('input[type="radio"]')

    expect(chips).toHaveLength(2)
    expect(chips[0].element.checked).toBe(true)

    await chips[1].setValue(true)

    expect(onChange).toHaveBeenLastCalledWith('second')
    expect(wrapper.findAll('input[type="radio"]')[1].element.checked).toBe(true)
  })

  it('Chip.Group supports multiple values with checkbox inputs', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(ChipGroup, { multiple: true, defaultValue: ['first'], onChange }, () => [
        h(Chip, { value: 'first' }, () => 'First'),
        h(Chip, { value: 'second' }, () => 'Second'),
      ]),
    )
    const chips = wrapper.findAll('input[type="checkbox"]')

    expect(chips).toHaveLength(2)
    expect(chips[0].element.checked).toBe(true)

    await chips[1].setValue(true)

    expect(onChange).toHaveBeenLastCalledWith(['first', 'second'])
    expect(wrapper.findAll('input[type="checkbox"]')[1].element.checked).toBe(true)

    await wrapper.findAll('input[type="checkbox"]')[0].setValue(false)

    expect(onChange).toHaveBeenLastCalledWith(['second'])
  })

  it('exposes Mantine-like static group component', () => {
    expect(Chip.Group).toBe(ChipGroup)
  })
})
