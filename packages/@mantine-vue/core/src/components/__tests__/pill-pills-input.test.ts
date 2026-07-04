import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Pill, PillGroup, PillsInput, PillsInputField } from '../../index'

function withProvider(component: any, options: Record<string, any> = {}) {
  return mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => component()),
    },
    options,
  )
}

describe('@mantine-vue/core Pill', () => {
  it('renders content and supports remove button', async () => {
    const onRemove = vi.fn()
    const removeClick = vi.fn()
    const wrapper = withProvider(() =>
      h(
        Pill,
        {
          withRemoveButton: true,
          onRemove,
          removeButtonProps: { 'aria-label': 'Remove pill', onClick: removeClick },
        },
        () => 'Pill label',
      ),
    )

    expect(wrapper.text()).toContain('Pill label')
    expect(wrapper.find('button[aria-label="Remove pill"]').exists()).toBe(true)

    await wrapper.find('button').trigger('click')

    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(removeClick).toHaveBeenCalledTimes(1)
  })

  it('Pill.Group provides size and disabled state to pills', () => {
    const wrapper = withProvider(() =>
      h(PillGroup, { size: 'lg', disabled: true }, () =>
        h(Pill, { withRemoveButton: true }, () => 'Grouped pill'),
      ),
    )
    const pill = wrapper.find('.mantine-Pill-root')

    expect(pill.attributes('data-size')).toBe('lg')
    expect(pill.attributes('data-disabled')).toBe('true')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('exposes Mantine-like static group component', () => {
    expect(Pill.Group).toBe(PillGroup)
  })
})

describe('@mantine-vue/core PillsInput', () => {
  it('focuses field when input root is clicked', async () => {
    const wrapper = withProvider(
      () =>
        h(PillsInput, { label: 'Tags' }, () =>
          h(PillGroup, null, () => [
            h(Pill, null, () => 'Vue'),
            h(PillsInputField, { placeholder: 'Add tag' }),
          ]),
        ),
      { attachTo: document.body },
    )

    await wrapper.find('[data-no-overflow="true"]').trigger('click')
    await nextTick()

    expect(document.activeElement).toBe(wrapper.find('input[placeholder="Add tag"]').element)
    wrapper.unmount()
  })

  it('PillsInput.Field receives disabled, aria and input ref from context', () => {
    const inputRef = ref<HTMLInputElement | null>(null)
    const wrapper = withProvider(() =>
      h(PillsInput, { id: 'tags', error: 'Tags error', disabled: true }, () =>
        h(PillsInputField, { inputRef, placeholder: 'Tags field' }),
      ),
    )
    const input = wrapper.find('input[placeholder="Tags field"]')

    expect(input.attributes('id')).toBe('tags')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('tags-error')
    expect(inputRef.value).toBe(input.element)
  })

  it('exposes Mantine-like static field component', () => {
    expect(PillsInput.Field).toBe(PillsInputField)
  })
})
