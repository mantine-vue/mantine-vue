import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useHover } from './use-hover'

describe('@mantine-vue/hooks/use-hover', () => {
  it('tracks an element rendered after mount', async () => {
    const visible = ref(false)
    const state: { hovered?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const hover = useHover<HTMLDivElement>()
          state.hovered = hover.hovered
          return () => (visible.value ? h('div', { ref: hover.ref, id: 'target' }) : null)
        },
      }),
    )

    visible.value = true
    await nextTick()

    await wrapper.get('#target').trigger('mouseenter')
    expect(state.hovered?.value).toBe(true)

    await wrapper.get('#target').trigger('mouseleave')
    expect(state.hovered?.value).toBe(false)

    wrapper.unmount()
  })

  it('follows the element when it is replaced', async () => {
    const key = ref('first')
    const state: { hovered?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const hover = useHover<HTMLDivElement>()
          state.hovered = hover.hovered
          return () => h('div', { ref: hover.ref, key: key.value, id: key.value })
        },
      }),
    )

    key.value = 'second'
    await nextTick()

    await wrapper.get('#second').trigger('mouseenter')
    expect(state.hovered?.value).toBe(true)

    wrapper.unmount()
  })

  it('resets hovered when the element is removed', async () => {
    const visible = ref(true)
    const state: { hovered?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const hover = useHover<HTMLDivElement>()
          state.hovered = hover.hovered
          return () => (visible.value ? h('div', { ref: hover.ref, id: 'target' }) : null)
        },
      }),
    )

    await wrapper.get('#target').trigger('mouseenter')
    expect(state.hovered?.value).toBe(true)

    visible.value = false
    await nextTick()

    expect(state.hovered?.value).toBe(false)

    wrapper.unmount()
  })

  it('resets hovered and removes listeners when the element is replaced', async () => {
    const key = ref('first')
    const state: { hovered?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const hover = useHover<HTMLDivElement>()
          state.hovered = hover.hovered
          return () => h('div', { ref: hover.ref, key: key.value, id: key.value })
        },
      }),
    )

    const oldElement = wrapper.get('#first').element

    await wrapper.get('#first').trigger('mouseenter')
    expect(state.hovered?.value).toBe(true)

    key.value = 'second'
    await nextTick()

    expect(state.hovered?.value).toBe(false)

    oldElement.dispatchEvent(new MouseEvent('mouseenter'))
    expect(state.hovered?.value).toBe(false)

    await wrapper.get('#second').trigger('mouseenter')
    expect(state.hovered?.value).toBe(true)

    wrapper.unmount()
  })

  it('removes event listeners on unmount', async () => {
    const state: { hovered?: Ref<boolean> } = {}

    const wrapper = mount(
      defineComponent({
        setup() {
          const hover = useHover<HTMLDivElement>()
          state.hovered = hover.hovered
          return () => h('div', { ref: hover.ref, id: 'target' })
        },
      }),
    )

    const element = wrapper.get('#target').element

    await wrapper.get('#target').trigger('mouseenter')
    expect(state.hovered?.value).toBe(true)

    wrapper.unmount()

    element.dispatchEvent(new MouseEvent('mouseleave'))

    expect(state.hovered?.value).toBe(true)
  })
})
