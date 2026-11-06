import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { Diagram } from '../components/Diagram'
import { boxCenter, distance } from '../core/geometry'
import {
  computeWallOutline,
  DOOR_TYPE,
  findCollisions,
  findOutsideBoundary,
  floorPlanExtension,
  FURNITURE_TYPE,
  getSegmentEndpoints,
  importFloorPlanImage,
  ROOM_TYPE,
  segmentBox,
  snapToWalls,
  useFloorPlanFloors,
  WALL_TYPE,
  createFurnitureTemplates,
} from '../floor-plan'
import { COLLISIONS_STATE_KEY } from '../floor-plan/extension'
import { getFloorPlanRuntime } from '../floor-plan/runtime'
import { insertTemplate } from '../vue/templates'
import { useDiagram } from '../vue/use-diagram'
import { flush, mountWithProvider, pointer } from './test-utils'

const wall = (id: string, a: [number, number], b: [number, number], thickness = 20) => ({
  id,
  type: WALL_TYPE,
  ...segmentBox({ x: a[0], y: a[1] }, { x: b[0], y: b[1] }, thickness),
})

function createPlan(options: Parameters<typeof floorPlanExtension>[0] = {}, nodes: any[] = []) {
  const controller = useDiagram({
    snapToGrid: false,
    smartGuides: false,
    extensions: [floorPlanExtension(options)],
    document: { version: 1, nodes, edges: [] },
  })
  controller.editor.setViewportSize({ width: 1000, height: 800 })

  return controller
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('walls', () => {
  it('builds wall boxes from segments', () => {
    const node = wall('w', [0, 0], [0, 300])
    expect(node.rotation).toBe(90)
    const [start, end] = getSegmentEndpoints(node)
    expect(start.x).toBeCloseTo(0)
    expect(start.y).toBeCloseTo(0)
    expect(end.y).toBeCloseTo(300)
  })

  it('miters corners where two walls meet', () => {
    const a = { ...wall('a', [0, 0], [300, 0]), x: 0 }
    const b = wall('b', [300, 0], [300, 200])
    const outline = computeWallOutline(a, [b])
    const xs = outline.map((p) => Math.round(p.x))

    // The outer corner reaches the outer edge of the second wall.
    expect(Math.max(...xs)).toBe(310)
    expect(Math.min(...xs)).toBe(0)
  })

  it('extends walls into the wall they meet at a T junction', () => {
    const host = wall('host', [0, 0], [400, 0])
    const stem = wall('stem', [200, 0], [200, 200])
    const outline = computeWallOutline(stem, [host])
    const ys = outline.map((p) => Math.round(p.y))

    expect(Math.min(...ys)).toBe(-10)
  })

  it('keeps wall outlines in sync when walls move', async () => {
    const controller = createPlan({}, [
      wall('a', [0, 0], [300, 0]),
      wall('b', [300, 0], [300, 200]),
    ])
    const runtime = getFloorPlanRuntime(controller)!
    const outline = runtime.wallOutline('a')
    const before = outline.value!

    controller.editor.moveBy(['b'], 100, 0)
    expect(outline.value).not.toEqual(before)
    // No longer joined: a plain rectangle again.
    expect(Math.max(...outline.value!.map((p) => p.x))).toBeCloseTo(300)
  })

  it('snaps to wall ends and centerlines', () => {
    const controller = createPlan({}, [wall('a', [0, 0], [300, 0])])
    const { editor } = controller

    expect(snapToWalls(editor, { x: 296, y: 4 }, 10)).toMatchObject({
      kind: 'end',
      point: { x: 300 },
    })
    expect(snapToWalls(editor, { x: 150, y: 6 }, 10)).toMatchObject({ kind: 'line', wallId: 'a' })
    expect(snapToWalls(editor, { x: 150, y: 60 }, 10).kind).toBe('none')
  })

  it('draws connected walls with the wall tool', () => {
    const controller = createPlan()
    const { editor } = controller
    editor.setTool('wall')

    for (const [x, y] of [
      [0, 0],
      [400, 0],
      [400, 300],
    ]) {
      editor.pointerDown(pointer(x, y))
      editor.pointerUp(pointer(x, y))
    }
    editor.keyDown({ key: 'Enter', shiftKey: false, altKey: false, ctrlKey: false, metaKey: false })

    const walls = editor.store.getNodes().filter((node) => node.type === WALL_TYPE)
    expect(walls).toHaveLength(2)
    expect(walls[0]).toMatchObject({ width: 400, height: 15, rotation: 0 })
    expect(walls[1]).toMatchObject({ width: 300, rotation: 90 })
    // One undo step for the whole chain.
    editor.undo()
    expect(editor.store.nodeCount).toBe(0)
  })

  it('keeps the centerline when the thickness changes', () => {
    const controller = createPlan({}, [wall('a', [0, 100], [300, 100])])
    const { editor } = controller
    editor.setNodeBox('a', { height: 40 })

    const [start] = getSegmentEndpoints(editor.store.getNode('a')!)
    expect(start.y).toBeCloseTo(100)
  })
})

describe('openings', () => {
  it('snaps doors into walls and follows them', () => {
    const controller = createPlan({}, [
      wall('a', [0, 0], [400, 0]),
      { id: 'd', type: DOOR_TYPE, x: 140, y: 30, width: 90, height: 20 },
    ])
    const { editor } = controller

    editor.moveBy(['d'], 0, -35)
    const door = editor.store.getNode('d')!
    expect(door.data).toMatchObject({ wallId: 'a' })
    expect(boxCenter(door).y).toBeCloseTo(0)
    expect(door.height).toBe(20)
    // Doors render above their wall.
    expect(editor.store.getNodeIndex('d')).toBeGreaterThan(editor.store.getNodeIndex('a'))

    editor.moveBy(['a'], 0, 100)
    expect(boxCenter(editor.store.getNode('d')!).y).toBeCloseTo(100)

    editor.rotateBy(['a'], 90)
    const rotated = editor.store.getNode('d')!
    expect(rotated.rotation).toBe(90)
    const [start, end] = getSegmentEndpoints(editor.store.getNode('a')!)
    expect(distance(boxCenter(rotated), start) + distance(boxCenter(rotated), end)).toBeCloseTo(
      distance(start, end),
    )
  })

  it('detaches doors dragged away from walls', () => {
    const controller = createPlan({}, [
      wall('a', [0, 0], [400, 0]),
      {
        id: 'd',
        type: DOOR_TYPE,
        x: 140,
        y: -10,
        width: 90,
        height: 20,
        data: { wallId: 'a', offset: 185 },
      },
    ])
    controller.editor.moveBy(['d'], 0, 300)

    expect(controller.editor.store.getNode('d')?.data?.wallId).toBeUndefined()
  })

  it('places doors in walls with the door tool and when dropped from the palette', () => {
    const controller = createPlan({}, [wall('a', [0, 0], [400, 0])])
    const { editor } = controller

    editor.setTool('door')
    editor.pointerDown(pointer(100, 25))
    editor.pointerUp(pointer(100, 25))
    const door = editor.store.getNodes().find((node) => node.type === DOOR_TYPE)!
    expect(door.data?.wallId).toBe('a')
    expect(boxCenter(door)).toMatchObject({ x: 100 })

    const template = controller.templates.value.find((item) => item.id === 'floor:window')!
    insertTemplate(controller, template, { x: 300, y: 8 })
    const placed = editor.getSelectedNodes()[0]
    expect(placed.data?.wallId).toBe('a')
  })

  it('remaps wall references when walls and doors are copied together', () => {
    const controller = createPlan({}, [
      wall('a', [0, 0], [400, 0]),
      {
        id: 'd',
        type: DOOR_TYPE,
        x: 140,
        y: -10,
        width: 90,
        height: 20,
        data: { wallId: 'a', offset: 185 },
      },
    ])
    const { editor } = controller
    const ids = editor.duplicate(['a', 'd'])
    const copies = ids.map((id) => editor.store.getNode(id)!)
    const copiedWall = copies.find((node) => node.type === WALL_TYPE)!
    const copiedDoor = copies.find((node) => node.type === DOOR_TYPE)!

    expect(copiedDoor.data?.wallId).toBe(copiedWall.id)

    // A door copied alone is placed again: it lands in the closest wall, the copied one.
    const [single] = editor.duplicate(['d'])
    expect(editor.store.getNode(single)?.data?.wallId).toBe(copiedWall.id)
  })
})

describe('rooms, collisions and boundaries', () => {
  it('draws rooms and computes their area', async () => {
    const controller = createPlan()
    const { editor } = controller
    editor.setTool('room')

    for (const [x, y] of [
      [0, 0],
      [500, 0],
      [500, 400],
      [0, 400],
    ]) {
      editor.pointerDown(pointer(x, y))
      editor.pointerUp(pointer(x, y))
    }
    // Clicking the first point closes the outline.
    editor.pointerDown(pointer(0, 0))

    const room = editor.store.getNodes().find((node) => node.type === ROOM_TYPE)!
    expect(room).toMatchObject({ x: 0, y: 0, width: 500, height: 400 })

    mountWithProvider(Diagram, { controller, style: { height: '400px' } })
    await flush()
    // 500 × 400 world units at 100 units per meter.
    expect(document.body.textContent).toContain('20 m²')
  })

  it('highlights overlapping furniture', async () => {
    const controller = createPlan({ collisions: 'highlight' }, [
      { id: 'a', type: FURNITURE_TYPE, x: 0, y: 0, width: 100, height: 100 },
      { id: 'b', type: FURNITURE_TYPE, x: 150, y: 0, width: 100, height: 100 },
    ])
    const collisions = () => controller.state[COLLISIONS_STATE_KEY] as Set<string>
    expect(collisions().size).toBe(0)

    controller.editor.moveBy(['b'], -100, 0)
    await nextTick()
    expect([...collisions()].sort()).toEqual(['a', 'b'])
    const pairs = findCollisions(controller.editor, { types: new Set([FURNITURE_TYPE]) })
    expect(pairs.map((pair) => [pair.a, pair.b].sort())).toEqual([['a', 'b']])
  })

  it('prevents overlapping moves', () => {
    const controller = createPlan({ collisions: 'prevent' }, [
      { id: 'a', type: FURNITURE_TYPE, x: 0, y: 0, width: 100, height: 100 },
      { id: 'b', type: FURNITURE_TYPE, x: 150, y: 0, width: 100, height: 100 },
    ])
    controller.editor.moveBy(['b'], -100, 0)
    expect(controller.editor.store.getNode('b')?.x).toBe(150)

    controller.editor.moveBy(['b'], -50, 0)
    expect(controller.editor.store.getNode('b')?.x).toBe(100)
  })

  it('finds nodes outside of the floor boundary', () => {
    const controller = createPlan({}, [
      { id: 'in', type: FURNITURE_TYPE, x: 10, y: 10, width: 50, height: 50 },
      { id: 'out', type: FURNITURE_TYPE, x: 980, y: 10, width: 50, height: 50 },
    ])
    controller.editor.updateSettings({ bounds: { x: 0, y: 0, width: 1000, height: 600 } })

    expect(findOutsideBoundary(controller.editor)).toEqual(['out'])
  })

  it('sizes furniture templates by the scale', () => {
    const [sofa] = createFurnitureTemplates({ pixelsPerMeter: 50 })
    expect(sofa.node).toMatchObject({ width: 100, height: 45, data: { kind: 'sofa' } })
  })

  it('sets a default scale on documents without one', () => {
    const controller = createPlan()
    expect(controller.editor.scale).toMatchObject({ pixelsPerMeter: 100, unit: 'm' })
    expect(controller.editor.canUndo).toBe(false)
  })
})

describe('floors and background images', () => {
  it('switches floors without history entries', () => {
    const controller = createPlan({}, [
      { id: 'ground', type: FURNITURE_TYPE, x: 0, y: 0, width: 50, height: 50 },
    ])
    const floors = useFloorPlanFloors(controller, { others: 'ghost' })

    const upper = floors.addFloor('First floor')
    const node = controller.editor.addNode({ type: FURNITURE_TYPE })
    expect(node.layerId).toBe(upper.id)
    expect(floors.floors.value.map((floor) => floor.name)).toEqual(['Layer 1', 'First floor'])

    const ground = floors.floors.value[0]
    floors.setActiveFloor(ground.id)
    const layers = controller.layers.value
    expect(layers.find((layer) => layer.id === upper.id)).toMatchObject({
      visible: true,
      locked: true,
      opacity: 0.25,
    })
    expect(layers.find((layer) => layer.id === ground.id)).toMatchObject({
      visible: true,
      locked: false,
    })
    expect(floors.nodesOn(upper.id).map((item) => item.id)).toEqual([node.id])
  })

  it('imports a locked background image at the back', async () => {
    const controller = createPlan({}, [
      { id: 'a', type: FURNITURE_TYPE, x: 0, y: 0, width: 50, height: 50 },
    ])
    const image = await importFloorPlanImage(controller, 'data:image/png;base64,iVBORw0KGgo=', {
      width: 800,
      height: 600,
    })

    expect(image).toMatchObject({ type: 'image', locked: true, width: 800 })
    expect(controller.editor.store.getNodeOrder()[0]).toBe(image.id)
  })
})

describe('floor plan rendering', () => {
  it('renders walls, doors and furniture', async () => {
    const controller = createPlan({}, [
      wall('a', [0, 0], [400, 0]),
      { id: 'd', type: DOOR_TYPE, x: 140, y: -10, width: 90, height: 20, data: { kind: 'double' } },
      {
        id: 'f',
        type: FURNITURE_TYPE,
        x: 50,
        y: 50,
        width: 200,
        height: 90,
        data: { kind: 'sofa' },
      },
    ])
    mountWithProvider({ render: () => h(Diagram, { controller, style: { height: '400px' } }) })
    await flush()

    expect(document.querySelector('[data-id="a"] polygon')).not.toBeNull()
    expect(document.querySelectorAll('[data-id="d"] path').length).toBeGreaterThan(0)
    expect(document.querySelectorAll('[data-id="f"] rect').length).toBeGreaterThan(1)
  })
})
