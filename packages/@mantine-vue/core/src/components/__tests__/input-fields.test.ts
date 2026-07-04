import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  InputBase,
  MantineProvider,
  PasswordInput,
  PasswordToggleIcon,
  Textarea,
  TextInput,
} from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

describe('@mantine-vue/core input fields', () => {
  it('renders TextInput through InputBase with wrapper props', () => {
    const wrapper = withProvider(() =>
      h(TextInput, {
        id: 'text-input',
        label: 'Text label',
        description: 'Text description',
        error: 'Text error',
        required: true,
        placeholder: 'Type here',
      }),
    )

    const input = wrapper.find('input')
    expect(wrapper.text()).toContain('Text label *')
    expect(wrapper.text()).toContain('Text description')
    expect(wrapper.text()).toContain('Text error')
    expect(input.attributes('id')).toBe('text-input')
    expect(input.attributes('aria-describedby')).toBe('text-input-error text-input-description')
    expect(input.attributes('placeholder')).toBe('Type here')
  })

  it('does not set error state for empty string error props', () => {
    const wrapper = withProvider(() =>
      h('div', [
        h(TextInput, { id: 'text-input-empty-error', error: '', label: 'Text input' }),
        h(PasswordInput, { id: 'password-input-empty-error', error: '', label: 'Password input' }),
      ]),
    )

    const textInput = wrapper.find('#text-input-empty-error')
    const passwordInput = wrapper.find('#password-input-empty-error')

    expect(textInput.attributes('data-error')).toBeUndefined()
    expect(textInput.attributes('aria-invalid')).toBeUndefined()
    expect(passwordInput.attributes('data-invalid')).toBeUndefined()
    expect(wrapper.find('.mantine-InputWrapper-error').exists()).toBe(false)
  })

  it('preserves explicit boolean error state', () => {
    const wrapper = withProvider(() =>
      h(TextInput, { id: 'text-input-boolean-error', error: true, label: 'Text input' }),
    )

    const input = wrapper.find('#text-input-boolean-error')

    expect(input.attributes('data-error')).toBeDefined()
    expect(input.attributes('aria-invalid')).toBe('true')
  })

  it('renders InputBase directly', () => {
    const wrapper = withProvider(() => h(InputBase, { id: 'base', label: 'Base label' }))

    expect(wrapper.find('.mantine-InputWrapper-label').text()).toBe('Base label')
    expect(wrapper.find('input').attributes('id')).toBe('base')
  })

  it('renders Textarea as a multiline input with bottom section', () => {
    const wrapper = withProvider(() =>
      h(Textarea, {
        id: 'textarea',
        label: 'Textarea label',
        resize: 'vertical',
        bottomSection: 'Bottom',
        minRows: 3,
      }),
    )

    const root = wrapper.find('.mantine-Input-wrapper')
    const textarea = wrapper.find('textarea')

    expect(root.attributes('data-multiline')).toBe('true')
    expect(root.attributes('data-with-bottom-section')).toBe('true')
    expect(textarea.exists()).toBe(true)
    expect(textarea.attributes('rows')).toBe('3')
    expect(wrapper.text()).toContain('Bottom')
  })

  it('toggles password visibility and calls onVisibilityChange', async () => {
    const onVisibilityChange = vi.fn()
    const wrapper = withProvider(() =>
      h(PasswordInput, {
        id: 'password',
        label: 'Password',
        defaultVisible: false,
        onVisibilityChange,
        value: 'secret',
      }),
    )

    expect(wrapper.find('input').attributes('type')).toBe('password')
    await wrapper.find('[aria-label="Toggle password visibility"]').trigger('mousedown')
    expect(onVisibilityChange).toHaveBeenCalledWith(true)
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('supports controlled password visibility and custom icon', async () => {
    const onVisibilityChange = vi.fn()
    const wrapper = withProvider(() =>
      h(PasswordInput, {
        visible: true,
        onVisibilityChange,
        visibilityToggleIcon: (props: any) =>
          h('span', { class: 'custom-icon' }, props.reveal ? 'hide' : 'show'),
      }),
    )

    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(wrapper.find('.custom-icon').text()).toBe('hide')
    await wrapper.find('[aria-label="Toggle password visibility"]').trigger('mousedown')
    expect(onVisibilityChange).toHaveBeenCalledWith(false)
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('exposes PasswordToggleIcon', () => {
    expect(PasswordToggleIcon).toBeTruthy()
  })
})
