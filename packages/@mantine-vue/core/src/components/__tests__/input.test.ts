import { describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Input,
  InputClearButton,
  InputDescription,
  InputError,
  InputLabel,
  InputPlaceholder,
  InputWrapper,
  MantineProvider,
} from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

describe('@mantine-vue/core Input', () => {
  it('renders input sections and state attributes', () => {
    const wrapper = withProvider(() =>
      h(Input, {
        leftSection: 'left',
        rightSection: 'right',
        error: true,
        pointer: true,
        disabled: true,
        variant: 'filled',
        inputSize: '5',
      }),
    )

    const root = wrapper.find('.mantine-Input-wrapper')
    const input = wrapper.find('input')

    expect(root.attributes('data-error')).toBe('true')
    expect(root.attributes('data-pointer')).toBe('true')
    expect(root.attributes('data-with-left-section')).toBe('true')
    expect(root.attributes('data-with-right-section')).toBe('true')
    expect(root.attributes('data-variant')).toBe('filled')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('size')).toBe('5')
    expect(wrapper.text()).toContain('left')
    expect(wrapper.text()).toContain('right')
  })

  it('connects wrapper label, description, error and input aria attributes', () => {
    const wrapper = withProvider(() =>
      h(
        InputWrapper,
        {
          id: 'test-id',
          label: 'Label',
          description: 'Description',
          error: 'Error',
          required: true,
        },
        () => h(Input),
      ),
    )

    const input = wrapper.find('input')
    const label = wrapper.find('.mantine-InputWrapper-label')
    const description = wrapper.find('#test-id-description')
    const error = wrapper.find('#test-id-error')

    expect(label.text()).toContain('Label *')
    expect(description.text()).toBe('Description')
    expect(error.text()).toBe('Error')
    expect(input.attributes('id')).toBe('test-id')
    expect(input.attributes('aria-describedby')).toBe('test-id-error test-id-description')
  })

  it('does not render boolean error in wrapper', () => {
    const wrapper = withProvider(() =>
      h(InputWrapper, { id: 'test-id', error: true }, () => h(Input)),
    )

    expect(wrapper.find('.mantine-InputWrapper-error').exists()).toBe(false)
  })

  it('supports custom label element and standalone helper components', () => {
    const wrapper = withProvider(() =>
      h('div', [
        h(InputWrapper, { id: 'test-id', label: 'Label', labelElement: 'div' }, () => h(Input)),
        h(InputLabel, { required: true }, () => 'Standalone label'),
        h(InputDescription, null, () => 'Standalone description'),
        h(InputError, null, () => 'Standalone error'),
        h(InputPlaceholder, { error: true }, () => 'Placeholder'),
      ]),
    )

    expect(wrapper.find('.mantine-InputWrapper-label').element.tagName).toBe('DIV')
    expect(wrapper.text()).toContain('Standalone label *')
    expect(wrapper.text()).toContain('Standalone description')
    expect(wrapper.text()).toContain('Standalone error')
    expect(wrapper.text()).toContain('Placeholder')
  })

  it('renders clear sections and clear button', async () => {
    const onClick = vi.fn()
    const wrapper = withProvider(() =>
      h(Input, {
        __clearable: true,
        __clearSection: h(InputClearButton, { onClick, 'aria-label': 'clear value' }),
        rightSection: 'right',
      }),
    )

    expect(wrapper.find('[data-combined-clear-section]').exists()).toBe(true)
    expect(wrapper.text()).toContain('right')
    await wrapper.find('[aria-label="clear value"]').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('assigns rootRef to the wrapper element', () => {
    const rootRef = ref<HTMLElement | null>(null)

    withProvider(() => h(Input, { rootRef }))

    expect(rootRef.value?.className).toContain('mantine-Input-wrapper')
  })

  it('exposes compound components', () => {
    expect(Input.Wrapper).toBe(InputWrapper)
    expect(Input.Label).toBe(InputLabel)
    expect(Input.Description).toBe(InputDescription)
    expect(Input.Error).toBe(InputError)
    expect(Input.Placeholder).toBe(InputPlaceholder)
    expect(Input.ClearButton).toBe(InputClearButton)
  })
})
