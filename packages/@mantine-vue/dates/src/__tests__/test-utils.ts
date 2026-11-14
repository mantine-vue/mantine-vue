import { afterEach, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'

const wrappers: VueWrapper[] = []

/** Mounts a component inside `MantineProvider`, attached to `document.body` */
export function render(component: any, props: Record<string, any> = {}) {
  const wrapper = mount(MantineProvider, {
    props: { env: 'test' },
    slots: { default: () => h(component, props) },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

/** Unmounts components mounted with `render` after each test */
export function cleanupRenderedComponents() {
  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
    document.body.innerHTML = ''
    vi.useRealTimers()
  })
}

/** Dispatches keydown event and waits for pending updates */
export async function press(element: Element, key: string) {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  await nextTick()
  await nextTick()
  await nextTick()
}

export const getDay = (label: string) =>
  document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)

export const headerLabels = () =>
  Array.from(document.querySelectorAll('[data-level-control]')).map((node) =>
    node.textContent?.trim(),
  )
