import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { DatePicker, DatePickerInput } from '../index'
import { cleanupRenderedComponents, render, press } from './test-utils'

cleanupRenderedComponents()

describe('@mantine-vue/dates presets', () => {
  it('moves focus between presets with arrow keys', async () => {
    render(DatePicker, {
      presets: [
        { value: '2022-04-11', label: 'First' },
        { value: '2022-04-12', label: 'Second' },
      ],
    })
    const presets = document.querySelectorAll<HTMLButtonElement>('[data-preset]')
    expect(presets[0].getAttribute('tabindex')).toBe('0')
    expect(presets[1].getAttribute('tabindex')).toBe('-1')
    presets[0].focus()
    await press(presets[0], 'ArrowDown')
    expect(document.activeElement).toBe(presets[1])
    expect(presets[1].getAttribute('tabindex')).toBe('0')
  })

  it('marks picker input dropdown with presets', async () => {
    render(DatePickerInput, {
      presets: [{ value: '2022-04-11', label: 'Preset' }],
      label: 'Pick date',
    })
    document.querySelector<HTMLButtonElement>('button')!.click()
    await nextTick()
    await nextTick()
    expect(document.querySelector('[data-dates-dropdown]')?.hasAttribute('data-with-presets')).toBe(
      true,
    )
  })
})
