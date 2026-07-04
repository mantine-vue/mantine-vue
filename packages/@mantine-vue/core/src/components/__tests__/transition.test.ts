import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Transition } from '../../index'

function renderTransition() {
  const opened = ref(false)
  const wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          h(MantineProvider, { env: 'default' }, () =>
            h(
              Transition,
              { mounted: opened.value, transition: 'fade', duration: 200 },
              {
                default: (styles: any) =>
                  h('div', { class: 'target', style: styles }, 'Transition content'),
              },
            ),
          )
      },
    }),
  )

  return { wrapper, opened }
}

async function advanceFrame() {
  await vi.advanceTimersByTimeAsync(16)
  await nextTick()
}

describe('@mantine-vue/core Transition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(Date.now()), 16),
    )
    vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('animates enter and exit states before unmounting', async () => {
    const { wrapper, opened } = renderTransition()

    expect(wrapper.find('.target').exists()).toBe(false)

    opened.value = true
    await nextTick()

    expect(wrapper.find('.target').attributes('style')).toContain('opacity: 1')
    expect(wrapper.find('.target').attributes('style')).toContain('animation-name:')

    await vi.advanceTimersByTimeAsync(200)
    await nextTick()
    expect(wrapper.find('.target').attributes('style')).toContain('opacity: 1')

    opened.value = false
    await nextTick()
    expect(wrapper.find('.target').exists()).toBe(true)
    expect(wrapper.find('.target').attributes('style')).toContain('opacity: 0')

    await advanceFrame()
    await vi.advanceTimersByTimeAsync(200)
    await nextTick()
    expect(wrapper.find('.target').exists()).toBe(false)
  })
})
