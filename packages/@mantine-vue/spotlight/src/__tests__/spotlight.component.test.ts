import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { MantineProvider } from '@mantine-vue/core'
import { createSpotlightStore, openSpotlightAction } from '../spotlight.store'
import { Spotlight } from '../components/Spotlight'

describe('@mantine-vue/spotlight component', () => {
  it('opens with Ctrl+K shortcut', async () => {
    const store = createSpotlightStore()

    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () =>
          h(Spotlight, {
            store,
            actions: [{ id: 'home', label: 'Home', description: 'Go home' }],
            transitionProps: { duration: 0 },
            withinPortal: false,
          }),
      },
      attachTo: document.body,
    })

    expect(store.getState().opened).toBe(false)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    await nextTick()

    expect(store.getState().opened).toBe(true)
    expect(wrapper.findAll('[data-action]')).toHaveLength(1)
    expect(wrapper.text()).toContain('Home')

    wrapper.unmount()
  })

  it('closes when an action is clicked by default', async () => {
    const store = createSpotlightStore()
    openSpotlightAction(store)
    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () =>
          h(Spotlight, {
            store,
            actions: [{ id: 'home', label: 'Home' }],
            transitionProps: { duration: 0 },
            withinPortal: false,
          }),
      },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.get('[data-action]').trigger('click')
    expect(store.getState().opened).toBe(false)

    wrapper.unmount()
  })
})
