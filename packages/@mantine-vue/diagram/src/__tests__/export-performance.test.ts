import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { Diagram } from '../components/Diagram'
import { parseDiagram, serializeDiagram } from '../core/serialization'
import { useDiagram } from '../vue/use-diagram'
import { useDiagramExport } from '../vue/use-diagram-export'
import { floorPlanExtension } from '../floor-plan'
import { restaurantExtension } from '../restaurant'
import { createEditor, flush, mountWithProvider, rect } from './test-utils'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('serialization and export', () => {
  it('restores a saved diagram with extensions', () => {
    const source = useDiagram({ extensions: [floorPlanExtension(), restaurantExtension()] })
    const { editor } = source
    editor.addNode({ type: 'floor-wall', x: 0, y: 0, width: 400, height: 15 })
    editor.addNode({ type: 'restaurant-table', x: 100, y: 100, data: { seats: 6 } })
    const a = editor.addNode({ type: 'rect', label: 'A' })
    const b = editor.addNode({ type: 'ellipse', x: 300, label: 'B' })
    editor.connect({ nodeId: a.id }, { nodeId: b.id }, { label: 'next' })
    editor.addLayer({ name: 'Notes' })

    const json = serializeDiagram(editor.toDocument(), 2)
    const parsed = parseDiagram(json)
    expect(parsed.ok).toBe(true)

    const target = useDiagram({ extensions: [floorPlanExtension(), restaurantExtension()] })
    target.load(parsed.document!)
    expect(target.toDocument()).toEqual(editor.toDocument())
    expect(target.editor.canUndo).toBe(false)
  })

  it('exports the content of a mounted diagram as a standalone SVG', async () => {
    let controller: any
    mountWithProvider(Diagram, {
      defaultValue: {
        version: 1,
        nodes: [
          rect('a', 0, 0, { label: 'Hello', style: { fill: 'blue.1' } }),
          rect('b', 300, 100),
        ],
        edges: [{ id: 'e', source: { nodeId: 'a' }, target: { nodeId: 'b' } }],
      },
      selection: ['a'],
      style: { height: '400px' },
      onReady: (value: any) => {
        controller = value
      },
    })
    await flush()

    const svg = useDiagramExport(controller).toSvg({ padding: 10, background: '#ffffff' })

    expect(svg.startsWith('<?xml')).toBe(true)
    expect(svg).toContain('viewBox="-10 -10 420 170"')
    expect(svg).toContain('Hello')
    expect(svg).toContain('fill="#ffffff"')
    // Selection handles and hit areas are not part of the export.
    expect(svg).not.toContain('data-diagram-hit="resize"')
    expect(svg).not.toContain('mantine-diagram-edge-hit')
    expect(svg).not.toContain(' id=')
  })

  it('requires a mounted diagram for image exports', () => {
    const controller = useDiagram()
    expect(() => useDiagramExport(controller).toSvg()).toThrow(/mounted/)
    expect(useDiagramExport(controller).toJson()).toContain('"version": 1')
  })
})

describe('performance', () => {
  it('re-renders only the node that changed', async () => {
    const renders = new Map<string, number>()
    const Counted = defineComponent({
      props: ['node', 'selected', 'controller'],
      setup(props) {
        return () => {
          renders.set(props.node.id, (renders.get(props.node.id) ?? 0) + 1)
          return h('rect', { width: props.node.width, height: props.node.height })
        }
      },
    })
    const nodes = Array.from({ length: 50 }, (_, index) => ({
      ...rect(`n${index}`, index * 120, 0),
      type: 'counted',
    }))
    const controller = useDiagram({
      nodeTypes: [{ type: 'counted', component: Counted }],
      document: { version: 1, nodes, edges: [] },
    })
    mountWithProvider(Diagram, { controller, style: { height: '400px' }, culling: false })
    await flush()
    renders.clear()

    controller.editor.moveBy(['n3'], 10, 0)
    await flush()
    expect([...renders.keys()]).toEqual(['n3'])

    renders.clear()
    controller.editor.setSelection(['n7'])
    await flush()
    expect([...renders.keys()]).toEqual(['n7'])

    renders.clear()
    controller.editor.setViewport({ x: 50, y: 20, zoom: 1.5 })
    await flush()
    expect(renders.size).toBe(0)
  })

  it('handles large documents', () => {
    const nodes = Array.from({ length: 10_000 }, (_, index) =>
      rect(`n${index}`, (index % 100) * 150, Math.floor(index / 100) * 100),
    )
    const edges = Array.from({ length: 5_000 }, (_, index) => ({
      id: `e${index}`,
      type: 'straight',
      source: { nodeId: `n${index}` },
      target: { nodeId: `n${index + 1}` },
    }))

    const start = performance.now()
    const editor = createEditor({ document: { version: 1, nodes, edges } })
    const loaded = performance.now()

    const visible = editor.queryNodes({ x: 0, y: 0, width: 1000, height: 800 })
    expect(visible.size).toBeLessThan(200)

    // A drag of 60 frames over a selection of 100 nodes.
    editor.setSelection(nodes.slice(0, 100).map((node) => node.id))
    const dragStart = performance.now()
    editor.store.begin('Move')
    const originals = editor.getTransformableNodes(editor.selection)
    for (let frame = 1; frame <= 60; frame += 1) {
      editor.applyMove(originals, frame, frame)
    }
    editor.store.commit()
    const dragged = performance.now()

    expect(editor.store.getNode('n0')).toMatchObject({ x: 60, y: 60 })
    expect(editor.store.getHistory().undo).toHaveLength(1)
    // Generous limits, the point is to catch accidental quadratic behavior.
    expect(loaded - start).toBeLessThan(3000)
    expect(dragged - dragStart).toBeLessThan(3000)

    editor.undo()
    expect(editor.store.getNode('n0')).toMatchObject({ x: 0, y: 0 })
  })
})
