import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useScroller } from './use-scroller'

function renderHook<T>(hook: () => T) {
  let result!: T
  mount(
    defineComponent({
      setup() {
        result = hook()
        return () => null
      },
    }),
  )
  return { result }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('@mantine-vue/hooks/use-scroller', () => {
  it('does not swallow the next click after a drag ended by leaving the container', async () => {
    const { result } = renderHook(() => useScroller())
    const container = document.createElement('div')
    document.body.appendChild(container)
    result.ref(container)
    await nextTick()

    const { onMousedown, onMousemove, onMouseleave } = result.dragHandlers
    onMousedown(new MouseEvent('mousedown', { clientX: 0 }))
    const move = new MouseEvent('mousemove')
    Object.defineProperty(move, 'pageX', { value: 50 })
    onMousemove(move)
    onMouseleave()
    onMousedown(new MouseEvent('mousedown', { clientX: 0 }))

    const onClick = vi.fn()
    container.addEventListener('click', onClick)
    container.click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
