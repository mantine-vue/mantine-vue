import { defineComponent, h, nextTick, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import { DiagramEditor, type DiagramEditorOptions } from '../core/editor'
import type { DiagramHitTarget, DiagramNode, DiagramPointerEvent } from '../core/types'

export function createEditor(options: DiagramEditorOptions = {}) {
  const editor = new DiagramEditor({ snapToGrid: false, smartGuides: false, ...options })
  editor.setViewportSize({ width: 1000, height: 800 })

  return editor
}

export const rect = (
  id: string,
  x: number,
  y: number,
  extra: Partial<DiagramNode> = {},
): DiagramNode => ({
  id,
  type: 'rect',
  x,
  y,
  width: 100,
  height: 50,
  ...extra,
})

/** Builds a pointer event at a world position, the viewport must be the identity. */
export function pointer(
  x: number,
  y: number,
  target: DiagramHitTarget = { kind: 'canvas' },
  extra: Partial<DiagramPointerEvent> = {},
): DiagramPointerEvent {
  return {
    world: { x, y },
    screen: { x, y },
    target,
    button: 0,
    pointerId: 1,
    pointerType: 'mouse',
    shiftKey: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    detail: 1,
    ...extra,
  }
}

/** Presses, drags and releases through the editor dispatch. */
export function drag(
  editor: DiagramEditor,
  from: [number, number],
  to: [number, number],
  target: DiagramHitTarget = { kind: 'canvas' },
  extra: Partial<DiagramPointerEvent> = {},
) {
  editor.pointerDown(pointer(from[0], from[1], target, extra))
  const steps = 4

  for (let index = 1; index <= steps; index += 1) {
    const x = from[0] + ((to[0] - from[0]) * index) / steps
    const y = from[1] + ((to[1] - from[1]) * index) / steps
    editor.pointerMove(pointer(x, y, editor.hitTest({ x, y }), extra))
  }

  editor.pointerUp(pointer(to[0], to[1], editor.hitTest({ x: to[0], y: to[1] }), extra))
}

export async function flush(times = 3) {
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
