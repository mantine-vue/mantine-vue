import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  getArrowMergeDropdownStyles,
  getArrowPositionStyles,
  getFloatingPosition,
  useContextMenuHandlers,
  useDelayedHover,
} from '../../utils/Floating'

describe('@mantine-vue/core Floating utilities', () => {
  it('mirrors horizontal positions in rtl direction', () => {
    expect(getFloatingPosition('ltr', 'right-start')).toBe('right-start')
    expect(getFloatingPosition('rtl', 'right-start')).toBe('left-start')
    expect(getFloatingPosition('rtl', 'left-end')).toBe('right-end')
    expect(getFloatingPosition('rtl', 'top')).toBe('top')
  })

  it('calculates centered and merged arrow styles', () => {
    const centered = getArrowPositionStyles({
      position: 'top',
      arrowSize: 7,
      arrowOffset: 5,
      arrowRadius: 0,
      arrowPosition: 'center',
      arrowX: 10,
      arrowY: 10,
      dir: 'ltr',
    })
    const merged = getArrowPositionStyles({
      position: 'bottom-start',
      arrowSize: 7,
      arrowOffset: 5,
      arrowRadius: 0,
      arrowPosition: 'merge',
      arrowX: 10,
      arrowY: 10,
      dir: 'ltr',
    })
    expect(centered.transform).toBe('rotate(45deg)')
    expect(centered.bottom).toBe(-3.5)
    expect(merged.clipPath).toBeDefined()
    expect(getArrowMergeDropdownStyles({ position: 'bottom-start', dir: 'ltr' })).toEqual({
      borderTopLeftRadius: 0,
    })
  })

  it('opens context menus at a virtual cursor reference', async () => {
    const open = vi.fn()
    const setReference = vi.fn()
    const wrapper = mount(
      defineComponent({
        setup() {
          const handlers = useContextMenuHandlers({
            childProps: {},
            opened: false,
            setReference,
            open,
          })
          return () => h('button', handlers, 'Target')
        },
      }),
    )
    await wrapper.find('button').trigger('contextmenu', { clientX: 20, clientY: 30 })
    expect(open).toHaveBeenCalledOnce()
    const virtual = setReference.mock.calls[0][0]
    expect(virtual.getBoundingClientRect()).toMatchObject({ x: 20, y: 30, width: 0, height: 0 })
  })

  it('supports delayed hover and cancels the opposite pending action', () => {
    vi.useFakeTimers()
    const open = vi.fn()
    const close = vi.fn()
    let handlers!: ReturnType<typeof useDelayedHover>
    const wrapper = mount(
      defineComponent({
        setup() {
          handlers = useDelayedHover({ open, close, openDelay: 100, closeDelay: 50 })
          return () => null
        },
      }),
    )
    handlers.openDropdown()
    vi.advanceTimersByTime(50)
    handlers.closeDropdown()
    vi.advanceTimersByTime(50)
    expect(open).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalledOnce()
    wrapper.unmount()
    vi.useRealTimers()
  })
})
