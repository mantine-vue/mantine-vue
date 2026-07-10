import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
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

// The transition state machine advances across several chained microtasks
// (nextTick -> forced reflow -> nextTick). Draining a handful of ticks is a
// robust way to let it settle without hard-coding the exact microtask count.
async function flush(times = 5) {
  for (let i = 0; i < times; i++) {
    await nextTick()
  }
}

async function open(opened: Ref<boolean>) {
  opened.value = true
  await flush()
  await vi.advanceTimersByTimeAsync(200)
  await nextTick()
}

describe('@mantine-vue/core Transition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('mounts and animates in using a real CSS transition', async () => {
    const { wrapper, opened } = renderTransition()

    expect(wrapper.find('.target').exists()).toBe(false)

    await open(opened)

    expect(wrapper.find('.target').exists()).toBe(true)
    const style = wrapper.find('.target').attributes('style')
    expect(style).toContain('opacity: 1')
    expect(style).toContain('transition-duration: 200ms')
    expect(style).not.toContain('animation-name')
  })

  it('keeps the element mounted and animates out for the full exit duration', async () => {
    const { wrapper, opened } = renderTransition()
    await open(opened)
    expect(wrapper.find('.target').exists()).toBe(true)

    opened.value = false
    await nextTick()
    // regression check: the element must not disappear the instant close is requested
    expect(wrapper.find('.target').exists()).toBe(true)

    await flush()
    // still mounted while the exit CSS transition is running
    expect(wrapper.find('.target').exists()).toBe(true)
    const style = wrapper.find('.target').attributes('style')
    expect(style).toContain('opacity: 0')
    expect(style).toContain('transition-duration: 200ms')

    await vi.advanceTimersByTimeAsync(150)
    await nextTick()
    // mid-way through the exit duration the element must still be in the DOM
    expect(wrapper.find('.target').exists()).toBe(true)

    await vi.advanceTimersByTimeAsync(50)
    await nextTick()
    expect(wrapper.find('.target').exists()).toBe(false)
  })

  it('respects a distinct exitDuration', async () => {
    const opened = ref(false)
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(MantineProvider, { env: 'default' }, () =>
              h(
                Transition,
                {
                  mounted: opened.value,
                  transition: 'fade',
                  duration: 200,
                  exitDuration: 50,
                },
                {
                  default: (styles: any) => h('div', { class: 'target', style: styles }, 'x'),
                },
              ),
            )
        },
      }),
    )

    await open(opened)

    opened.value = false
    await flush()
    expect(wrapper.find('.target').attributes('style')).toContain('transition-duration: 50ms')

    await vi.advanceTimersByTimeAsync(50)
    await nextTick()
    expect(wrapper.find('.target').exists()).toBe(false)
  })
})
