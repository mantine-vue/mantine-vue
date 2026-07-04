import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { FocusTrap, FocusTrapInitialFocus, MantineProvider } from '../../index'

function withProvider(props: Record<string, any> = {}) {
  const target = document.createElement('div')
  document.body.appendChild(target)

  return mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(FocusTrap, props, () =>
            h('div', [
              h('button', { 'data-testid': 'first' }, 'First'),
              h('input', { 'data-testid': 'auto', 'data-autofocus': '', value: 'auto' }),
              h('button', { 'data-testid': 'last' }, 'Last'),
            ]),
          ),
        ),
    },
    { attachTo: target },
  )
}

describe('@mantine-vue/core FocusTrap', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('focuses data-autofocus element on mount', async () => {
    const wrapper = withProvider()

    await vi.runAllTimersAsync()

    expect(document.activeElement).toBe(wrapper.find('[data-testid="auto"]').element)
  })

  it('does not focus elements when inactive', async () => {
    const wrapper = withProvider({ active: false })
    const autofocus = wrapper.find('[data-testid="auto"]').element as HTMLInputElement
    const focus = vi.spyOn(autofocus, 'focus')

    await vi.runAllTimersAsync()

    expect(focus).not.toHaveBeenCalled()
  })

  it('keeps tab focus scoped inside root', async () => {
    const wrapper = withProvider()

    await vi.runAllTimersAsync()

    const first = wrapper.find('[data-testid="first"]').element as HTMLButtonElement
    const last = wrapper.find('[data-testid="last"]').element as HTMLButtonElement
    last.focus()

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    document.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(first)
  })

  it('supports InitialFocus helper', () => {
    const wrapper = mount({
      render: () => h(MantineProvider, { env: 'test' }, () => h(FocusTrapInitialFocus)),
    })
    const element = wrapper.find('[data-autofocus]')

    expect(element.exists()).toBe(true)
    expect(element.attributes('tabindex')).toBe('-1')
  })

  it('exposes InitialFocus on FocusTrap namespace', () => {
    expect(FocusTrap.InitialFocus).toBe(FocusTrapInitialFocus)
  })
})
