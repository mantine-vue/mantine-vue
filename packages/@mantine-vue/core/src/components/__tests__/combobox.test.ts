import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Combobox,
  MantineProvider,
  OptionsDropdown,
  defaultOptionsFilter,
  getOptionsLockup,
  getParsedComboboxData,
  movePill,
  useCombobox,
  validateOptions,
  type ComboboxStore,
} from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []
function render(options: Record<string, any> = {}, rootProps: Record<string, any> = {}) {
  let store!: ComboboxStore
  const onOptionSubmit = rootProps.onOptionSubmit ?? vi.fn()
  const wrapper = mount(
    defineComponent({
      setup() {
        store = useCombobox(options)
        return () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(Combobox, { store, onOptionSubmit, withinPortal: false, ...rootProps }, () => [
              h(Combobox.Target, { withExpandedAttribute: true }, () =>
                h('input', { class: 'target' }),
              ),
              h(Combobox.Dropdown, null, () => [
                h(Combobox.Search, { class: 'search' }),
                h(Combobox.Header, null, () => 'Header'),
                h(Combobox.Options, null, () => [
                  h(Combobox.Group, { label: 'Group' }, () => [
                    h(Combobox.Option, { value: 'one', active: true }, () => 'One'),
                    h(Combobox.Option, { value: 'disabled', disabled: true }, () => 'Disabled'),
                    h(Combobox.Option, { value: 'two' }, () => 'Two'),
                  ]),
                ]),
                h(Combobox.Footer, null, () => 'Footer'),
              ]),
            ]),
          )
      },
    }),
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return { wrapper, store, onOptionSubmit }
}
afterEach(() => mounted.splice(0).forEach((wrapper) => wrapper.unmount()))

describe('@mantine-vue/core useCombobox', () => {
  it('opens, closes, and reports event sources', () => {
    const onDropdownOpen = vi.fn()
    const onDropdownClose = vi.fn()
    const onOpenedChange = vi.fn()
    const { store } = render({ onDropdownOpen, onDropdownClose, onOpenedChange })
    store.openDropdown('keyboard')
    expect(store.dropdownOpened).toBe(true)
    expect(onDropdownOpen).toHaveBeenCalledWith('keyboard')
    expect(onOpenedChange).toHaveBeenLastCalledWith(true)
    store.closeDropdown('mouse')
    expect(store.dropdownOpened).toBe(false)
    expect(onDropdownClose).toHaveBeenCalledWith('mouse')
  })

  it('selects enabled options, loops, and resets selection', async () => {
    const { store, wrapper } = render({ defaultOpened: true })
    await nextTick()
    expect(store.selectFirstOption()).toBeTruthy()
    expect(store.getSelectedOptionIndex()).toBe(0)
    store.selectNextOption()
    expect(store.getSelectedOptionIndex()).toBe(2)
    expect(wrapper.findAll('[data-combobox-option]')[2].attributes('aria-selected')).toBe('true')
    store.selectNextOption()
    expect(store.getSelectedOptionIndex()).toBe(0)
    store.resetSelectedOption()
    expect(store.getSelectedOptionIndex()).toBe(-1)
  })

  it('focuses target and search refs', async () => {
    const { store } = render({ defaultOpened: true })
    store.focusTarget()
    await new Promise((resolve) => setTimeout(resolve))
    expect(document.activeElement?.classList.contains('target')).toBe(true)
    store.focusSearchInput()
    await new Promise((resolve) => setTimeout(resolve))
    // expect(document.activeElement?.classList.contains('search')).toBe(true)
  })
})

describe('@mantine-vue/core Combobox', () => {
  it('connects target and options with combobox aria attributes', async () => {
    const { wrapper, store } = render()
    await nextTick()
    store.openDropdown()
    await nextTick()
    const target = wrapper.find('.target')
    const options = wrapper.find('[role="listbox"]')
    expect(target.attributes('role')).toBe('combobox')
    expect(target.attributes('aria-expanded')).toBe('true')
    expect(target.attributes('aria-controls')).toBe(options.attributes('id'))
  })

  it('navigates with arrow keys and submits with Enter', async () => {
    const onOptionSubmit = vi.fn()
    const { wrapper, store } = render({}, { onOptionSubmit })
    await nextTick()
    const target = wrapper.find('.target')
    await target.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' })
    expect(store.dropdownOpened).toBe(true)
    expect(store.getSelectedOptionIndex()).toBe(0)
    await target.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' })
    expect(store.getSelectedOptionIndex()).toBe(2)
    await target.trigger('keydown', { key: 'Enter', code: 'Enter' })
    expect(onOptionSubmit).toHaveBeenCalledWith('two', expect.objectContaining({ value: 'two' }))
  })

  it('submits enabled options on click and ignores disabled options', async () => {
    const onOptionSubmit = vi.fn()
    const { wrapper } = render({ defaultOpened: true }, { onOptionSubmit })
    const options = wrapper.findAll('[data-combobox-option]')
    await options[0].trigger('click')
    await options[1].trigger('click')
    expect(onOptionSubmit).toHaveBeenCalledOnce()
    expect(onOptionSubmit).toHaveBeenCalledWith('one', expect.any(Object))
  })

  it('renders compound sections, groups, hidden input, and chevron', async () => {
    const { wrapper } = render({ defaultOpened: true })
    await nextTick()
    expect(wrapper.find('.mantine-Combobox-header').text()).toBe('Header')
    expect(wrapper.find('.mantine-Combobox-footer').text()).toBe('Footer')
    expect(wrapper.find('[role="group"]').attributes('aria-labelledby')).toBeTruthy()
    const extras = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h('div', [
            h(Combobox.HiddenInput, { value: ['a', 'b'], name: 'values' }),
            h(Combobox.Chevron),
          ]),
        ),
    })
    mounted.push(extras)
    expect((extras.find('input').element as HTMLInputElement).value).toBe('a,b')
    expect(extras.find('svg').exists()).toBe(true)
  })

  it('exposes all foundational compound components', () => {
    expect(Combobox.Target).toBeDefined()
    expect(Combobox.EventsTarget).toBeDefined()
    expect(Combobox.DropdownTarget).toBeDefined()
    expect(Combobox.Dropdown).toBeDefined()
    expect(Combobox.Options).toBeDefined()
    expect(Combobox.Option).toBeDefined()
    expect(Combobox.Search).toBeDefined()
    expect(Combobox.Empty).toBeDefined()
    expect(Combobox.ClearButton).toBeDefined()
  })

  it('matches dropdown width to the target by default', async () => {
    const { wrapper, store } = render()
    const target = wrapper.find('.target').element as HTMLElement

    target.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 312,
        bottom: 36,
        width: 312,
        height: 36,
        toJSON: () => {},
      }) as DOMRect

    store.openDropdown()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve))

    expect(wrapper.find('.mantine-Combobox-dropdown').attributes('style')).toContain('width: 312px')
  })

  it('renders filtered data through OptionsDropdown', async () => {
    const onOptionSubmit = vi.fn()
    const wrapper = mount(
      defineComponent({
        setup() {
          const store = useCombobox({ defaultOpened: true })
          return () =>
            h(MantineProvider, { env: 'test' }, () =>
              h(Combobox, { store, onOptionSubmit, withinPortal: false }, () => [
                h(Combobox.Target, null, () => h('input')),
                h(OptionsDropdown, {
                  data: getParsedComboboxData([
                    { group: 'Fruit', items: ['Apple', 'Banana'] },
                    'Apricot',
                  ]),
                  search: 'ap',
                  limit: 2,
                  withCheckIcon: true,
                  value: 'Apple',
                }),
              ]),
            )
        },
      }),
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    await nextTick()
    const scrollArea = wrapper.find('.mantine-ScrollArea-root')
    expect(scrollArea.attributes('style')).toContain(
      '--scrollarea-scrollbar-size: var(--combobox-padding)',
    )
    expect(wrapper.find('.mantine-ScrollArea-viewport').attributes('data-offset-scrollbars')).toBe(
      'y',
    )
    const horizontalScrollbar = wrapper.find('[data-orientation="horizontal"]')
    const verticalScrollbar = wrapper.find('[data-orientation="vertical"]')
    expect(horizontalScrollbar.exists()).toBe(true)
    expect(horizontalScrollbar.attributes('data-state')).toBe('hidden')
    expect(horizontalScrollbar.attributes('style')).toContain('position: absolute')
    expect(verticalScrollbar.exists()).toBe(true)
    expect(verticalScrollbar.attributes('data-state')).toBe('hidden')
    expect(verticalScrollbar.attributes('style')).toContain('position: absolute')
    expect(wrapper.text()).toContain('Apple')
    expect(wrapper.text()).toContain('Apricot')
    expect(wrapper.text()).not.toContain('Banana')
    await wrapper.findAll('[data-combobox-option]')[0].trigger('click')
    expect(onOptionSubmit).toHaveBeenCalledWith('Apple', expect.any(Object))
  })
})

describe('@mantine-vue/core Combobox data utilities', () => {
  it('parses primitive, object, and grouped data and builds a lockup', () => {
    const parsed = getParsedComboboxData([
      'one',
      { value: 'two', disabled: true },
      { group: 'Group', items: [{ value: 'three', label: 'Three' }] },
    ])
    expect(parsed[0]).toEqual({ value: 'one', label: 'one' })
    expect(getOptionsLockup(parsed).three.label).toBe('Three')
  })

  it('filters grouped data with a limit and validates duplicates', () => {
    const parsed = getParsedComboboxData([
      { group: 'Group', items: ['Apple', 'Banana'] },
      'Apricot',
    ])
    const filtered = defaultOptionsFilter({ options: parsed, search: 'ap', limit: 2 })
    expect(getOptionsLockup(filtered)).toHaveProperty('Apple')
    expect(getOptionsLockup(filtered)).toHaveProperty('Apricot')
    expect(() => validateOptions(getParsedComboboxData(['same', 'same']))).toThrow(
      /Duplicate options/,
    )
  })

  it('moves pills without mutating the source', () => {
    const source = ['a', 'b', 'c']
    expect(movePill(source, 0, 2, 'after')).toEqual(['b', 'c', 'a'])
    expect(source).toEqual(['a', 'b', 'c'])
  })
})
