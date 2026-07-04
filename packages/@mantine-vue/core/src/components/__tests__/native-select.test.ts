import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, NativeSelect, getParsedNativeSelectData } from '../../index'

function withProvider(props: Record<string, any>, slots?: Record<string, any>) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(NativeSelect, props, slots)),
  })
}

describe('@mantine-vue/core NativeSelect', () => {
  it('parses native select data', () => {
    expect(getParsedNativeSelectData(undefined)).toEqual([])
    expect(
      getParsedNativeSelectData([
        'first',
        { value: 'second', disabled: true },
        { group: 'group', items: ['third', { value: 'fourth', label: 'Fourth' }] },
      ]),
    ).toEqual([
      { value: 'first', label: 'first' },
      { value: 'second', label: 'second', disabled: true },
      {
        group: 'group',
        items: [
          { value: 'third', label: 'third' },
          { value: 'fourth', label: 'Fourth' },
        ],
      },
    ])
  })

  it('renders options and optgroups from data prop', () => {
    const wrapper = withProvider({
      data: [
        'test-1',
        { group: 'test-group', items: ['test-2', { value: 'test-3', label: 'Test 3' }] },
      ],
    })

    expect(wrapper.findAll('option')).toHaveLength(3)
    expect(wrapper.find('optgroup').attributes('label')).toBe('test-group')
    expect(wrapper.findAll('option').map((option) => option.text())).toEqual([
      'test-1',
      'test-2',
      'Test 3',
    ])
  })

  it('supports native uncontrolled state', async () => {
    const wrapper = withProvider({ data: ['test-1', 'test-2'] })
    const select = wrapper.find('select')

    await select.setValue('test-2')

    expect((select.element as HTMLSelectElement).value).toBe('test-2')
  })

  it('supports controlled value and change handler', async () => {
    const onChange = vi.fn((event: Event) => (event.target as HTMLSelectElement).value)
    const wrapper = withProvider({ data: ['test-1', 'test-2'], value: 'test-1', onChange })
    const select = wrapper.find('select')

    await select.setValue('test-2')

    expect(onChange).toHaveReturnedWith('test-2')
    expect((select.element as HTMLSelectElement).value).toBe('test-1')
  })

  it('prefers children over data', () => {
    const wrapper = withProvider(
      { data: ['data-option'] },
      { default: () => h('option', { value: 'child-option' }, 'Child option') },
    )

    expect(wrapper.findAll('option')).toHaveLength(1)
    expect(wrapper.find('option').text()).toBe('Child option')
  })

  it('passes wrapper props to InputBase', () => {
    const wrapper = withProvider({
      id: 'native-select',
      label: 'Native label',
      description: 'Native description',
      error: true,
      disabled: true,
      data: ['value'],
    })

    const select = wrapper.find('select')

    expect(wrapper.text()).toContain('Native label')
    expect(wrapper.text()).toContain('Native description')
    expect(select.attributes('disabled')).toBeDefined()
    expect(select.attributes('aria-invalid')).toBe('true')
  })
})
