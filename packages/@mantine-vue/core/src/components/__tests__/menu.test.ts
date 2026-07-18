import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { MantineProvider, Menu } from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []
function render(
  props: Record<string, any> = {},
  dropdown: () => any[] = () => [
    h(Menu.Item, null, () => 'First'),
    h(Menu.Item, null, () => 'Second'),
  ],
) {
  const wrapper = mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            Menu,
            { withinPortal: false, ...props },
            {
              default: () => [
                h(Menu.Target, null, () => h('button', { class: 'target' }, 'Target')),
                h(Menu.Dropdown, null, dropdown),
              ],
            },
          ),
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return wrapper
}
afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.useRealTimers()
})

describe('@mantine-vue/core Menu', () => {
  it('opens and closes from target with callbacks', async () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    const onChange = vi.fn()
    const wrapper = render({ onOpen, onClose, onChange })
    await wrapper.find('.target').trigger('click')
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    expect(onOpen).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenLastCalledWith(true)
    await wrapper.find('.target').trigger('click')
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    expect(onClose).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('closes on item click and supports per-item override', async () => {
    const wrapper = render({}, () => [
      h(Menu.Item, { closeMenuOnClick: false }, () => 'Keep'),
      h(Menu.Item, null, () => 'Close'),
    ])
    await wrapper.find('.target').trigger('click')
    await wrapper.findAll('[data-menu-item]')[0].trigger('click')
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    await wrapper.findAll('[data-menu-item]')[1].trigger('click')
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
  })

  it('navigates enabled items with arrow, Home, and End keys', async () => {
    const wrapper = render({ defaultOpened: true }, () => [
      h(Menu.Item, null, () => 'First'),
      h(Menu.Item, { disabled: true }, () => 'Disabled'),
      h(Menu.Item, null, () => 'Last'),
    ])
    const root = wrapper.find('[role="menu"]')
    const items = wrapper.findAll('[data-menu-item]')
    ;(items[0].element as HTMLElement).focus()
    await root.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items[2].element)
    await root.trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(items[0].element)
    await root.trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(items[2].element)
  })

  it('renders labels, dividers, sections, and Menu styles API selectors', () => {
    const wrapper = render({ defaultOpened: true }, () => [
      h(Menu.Label, null, () => 'Actions'),
      h(Menu.Divider),
      h(Menu.Item, { leftSection: 'L', rightSection: 'R' }, () => 'Item'),
    ])
    expect(wrapper.find('.mantine-Menu-label').text()).toBe('Actions')
    expect(wrapper.find('[role="separator"]').exists()).toBe(true)
    expect(wrapper.findAll('.mantine-Menu-itemSection')).toHaveLength(2)
  })

  it('supports checkbox and radio groups', async () => {
    const checks = ref<string[]>(['one'])
    const radio = ref('a')
    const wrapper = render({ defaultOpened: true, closeOnItemClick: false }, () => [
      h(
        Menu.CheckboxGroup,
        { modelValue: checks.value, onChange: (value: string[]) => (checks.value = value) },
        () => [
          h(Menu.CheckboxItem, { value: 'one' }, () => 'One'),
          h(Menu.CheckboxItem, { value: 'two' }, () => 'Two'),
        ],
      ),
      h(
        Menu.RadioGroup,
        { modelValue: radio.value, onChange: (value: string) => (radio.value = value) },
        () => [
          h(Menu.RadioItem, { value: 'a' }, () => 'A'),
          h(Menu.RadioItem, { value: 'b' }, () => 'B'),
        ],
      ),
    ])
    expect(wrapper.find('[role="menuitemcheckbox"]').attributes('aria-checked')).toBe('true')
    await wrapper.findAll('[role="menuitemcheckbox"]')[1].trigger('click')
    expect(checks.value).toEqual(['one', 'two'])
    await wrapper.findAll('[role="menuitemradio"]')[1].trigger('click')
    expect(radio.value).toBe('b')
  })

  it('opens with hover trigger and configured delay', async () => {
    vi.useFakeTimers()
    const wrapper = render({ trigger: 'hover', openDelay: 50 })
    await wrapper.find('.target').trigger('mouseenter')
    vi.advanceTimersByTime(49)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    vi.advanceTimersByTime(1)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
  })

  it('opens from contextmenu and exposes compound API', async () => {
    const wrapper = mount(
      {
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(
              Menu,
              { withinPortal: false },
              {
                default: () => [
                  h(Menu.ContextMenu, null, () => h('div', { class: 'context' }, 'Context')),
                  h(Menu.Dropdown, null, () => h(Menu.Item, null, () => 'Copy')),
                ],
              },
            ),
          ),
      },
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 10,
      clientY: 20,
    })
    wrapper.find('.context').element.dispatchEvent(event)
    await wrapper.vm.$nextTick()
    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    expect(Menu.Sub.Target).toBeDefined()
    expect(Menu.Sub.Dropdown).toBeDefined()
    expect(Menu.Search).toBeDefined()
  })

  it('positions context menu at the cursor virtual reference', async () => {
    const wrapper = mount(
      {
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(
              Menu,
              { withinPortal: false, transitionProps: { duration: 0 } },
              {
                default: () => [
                  h(Menu.ContextMenu, null, () => h('div', { class: 'context' }, 'Context')),
                  h(Menu.Dropdown, null, () => h(Menu.Item, null, () => 'Copy')),
                ],
              },
            ),
          ),
      },
      { attachTo: document.body },
    )
    mounted.push(wrapper)

    wrapper.find('.context').element.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 120,
        clientY: 80,
      }),
    )
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const dropdown = wrapper.find('[role="menu"]').element as HTMLElement
    expect(dropdown.style.left).not.toBe('0px')
    expect(dropdown.style.top).not.toBe('0px')
  })

  it('supports type-ahead navigation', async () => {
    const wrapper = render({ defaultOpened: true }, () => [
      h(Menu.Item, null, () => 'Apple'),
      h(Menu.Item, null, () => 'Banana'),
    ])
    await wrapper.find('[role="menu"]').trigger('keydown', { key: 'b' })
    expect(document.activeElement?.textContent).toContain('Banana')
  })

  it('keeps focus on Menu.Search while typing and controls active item with keyboard', async () => {
    const onChange = vi.fn()
    const onClick = vi.fn()
    const wrapper = render({ defaultOpened: true }, () => [
      h(Menu.Search, { value: '', onChange, placeholder: 'Search' }),
      h(Menu.Item, { onClick }, () => 'Apple'),
      h(Menu.Item, null, () => 'Banana'),
    ])
    const search = wrapper.find('input[type="search"]')

    ;(search.element as HTMLInputElement).focus()
    await search.setValue('b')
    expect(onChange).toHaveBeenCalled()

    onChange.mockClear()
    await search.trigger('keydown', { key: 'b' })
    expect(document.activeElement).toBe(search.element)
    expect(wrapper.find('[data-menu-active]').exists()).toBe(false)

    await search.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(search.element)
    expect(wrapper.find('[data-menu-active]').text()).toContain('Apple')

    await search.trigger('keydown', { key: 'Enter' })
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('clears Menu.Search through onChange when menu closes', async () => {
    const onChange = vi.fn()
    const wrapper = render({ defaultOpened: true }, () => [
      h(Menu.Search, { value: 'ap', onChange }),
      h(Menu.Item, null, () => 'Apple'),
    ])

    await wrapper.find('.target').trigger('click')

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        currentTarget: expect.objectContaining({ value: '' }),
      }),
    )
  })

  it('opens nested submenus on hover', async () => {
    const wrapper = render({ defaultOpened: true }, () => [
      h(Menu.Sub, { withinPortal: false, openDelay: 0 }, () => [
        h(Menu.Sub.Target, null, () => h(Menu.Sub.Item, { class: 'sub-target' }, () => 'More')),
        h(Menu.Sub.Dropdown, null, () => h(Menu.Item, null, () => 'Nested action')),
      ]),
    ])
    await wrapper.find('.sub-target').trigger('mouseenter')
    expect(wrapper.text()).toContain('Nested action')
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(2)
    expect(wrapper.findAll('[role="menu"]')[1].attributes('data-position')).toBe('right-start')
    expect(wrapper.find('.sub-target svg').exists()).toBe(true)
  })

  it('opens a submenu on ArrowRight from its parent item', async () => {
    const wrapper = render({ defaultOpened: true }, () => [
      h(Menu.Item, null, () => 'Regular'),
      h(Menu.Sub, { withinPortal: false, openDelay: 0 }, () => [
        h(Menu.Sub.Target, null, () => h(Menu.Sub.Item, { class: 'sub-target' }, () => 'More')),
        h(Menu.Sub.Dropdown, null, () => h(Menu.Item, null, () => 'Nested action')),
      ]),
    ])

    expect(wrapper.text()).not.toContain('Nested action')
    await wrapper.find('.sub-target').trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    await nextTick()
    expect(wrapper.text()).toContain('Nested action')
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(2)
  })

  it('does not open a submenu on ArrowDown from its parent item', async () => {
    const wrapper = render({ defaultOpened: true }, () => [
      h(Menu.Item, null, () => 'Regular'),
      h(Menu.Sub, { withinPortal: false, openDelay: 0 }, () => [
        h(Menu.Sub.Target, null, () => h(Menu.Sub.Item, { class: 'sub-target' }, () => 'More')),
        h(Menu.Sub.Dropdown, null, () => h(Menu.Item, null, () => 'Nested action')),
      ]),
    ])

    await wrapper.find('.sub-target').trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()
    await nextTick()
    expect(wrapper.text()).not.toContain('Nested action')
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(1)
  })

  it('closes a submenu on ArrowLeft from an item inside it', async () => {
    const wrapper = render({ defaultOpened: true }, () => [
      h(Menu.Sub, { withinPortal: false, openDelay: 0 }, () => [
        h(Menu.Sub.Target, null, () => h(Menu.Sub.Item, { class: 'sub-target' }, () => 'More')),
        h(Menu.Sub.Dropdown, null, () => h(Menu.Item, { class: 'nested' }, () => 'Nested action')),
      ]),
    ])

    await wrapper.find('.sub-target').trigger('mouseenter')
    await flushPromises()
    await nextTick()
    expect(wrapper.text()).toContain('Nested action')
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(2)

    await wrapper.find('.nested').trigger('keydown', { key: 'ArrowLeft' })
    await flushPromises()
    await nextTick()
    expect(wrapper.text()).not.toContain('Nested action')
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(1)
  })
})
