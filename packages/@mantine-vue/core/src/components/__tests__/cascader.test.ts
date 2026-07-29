import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { Cascader, MantineProvider } from '../../index'

const data = [
  {
    value: 'frameworks',
    label: 'Frameworks',
    children: [
      {
        value: 'vue',
        label: 'Vue',
        children: [{ value: 'vue-3', label: 'Vue 3' }],
      },
      { value: 'react', label: 'React' },
    ],
  },
]

const mounted: Array<ReturnType<typeof mount>> = []

function render(
  props: Record<string, unknown> = {},
  slots: Record<string, (...args: any[]) => any> = {},
) {
  const wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(
              Cascader,
              {
                data,
                defaultDropdownOpened: true,
                comboboxProps: { withinPortal: false },
                ...props,
              },
              slots,
            ),
          )
      },
    }),
    { attachTo: document.body },
  )

  mounted.push(wrapper)
  return wrapper
}

afterEach(() => mounted.splice(0).forEach((wrapper) => wrapper.unmount()))

describe('@mantine-vue/core Cascader', () => {
  it('renders Mantine chevrons and keeps ancestor and selected states separate', async () => {
    const wrapper = render()
    await nextTick()

    const rootOption = wrapper.get('[role="option"]')
    expect(rootOption.find('svg').exists()).toBe(true)
    expect(rootOption.text()).toBe('Frameworks')

    await rootOption.trigger('click')
    await nextTick()

    const options = wrapper.findAll('[role="option"]')
    expect(options).toHaveLength(3)
    expect(options[0].attributes('data-in-path')).toBe('true')
    expect(options[0].attributes('data-active')).toBeUndefined()
    expect(options[2].attributes('data-selected')).toBeUndefined()

    await options[2].trigger('click')
    await nextTick()

    expect(wrapper.get('[role="option"][data-selected="true"]').text()).toBe('React')
  })

  it('uses the active state only for keyboard navigation', async () => {
    const wrapper = render()
    await nextTick()

    await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(wrapper.get('[role="option"][data-active="true"]').text()).toBe('Frameworks')
  })

  it('selects parent options and keeps their child columns open with changeOnSelect', async () => {
    const changes: Array<string[] | null> = []
    const wrapper = render({
      changeOnSelect: true,
      onChange: (value: string[] | null) => changes.push(value),
    })
    await nextTick()

    await wrapper.get('[role="option"]').trigger('click')
    await nextTick()

    expect(changes).toEqual([['frameworks']])
    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual([
      'Frameworks',
      'Vue',
      'React',
    ])

    await wrapper.findAll('[role="option"]')[1].trigger('click')
    await nextTick()

    expect(changes).toEqual([['frameworks'], ['frameworks', 'vue']])
    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual([
      'Frameworks',
      'Vue',
      'React',
      'Vue 3',
    ])
  })

  it('serializes the selected path and forwards hidden input form state', async () => {
    const wrapper = render({
      defaultValue: ['frameworks', 'react'],
      name: 'technology',
      form: 'settings',
      disabled: true,
    })
    await nextTick()

    const input = wrapper.get('input[type="hidden"]')
    expect(input.attributes('name')).toBe('technology')
    expect(input.attributes('form')).toBe('settings')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.element.value).toBe('frameworks,react')
  })

  it('supports named slots for renderable content', async () => {
    const wrapper = render(
      { withColumns: false },
      {
        label: () => 'Technology slot',
        separator: () => h('strong', { class: 'separator-slot' }, '→'),
      },
    )
    await nextTick()

    expect(wrapper.text()).toContain('Technology slot')
    expect(wrapper.findAll('.separator-slot')).toHaveLength(3)

    const searchable = render(
      { searchable: true, searchValue: 'vue' },
      {
        renderSearchOption: ({ query }: any) =>
          h('span', { class: 'search-option-slot' }, `Search: ${query}`),
      },
    )
    await nextTick()

    expect(searchable.get('.search-option-slot').text()).toBe('Search: vue')

    const emptyColumns = render(
      { data: [] },
      {
        nothingFoundMessage: () => h('span', { class: 'nothing-found-slot' }, 'No paths'),
      },
    )
    await nextTick()

    expect(emptyColumns.get('.nothing-found-slot').text()).toBe('No paths')
  })

  it('keeps render props as the precedence-compatible API', async () => {
    const wrapper = render(
      {
        renderOption: (option: any) => `Prop: ${option.label}`,
      },
      {
        renderOption: ({ option }: any) => `Slot: ${option.label}`,
      },
    )
    await nextTick()

    expect(wrapper.get('[role="option"]').text()).toContain('Prop: Frameworks')
    expect(wrapper.get('[role="option"]').text()).not.toContain('Slot:')
  })
})
