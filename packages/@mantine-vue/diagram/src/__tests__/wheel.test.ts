import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createWheelController, isDiscreteWheel, type DiagramWheelInput } from '../core/wheel'
import { createEditor } from './test-utils'

/** A manual animation frame clock: `tick` runs the queued callbacks one frame later. */
let queue: ((time: number) => void)[] = []
let time = 0

function tick(frames = 1) {
  for (let index = 0; index < frames; index += 1) {
    time += 16
    const callbacks = queue
    queue = []
    callbacks.forEach((callback) => callback(time))
  }
}

beforeEach(() => {
  queue = []
  time = 1000
  vi.stubGlobal('requestAnimationFrame', (callback: (time: number) => void) => {
    queue.push(callback)
    return queue.length
  })
  vi.stubGlobal('cancelAnimationFrame', () => {
    queue = []
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const wheel = (input: Partial<DiagramWheelInput>): DiagramWheelInput => ({
  deltaX: 0,
  deltaY: 0,
  deltaMode: 0,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  point: { x: 500, y: 400 },
  ...input,
})

describe('wheel controller', () => {
  it('tells mouse wheels from trackpads', () => {
    expect(isDiscreteWheel({ deltaMode: 0, deltaY: 100 })).toBe(true)
    expect(isDiscreteWheel({ deltaMode: 1, deltaY: 3 })).toBe(true)
    expect(isDiscreteWheel({ deltaMode: 0, deltaY: 4.5 })).toBe(false)
  })

  it('batches events into one viewport update per frame', () => {
    const editor = createEditor()
    const controller = createWheelController(editor, { mode: () => 'pan' })
    const updates = vi.fn()
    editor.events.on('viewport', updates)

    for (let index = 0; index < 5; index += 1) {
      controller.handle(wheel({ deltaX: 2, deltaY: 10 }))
    }

    expect(updates).not.toHaveBeenCalled()
    tick()
    expect(updates).toHaveBeenCalledTimes(1)
    expect(editor.viewport).toMatchObject({ x: -10, y: -50, zoom: 1 })
  })

  it('eases a mouse wheel notch to a 20 % zoom around the pointer', () => {
    const editor = createEditor()
    const controller = createWheelController(editor, { mode: () => 'pan' })
    const anchor = editor.screenToWorld({ x: 500, y: 400 })
    const zooms: number[] = []
    editor.events.on('viewport', (viewport) => zooms.push(viewport.zoom))

    controller.handle(wheel({ deltaY: -100, ctrlKey: true }))
    tick(60)

    // Several intermediate steps that only grow, ending exactly on the target.
    expect(zooms.length).toBeGreaterThan(5)
    expect(zooms.every((zoom, index) => index === 0 || zoom > zooms[index - 1])).toBe(true)
    expect(editor.viewport.zoom).toBeCloseTo(1.2, 6)
    expect(editor.screenToWorld({ x: 500, y: 400 }).x).toBeCloseTo(anchor.x, 6)
    expect(queue).toHaveLength(0)
  })

  it('adds up fast notches instead of restarting from the current zoom', () => {
    const editor = createEditor()
    const controller = createWheelController(editor, { mode: () => 'pan' })

    controller.handle(wheel({ deltaY: -100, ctrlKey: true }))
    tick()
    controller.handle(wheel({ deltaY: -100, ctrlKey: true }))
    tick(60)

    expect(editor.viewport.zoom).toBeCloseTo(1.44, 6)
  })

  it('applies trackpad pinches on the next frame without easing', () => {
    const editor = createEditor()
    const controller = createWheelController(editor, { mode: () => 'pan' })

    controller.handle(wheel({ deltaY: -3, ctrlKey: true }))
    controller.handle(wheel({ deltaY: -2, ctrlKey: true }))
    tick()

    expect(editor.viewport.zoom).toBeCloseTo(Math.exp(0.05), 6)
    expect(queue).toHaveLength(0)
  })

  it('stays within the zoom limits', () => {
    const editor = createEditor({ maxZoom: 1.5 })
    const controller = createWheelController(editor, { mode: () => 'pan' })

    for (let index = 0; index < 10; index += 1) {
      controller.handle(wheel({ deltaY: -100, ctrlKey: true }))
    }

    tick(80)
    expect(editor.viewport.zoom).toBe(1.5)
  })

  it('zooms instantly with reduced motion and in the zoom wheel mode', () => {
    const editor = createEditor()
    editor.reducedMotion = true
    const controller = createWheelController(editor, { mode: () => 'zoom' })

    controller.handle(wheel({ deltaY: -100 }))
    tick()

    expect(editor.viewport.zoom).toBeCloseTo(1.2, 6)
  })

  it('gives up its target when something else moves the view', () => {
    const editor = createEditor()
    const controller = createWheelController(editor, { mode: () => 'pan' })

    controller.handle(wheel({ deltaY: -100, ctrlKey: true }))
    tick(2)
    editor.setViewport({ x: 0, y: 0, zoom: 0.5 })
    tick(60)

    expect(editor.viewport.zoom).toBe(0.5)
  })

  it('applies changes at once without animation frames', () => {
    vi.unstubAllGlobals()
    vi.stubGlobal('requestAnimationFrame', undefined)
    const editor = createEditor()
    const controller = createWheelController(editor, { mode: () => 'pan' })

    controller.handle(wheel({ deltaY: -100, ctrlKey: true }))
    expect(editor.viewport.zoom).toBeCloseTo(1.2, 6)
  })
})
