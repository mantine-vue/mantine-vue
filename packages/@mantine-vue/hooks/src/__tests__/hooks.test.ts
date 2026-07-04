import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import {
  useCollapse,
  useCounter,
  useDisclosure,
  useHotkeys,
  useHorizontalCollapse,
  usePagination,
  useReducedMotion,
  useToggle,
  useUncontrolled,
} from '../index'

describe('@mantine-vue/hooks', () => {
  it('implements disclosure handlers with Vue refs', () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    const [opened, handlers] = useDisclosure(false, { onOpen, onClose })

    handlers.open()
    expect(opened.value).toBe(true)
    expect(onOpen).toHaveBeenCalledTimes(1)

    handlers.close()
    expect(opened.value).toBe(false)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('supports uncontrolled state', () => {
    const [value, setValue, controlled] = useUncontrolled({ defaultValue: 1 })
    expect(controlled.value).toBe(false)
    setValue(2)
    expect(value.value).toBe(2)
  })

  it('supports counter and toggle primitives', () => {
    const [count, counter] = useCounter(1)
    counter.increment()
    expect(count.value).toBe(2)

    const [state, toggle] = useToggle(['a', 'b'] as const)
    toggle()
    expect(state.value).toBe('b')
  })

  it('creates Mantine-compatible pagination ranges and handlers', () => {
    const onChange = vi.fn()
    const pagination = usePagination({ total: 10, onChange })

    expect(pagination.active.value).toBe(1)
    expect(pagination.range.value).toEqual([1, 2, 3, 4, 5, 'dots', 10])

    pagination.setPage(6)
    expect(pagination.active.value).toBe(6)
    expect(pagination.range.value).toEqual([1, 'dots', 5, 6, 7, 'dots', 10])
    expect(onChange).toHaveBeenLastCalledWith(6)

    pagination.next()
    expect(pagination.active.value).toBe(7)
    pagination.previous()
    expect(pagination.active.value).toBe(6)

    pagination.setPage(100)
    expect(pagination.active.value).toBe(10)
    pagination.setPage(-100)
    expect(pagination.active.value).toBe(1)
  })

  it('supports pagination startValue', () => {
    const pagination = usePagination({ total: 12, startValue: 10 })

    expect(pagination.active.value).toBe(10)
    expect(pagination.range.value).toEqual([10, 11, 12])
    pagination.last()
    expect(pagination.active.value).toBe(12)
  })

  it('supports reduced motion media query wrapper', () => {
    const reducedMotion = useReducedMotion(false, { getInitialValueInEffect: false })
    expect(reducedMotion.value).toBe(false)
  })

  it('handles hotkeys and ignores inputs by default', async () => {
    const handler = vi.fn()
    const wrapper = mount(
      defineComponent({
        setup() {
          useHotkeys([['mod + K', handler]])
          return () => h('input')
        },
      }),
      { attachTo: document.body },
    )

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    expect(handler).toHaveBeenCalledTimes(1)

    await wrapper.find('input').trigger('keydown', { key: 'k', ctrlKey: true })
    expect(handler).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('creates vertical and horizontal collapse props from refs', () => {
    const expanded = ref(false)
    const collapse = useCollapse({ expanded, keepMounted: false })
    const horizontal = useHorizontalCollapse({ expanded, keepMounted: false })

    expect(collapse.state.value).toBe('exited')
    expect(collapse.getCollapseProps().style).toMatchObject({
      height: 0,
      overflow: 'hidden',
      display: 'none',
    })
    expect(collapse.getCollapseProps()['aria-hidden']).toBe(true)
    expect(horizontal.getCollapseProps().style).toMatchObject({
      width: 0,
      overflow: 'hidden',
      display: 'none',
    })
  })
})
