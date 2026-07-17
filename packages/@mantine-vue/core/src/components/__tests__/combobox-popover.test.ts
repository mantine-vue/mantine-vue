import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { Button, ComboboxPopover, MantineProvider } from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []

function render(props: Record<string, any> = {}, targetLabel = 'Toggle') {
  const wrapper = mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(ComboboxPopover, { comboboxProps: { withinPortal: false }, ...props }, () =>
            h(ComboboxPopover.Target, null, () => h(Button, null, () => targetLabel)),
          ),
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return wrapper
}

async function openDropdown(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('[role="combobox"]').trigger('click')
  await flushPromises()
  await nextTick()
}

function options(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[role="option"]')
}

function optionByName(wrapper: ReturnType<typeof mount>, name: string) {
  return options(wrapper).find((option) => option.text() === name)!
}

afterEach(() => mounted.splice(0).forEach((wrapper) => wrapper.unmount()))

describe('@mantine-vue/core ComboboxPopover', () => {
  it('exposes Target as a static property', () => {
    expect(ComboboxPopover.Target).toBeDefined()
  })

  it('renders a combobox target', () => {
    const wrapper = render({ data: ['test-1', 'test-2'] })
    expect(wrapper.find('[role="combobox"]').exists()).toBe(true)
  })

  it('supports uncontrolled single value state', async () => {
    const spy = vi.fn()
    const wrapper = render({ data: ['test-1', 'test-2'], onChange: spy })
    await openDropdown(wrapper)
    await optionByName(wrapper, 'test-1').trigger('click')
    expect(spy).toHaveBeenCalledWith('test-1')
  })

  it('supports controlled single value state', async () => {
    const spy = vi.fn()
    const wrapper = render({ data: ['test-1', 'test-2'], value: 'test-1', onChange: spy })
    await openDropdown(wrapper)
    await optionByName(wrapper, 'test-2').trigger('click')
    expect(spy).toHaveBeenCalledWith('test-2')
  })

  it('allows deselecting the selected option in single mode', async () => {
    const spy = vi.fn()
    const wrapper = render({ data: ['test-1', 'test-2'], defaultValue: 'test-1', onChange: spy })
    await openDropdown(wrapper)
    await optionByName(wrapper, 'test-1').trigger('click')
    expect(spy).toHaveBeenCalledWith(null)
  })

  it('does not allow deselecting when allowDeselect is false', async () => {
    const spy = vi.fn()
    const wrapper = render({
      data: ['test-1', 'test-2'],
      defaultValue: 'test-1',
      allowDeselect: false,
      onChange: spy,
    })
    await openDropdown(wrapper)
    await optionByName(wrapper, 'test-1').trigger('click')
    expect(spy).toHaveBeenCalledWith('test-1')
  })

  it('supports uncontrolled multiple value state', async () => {
    const spy = vi.fn()
    const wrapper = render({ data: ['test-1', 'test-2'], multiple: true, onChange: spy })
    await openDropdown(wrapper)
    await optionByName(wrapper, 'test-1').trigger('click')
    expect(spy).toHaveBeenCalledWith(['test-1'])
  })

  it('supports controlled multiple value state', async () => {
    const spy = vi.fn()
    const wrapper = render({
      data: ['test-1', 'test-2'],
      multiple: true,
      value: ['test-1'],
      onChange: spy,
    })
    await openDropdown(wrapper)
    await optionByName(wrapper, 'test-2').trigger('click')
    expect(spy).toHaveBeenCalledWith(['test-1', 'test-2'])
  })

  it('allows deselecting in multiple mode', async () => {
    const spy = vi.fn()
    const wrapper = render({
      data: ['test-1', 'test-2'],
      multiple: true,
      defaultValue: ['test-1'],
      onChange: spy,
    })
    await openDropdown(wrapper)
    await optionByName(wrapper, 'test-1').trigger('click')
    expect(spy).toHaveBeenCalledWith([])
  })

  it('displays nothing found message when there is no data', async () => {
    const wrapper = render({ data: [], nothingFoundMessage: 'No data' })
    await openDropdown(wrapper)
    expect(wrapper.text()).toContain('No data')
  })

  it('displays check icon for selected option', async () => {
    const wrapper = render({
      data: ['test-1', 'test-2'],
      defaultValue: 'test-1',
      withCheckIcon: true,
    })
    await openDropdown(wrapper)
    expect(optionByName(wrapper, 'test-1').find('svg').exists()).toBe(true)
  })

  it('sets input value on the hidden input', async () => {
    const wrapper = render({ data: ['test-1', 'test-2'], name: 'test-combobox-popover' })
    const input = () =>
      wrapper.find('input[name="test-combobox-popover"]').element as HTMLInputElement
    expect(input().value).toBe('')
    await openDropdown(wrapper)
    await optionByName(wrapper, 'test-1').trigger('click')
    expect(input().value).toBe('test-1')
  })

  it('calls onDropdownOpen and onDropdownClose', async () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    const wrapper = render({
      data: ['test-1', 'test-2'],
      onDropdownOpen: onOpen,
      onDropdownClose: onClose,
    })
    await openDropdown(wrapper)
    expect(onOpen).toHaveBeenCalledTimes(1)
    await openDropdown(wrapper)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('supports data with groups', async () => {
    const wrapper = render({
      data: [
        { group: 'Frontend', items: ['React', 'Vue'] },
        { group: 'Backend', items: ['Node', 'Python'] },
      ],
    })
    await openDropdown(wrapper)
    expect(wrapper.text()).toContain('Frontend')
    expect(wrapper.text()).toContain('Backend')
    expect(options(wrapper)).toHaveLength(4)
  })

  it('renders search input in dropdown when searchable', async () => {
    const wrapper = render({ data: ['React', 'Angular', 'Vue'], searchable: true })
    await openDropdown(wrapper)
    expect(wrapper.find('input[placeholder="Search..."]').exists()).toBe(true)
  })

  it('filters options when typing in search input', async () => {
    const wrapper = render({ data: ['React', 'Angular', 'Vue'], searchable: true })
    await openDropdown(wrapper)
    expect(options(wrapper)).toHaveLength(3)
    await wrapper.find('input[placeholder="Search..."]').setValue('Rea')
    await nextTick()
    expect(options(wrapper)).toHaveLength(1)
    expect(options(wrapper)[0].text()).toBe('React')
  })

  it('displays nothing found message when search has no matches', async () => {
    const wrapper = render({
      data: ['React', 'Angular', 'Vue'],
      searchable: true,
      nothingFoundMessage: 'Nothing found',
    })
    await openDropdown(wrapper)
    await wrapper.find('input[placeholder="Search..."]').setValue('xyz')
    await nextTick()
    expect(wrapper.text()).toContain('Nothing found')
  })
})
