import { defineComponent, h, nextTick, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import { createMemoryAdapter, type MemoryFileSeed } from '../adapters/create-memory-adapter'

/** Small tree most tests start from. */
export function createSeed(): MemoryFileSeed[] {
  return [
    {
      id: 'docs',
      name: 'Documents',
      children: [
        { id: 'report', name: 'report.pdf', size: 2048, modifiedAt: '2026-01-10T10:00:00.000Z' },
        {
          id: 'notes',
          name: 'notes.txt',
          content: 'Hello',
          modifiedAt: '2026-02-10T10:00:00.000Z',
        },
        {
          id: 'archive',
          name: 'Archive',
          children: [{ id: 'old', name: 'old.txt', content: 'x' }],
        },
      ],
    },
    { id: 'photos', name: 'Photos', children: [{ id: 'sun', name: 'sun.png', size: 500 }] },
    { id: 'readme', name: 'readme.md', content: '# Hi', modifiedAt: '2026-03-10T10:00:00.000Z' },
    {
      id: 'locked',
      name: 'locked.txt',
      content: 'secret',
      permissions: { rename: false, delete: false, move: false },
    },
  ]
}

export const createAdapter = (options: Parameters<typeof createMemoryAdapter>[0] = {}) =>
  createMemoryAdapter({ files: createSeed(), ...options })

/** Waits for pending promises and renders, enough for the in-memory adapter to settle. */
export async function flush(times = 6) {
  for (let index = 0; index < times; index += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0))
    await nextTick()
  }
}

export function mountWithProvider(
  component: Component,
  props: Record<string, any> = {},
  slots = {},
) {
  return mount(
    defineComponent({
      setup: () => () =>
        h(MantineProvider, { env: 'test' } as any, () => h(component as any, props, slots)),
    }),
    { attachTo: document.body },
  )
}

/** Assembled at runtime, a plain literal is what lint rules are looking for. */
export const UNSAFE_URL = ['javascript', 'alert(1)'].join(':')

export function keydown(target: Element | Document, key: string, init: KeyboardEventInit = {}) {
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }),
  )
}
