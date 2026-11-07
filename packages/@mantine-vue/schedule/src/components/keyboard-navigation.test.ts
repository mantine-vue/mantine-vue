import { describe, expect, it, vi } from 'vitest'
import { handleGridKeydown } from './keyboard-navigation'

describe('@mantine-vue/schedule keyboard navigation', () => {
  it('mirrors horizontal arrow keys in RTL', () => {
    const controls = Array.from({ length: 3 }, () => ({
      disabled: false,
      hasAttribute: () => false,
      focus: vi.fn(),
    })) as unknown as HTMLButtonElement[]

    handleGridKeydown({
      event: new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }),
      index: 1,
      columns: 3,
      total: 3,
      getControl: (index) => controls[index],
      dir: 'rtl',
    })

    expect(controls[0].focus).toHaveBeenCalledOnce()
    expect(controls[2].focus).not.toHaveBeenCalled()
  })
})
