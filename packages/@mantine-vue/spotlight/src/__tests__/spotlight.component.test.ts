import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { MantineProvider } from '@mantine-vue/core'
import { createSpotlightStore } from '../spotlight.store'
import { Spotlight } from '../Spotlight'

describe('@mantine-vue/spotlight component', () => {
  it('opens with Ctrl+K shortcut', async () => {
    const store = createSpotlightStore()

    mount(MantineProvider, {
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
  })
})
