import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { ColorInput, MantineProvider, MultiSelect, TagsInput, TreeSelect } from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []
function render(component: any, props: Record<string, any>) {
  const wrapper = mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(component, {
            ...props,
            comboboxProps: { withinPortal: false, ...props.comboboxProps },
            popoverProps: { withinPortal: false, ...props.popoverProps },
          }),
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return wrapper
}
afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.unstubAllGlobals()
})

describe('@mantine-vue/core multi-value inputs', () => {
  it('selects, removes, and serializes MultiSelect values', async () => {
    const onRemove = vi.fn()
    const wrapper = render(MultiSelect, {
      data: [
        { value: 'vue', label: 'Vue' },
        { value: 'react', label: 'React' },
      ],
      defaultValue: ['vue'],
      name: 'frameworks',
      searchable: true,
      onRemove,
    })
    expect((wrapper.find('input[type="hidden"]').element as HTMLInputElement).value).toBe('vue')
    await wrapper.find('input:not([type="hidden"])').trigger('focus')
    await wrapper.findAll('[data-combobox-option]')[1].trigger('click')
    expect((wrapper.find('input[type="hidden"]').element as HTMLInputElement).value).toBe(
      'vue,react',
    )
    await wrapper.find('button').trigger('click')
    expect(onRemove).toHaveBeenCalledWith('vue')
  })

  it('keeps non-searchable MultiSelect dropdown open after click focus', async () => {
    const wrapper = render(MultiSelect, {
      data: ['Vue', 'React'],
    })
    const input = wrapper.find('input:not([type="hidden"])')

    await input.trigger('focus')
    await input.trigger('click')

    expect(wrapper.find('.mantine-MultiSelect-dropdown').attributes('data-hidden')).toBeUndefined()
    expect(wrapper.findAll('[data-combobox-option]')).toHaveLength(2)
  })

  it('creates tags, prevents duplicates, and honors maxTags', async () => {
    const onDuplicate = vi.fn()
    const onMaxTags = vi.fn()
    const wrapper = render(TagsInput, { defaultValue: ['Vue'], maxTags: 2, onDuplicate, onMaxTags })
    const input = wrapper.find('input:not([type="hidden"])')
    await input.setValue('vue')
    await input.trigger('keydown', { key: 'Enter' })
    expect(onDuplicate).toHaveBeenCalledWith('vue')
    await input.setValue('React')
    await input.trigger('keydown', { key: 'Enter' })
    await input.setValue('Svelte')
    await input.trigger('keydown', { key: 'Enter' })
    expect(onMaxTags).toHaveBeenCalledWith('Svelte')
    expect((wrapper.find('input[type="hidden"]').element as HTMLInputElement).value).toBe(
      'Vue,React',
    )
  })
})

describe('@mantine-vue/core ColorInput and TreeSelect', () => {
  it('tracks valid ColorInput values and fixes invalid values on blur', async () => {
    const wrapper = render(ColorInput, { defaultValue: '#ff0000', label: 'Color' })
    const input = wrapper.find('input')
    await input.setValue('invalid')
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('#ff0000')
    expect(wrapper.text()).toContain('Color')
  })

  it('renders Mantine eye dropper action icon and picks color', async () => {
    const onChangeEnd = vi.fn()
    vi.stubGlobal(
      'EyeDropper',
      class {
        open() {
          return Promise.resolve({ sRGBHex: '#00ff00' })
        }
      },
    )

    const wrapper = render(ColorInput, { defaultValue: '#ff0000', onChangeEnd })
    const button = wrapper.find('button[aria-label="Pick color from screen"]')

    expect(button.exists()).toBe(true)
    expect(button.find('svg').exists()).toBe(true)
    expect(button.find('path[d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"]').exists()).toBe(true)
    expect(button.text()).toBe('')

    await button.trigger('click')
    await Promise.resolve()

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('#00ff00')
    expect(onChangeEnd).toHaveBeenCalledWith('#00ff00')
  })

  it('selects leaves and expands parents in TreeSelect', async () => {
    const wrapper = render(TreeSelect, {
      data: [{ value: 'parent', label: 'Parent', children: [{ value: 'leaf', label: 'Leaf' }] }],
      name: 'node',
      expandOnClick: true,
    })
    const input = wrapper.find('input:not([type="hidden"])')
    await input.trigger('click')
    await wrapper.find('[data-combobox-option]').trigger('click')
    expect(wrapper.find('.mantine-TreeSelect-option').text()).toContain('Parent')
    await wrapper.findAll('[data-combobox-option]')[1].trigger('click')
    expect((wrapper.find('input[type="hidden"]').element as HTMLInputElement).value).toBe('leaf')
  })

  it('cascades checkbox selection and serializes leaf values', async () => {
    const wrapper = render(TreeSelect, {
      mode: 'checkbox',
      defaultExpandedValues: ['parent'],
      data: [
        {
          value: 'parent',
          label: 'Parent',
          children: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        },
      ],
      name: 'nodes',
    })
    await wrapper.find('input:not([type="hidden"])').trigger('click')
    await wrapper.find('[data-combobox-option]').trigger('click')
    expect((wrapper.find('input[type="hidden"]').element as HTMLInputElement).value).toBe('a,b')
  })

  it('renders the complete group during SSR', async () => {
    const app = createSSRApp({
      render: () =>
        h(MantineProvider, null, () => [
          h(MultiSelect, {
            data: ['Vue'],
            defaultValue: ['Vue'],
            comboboxProps: { withinPortal: false },
          }),
          h(TagsInput, { defaultValue: ['tag'], comboboxProps: { withinPortal: false } }),
          h(ColorInput, { defaultValue: '#fff', popoverProps: { withinPortal: false } }),
          h(TreeSelect, {
            data: [{ value: 'node', label: 'Node' }],
            defaultValue: 'node',
            comboboxProps: { withinPortal: false },
          }),
        ]),
    })
    const html = await renderToString(app)
    expect(html).toContain('Vue')
    expect(html).toContain('tag')
    expect(html).toContain('#fff')
    expect(html).toContain('Node')
  })
})
