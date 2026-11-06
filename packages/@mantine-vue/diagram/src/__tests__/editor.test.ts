import { describe, expect, it, vi } from 'vitest'
import {
  createShapeTool,
  createConnectorTool,
  createPointsShapeTool,
  createTextTool,
} from '../core/tools/basic-tools'
import { getNodeBounds } from '../core/shapes'
import { createEditor, drag, pointer, rect } from './test-utils'

describe('DiagramEditor: elements', () => {
  it('creates nodes with type defaults and unique ids', () => {
    const editor = createEditor()
    const a = editor.addNode({ type: 'ellipse', x: 10, y: 10 })
    const b = editor.addNode({ type: 'ellipse', x: 10, y: 10 })

    expect(a.width).toBe(140)
    expect(a.height).toBe(90)
    expect(a.id).not.toBe(b.id)
    expect(editor.store.getNodes()).toHaveLength(2)
  })

  it('connects nodes according to the connection rules', () => {
    const editor = createEditor({
      document: {
        nodes: [
          rect('a', 0, 0),
          rect('b', 300, 0, {
            ports: [{ id: 'in', x: 0, y: 0.5, kind: 'target', maxConnections: 1 }],
          }),
        ],
        edges: [],
      },
    })
    const onConnect = vi.fn()
    editor.events.on('connect', onConnect)

    expect(editor.connect({ nodeId: 'a' }, { nodeId: 'a' })).toBeNull()
    expect(editor.connect({ nodeId: 'b', portId: 'in' }, { nodeId: 'a' })).toBeNull()

    const edge = editor.connect({ nodeId: 'a' }, { nodeId: 'b', portId: 'in' })
    expect(edge).not.toBeNull()
    expect(onConnect).toHaveBeenCalledOnce()
    // The port only accepts one connection.
    expect(editor.connect({ nodeId: 'a', portId: 'top' }, { nodeId: 'b', portId: 'in' })).toBeNull()
  })

  it('deletes groups with their children and connected edges', () => {
    const editor = createEditor({
      document: {
        nodes: [rect('a', 0, 0), rect('b', 200, 0), rect('c', 400, 0)],
        edges: [{ id: 'e', source: { nodeId: 'a' }, target: { nodeId: 'c' } }],
      },
    })
    const group = editor.group(['a', 'b'])!

    editor.deleteElements([group.id])
    expect(editor.store.getNodes().map((node) => node.id)).toEqual(['c'])
    expect(editor.store.edgeCount).toBe(0)

    editor.undo()
    expect(editor.store.nodeCount).toBe(4)
    expect(editor.store.getEdge('e')).toBeDefined()
  })

  it('keeps locked elements when deleting', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0, { locked: true }), rect('b', 0, 0)], edges: [] },
    })
    editor.deleteElements(['a', 'b'])

    expect(editor.store.getNodes().map((node) => node.id)).toEqual(['a'])
  })

  it('groups and ungroups nodes', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 200, 100), rect('c', 500, 0)], edges: [] },
    })
    const group = editor.group(['a', 'b'])!

    expect(group.type).toBe('group')
    expect(getNodeBounds(editor.store.getNode(group.id)!)).toEqual({
      x: 0,
      y: 0,
      width: 300,
      height: 150,
    })
    expect(editor.getSelectedIds()).toEqual([group.id])
    // The group renders above its children.
    expect(editor.store.getNodeOrder()).toEqual(['a', 'b', group.id, 'c'])

    editor.moveBy([group.id], 10, 10)
    expect(editor.store.getNode('a')).toMatchObject({ x: 10, y: 10 })
    expect(editor.store.getNode(group.id)).toMatchObject({ x: 10, y: 10 })

    editor.ungroup()
    expect(editor.store.hasNode(group.id)).toBe(false)
    expect(editor.store.getNode('a')?.parentId).toBeUndefined()
    expect(editor.getSelectedIds().sort()).toEqual(['a', 'b'])
  })

  it('selects the outermost group and enters groups on double click', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 200, 0)], edges: [] },
    })
    const group = editor.group(['a', 'b'])!
    editor.clearSelection()

    editor.pointerDown(pointer(10, 10, { kind: 'node', id: 'a' }))
    editor.pointerUp(pointer(10, 10, { kind: 'node', id: 'a' }))
    expect(editor.getSelectedIds()).toEqual([group.id])

    editor.doubleClick(pointer(10, 10, { kind: 'node', id: 'a' }))
    expect(editor.getSelectedIds()).toEqual(['a'])

    editor.keyDown({
      key: 'Escape',
      shiftKey: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
    })
    expect(editor.getSelectedIds()).toEqual([group.id])
  })

  it('reorders nodes, moving groups with their descendants', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 20, 0), rect('c', 40, 0)], edges: [] },
    })

    editor.reorder(['a'], 'front')
    expect(editor.store.getNodeOrder()).toEqual(['b', 'c', 'a'])
    editor.reorder(['a'], 'backward')
    expect(editor.store.getNodeOrder()).toEqual(['b', 'a', 'c'])
    editor.reorder(['c'], 'back')
    expect(editor.store.getNodeOrder()).toEqual(['c', 'b', 'a'])

    const group = editor.group(['c', 'b'])!
    editor.reorder([group.id], 'front')
    expect(editor.store.getNodeOrder()).toEqual(['a', 'c', 'b', group.id])
  })

  it('aligns, distributes and matches sizes', () => {
    const editor = createEditor({
      document: {
        nodes: [rect('a', 0, 0), rect('b', 130, 40, { width: 50 }), rect('c', 400, 90)],
        edges: [],
      },
    })
    editor.setSelection(['a', 'b', 'c'])

    editor.align('top')
    expect(editor.getSelectedNodes().map((node) => node.y)).toEqual([0, 0, 0])

    editor.distribute('horizontal')
    // Total span 500, sizes 250: gaps of 125.
    expect(editor.store.getNode('b')?.x).toBe(225)

    editor.matchSize('width')
    expect(editor.store.getNode('b')?.width).toBe(100)
  })

  it('flips and rotates nodes', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 200, 0)], edges: [] },
    })

    editor.flip(['a', 'b'], 'horizontal')
    expect(editor.store.getNode('a')).toMatchObject({ x: 200, flipX: true })
    expect(editor.store.getNode('b')).toMatchObject({ x: 0, flipX: true })

    editor.rotateBy(['a'], 90)
    expect(editor.store.getNode('a')).toMatchObject({ x: 200, y: 0, rotation: 90 })
  })

  it('copies, pastes and duplicates with new ids and offsets', () => {
    const editor = createEditor({
      document: {
        nodes: [rect('a', 0, 0), rect('b', 200, 0)],
        edges: [
          {
            id: 'e',
            source: { nodeId: 'a' },
            target: { nodeId: 'b' },
            waypoints: [{ x: 150, y: 100 }],
          },
        ],
      },
    })
    editor.setSelection(['a', 'b'])
    const text = editor.copy()!

    const pasted = editor.paste()
    expect(pasted).toHaveLength(3)
    expect(editor.store.nodeCount).toBe(4)
    expect(editor.store.edgeCount).toBe(2)

    const copies = editor.getSelectedNodes()
    expect(copies.map((node) => node.x).sort((x, y) => x - y)).toEqual([20, 220])
    const copiedEdge = editor.getSelectedEdges()[0]
    expect(copies.map((node) => node.id)).toContain(copiedEdge.source.nodeId)
    expect(copiedEdge.waypoints).toEqual([{ x: 170, y: 120 }])

    // Clipboard text works in another editor.
    const other = createEditor()
    expect(other.paste({ text, at: { x: 0, y: 0 } })).toHaveLength(3)
    expect(other.paste({ text: 'not a diagram' })).toEqual([])
    expect(
      other.paste({
        text: JSON.stringify({
          type: 'application/x-mantine-vue-diagram',
          nodes: [null],
          edges: [],
        }),
      }),
    ).toEqual([])

    editor.setSelection(['a'])
    const [duplicate] = editor.duplicate()
    expect(editor.store.getNode(duplicate)).toMatchObject({ x: 20, y: 20 })
  })

  it('cuts elements', () => {
    const editor = createEditor({ document: { nodes: [rect('a', 0, 0)], edges: [] } })
    editor.setSelection(['a'])
    editor.cut()

    expect(editor.store.nodeCount).toBe(0)
    editor.paste()
    // Pasting after a cut keeps the original position.
    expect(editor.getSelectedNodes()[0]).toMatchObject({ x: 0, y: 0 })
  })

  it('edits labels', () => {
    const editor = createEditor({ document: { nodes: [rect('a', 0, 0)], edges: [] } })

    expect(editor.startTextEdit({ kind: 'node', id: 'a' })).toBe(true)
    editor.commitTextEdit('Hello')
    expect(editor.store.getNode('a')?.label).toBe('Hello')
    expect(editor.editing).toBeNull()

    editor.setMode('view')
    expect(editor.startTextEdit({ kind: 'node', id: 'a' })).toBe(false)
  })

  it('manages layers', () => {
    const editor = createEditor({ document: { nodes: [rect('a', 0, 0)], edges: [] } })
    const layer = editor.addLayer({ name: 'Furniture' })

    expect(editor.activeLayerId).toBe(layer.id)
    const node = editor.addNode({ type: 'rect' })
    expect(node.layerId).toBe(layer.id)

    editor.updateLayer(layer.id, { visible: false })
    expect(editor.isNodeVisible(editor.store.getNode(node.id)!)).toBe(false)
    editor.setSelection([node.id])
    expect(editor.getSelectedIds()).toEqual([])

    editor.removeLayer(layer.id, editor.store.getLayers()[0].id)
    expect(editor.store.getNode(node.id)?.layerId).toBe('default')
    expect(editor.store.getLayers()).toHaveLength(1)
  })

  it('applies locked layer rules equally to nodes and edges', () => {
    const editor = createEditor({
      document: {
        nodes: [rect('a', 0, 0, { layerId: 'locked' }), rect('b', 200, 0)],
        edges: [
          {
            id: 'e',
            layerId: 'locked',
            source: { nodeId: 'a' },
            target: { nodeId: 'b' },
          },
        ],
        layers: [
          { id: 'default', name: 'Default' },
          { id: 'locked', name: 'Locked', locked: true },
        ],
      },
    })
    const node = editor.store.getNode('a')!
    const edge = editor.store.getEdge('e')!

    expect(editor.isNodeSelectable(node)).toBe(false)
    expect(editor.isEdgeSelectable(edge)).toBe(false)
    expect(editor.isNodeEditable(node)).toBe(false)
    expect(editor.isEdgeEditable(edge)).toBe(false)

    editor.setSelection(['a', 'e'])
    expect(editor.getSelectedIds()).toEqual([])

    editor.deleteElements(['a', 'e'])
    expect(editor.store.hasNode('a')).toBe(true)
    expect(editor.store.hasEdge('e')).toBe(true)
  })

  it('invalidates obstacle routes only for routing-relevant changes', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0)], edges: [] },
    })
    const onRoutes = vi.fn()
    editor.events.on('routes', onRoutes)

    editor.store.updateNode('a', { label: 'Renamed' })
    editor.store.updateSettings({ background: '#fff' })
    expect(onRoutes).not.toHaveBeenCalled()

    editor.store.transact('Move live', () => editor.store.updateNode('a', { x: 20 }), {
      history: false,
    })
    expect(onRoutes).toHaveBeenCalledOnce()

    editor.updateLayer('default', { visible: false })
    expect(onRoutes).toHaveBeenCalledTimes(2)
  })

  it('applies tree and layered layouts', () => {
    const editor = createEditor({
      document: {
        nodes: [rect('root', 0, 0), rect('a', 0, 0), rect('b', 0, 0), rect('c', 0, 0)],
        edges: [
          { id: 'e1', source: { nodeId: 'root' }, target: { nodeId: 'a' } },
          { id: 'e2', source: { nodeId: 'root' }, target: { nodeId: 'b' } },
          { id: 'e3', source: { nodeId: 'b' }, target: { nodeId: 'c' } },
        ],
      },
    })

    editor.applyLayout('tree', { rankGap: 50, nodeGap: 20, origin: { x: 0, y: 0 } })
    const node = (id: string) => editor.store.getNode(id)!

    expect(node('a').y).toBe(100)
    expect(node('c').y).toBe(200)
    expect(node('root').x).toBe((node('a').x + node('b').x) / 2)

    editor.applyLayout('layered', {
      direction: 'LR',
      rankGap: 50,
      nodeGap: 20,
      origin: { x: 0, y: 0 },
    })
    expect(node('root').x).toBe(0)
    expect(node('a').x).toBe(150)
    expect(node('c').x).toBe(300)
  })
})

describe('DiagramEditor: viewport', () => {
  it('zooms within limits and fits content', () => {
    const editor = createEditor({
      minZoom: 0.5,
      maxZoom: 2,
      document: { nodes: [rect('a', 0, 0, { width: 400, height: 200 })], edges: [] },
    })

    editor.zoomTo(10)
    expect(editor.viewport.zoom).toBe(2)

    editor.fitView({ padding: 100, maxZoom: 4 })
    expect(editor.viewport.zoom).toBe(2)
    expect(editor.worldToScreen({ x: 200, y: 100 })).toEqual({ x: 500, y: 400 })

    editor.zoomTo(1, { x: 0, y: 0 })
    expect(editor.screenToWorld({ x: 0, y: 0 })).toEqual(editor.screenToWorld({ x: 0, y: 0 }))
  })

  it('pans in the view mode and still reports clicks', () => {
    const editor = createEditor({ mode: 'view', document: { nodes: [rect('a', 0, 0)], edges: [] } })
    const onClick = vi.fn()
    editor.events.on('nodeClick', onClick)

    editor.pointerDown(pointer(10, 10, { kind: 'node', id: 'a' }))
    editor.pointerUp(pointer(10, 10, { kind: 'node', id: 'a' }))
    expect(onClick).toHaveBeenCalledOnce()

    editor.pointerDown(pointer(100, 100))
    editor.pointerMove(pointer(150, 120))
    editor.pointerUp(pointer(150, 120))
    expect(editor.viewport).toMatchObject({ x: 50, y: 20 })
    expect(editor.store.getNode('a')?.x).toBe(0)
  })
})

describe('DiagramEditor: select tool', () => {
  it('moves nodes by dragging as one undo step', () => {
    const editor = createEditor({ document: { nodes: [rect('a', 0, 0)], edges: [] } })

    drag(editor, [10, 10], [60, 30], { kind: 'node', id: 'a' })
    expect(editor.store.getNode('a')).toMatchObject({ x: 50, y: 20 })
    expect(editor.store.getHistory().undo).toHaveLength(1)

    editor.undo()
    expect(editor.store.getNode('a')).toMatchObject({ x: 0, y: 0 })
  })

  it('snaps moves to the grid and to other nodes', () => {
    const editor = createEditor({
      snapToGrid: true,
      smartGuides: true,
      document: { nodes: [rect('a', 0, 0), rect('b', 300, 200)], edges: [] },
    })

    drag(editor, [10, 10], [37, 23], { kind: 'node', id: 'a' })
    expect(editor.store.getNode('a')).toMatchObject({ x: 20, y: 20 })

    // 296 is within the threshold of the left edge of b.
    drag(editor, [30, 30], [306, 30], { kind: 'node', id: 'a' })
    expect(editor.store.getNode('a')?.x).toBe(300)
  })

  it('does not move locked nodes', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0, { locked: true })], edges: [] },
    })

    drag(editor, [10, 10], [60, 30], { kind: 'node', id: 'a' })
    expect(editor.store.getNode('a')).toMatchObject({ x: 0, y: 0 })
    expect(editor.getSelectedIds()).toEqual(['a'])
  })

  it('rejects moves the transform validator refuses', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0)], edges: [] },
      validateTransform: (_, nodes) => nodes.every((node) => node.x <= 30),
    })

    drag(editor, [10, 10], [80, 10], { kind: 'node', id: 'a' })
    // The last accepted position was at x = 17.5 + ... within the limit.
    expect(editor.store.getNode('a')!.x).toBeLessThanOrEqual(30)
  })

  it('selects with a marquee and toggles with shift', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 200, 0), rect('c', 400, 0)], edges: [] },
    })

    drag(editor, [-10, -10], [320, 60])
    expect(editor.getSelectedIds().sort()).toEqual(['a', 'b'])

    editor.pointerDown(pointer(410, 10, { kind: 'node', id: 'c' }, { shiftKey: true }))
    editor.pointerUp(pointer(410, 10, { kind: 'node', id: 'c' }, { shiftKey: true }))
    expect(editor.getSelectedIds().sort()).toEqual(['a', 'b', 'c'])

    editor.pointerDown(pointer(700, 700))
    editor.pointerUp(pointer(700, 700))
    expect(editor.getSelectedIds()).toEqual([])
  })

  it('selects with a lasso while Alt is pressed', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 300, 0)], edges: [] },
    })
    editor.pointerDown(pointer(-20, -20, { kind: 'canvas' }, { altKey: true }))
    for (const [x, y] of [
      [150, -20],
      [150, 80],
      [-20, 80],
    ]) {
      editor.pointerMove(pointer(x, y, { kind: 'canvas' }, { altKey: true }))
    }
    editor.pointerUp(pointer(-20, 80))

    expect(editor.getSelectedIds()).toEqual(['a'])
  })

  it('resizes from a handle with the opposite corner fixed', () => {
    const editor = createEditor({ document: { nodes: [rect('a', 0, 0)], edges: [] } })
    editor.setSelection(['a'])

    drag(editor, [100, 50], [150, 100], { kind: 'resize', handle: 'se' })
    expect(editor.store.getNode('a')).toMatchObject({ x: 0, y: 0, width: 150, height: 100 })

    drag(editor, [0, 0], [50, -20], { kind: 'resize', handle: 'nw' })
    expect(editor.store.getNode('a')).toMatchObject({ x: 50, y: -20, width: 100, height: 120 })
  })

  it('keeps the aspect ratio with shift', () => {
    const editor = createEditor({ document: { nodes: [rect('a', 0, 0)], edges: [] } })
    editor.setSelection(['a'])

    drag(editor, [100, 50], [200, 60], { kind: 'resize', handle: 'se' }, { shiftKey: true })
    expect(editor.store.getNode('a')).toMatchObject({ width: 200, height: 100 })
  })

  it('resizes rotated nodes in their own frame', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0, { rotation: 90 })], edges: [] },
    })
    editor.setSelection(['a'])
    // Rotated 90°, the east handle points down.
    const node = editor.store.getNode('a')!
    const east = { x: node.x + node.width / 2, y: node.y + node.height / 2 + node.width / 2 }
    drag(editor, [east.x, east.y], [east.x, east.y + 50], { kind: 'resize', handle: 'e' })

    const resized = editor.store.getNode('a')!
    expect(resized.width).toBeCloseTo(150)
    expect(resized.height).toBeCloseTo(50)
    // The west edge stays in place.
    expect(resized.y + resized.height / 2 - resized.width / 2).toBeCloseTo(
      node.y + node.height / 2 - node.width / 2,
    )
  })

  it('scales a multiple selection', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 100, 50)], edges: [] },
    })
    editor.setSelection(['a', 'b'])

    drag(editor, [200, 100], [400, 200], { kind: 'resize', handle: 'se' })
    expect(editor.store.getNode('b')).toMatchObject({ x: 200, y: 100, width: 200, height: 100 })
  })

  it('rotates with the rotate handle and snaps with shift', () => {
    const editor = createEditor({ document: { nodes: [rect('a', 0, 0)], edges: [] } })
    editor.setSelection(['a'])

    drag(editor, [50, -30], [110, 27], { kind: 'rotate' }, { shiftKey: true })
    expect(editor.store.getNode('a')?.rotation).toBe(90)
  })

  it('connects ports and reconnects edge ends', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 300, 0), rect('c', 0, 300)], edges: [] },
    })

    drag(editor, [100, 25], [300, 25], { kind: 'port', nodeId: 'a', portId: 'right' })
    const [edge] = editor.store.getEdges()
    expect(edge.source).toEqual({ nodeId: 'a', portId: 'right' })
    expect(edge.target).toEqual({ nodeId: 'b', portId: 'left' })

    drag(editor, [300, 25], [50, 300], { kind: 'edge-end', edgeId: edge.id, end: 'target' })
    expect(editor.store.getEdge(edge.id)?.target).toEqual({ nodeId: 'c', portId: 'top' })
    expect(editor.store.getHistory().undo.at(-1)?.label).toBe('Reconnect')
  })

  it('reports connectors dropped on the canvas', () => {
    const editor = createEditor({ document: { nodes: [rect('a', 0, 0)], edges: [] } })
    const onEnd = vi.fn()
    editor.events.on('connectEnd', onEnd)

    drag(editor, [100, 25], [600, 600], { kind: 'port', nodeId: 'a', portId: 'right' })
    expect(editor.store.edgeCount).toBe(0)
    expect(onEnd).toHaveBeenCalledWith(expect.objectContaining({ point: { x: 600, y: 600 } }))
  })

  it('adds, moves and removes waypoints', () => {
    const editor = createEditor({
      document: {
        nodes: [rect('a', 0, 0), rect('b', 300, 0)],
        edges: [{ id: 'e', type: 'straight', source: { nodeId: 'a' }, target: { nodeId: 'b' } }],
      },
    })

    drag(editor, [200, 25], [200, 120], { kind: 'segment', edgeId: 'e', index: 0 })
    expect(editor.store.getEdge('e')?.waypoints).toEqual([{ x: 200, y: 120 }])

    editor.doubleClick(pointer(200, 120, { kind: 'waypoint', edgeId: 'e', index: 0 }))
    expect(editor.store.getEdge('e')?.waypoints).toEqual([])
  })

  it('edits polygon vertices', () => {
    const editor = createEditor({ document: { nodes: [], edges: [] } })
    const node = editor.addNode({
      type: 'polygon',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      data: {
        points: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 100, y: 100 },
          { x: 0, y: 100 },
        ],
      },
    })

    drag(editor, [100, 100], [200, 150], { kind: 'vertex', nodeId: node.id, index: 2 })
    const updated = editor.store.getNode(node.id)!
    expect(updated).toMatchObject({ x: 0, y: 0, width: 200, height: 150 })
    expect(updated.data?.points[2]).toEqual({ x: 200, y: 150 })

    editor.doubleClick(pointer(200, 150, { kind: 'vertex', nodeId: node.id, index: 2 }))
    expect(editor.store.getNode(node.id)?.data?.points).toHaveLength(3)
  })

  it('cancels the gesture with Escape', () => {
    const editor = createEditor({ document: { nodes: [rect('a', 0, 0)], edges: [] } })

    editor.pointerDown(pointer(10, 10, { kind: 'node', id: 'a' }))
    editor.pointerMove(pointer(60, 60, { kind: 'node', id: 'a' }))
    editor.keyDown({
      key: 'Escape',
      shiftKey: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
    })

    expect(editor.store.getNode('a')).toMatchObject({ x: 0, y: 0 })
    expect(editor.canUndo).toBe(false)
  })
})

describe('DiagramEditor: drawing tools', () => {
  it('draws shapes by dragging and by clicking', () => {
    const editor = createEditor()
    editor.registerTool(createShapeTool({ id: 'rect', node: { type: 'rect' } }))

    editor.setTool('rect')
    drag(editor, [10, 10], [110, 60])
    expect(editor.store.getNodes()[0]).toMatchObject({ x: 10, y: 10, width: 100, height: 50 })
    expect(editor.activeTool).toBe('select')

    editor.setTool('rect')
    editor.pointerDown(pointer(500, 500))
    editor.pointerUp(pointer(500, 500))
    expect(editor.store.getNodes()[1]).toMatchObject({ x: 420, y: 460, width: 160, height: 80 })
  })

  it('does not activate editing tools outside of the edit mode', () => {
    const editor = createEditor({ mode: 'select' })
    editor.registerTool(createShapeTool({ id: 'rect', node: { type: 'rect' } }))
    editor.setTool('rect')

    expect(editor.activeTool).toBe('select')
  })

  it('draws connectors between nodes and with free ends', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 300, 0)], edges: [] },
    })
    editor.registerTool(createConnectorTool({ sticky: true }))
    editor.setTool('connector')

    drag(editor, [50, 25], [350, 25])
    expect(editor.store.getEdges()[0]).toMatchObject({
      source: { nodeId: 'a' },
      target: { nodeId: 'b' },
    })

    drag(editor, [600, 600], [700, 600])
    expect(editor.store.getEdges()[1]).toMatchObject({
      source: { point: { x: 600, y: 600 } },
      target: { point: { x: 700, y: 600 } },
    })
  })

  it('draws polygons point by point', () => {
    const editor = createEditor()
    editor.registerTool(createPointsShapeTool({ id: 'polygon', type: 'polygon' }))
    editor.setTool('polygon')

    for (const [x, y] of [
      [0, 0],
      [100, 0],
      [100, 100],
    ]) {
      editor.pointerDown(pointer(x, y))
      editor.pointerUp(pointer(x, y))
    }

    expect(editor.overlay.draft?.points).toHaveLength(3)
    editor.keyDown({ key: 'Enter', shiftKey: false, altKey: false, ctrlKey: false, metaKey: false })

    const [node] = editor.store.getNodes()
    expect(node).toMatchObject({ type: 'polygon', x: 0, y: 0, width: 100, height: 100 })
    expect(editor.overlay.draft).toBeNull()
  })

  it('creates text and starts editing it', () => {
    const editor = createEditor()
    editor.registerTool(createTextTool())
    editor.setTool('text')
    editor.pointerUp(pointer(40, 40))

    expect(editor.store.getNodes()[0].type).toBe('text')
    expect(editor.editing?.kind).toBe('node')
  })
})

describe('DiagramEditor: commands and hit testing', () => {
  it('runs commands with enablement checks', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 200, 0)], edges: [] },
    })

    expect(editor.canExecute('group')).toBe(false)
    editor.execute('selectAll')
    expect(editor.execute('group')).toBe(true)
    expect(editor.execute('undo')).toBe(true)
    expect(editor.store.getNodes()).toHaveLength(2)

    editor.setSelection(['a'])
    editor.execute('nudgeRight')
    editor.execute('nudgeRight')
    expect(editor.store.getNode('a')?.x).toBe(2)
    // Nudges merge into one history entry.
    editor.execute('undo')
    expect(editor.store.getNode('a')?.x).toBe(0)

    editor.setMode('select')
    expect(editor.execute('delete')).toBe(false)
    expect(editor.execute('zoomIn')).toBe(true)
  })

  it('moves the selection with Tab without trapping focus', () => {
    const editor = createEditor({
      document: { nodes: [rect('a', 0, 0), rect('b', 200, 0)], edges: [] },
    })

    expect(editor.execute('focusPrevious')).toBe(false)
    expect(editor.execute('focusNext')).toBe(true)
    expect(editor.getSelectedIds()).toEqual(['a'])
    editor.execute('focusNext')
    expect(editor.getSelectedIds()).toEqual(['b'])
    expect(editor.canExecute('focusNext')).toBe(false)
  })

  it('hit tests nodes and edges', () => {
    const editor = createEditor({
      document: {
        nodes: [rect('a', 0, 0), rect('b', 300, 0), { ...rect('c', 0, 200), type: 'ellipse' }],
        edges: [{ id: 'e', type: 'straight', source: { nodeId: 'a' }, target: { nodeId: 'b' } }],
      },
    })

    expect(editor.hitTest({ x: 50, y: 25 })).toEqual({ kind: 'node', id: 'a' })
    expect(editor.hitTest({ x: 200, y: 27 })).toEqual({ kind: 'edge', id: 'e' })
    // The corner of the ellipse bounds is outside of its outline.
    expect(editor.hitTest({ x: 2, y: 202 })).toEqual({ kind: 'canvas' })
  })
})
