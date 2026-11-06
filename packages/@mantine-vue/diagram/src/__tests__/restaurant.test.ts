import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { Diagram } from '../components/Diagram'
import {
  allocate,
  BAR_TYPE,
  getSeatPositions,
  getTableFootprint,
  mergeTables,
  nextTableNumber,
  renumberTables,
  restaurantExtension,
  RestaurantStatusLegend,
  splitTable,
  summarizeRestaurant,
  TABLE_TYPE,
  useRestaurantFloor,
  validateRestaurantLayout,
  ZONE_TYPE,
} from '../restaurant'
import DiagramProvider from '../components/DiagramProvider/DiagramProvider.vue'
import { insertTemplate } from '../vue/templates'
import { useDiagram } from '../vue/use-diagram'
import { flush, mountWithProvider, pointer } from './test-utils'

const table = (id: string, x: number, y: number, data: Record<string, any> = {}, size = 90) => ({
  id,
  type: TABLE_TYPE,
  x,
  y,
  width: size,
  height: size,
  data: { shape: 'round', seats: 4, ...data },
})

const zone = (
  id: string,
  kind: string,
  rect: { x: number; y: number; width: number; height: number },
  label = kind,
) => ({
  id,
  type: ZONE_TYPE,
  ...rect,
  label,
  data: {
    kind,
    points: [
      { x: 0, y: 0 },
      { x: rect.width, y: 0 },
      { x: rect.width, y: rect.height },
      { x: 0, y: rect.height },
    ],
  },
})

function createFloor(nodes: any[] = [], options: Parameters<typeof restaurantExtension>[0] = {}) {
  const controller = useDiagram({
    snapToGrid: false,
    smartGuides: false,
    extensions: [restaurantExtension(options)],
    document: { version: 1, nodes, edges: [] },
  })
  controller.editor.setViewportSize({ width: 1200, height: 800 })

  return controller
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('seating', () => {
  it('allocates seats proportionally', () => {
    expect(allocate(6, [2, 1, 2, 1])).toEqual([2, 1, 2, 1])
    expect(allocate(5, [1, 0, 1, 0])).toEqual([3, 0, 2, 0])
    expect(allocate(0, [1, 1])).toEqual([0, 0])
  })

  it('places chairs evenly around round tables, facing the table', () => {
    const seats = getSeatPositions({ width: 100, height: 100, data: { shape: 'round', seats: 4 } })

    expect(seats).toHaveLength(4)
    // The first chair is at the top, facing down.
    expect(seats[0].x).toBeCloseTo(50)
    expect(seats[0].y).toBeLessThan(0)
    expect(seats[0].rotation).toBeCloseTo(0)
    // The second one is on the right, facing left.
    expect(seats[1].x).toBeGreaterThan(100)
    expect(seats[1].rotation).toBeCloseTo(90)
  })

  it('uses the seat layout of rectangular tables', () => {
    const longSides = getSeatPositions({
      width: 200,
      height: 80,
      data: { shape: 'rectangle', seats: 6, seatLayout: 'long-sides' },
    })
    expect(longSides.filter((seat) => seat.y < 0)).toHaveLength(3)
    expect(longSides.filter((seat) => seat.y > 80)).toHaveLength(3)

    const oneSide = getSeatPositions({
      width: 200,
      height: 80,
      data: { shape: 'rectangle', seats: 3, seatLayout: 'one-side' },
    })
    expect(oneSide.every((seat) => seat.y < 0)).toBe(true)

    const around = getSeatPositions({
      width: 100,
      height: 100,
      data: { shape: 'square', seats: 4 },
    })
    expect(new Set(around.map((seat) => seat.rotation))).toEqual(new Set([0, 90, 180, 270]))
  })

  it('grows the footprint only on sides with chairs', () => {
    const footprint = getTableFootprint({
      width: 200,
      height: 80,
      data: { shape: 'rectangle', seats: 2, seatLayout: 'one-side' },
    })
    const ys = footprint.map((p) => p.y)
    const xs = footprint.map((p) => p.x)

    expect(Math.min(...ys)).toBe(-51)
    expect(Math.max(...ys)).toBe(80)
    expect(Math.min(...xs)).toBe(0)
  })
})

describe('tables', () => {
  it('numbers new tables automatically', () => {
    const controller = createFloor([table('t1', 0, 0, { number: 1 })])
    const template = controller.templates.value.find((item) => item.id === 'restaurant:square-4')!

    insertTemplate(controller, template, { x: 400, y: 400 })
    expect(controller.editor.getSelectedNodes()[0].data?.number).toBe(2)
    expect(nextTableNumber(controller.editor)).toBe(3)

    // Copies get their own number.
    const [copy] = controller.editor.duplicate(['t1'])
    expect(controller.editor.store.getNode(copy)?.data?.number).toBe(3)
  })

  it('renumbers tables in reading order', () => {
    const controller = createFloor([table('c', 0, 300), table('b', 300, 0), table('a', 0, 0)])
    renumberTables(controller.editor, { prefix: 'T' })
    const number = (id: string) => controller.editor.store.getNode(id)?.data?.number

    expect([number('a'), number('b'), number('c')]).toEqual(['T1', 'T2', 'T3'])
  })

  it('merges and splits tables', () => {
    const controller = createFloor([
      table('a', 0, 0, { number: 4, shape: 'square', status: 'reserved' }, 80),
      table('b', 80, 0, { number: 5, shape: 'square' }, 80),
    ])
    const { editor } = controller

    const merged = mergeTables(editor, ['a', 'b'])!
    expect(merged).toMatchObject({ x: 0, y: 0, width: 160, height: 80 })
    expect(merged.data).toMatchObject({
      seats: 8,
      number: '4+5',
      shape: 'rectangle',
      status: 'reserved',
    })
    expect(editor.store.hasNode('a')).toBe(false)

    const restored = splitTable(editor, merged.id)
    expect(restored.sort()).toEqual(['a', 'b'])
    expect(editor.store.getNode('b')?.data?.status).toBe('reserved')

    editor.undo()
    expect(editor.store.getNode(merged.id)).toBeDefined()
    editor.undo()
    expect(editor.store.hasNode('a') && editor.store.hasNode('b')).toBe(true)
  })

  it('merges and splits with commands', () => {
    const controller = createFloor([table('a', 0, 0), table('b', 100, 0)])
    const { editor } = controller
    editor.setSelection(['a', 'b'])

    expect(editor.execute('mergeTables')).toBe(true)
    expect(editor.store.nodeCount).toBe(1)
    expect(editor.execute('splitTable')).toBe(true)
    expect(editor.store.nodeCount).toBe(2)
  })
})

describe('validation and summaries', () => {
  it('reports overlaps, spacing, zones, boundaries and numbers', () => {
    const controller = createFloor([
      zone('walk', 'walkway', { x: 0, y: 400, width: 800, height: 100 }),
      zone('staff', 'restricted', { x: 900, y: 0, width: 200, height: 200 }),
      table('a', 0, 0, { number: 1 }),
      table('b', 60, 0, { number: 1 }),
      table('c', 400, 0, { number: 3 }),
      // Footprints reach 51 beyond the table: 38 apart from c.
      table('d', 400, 230, { number: 4 }),
      table('e', 700, 390, { number: 5 }),
      table('f', 950, 50, { number: 6 }),
      table('g', 2000, 50, { number: 7, seats: 0 }),
    ])
    controller.editor.updateSettings({ bounds: { x: -100, y: -100, width: 1400, height: 800 } })
    const issues = validateRestaurantLayout(controller.editor, { minSpacing: 60 })
    const find = (type: string) =>
      issues.filter((issue) => issue.type === type).map((issue) => issue.nodeIds.sort())

    expect(find('overlap')).toEqual([['a', 'b']])
    expect(find('spacing')).toEqual([['c', 'd']])
    expect(find('walkway')).toEqual([['e', 'walk']])
    expect(find('restricted')).toEqual([['f', 'staff']])
    expect(find('outside-boundary')).toEqual([['g']])
    expect(find('duplicate-number')).toEqual([['a', 'b']])
    expect(find('no-seats')).toEqual([['g']])
  })

  it('summarizes capacity by status and zone', () => {
    const controller = createFloor([
      zone('terrace', 'outdoor', { x: 0, y: 0, width: 500, height: 500 }, 'Terrace'),
      table('a', 50, 50, { seats: 4, status: 'occupied' }),
      table('b', 300, 50, { seats: 2 }),
      table('c', 800, 50, { seats: 6 }),
      { id: 'bar', type: BAR_TYPE, x: 800, y: 400, width: 300, height: 60, data: { seats: 5 } },
    ])
    const summary = summarizeRestaurant(controller.editor)

    expect(summary).toMatchObject({ tables: 4, seats: 17, availableSeats: 13 })
    expect(summary.byStatus.occupied).toEqual({ tables: 1, seats: 4 })
    expect(summary.byZone.terrace).toMatchObject({
      name: 'Terrace',
      kind: 'outdoor',
      tables: 2,
      seats: 6,
    })
  })
})

describe('live statuses', () => {
  it('shows external statuses without changing the document', async () => {
    const controller = createFloor([table('a', 0, 0), table('b', 200, 0, { seats: 6 })])
    const statuses = ref<Record<string, string>>({ a: 'occupied' })
    const onChange = vi.fn()
    mountWithProvider({
      render: () => h(Diagram, { controller, mode: 'view', style: { height: '400px' }, onChange }),
    })
    const floor = useRestaurantFloor(controller, { statuses })
    await flush()

    const status = (id: string) =>
      document.querySelector(`[data-id="${id}"] [data-status]`)?.getAttribute('data-status')
    expect(status('a')).toBe('occupied')
    expect(status('b')).toBe('available')
    expect(floor.summary.value.availableSeats).toBe(6)

    statuses.value = { a: 'occupied', b: 'reserved' }
    await flush()
    expect(status('b')).toBe('reserved')
    expect(controller.editor.store.getNode('b')?.data?.status).toBeUndefined()
    expect(onChange).not.toHaveBeenCalled()

    floor.setStatus('b', 'cleaning', { persist: true })
    expect(controller.editor.store.getNode('b')?.data?.status).toBe('cleaning')
    expect(controller.editor.canUndo).toBe(false)
  })

  it('finds tables for a party', () => {
    const controller = createFloor([
      table('two', 0, 0, { seats: 2 }),
      table('four', 200, 0, { seats: 4 }),
      table('big', 400, 0, { seats: 8, minSeats: 5 }),
      table('busy', 600, 0, { seats: 4, status: 'occupied' }),
    ])
    const floor = useRestaurantFloor(controller)

    expect(floor.findTablesFor(3).map((item) => item.id)).toEqual(['four'])
    expect(floor.findTablesFor(6).map((item) => item.id)).toEqual(['big'])
  })

  it('selects tables in the view mode and reports clicks', async () => {
    const controller = createFloor([table('a', 0, 0)])
    const onClick = vi.fn()
    mountWithProvider({
      render: () =>
        h(Diagram, { controller, mode: 'view', style: { height: '400px' }, onNodeClick: onClick }),
    })
    await flush()

    controller.editor.pointerDown(pointer(40, 40, { kind: 'node', id: 'a' }))
    controller.editor.pointerUp(pointer(40, 40, { kind: 'node', id: 'a' }))
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }), expect.anything())
  })

  it('renders a status legend with counts', async () => {
    const controller = createFloor([table('a', 0, 0, { status: 'occupied' }), table('b', 200, 0)])
    mountWithProvider({
      render: () => h(DiagramProvider, { controller }, () => h(RestaurantStatusLegend)),
    })
    await nextTick()

    expect(document.querySelector('[data-status="occupied"]')?.textContent).toContain('1 · 4 seats')
    expect(document.querySelector('[data-status="available"]')?.textContent).toContain(
      '1 · 4 seats',
    )
  })

  it('accepts custom statuses', () => {
    const controller = createFloor([table('a', 0, 0, { status: 'vip' })], {
      statuses: { vip: { label: 'VIP', color: 'violet' } },
    })
    const floor = useRestaurantFloor(controller)

    expect(floor.definitions.value.vip.label).toBe('VIP')
    expect(floor.definitions.value.available).toBeDefined()
    expect(floor.summary.value.byStatus.vip).toEqual({ tables: 1, seats: 4 })
  })
})
