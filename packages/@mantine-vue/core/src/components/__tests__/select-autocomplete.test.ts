import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { Autocomplete, MantineProvider, Select } from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []
function render(component: any, props: Record<string, any>) {
  const wrapper = mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () => h(component, { withinPortal: false, ...props })),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return wrapper
}
afterEach(() => mounted.splice(0).forEach((wrapper) => wrapper.unmount()))

describe('@mantine-vue/core Select', () => {
  it('renders Mantine Combobox chevron as default right section', () => {
    const wrapper = render(Select, { data: ['React'] })
    const chevron = wrapper.find('.mantine-ComboboxChevron-chevron')

    expect(chevron.exists()).toBe(true)
    expect(chevron.attributes('style')).toContain('--combobox-chevron-size')
    expect(chevron.find('path').attributes('d')).toBe(
      'M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z',
    )
  })

  it('renders selected label and hidden form value', () => {
    const wrapper = render(Select, {
      data: [
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' },
      ],
      defaultValue: 'vue',
      name: 'framework',
      label: 'Framework',
    })
    expect((wrapper.find('input:not([type="hidden"])').element as HTMLInputElement).value).toBe(
      'Vue',
    )
    expect((wrapper.find('input[type="hidden"]').element as HTMLInputElement).value).toBe('vue')
    expect(wrapper.text()).toContain('Framework')
  })

  it('opens from click and selects an option', async () => {
    const onChange = vi.fn()
    const wrapper = render(Select, { data: ['React', 'Vue'], onChange })
    const input = wrapper.find('input:not([type="hidden"])')
    await input.trigger('click')
    expect(input.attributes('aria-expanded')).toBe('true')
    await wrapper.findAll('[data-combobox-option]')[1].trigger('click')
    expect(onChange).toHaveBeenCalledWith('Vue', expect.objectContaining({ label: 'Vue' }))
    expect((input.element as HTMLInputElement).value).toBe('Vue')
    expect(input.attributes('aria-expanded')).toBe('false')
  })

  it('allows deselection and can disable deselection', async () => {
    const wrapper = render(Select, { data: ['Vue'], defaultValue: 'Vue' })
    await wrapper.find('input:not([type="hidden"])').trigger('click')
    await wrapper.find('[data-combobox-option]').trigger('click')
    expect((wrapper.find('input[type="hidden"]').element as HTMLInputElement).value).toBe('')

    const locked = render(Select, { data: ['Vue'], defaultValue: 'Vue', allowDeselect: false })
    await locked.find('input:not([type="hidden"])').trigger('click')
    await locked.find('[data-combobox-option]').trigger('click')
    expect((locked.find('input[type="hidden"]').element as HTMLInputElement).value).toBe('Vue')
  })

  it('filters searchable options and restores selected label on blur', async () => {
    const wrapper = render(Select, {
      data: ['Apple', 'Banana', 'Apricot'],
      defaultValue: 'Banana',
      searchable: true,
    })
    const input = wrapper.find('input:not([type="hidden"])')
    await input.setValue('ap')
    expect(wrapper.findAll('[data-combobox-option]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Apple')
    expect(wrapper.text()).toContain('Apricot')
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('Banana')
  })

  it('supports controlled values and clear button', async () => {
    const value = ref<string | null>('Vue')
    const wrapper = mount(
      defineComponent({
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(Select, {
              data: ['Vue', 'React'],
              modelValue: value.value,
              'onUpdate:modelValue': (next: string | null) => (value.value = next),
              clearable: true,
              withinPortal: false,
            }),
          ),
      }),
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    await wrapper.find('button').trigger('click')
    expect(value.value).toBeNull()
    expect((wrapper.find('input[type="hidden"]').element as HTMLInputElement).value).toBe('')
  })

  it('hides dropdown for disabled and read-only inputs', async () => {
    const wrapper = render(Select, { data: ['One'], disabled: true })
    await wrapper.find('input:not([type="hidden"])').trigger('click')
    expect(wrapper.find('.mantine-Select-dropdown').attributes('data-hidden')).toBe('true')
  })
})

describe('@mantine-vue/core Autocomplete', () => {
  it('supports free text and emits value changes', async () => {
    const onChange = vi.fn()
    const wrapper = render(Autocomplete, { data: ['Apple', 'Banana'], onChange })
    const input = wrapper.find('input')
    await input.setValue('Custom')
    expect(onChange).toHaveBeenLastCalledWith('Custom')
    expect((input.element as HTMLInputElement).value).toBe('Custom')
  })

  it('filters and selects option labels', async () => {
    const onOptionSubmit = vi.fn()
    const wrapper = render(Autocomplete, {
      data: [{ value: 'apple-id' }, { value: 'banana-id' }],
      onOptionSubmit,
    })
    const input = wrapper.find('input')
    await input.setValue('ban')
    expect(wrapper.findAll('[data-combobox-option]')).toHaveLength(1)
    await wrapper.find('[data-combobox-option]').trigger('click')
    expect(onOptionSubmit).toHaveBeenCalledWith('banana-id')
    expect((input.element as HTMLInputElement).value).toBe('banana-id')
  })

  it('opens on focus and supports clearable controlled state', async () => {
    const value = ref('Apple')
    const wrapper = mount(
      defineComponent({
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(Autocomplete, {
              data: ['Apple'],
              modelValue: value.value,
              'onUpdate:modelValue': (next: string) => (value.value = next),
              clearable: true,
              withinPortal: false,
            }),
          ),
      }),
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(input.attributes('aria-expanded')).toBe('true')
    await wrapper.find('button').trigger('click')
    expect(value.value).toBe('')
  })
})
