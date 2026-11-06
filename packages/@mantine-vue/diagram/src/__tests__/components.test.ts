import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, ref } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { MantineProvider } from '@mantine-vue/core'
import { Diagram } from '../components/Diagram'
import DiagramControls from '../components/DiagramControls/DiagramControls.vue'
import DiagramLayers from '../components/DiagramLayers/DiagramLayers.vue'
import DiagramMinimap from '../components/DiagramMinimap/DiagramMinimap.vue'
import DiagramPalette from '../components/DiagramPalette/DiagramPalette.vue'
import DiagramPropertiesPanel from '../components/DiagramPropertiesPanel/DiagramPropertiesPanel.vue'
import DiagramProvider from '../components/DiagramProvider/DiagramProvider.vue'
import DiagramToolbar from '../components/DiagramToolbar/DiagramToolbar.vue'
import type { DiagramDocument } from '../core/types'
import { useDiagram, type DiagramController } from '../vue/use-diagram'
import { flush, mountWithProvider, rect } from './test-utils'

const $ = <T extends Element = HTMLElement>(selector: string) =>
  document.body.querySelector<T>(selector)
const $$ = (selector: string) => [...document.body.querySelectorAll<HTMLElement>(selector)]

const doc = (): DiagramDocument => ({
  version: 1,
  nodes: [rect('a', 0, 0, { label: 'Start' }), rect('b', 300, 0, { label: 'End' })],
  edges: [{ id: 'e', type: 'straight', source: { nodeId: 'a' }, target: { nodeId: 'b' } }],
})

function pointerEvent(
  type: string,
  init: PointerEventInit & { clientX?: number; clientY?: number } = {},
) {
  const Ctor = (window as any).PointerEvent ?? MouseEvent
  return new Ctor(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    pointerId: 1,
    pointerType: 'mouse',
    ...init,
  })
}

function press(element: Element, x: number, y: number, init: PointerEventInit = {}) {
  element.dispatchEvent(pointerEvent('pointerdown', { clientX: x, clientY: y, ...init }))
}

function move(x: number, y: number, init: PointerEventInit = {}) {
  $('[class*="canvas"]')!.dispatchEvent(
    pointerEvent('pointermove', { clientX: x, clientY: y, ...init }),
  )
}

function release(x: number, y: number, init: PointerEventInit = {}) {
  $('[class*="canvas"]')!.dispatchEvent(
    pointerEvent('pointerup', { clientX: x, clientY: y, ...init }),
  )
}

const keydown = (target: Element, key: string, init: KeyboardEventInit = {}) =>
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }),
  )

async function renderDiagram(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  let controller: DiagramController | undefined
  const wrapper = mountWithProvider(
    Diagram,
    {
      defaultValue: doc(),
      style: { height: '500px' },
      onReady: (value: DiagramController) => {
        controller = value
      },
      ...props,
    },
    slots,
  )
  await flush()
  controller!.editor.setViewportSize({ width: 800, height: 500 })
  await flush()

  return { wrapper, controller: controller! }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Diagram rendering', () => {
  it('renders nodes, edges and an accessible canvas', async () => {
    await renderDiagram()

    expect($$('[data-diagram-hit="node"]').map((node) => node.dataset.id)).toEqual(['a', 'b'])
    expect($$('[data-diagram-hit="edge"]')).toHaveLength(1)
    expect($('[role="application"]')?.getAttribute('aria-roledescription')).toBe('diagram editor')
    expect($('[data-id="a"]')?.getAttribute('aria-label')).toBe('Start, Rectangle')
    expect(document.body.textContent).toContain('Start')
  })

  it('applies node styles with theme colors', async () => {
    await renderDiagram({
      defaultValue: {
        version: 1,
        nodes: [rect('a', 0, 0, { style: { fill: 'blue.1', stroke: '#ff0000' } })],
        edges: [],
      },
    })
    const shape = $('[data-id="a"] rect')!

    expect(shape.getAttribute('fill')).toBe('var(--mantine-color-blue-1)')
    expect(shape.getAttribute('stroke')).toBe('#ff0000')
  })

  it('applies layer opacity and layer order to edges', async () => {
    await renderDiagram({
      defaultValue: {
        version: 1,
        nodes: [rect('a', 0, 0), rect('b', 300, 0)],
        edges: [
          {
            id: 'front',
            layerId: 'front',
            source: { nodeId: 'a' },
            target: { nodeId: 'b' },
          },
          {
            id: 'back',
            layerId: 'back',
            source: { nodeId: 'a' },
            target: { nodeId: 'b' },
            style: { opacity: 0.5 },
          },
        ],
        layers: [
          { id: 'back', name: 'Back', opacity: 0.5 },
          { id: 'front', name: 'Front' },
        ],
      },
    })

    expect($$('[data-diagram-hit="edge"]').map((edge) => edge.dataset.id)).toEqual([
      'back',
      'front',
    ])
    expect($('[data-id="back"]')?.getAttribute('opacity')).toBe('0.25')
  })

  it('renders custom node components', async () => {
    const Custom = defineComponent({
      props: ['node', 'selected', 'controller'],
      setup: (props) => () =>
        h('circle', {
          class: 'custom',
          r: props.node.width / 2,
          'data-selected': String(props.selected),
        }),
    })
    await renderDiagram({
      nodeTypes: [{ type: 'badge', component: Custom, defaults: { width: 40, height: 40 } }],
      defaultValue: {
        version: 1,
        nodes: [{ id: 'n', type: 'badge', x: 0, y: 0, width: 40, height: 40 }],
        edges: [],
      },
    })

    expect($('.custom')?.getAttribute('r')).toBe('20')
  })

  it('restores overridden node renderers when registrations are removed', () => {
    const controller = useDiagram()
    const builtIn = controller.nodeTypes.get('rect')!
    const First = defineComponent(() => () => h('rect', { class: 'first' }))
    const Second = defineComponent(() => () => h('rect', { class: 'second' }))
    const removeFirst = controller.registerNodeType({ ...builtIn, component: First })
    const removeSecond = controller.registerNodeType({ ...builtIn, component: Second })

    expect(controller.nodeTypes.get('rect')?.component).toBe(Second)
    removeFirst()
    expect(controller.nodeTypes.get('rect')?.component).toBe(Second)
    removeSecond()
    expect(controller.nodeTypes.get('rect')?.component).toBe(builtIn.component)
    controller.destroy()
  })

  it('renders HTML nodes inside a foreignObject', async () => {
    const Card = defineComponent({
      props: ['node', 'selected', 'controller'],
      setup: (props) => () => h('div', { class: 'card' }, props.node.data.title),
    })
    await renderDiagram({
      nodeTypes: [{ type: 'card', html: true, component: Card, renderLabel: false }],
      defaultValue: {
        version: 1,
        nodes: [
          { id: 'n', type: 'card', x: 0, y: 0, width: 120, height: 60, data: { title: 'Hello' } },
        ],
        edges: [],
      },
    })

    expect($('foreignObject .card')?.textContent).toBe('Hello')
  })

  it('culls nodes outside of the viewport in large diagrams', async () => {
    const nodes = Array.from({ length: 400 }, (_, index) =>
      rect(`n${index}`, (index % 20) * 200, Math.floor(index / 20) * 200),
    )
    const { controller } = await renderDiagram({
      defaultValue: { version: 1, nodes, edges: [] },
      culling: 300,
    })

    const rendered = $$('[data-diagram-hit="node"]').length
    expect(rendered).toBeGreaterThan(0)
    expect(rendered).toBeLessThan(100)

    controller.editor.setViewport({ x: -2000, y: -2000, zoom: 1 })
    await flush()
    expect($('[data-id="n0"]')).toBeNull()
    expect($('[data-id="n210"]')).not.toBeNull()
  })

  it('renders on the server', async () => {
    const app = createSSRApp({
      render: () =>
        h(MantineProvider, { env: 'test' } as any, () =>
          h(Diagram, { defaultValue: doc(), rulers: true }, () => [
            h(DiagramToolbar),
            h(DiagramControls),
          ]),
        ),
    })
    const html = await renderToString(app)

    expect(html).toContain('data-diagram-hit="node"')
    expect(html).toContain('role="application"')
    expect(html).toContain('role="toolbar"')
  })

  it('hydrates server markup without mismatches', async () => {
    const render = () =>
      h(MantineProvider, { env: 'test' } as any, () =>
        h(Diagram, { defaultValue: doc(), style: { height: '300px' } }, () => [
          h(DiagramToolbar),
          h(DiagramControls),
        ]),
      )
    const html = await renderToString(createSSRApp({ render }))
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    createSSRApp({ render }).mount(container)
    await flush()

    const messages = [...warn.mock.calls, ...error.mock.calls].map((call) => String(call[0]))
    warn.mockRestore()
    error.mockRestore()
    expect(messages.filter((message) => /hydration/i.test(message))).toEqual([])
    expect(container.querySelectorAll('[data-diagram-hit="node"]')).toHaveLength(2)
  })
})

describe('Diagram interactions', () => {
  it('selects and moves nodes with the pointer and emits v-model updates', async () => {
    const onUpdate = vi.fn()
    const onSelection = vi.fn()
    const { controller } = await renderDiagram({
      'onUpdate:modelValue': onUpdate,
      'onUpdate:selection': onSelection,
      snapToGrid: false,
      smartGuides: false,
    })
    const node = $('[data-id="a"] rect')!

    press(node, 10, 10)
    move(30, 20)
    move(60, 40)
    release(60, 40)
    await flush()

    expect(onSelection).toHaveBeenCalledWith(['a'])
    expect(controller.editor.store.getNode('a')).toMatchObject({ x: 50, y: 30 })
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate.mock.calls[0][0].nodes[0]).toMatchObject({ id: 'a', x: 50, y: 30 })
    expect($('[data-diagram-hit="resize"]')).not.toBeNull()
  })

  it('emits non-history transactions and advances the commit version', async () => {
    const onUpdate = vi.fn()
    const { controller } = await renderDiagram({ 'onUpdate:modelValue': onUpdate })
    const previousVersion = controller.commitVersion.value

    controller.editor.store.transact(
      'Live status',
      () => controller.editor.store.updateNodeData('a', { status: 'busy' }),
      { history: false },
    )
    await flush()

    expect(onUpdate).toHaveBeenCalledOnce()
    expect(onUpdate.mock.calls[0][0].nodes[0].data.status).toBe('busy')
    expect(controller.commitVersion.value).toBe(previousVersion + 1)
    expect(controller.canUndo.value).toBe(false)
  })

  it('rolls back an active gesture when a canvas with an external controller unmounts', async () => {
    const controller = useDiagram({ document: doc() })
    const wrapper = mountWithProvider(Diagram, {
      controller,
      snapToGrid: false,
      smartGuides: false,
      style: { height: '400px' },
    })
    await flush()
    controller.editor.setViewportSize({ width: 800, height: 400 })
    await flush()

    press($('[data-id="a"] rect')!, 10, 10)
    move(60, 40)
    expect(controller.editor.store.inTransaction).toBe(true)
    expect(controller.editor.store.getNode('a')?.x).not.toBe(0)

    wrapper.unmount()
    expect(controller.editor.store.inTransaction).toBe(false)
    expect(controller.editor.store.getNode('a')?.x).toBe(0)
    controller.destroy()
  })

  it('loads a new model value without echoing it', async () => {
    const value = ref<DiagramDocument>(doc())
    const onUpdate = vi.fn((next: DiagramDocument) => {
      value.value = next
    })
    const Host = defineComponent({
      setup: () => () =>
        h(Diagram, {
          modelValue: value.value,
          'onUpdate:modelValue': onUpdate,
          style: { height: '400px' },
        }),
    })
    mountWithProvider(Host)
    await flush()

    value.value = { version: 1, nodes: [rect('z', 0, 0)], edges: [] }
    await flush()

    expect($$('[data-diagram-hit="node"]').map((node) => node.dataset.id)).toEqual(['z'])
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('zooms with Ctrl + plus on every layout and keeps the keys from the browser', async () => {
    const { controller } = await renderDiagram({ maxZoom: 2 })
    const root = $('[role="application"]')!
    controller.editor.reducedMotion = true
    const press = (init: KeyboardEventInit) => {
      const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        ctrlKey: true,
        ...init,
      })
      root.dispatchEvent(event)
      return event
    }
    const zoom = () => controller.editor.viewport.zoom

    // US layout: + is Shift + =.
    expect(press({ key: '+', code: 'Equal', shiftKey: true }).defaultPrevented).toBe(true)
    expect(zoom()).toBeCloseTo(1.2)
    // = without Shift.
    press({ key: '=', code: 'Equal' })
    expect(zoom()).toBeCloseTo(1.44)
    // German layout: + has its own key.
    press({ key: '-', code: 'Slash' })
    expect(zoom()).toBeCloseTo(1.2)
    press({ key: '+', code: 'BracketRight' })
    expect(zoom()).toBeCloseTo(1.44)
    // Numpad.
    press({ key: '+', code: 'NumpadAdd' })
    expect(zoom()).toBeCloseTo(1.728)
    press({ key: '-', code: 'NumpadSubtract' })
    expect(zoom()).toBeCloseTo(1.44)

    // At the limit the command is disabled, the browser still must not zoom.
    controller.editor.zoomTo(2)
    expect(controller.editor.canExecute('zoomIn')).toBe(false)
    expect(press({ key: '+', code: 'Equal', shiftKey: true }).defaultPrevented).toBe(true)
    expect(zoom()).toBe(2)
  })

  it('handles keyboard shortcuts on the canvas', async () => {
    const { controller } = await renderDiagram()
    const root = $('[role="application"]')!
    controller.editor.setSelection(['a'])

    keydown(root, 'ArrowRight', { shiftKey: true })
    expect(controller.editor.store.getNode('a')?.x).toBe(20)

    keydown(root, 'Delete')
    await flush()
    expect($('[data-id="a"]')).toBeNull()

    keydown(root, 'z', { ctrlKey: true })
    await flush()
    expect($('[data-id="a"]')).not.toBeNull()

    keydown(root, 'a', { ctrlKey: true })
    expect(controller.selection.value).toEqual(['a', 'b', 'e'])
  })

  it('disables shortcuts and editing in the view mode', async () => {
    const { controller } = await renderDiagram({ mode: 'view' })
    const root = $('[role="application"]')!

    keydown(root, 'a', { ctrlKey: true })
    expect(controller.selection.value).toEqual([])

    press($('[data-id="a"] rect')!, 10, 10)
    move(100, 100)
    release(100, 100)
    expect(controller.editor.store.getNode('a')).toMatchObject({ x: 0, y: 0 })
    expect(controller.viewport.value).toMatchObject({ x: 90, y: 90 })
  })

  it('edits labels inline on double click', async () => {
    const { controller } = await renderDiagram()
    $('[data-id="a"] rect')!.dispatchEvent(
      new MouseEvent('dblclick', { bubbles: true, clientX: 10, clientY: 10 }),
    )
    await flush()

    const textarea = $<HTMLTextAreaElement>('textarea')!
    expect(textarea.value).toBe('Start')
    textarea.value = 'Begin'
    textarea.dispatchEvent(new Event('input'))
    keydown(textarea, 'Enter')
    await flush()

    expect(controller.editor.store.getNode('a')?.label).toBe('Begin')
    expect($('textarea')).toBeNull()
  })

  it('zooms with ctrl + wheel and pans with the wheel', async () => {
    const { controller } = await renderDiagram()
    const canvas = $('[class*="canvas"]')!

    const frames = () => new Promise((resolve) => setTimeout(resolve, 80))

    canvas.dispatchEvent(
      new WheelEvent('wheel', { deltaY: 100, deltaX: 20, bubbles: true, cancelable: true }),
    )
    // Wheel events are applied once per animation frame.
    await frames()
    expect(controller.viewport.value).toMatchObject({ x: -20, y: -100, zoom: 1 })

    canvas.dispatchEvent(
      new WheelEvent('wheel', { deltaY: -5, ctrlKey: true, bubbles: true, cancelable: true }),
    )
    await frames()
    expect(controller.viewport.value.zoom).toBeCloseTo(Math.exp(0.05))
  })

  it('opens the context menu with commands for the selection', async () => {
    const { controller } = await renderDiagram()
    $('[data-id="a"] rect')!.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 20, clientY: 20 }),
    )
    await flush()

    expect(controller.selection.value).toEqual(['a'])
    const item = $('[data-command="duplicate"]')!
    expect(item).not.toBeNull()
    item.click()
    await flush()
    expect(controller.editor.store.nodeCount).toBe(3)
  })
})

describe('Diagram panels', () => {
  it('renders tooltips and menus inside the diagram while it is fullscreen', async () => {
    const { controller } = await renderDiagram(
      {},
      { default: () => [h(DiagramToolbar), h(DiagramControls)] },
    )
    const root = $('[role="application"]')!
    // jsdom has no fullscreen API: emulate the document state and its event.
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => root })
    document.dispatchEvent(new Event('fullscreenchange'))
    await flush()

    try {
      $('[data-command="zoomIn"]')!.dispatchEvent(new MouseEvent('mouseenter'))
      await new Promise((resolve) => setTimeout(resolve, 300))
      await flush()
      const tooltip = $$('div').find((element) => element.textContent === 'Zoom in')
      expect(tooltip).toBeDefined()
      expect(root.contains(tooltip!)).toBe(true)

      // The align menu is enabled with two selected nodes.
      controller.editor.setSelection(['a', 'b'])
      await flush()
      $<HTMLButtonElement>('[data-menu="align"]')!.click()
      await flush()
      const menu = $('[data-command="alignLeft"]')
      expect(menu).not.toBeNull()
      expect(root.contains(menu)).toBe(true)

      $('[data-id="a"] rect')!.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 20,
          clientY: 20,
        }),
      )
      await flush()
      const item = $('[data-command="duplicate"]')
      expect(item).not.toBeNull()
      expect(root.contains(item)).toBe(true)
    } finally {
      delete (document as any).fullscreenElement
      document.dispatchEvent(new Event('fullscreenchange'))
      await flush()
    }
  })

  it('enables and opens toolbar menus when the selection allows them', async () => {
    const { controller } = await renderDiagram({}, { default: () => h(DiagramToolbar) })
    const align = () => $<HTMLButtonElement>('[data-menu="align"]')!

    expect(align().disabled).toBe(true)
    controller.editor.setSelection(['a', 'b'])
    await flush()
    expect(align().disabled).toBe(false)

    align().dispatchEvent(new MouseEvent('mouseenter'))
    await new Promise((resolve) => setTimeout(resolve, 300))
    await flush()
    expect($$('div').some((element) => element.textContent === 'Align')).toBe(true)

    align().click()
    await flush()
    $<HTMLElement>('[data-command="alignLeft"]')!.click()
    await flush()
    expect(controller.editor.store.getNode('b')?.x).toBe(0)
  })

  it('switches tools and runs commands from the toolbar', async () => {
    const { controller } = await renderDiagram({}, { default: () => h(DiagramToolbar) })

    $<HTMLButtonElement>('[data-tool="rect"]')!.click()
    expect(controller.tool.value).toBe('rect')
    await flush()
    expect($('[data-tool="rect"]')?.getAttribute('aria-pressed')).toBe('true')

    controller.editor.setSelection(['a'])
    await flush()
    $<HTMLButtonElement>('[data-command="delete"]')!.click()
    expect(controller.editor.store.hasNode('a')).toBe(false)
    await flush()
    expect($<HTMLButtonElement>('[data-command="undo"]')!.disabled).toBe(false)
  })

  it('zooms from the controls', async () => {
    const { controller } = await renderDiagram({}, { default: () => h(DiagramControls) })

    $<HTMLButtonElement>('[data-command="zoomIn"]')!.click()
    controller.editor.reducedMotion = true
    $<HTMLButtonElement>('[data-command="zoomIn"]')!.click()
    expect(controller.viewport.value.zoom).toBeGreaterThan(1)
    expect($('[data-command="zoomReset"]')?.textContent?.trim()).toMatch(/%$/)
  })

  it('edits properties of the selection', async () => {
    const controller = useDiagram({ document: doc() })
    mountWithProvider(
      defineComponent({
        setup: () => () => h(DiagramProvider, { controller }, () => h(DiagramPropertiesPanel)),
      }),
    )
    controller.editor.setSelection(['a'])
    await flush()

    const label = $<HTMLTextAreaElement>(
      '[data-field="label"] textarea, textarea[data-field="label"]',
    )!
    label.value = 'Renamed'
    label.dispatchEvent(new Event('input'))
    await flush()
    expect(controller.editor.store.getNode('a')?.label).toBe('Renamed')

    const width = $<HTMLInputElement>('input[data-field="width"], [data-field="width"] input')!
    width.value = '240'
    width.dispatchEvent(new Event('input'))
    await flush()
    expect(controller.editor.store.getNode('a')?.width).toBe(240)
  })

  it('manages layers and lists objects', async () => {
    const controller = useDiagram({ document: doc() })
    mountWithProvider(
      defineComponent({
        setup: () => () => h(DiagramProvider, { controller }, () => h(DiagramLayers)),
      }),
    )
    await flush()

    expect($$('[data-object]').map((item) => item.dataset.object)).toEqual(['b', 'a'])
    $<HTMLButtonElement>('[data-object="a"]')!.click()
    expect(controller.selection.value).toEqual(['a'])

    $<HTMLButtonElement>('[data-action="add-layer"]')!.click()
    await flush()
    expect(controller.layers.value).toHaveLength(2)
    expect($$('[data-layer]')).toHaveLength(2)

    $<HTMLButtonElement>(
      `[data-layer="${controller.layers.value[0].id}"] [data-action="toggle-visible"]`,
    )!.click()
    expect(controller.layers.value[0].visible).toBe(false)
  })

  it('does not expose layer mutations outside edit mode', async () => {
    const controller = useDiagram({ document: doc() })
    controller.editor.setMode('view')
    mountWithProvider(
      defineComponent({
        setup: () => () => h(DiagramProvider, { controller }, () => h(DiagramLayers)),
      }),
    )
    await flush()

    const visibility = $<HTMLButtonElement>('[data-action="toggle-visible"]')!
    const lock = $<HTMLButtonElement>('[data-action="toggle-lock"]')!
    expect(visibility.disabled).toBe(true)
    expect(lock.disabled).toBe(true)

    visibility.click()
    lock.click()
    expect(controller.layers.value[0]).toMatchObject({ visible: true })
    expect(controller.layers.value[0].locked).not.toBe(true)
    controller.destroy()
  })

  it('inserts templates from the palette', async () => {
    const controller = useDiagram({
      templates: [
        {
          id: 'process',
          label: 'Process',
          category: 'Flowchart',
          node: { type: 'rect', label: 'Process' },
        },
        {
          id: 'pair',
          label: 'Pair',
          category: 'Flowchart',
          nodes: [{ type: 'rect' }, { type: 'rect', x: 200 }],
          edges: [{ source: 0, target: 1 }],
        },
      ],
    })
    controller.editor.setViewportSize({ width: 800, height: 600 })
    mountWithProvider(
      defineComponent({
        setup: () => () => h(DiagramProvider, { controller }, () => h(DiagramPalette)),
      }),
    )
    await flush()

    $<HTMLButtonElement>('[data-template="process"]')!.click()
    expect(controller.editor.store.getNodes()[0]).toMatchObject({ type: 'rect', label: 'Process' })

    $<HTMLButtonElement>('[data-template="pair"]')!.click()
    expect(controller.editor.store.nodeCount).toBe(3)
    expect(controller.editor.store.edgeCount).toBe(1)
    controller.editor.undo()
    expect(controller.editor.store.nodeCount).toBe(1)
  })

  it('renders the minimap without a canvas implementation', async () => {
    await renderDiagram({}, { default: () => h(DiagramMinimap) })
    expect($('canvas')).not.toBeNull()
  })
})
