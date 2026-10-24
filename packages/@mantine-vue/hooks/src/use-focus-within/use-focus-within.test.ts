import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useFocusWithin } from './use-focus-within'

describe('@mantine-vue/hooks/use-focus-within', () => {
  it('tracks focus within an element', async () => {
    const state: { focused?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const focus = useFocusWithin<HTMLDivElement>()
          state.focused = focus.focused

          return () => h('div', { ref: focus.ref }, [h('input', { id: 'input' })])
        },
      }),
      { attachTo: document.body },
    )

    expect(state.focused?.value).toBe(false)

    wrapper.get('#input').element.focus()
    expect(state.focused?.value).toBe(true)

    wrapper.get('#input').element.blur()
    await nextTick()

    expect(state.focused?.value).toBe(false)

    wrapper.unmount()
  })

  it('calls onFocus and onBlur when focus enters and leaves', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    const wrapper = mount(
      defineComponent({
        setup() {
          const focus = useFocusWithin({
            onFocus,
            onBlur,
          })

          return () => h('div', { ref: focus.ref }, [h('input', { id: 'input' })])
        },
      }),
      { attachTo: document.body },
    )

    wrapper.get('#input').element.focus()

    expect(onFocus).toHaveBeenCalledOnce()
    expect(onFocus).toHaveBeenCalledWith(expect.any(FocusEvent))
    expect(onBlur).not.toHaveBeenCalled()

    wrapper.get('#input').element.blur()
    await nextTick()

    expect(onBlur).toHaveBeenCalledOnce()
    expect(onBlur).toHaveBeenCalledWith(expect.any(FocusEvent))

    wrapper.unmount()
  })

  it('tracks an element rendered after mount', async () => {
    const visible = ref(false)
    const state: { focused?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const focus = useFocusWithin<HTMLDivElement>()
          state.focused = focus.focused

          return () =>
            visible.value ? h('div', { ref: focus.ref }, [h('input', { id: 'input' })]) : null
        },
      }),
      { attachTo: document.body },
    )

    visible.value = true
    await nextTick()

    wrapper.get('#input').element.focus()

    expect(state.focused?.value).toBe(true)

    wrapper.unmount()
  })

  it('resets focused when the element is removed', async () => {
    const visible = ref(true)
    const state: { focused?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const focus = useFocusWithin<HTMLDivElement>()
          state.focused = focus.focused

          return () =>
            visible.value ? h('div', { ref: focus.ref }, [h('input', { id: 'input' })]) : null
        },
      }),
      { attachTo: document.body },
    )

    wrapper.get('#input').element.focus()
    expect(state.focused?.value).toBe(true)

    visible.value = false
    await nextTick()

    expect(state.focused?.value).toBe(false)

    wrapper.unmount()
  })

  it('follows the element when it is replaced', async () => {
    const key = ref('first')
    const state: { focused?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const focus = useFocusWithin<HTMLDivElement>()
          state.focused = focus.focused

          return () => h('div', { ref: focus.ref, key: key.value }, [h('input', { id: key.value })])
        },
      }),
      { attachTo: document.body },
    )

    wrapper.get('#first').element.focus()
    expect(state.focused?.value).toBe(true)

    key.value = 'second'
    await nextTick()

    expect(state.focused?.value).toBe(false)

    wrapper.get('#second').element.focus()
    expect(state.focused?.value).toBe(true)

    wrapper.unmount()
  })

  it('removes listeners from the replaced element', async () => {
    const key = ref('first')
    const state: { focused?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const focus = useFocusWithin<HTMLDivElement>()
          state.focused = focus.focused

          return () => h('div', { ref: focus.ref, key: key.value }, [h('input', { id: key.value })])
        },
      }),
      { attachTo: document.body },
    )

    const oldElement = wrapper.element

    key.value = 'second'
    await nextTick()

    oldElement.dispatchEvent(new FocusEvent('focusin'))

    expect(state.focused?.value).toBe(false)

    wrapper.get('#second').element.focus()
    expect(state.focused?.value).toBe(true)

    wrapper.unmount()
  })

  it('ignores pending focusout callbacks after replacement', async () => {
    const key = ref('first')
    const onBlur = vi.fn()
    const state: { focused?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const focus = useFocusWithin<HTMLDivElement>({ onBlur })
          state.focused = focus.focused

          return () => h('div', { ref: focus.ref, key: key.value }, [h('input', { id: key.value })])
        },
      }),
      { attachTo: document.body },
    )

    wrapper.get('#first').element.focus()
    expect(state.focused?.value).toBe(true)

    wrapper.get('#first').element.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))

    key.value = 'second'
    await nextTick()

    expect(state.focused?.value).toBe(false)
    expect(onBlur).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('removes event listeners on unmount', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const state: { focused?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const focus = useFocusWithin<HTMLDivElement>({
            onFocus,
            onBlur,
          })

          state.focused = focus.focused

          return () => h('div', { ref: focus.ref }, [h('input', { id: 'input' })])
        },
      }),
      { attachTo: document.body },
    )

    const element = wrapper.element

    wrapper.unmount()

    element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    element.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))

    await nextTick()

    expect(state.focused?.value).toBe(false)
    expect(onFocus).not.toHaveBeenCalled()
    expect(onBlur).not.toHaveBeenCalled()
  })
})
