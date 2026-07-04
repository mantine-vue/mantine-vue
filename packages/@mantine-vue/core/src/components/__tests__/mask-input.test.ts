import { describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, MaskInput } from '../../index'

function render(props: Record<string, any>) {
  return mount({ render: () => h(MantineProvider, { env: 'test' }, () => h(MaskInput, props)) })
}

describe('@mantine-vue/core MaskInput', () => {
  it('formats defaultValue on mount without notifying change handlers', () => {
    const onChangeRaw = vi.fn()
    const onComplete = vi.fn()
    const wrapper = render({
      mask: '(999) 999-9999',
      defaultValue: '1234567890',
      onChangeRaw,
      onComplete,
    })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('(123) 456-7890')
    expect(onChangeRaw).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('filters invalid input and emits raw and completed values', async () => {
    const onChangeRaw = vi.fn()
    const onComplete = vi.fn()
    const wrapper = render({ mask: '999-999', onChangeRaw, onComplete })
    await wrapper.find('input').setValue('12a3456')
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('123-456')
    expect(onChangeRaw).toHaveBeenLastCalledWith('123456', '123-456')
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('clears value and emits an empty raw value through resetRef', async () => {
    const resetRef = ref<(() => void) | null>(null)
    const onChangeRaw = vi.fn()
    const wrapper = render({ mask: '999-999', resetRef, onChangeRaw })
    await wrapper.find('input').setValue('123')
    resetRef.value!()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
    expect(onChangeRaw).toHaveBeenLastCalledWith('', '')
  })

  it('shows slots on focus and hides an empty mask on blur', async () => {
    const wrapper = render({ mask: '99/99', slotChar: '_' })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect((input.element as HTMLInputElement).value).toBe('__/__')
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('supports custom tokens and transforms', async () => {
    const wrapper = render({
      mask: 'LL-99',
      tokens: { L: /[a-z]/i, '9': /[0-9]/ },
      transform: (char: string) => char.toUpperCase(),
    })
    await wrapper.find('input').setValue('ab12')
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('AB-12')
  })

  it('auto-clears incomplete values on blur', async () => {
    const onChangeRaw = vi.fn()
    const wrapper = render({ mask: '999', autoClear: true, onChangeRaw })
    const input = wrapper.find('input')
    await input.setValue('12')
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('')
    expect(onChangeRaw).toHaveBeenLastCalledWith('', '')
  })
})
