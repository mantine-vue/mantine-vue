import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { useActiveElement, type UseActiveElementOptions } from './use-active-element'

function createInput(id?: string) {
  const input = document.createElement('input')
  if (id) {
    input.id = id
  }
  document.body.appendChild(input)
  return input
}

function renderHook(options?: any) {
  let result!: ReturnType<typeof useActiveElement>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useActiveElement(options)
        return () => null
      },
    }),
  )
  return { result, unmount: () => wrapper.unmount() }
}

let observe: Mock
let disconnect: Mock
let observerCallback: MutationCallback
let originalMutationObserver: typeof MutationObserver

function triggerObserver(records: Partial<MutationRecord>[]) {
  observerCallback(records as MutationRecord[], {} as MutationObserver)
}

beforeEach(() => {
  observe = vi.fn()
  disconnect = vi.fn()
  observerCallback = () => {}
  originalMutationObserver = window.MutationObserver

  window.MutationObserver = class {
    constructor(callback: MutationCallback) {
      observerCallback = callback
    }

    observe = observe
    disconnect = disconnect
    takeRecords = () => []
  } as unknown as typeof MutationObserver
})

afterEach(() => {
  window.MutationObserver = originalMutationObserver
  document.body.innerHTML = ''
})

describe('@mantine-vue/hooks/use-active-element', () => {
  it('returns the currently focused element', () => {
    const input = createInput('test-input')
    const { result } = renderHook()
    input.focus()
    expect(result.value).toBe(input)
  })

  it('updates when focus moves between elements', () => {
    const first = createInput('first')
    const second = createInput('second')
    const { result } = renderHook()

    first.focus()
    expect(result.value).toBe(first)

    second.focus()
    expect(result.value).toBe(second)
  })

  it('updates when focus is lost', () => {
    const input = createInput()
    const { result } = renderHook()

    input.focus()
    expect(result.value).toBe(input)

    input.blur()
    expect(result.value).toBe(document.body)
  })

  it('pierces shadow roots when deep is true (default)', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const input = document.createElement('input')
    shadow.appendChild(input)

    const { result } = renderHook()
    input.focus()
    expect(result.value).toBe(input)
  })

  it('does not pierce shadow roots when deep is false', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const input = document.createElement('input')
    shadow.appendChild(input)

    const { result } = renderHook({ deep: false })
    input.focus()
    expect(result.value).toBe(host)
  })

  it('observes the shadow root of the active element for removals when deep', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const input = document.createElement('input')
    shadow.appendChild(input)

    renderHook()
    input.focus()
    expect(observe).toHaveBeenCalledWith(shadow, { childList: true, subtree: true })
  })

  it('observes document.body and re-reads when the focused element is removed', () => {
    const input = createInput()
    const { result } = renderHook()

    expect(observe).toHaveBeenCalledWith(document.body, { childList: true, subtree: true })

    input.focus()
    expect(result.value).toBe(input)

    input.remove()
    triggerObserver([{ removedNodes: [input] as unknown as NodeList }])
    expect(result.value).toBe(document.body)
  })

  it('ignores mutations that do not remove nodes', () => {
    const input = createInput()
    const { result } = renderHook()

    input.focus()
    expect(result.value).toBe(input)

    triggerObserver([{ removedNodes: [] as unknown as NodeList }])
    expect(result.value).toBe(input)
  })

  it('does not observe removal when triggerOnRemoval is false', () => {
    renderHook({ triggerOnRemoval: false })
    expect(observe).not.toHaveBeenCalled()
  })

  it('resubscribes when reactive options change', async () => {
    const options = ref<UseActiveElementOptions>({ triggerOnRemoval: false })
    renderHook(options)
    expect(observe).not.toHaveBeenCalled()

    options.value = { triggerOnRemoval: true }
    await nextTick()
    expect(observe).toHaveBeenCalledWith(document.body, { childList: true, subtree: true })
  })

  it('removes listeners and disconnects observer on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook()

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('focusin', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('focusout', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('blur', expect.any(Function), true)
    expect(disconnect).toHaveBeenCalled()

    removeSpy.mockRestore()
  })
})
