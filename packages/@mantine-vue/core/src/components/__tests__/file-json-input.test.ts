import { describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Button,
  FileButton,
  FileInput,
  JsonInput,
  MantineProvider,
  validateJson,
} from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

function setFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: files,
  })
}

describe('@mantine-vue/core JsonInput', () => {
  it('validates and formats JSON on blur', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(JsonInput, {
        defaultValue: '{"a":1}',
        formatOnBlur: true,
        validationError: 'Invalid JSON',
        onChange,
      }),
    )
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{"a":1,"b":2}')
    await textarea.trigger('blur')

    expect(onChange).toHaveBeenLastCalledWith('{\n  "a": 1,\n  "b": 2\n}')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('{\n  "a": 1,\n  "b": 2\n}')

    await textarea.setValue('{bad')
    await textarea.trigger('blur')

    expect(wrapper.text()).toContain('Invalid JSON')
  })

  it('exports validateJson helper', () => {
    expect(validateJson('{"valid": true}', JSON.parse)).toBe(true)
    expect(validateJson('{bad', JSON.parse)).toBe(false)
  })
})

describe('@mantine-vue/core FileButton', () => {
  it('passes onClick to default slot and emits selected file', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(
        FileButton,
        { onChange, accept: 'text/plain' },
        {
          default: ({ onClick }: { onClick: () => void }) =>
            h(Button, { onClick }, () => 'Pick file'),
        },
      ),
    )
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    const input = wrapper.find('input[type="file"]')

    expect(input.attributes('accept')).toBe('text/plain')

    setFiles(input.element as HTMLInputElement, [file])
    await input.trigger('change')

    expect(onChange).toHaveBeenLastCalledWith(file)
  })

  it('supports multiple files and resetRef', async () => {
    const onChange = vi.fn()
    const resetRef = ref<(() => void) | null>(null)
    const wrapper = withProvider(() =>
      h(
        FileButton,
        { onChange, multiple: true, resetRef },
        {
          default: () => h('button', 'Pick files'),
        },
      ),
    )
    const files = [new File(['a'], 'a.txt'), new File(['b'], 'b.txt')]
    const input = wrapper.find('input[type="file"]')

    setFiles(input.element as HTMLInputElement, files)
    await input.trigger('change')

    expect(onChange).toHaveBeenLastCalledWith(files)
    const valueSetter = vi.fn()
    Object.defineProperty(input.element, 'value', {
      configurable: true,
      get: () => 'C:\\fakepath\\a.txt',
      set: valueSetter,
    })
    resetRef.value?.()
    expect(valueSetter).toHaveBeenCalledWith('')
  })
})

describe('@mantine-vue/core FileInput', () => {
  it('renders placeholder, selected file name and clear button', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(FileInput, {
        placeholder: 'Upload file',
        clearable: true,
        onChange,
      }),
    )
    const file = new File(['hello'], 'hello.txt')
    const input = wrapper.find('input[type="file"]')

    expect(wrapper.text()).toContain('Upload file')

    setFiles(input.element as HTMLInputElement, [file])
    await input.trigger('change')

    expect(onChange).toHaveBeenLastCalledWith(file)
    expect(wrapper.text()).toContain('hello.txt')

    await wrapper.find('button.mantine-CloseButton-root').trigger('click')

    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(wrapper.text()).toContain('Upload file')
  })

  it('renders multiple file names', async () => {
    const wrapper = withProvider(() =>
      h(FileInput, { multiple: true, placeholder: 'Upload files' }),
    )
    const files = [new File(['a'], 'a.txt'), new File(['b'], 'b.txt')]
    const input = wrapper.find('input[type="file"]')

    setFiles(input.element as HTMLInputElement, files)
    await input.trigger('change')

    expect(wrapper.text()).toContain('a.txt, b.txt')
  })
})
