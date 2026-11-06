import { describe, expect, it } from 'vitest'
import { DiagramBehaviorRegistry } from '../core/shapes'
import { getPortPosition, getPortSide, resolveEdgeEndpoints } from '../core/connectors'
import {
  bezierRouter,
  endAngle,
  findOrthogonalRoute,
  getArrowhead,
  orthogonalRouter,
  roundedPolylinePath,
  straightRouter,
} from '../core/routing'
import {
  migrateDiagram,
  parseDiagram,
  serializeDiagram,
  validateDiagram,
} from '../core/serialization'
import { applyDiagramPatch, diffDiagrams } from '../core/patch'
import { DiagramStore } from '../core/store'
import {
  calibrateScale,
  convertLength,
  formatArea,
  formatLength,
  parseLength,
  unitToWorld,
  worldToUnit,
} from '../core/units'
import { plainTextToRichText, wrapRichText } from '../core/text'
import { createEditor, rect } from './test-utils'

const behaviors = new DiagramBehaviorRegistry()
const ctx = (nodes: ReturnType<typeof rect>[]) => ({
  getNode: (id: string) => nodes.find((node) => node.id === id),
  behaviors,
})

describe('connectors', () => {
  it('positions ports with rotation and flips', () => {
    const node = rect('a', 0, 0, { rotation: 90 })
    const port = { id: 'right', x: 1, y: 0.5 }

    const position = getPortPosition(node, port)
    expect(position.x).toBeCloseTo(50)
    expect(position.y).toBeCloseTo(75)
    expect(getPortSide(node, port)).toBe('bottom')
    expect(getPortSide({ ...node, rotation: 0, flipX: true }, port)).toBe('left')
  })

  it('ends floating connectors on the outline', () => {
    const nodes = [rect('a', 0, 0), rect('b', 300, 0)]
    const { source, target } = resolveEdgeEndpoints(
      { id: 'e', source: { nodeId: 'a' }, target: { nodeId: 'b' } },
      ctx(nodes),
    )

    expect(source.point.x).toBeCloseTo(100)
    expect(source.point.y).toBeCloseTo(25)
    expect(source.side).toBe('right')
    expect(target.point.x).toBeCloseTo(300)
  })
})

describe('routing', () => {
  const source = {
    point: { x: 100, y: 25 },
    side: 'right' as const,
    rect: { x: 0, y: 0, width: 100, height: 50 },
  }
  const target = {
    point: { x: 300, y: 225 },
    side: 'left' as const,
    rect: { x: 300, y: 200, width: 100, height: 50 },
  }

  it('draws straight connectors through waypoints', () => {
    const route = straightRouter({
      source,
      target,
      waypoints: [{ x: 200, y: 0 }],
      obstacles: () => [],
    })
    expect(route.points).toEqual([source.point, { x: 200, y: 0 }, target.point])
    expect(route.path).toBe('M100 25 L200 0 L300 225')
  })

  it('routes orthogonal connectors with horizontal and vertical segments only', () => {
    const route = orthogonalRouter({ source, target, waypoints: [], obstacles: () => [] })

    for (let index = 1; index < route.points.length; index += 1) {
      const a = route.points[index - 1]
      const b = route.points[index]
      expect(a.x === b.x || a.y === b.y).toBe(true)
    }

    expect(route.points[0]).toEqual(source.point)
    expect(route.points.at(-1)).toEqual(target.point)
  })

  it('avoids obstacles', () => {
    const obstacle = { x: 150, y: -100, width: 50, height: 400 }
    const path = findOrthogonalRoute({ x: 120, y: 25 }, 'right', { x: 280, y: 25 }, 'left', [
      obstacle,
    ])!

    expect(path).not.toBeNull()
    for (let index = 1; index < path.length; index += 1) {
      const a = path[index - 1]
      const b = path[index]
      const crosses =
        Math.max(a.x, b.x) > obstacle.x &&
        Math.min(a.x, b.x) < obstacle.x + obstacle.width &&
        Math.max(a.y, b.y) > obstacle.y &&
        Math.min(a.y, b.y) < obstacle.y + obstacle.height
      expect(crosses).toBe(false)
    }
  })

  it('routes around nodes through the editor', () => {
    const editor = createEditor({
      document: {
        nodes: [rect('a', 0, 0), rect('wall', 200, -200, { height: 500 }), rect('b', 400, 0)],
        edges: [
          {
            id: 'e',
            type: 'orthogonal',
            source: { nodeId: 'a', portId: 'right' },
            target: { nodeId: 'b', portId: 'left' },
          },
        ],
      },
    })
    const route = editor.getEdgeRoute(editor.store.getEdge('e')!)
    const ys = route.points.map((p) => p.y)

    // The route has to leave the row of the nodes to get around the wall.
    expect(Math.min(...ys) < -200 || Math.max(...ys) > 300).toBe(true)
    // Cached until something changes.
    expect(editor.getEdgeRoute(editor.store.getEdge('e')!)).toBe(route)
  })

  it('draws curves along the port directions', () => {
    const route = bezierRouter({ source, target, waypoints: [], obstacles: () => [] })
    expect(route.path.startsWith('M100 25 C')).toBe(true)
    expect(route.points.length).toBeGreaterThan(10)
  })

  it('rounds corners', () => {
    const d = roundedPolylinePath(
      [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
      ],
      10,
    )
    expect(d).toBe('M0 0 L90 0 Q100 0 100 10 L100 100')
  })

  it('builds arrowheads', () => {
    expect(getArrowhead('none', { x: 0, y: 0 }, 0, 10)).toBeNull()
    expect(getArrowhead('triangle', { x: 0, y: 0 }, 0, 10)).toEqual({
      path: 'M0 0 L-10 -5 L-10 5 Z',
      filled: true,
      inset: 10,
    })
    expect(
      endAngle(
        [
          { x: 0, y: 0 },
          { x: 0, y: 10 },
        ],
        'target',
      ),
    ).toBe(90)
    expect(
      endAngle(
        [
          { x: 0, y: 0 },
          { x: 0, y: 10 },
        ],
        'source',
      ),
    ).toBe(-90)
  })
})

describe('serialization', () => {
  const document = {
    version: 1,
    nodes: [rect('a', 0, 0), rect('b', 200, 0, { parentId: 'missing' })],
    edges: [{ id: 'e', source: { nodeId: 'a' }, target: { point: { x: 1, y: 2 } } }],
  }

  it('round trips documents', () => {
    const result = parseDiagram(serializeDiagram(document as any))
    expect(result.ok).toBe(true)
    expect(result.document?.nodes).toHaveLength(2)
    expect(result.issues).toEqual([
      expect.objectContaining({ path: 'nodes[1].parentId', severity: 'warning' }),
    ])
  })

  it('reports structural errors', () => {
    const issues = validateDiagram({
      version: 1,
      nodes: [rect('a', 0, 0), { ...rect('a', 0, 0), width: Number.NaN }],
      edges: [{ id: 'e', source: { nodeId: 'nope' }, target: {} }],
    })

    expect(issues.map((issue) => issue.path)).toEqual(
      expect.arrayContaining([
        'nodes[1].id',
        'nodes[1].width',
        'edges[0].source.nodeId',
        'edges[0].target',
      ]),
    )
    expect(parseDiagram('{oops').ok).toBe(false)
    expect(parseDiagram({ version: 99, nodes: [], edges: [] }).ok).toBe(false)
    expect(parseDiagram(document, { strict: true }).ok).toBe(false)
  })

  it('detects group cycles', () => {
    const issues = validateDiagram({
      version: 1,
      nodes: [rect('a', 0, 0, { parentId: 'b' }), rect('b', 0, 0, { parentId: 'a' })],
      edges: [],
    })
    expect(issues.some((issue) => issue.message.includes('cycle'))).toBe(true)
  })

  it('migrates older documents', () => {
    const migrated = migrateDiagram({ version: 0, shapes: [rect('a', 0, 0)], links: [] }, [
      { version: 0, migrate: (doc) => ({ ...doc, nodes: doc.shapes, edges: doc.links }) },
    ])
    expect(migrated.version).toBe(1)
    expect(migrated.nodes).toHaveLength(1)

    const parsed = parseDiagram(
      { shapes: [rect('a', 0, 0)], links: [] },
      {
        migrations: [
          { version: 0, migrate: (doc) => ({ ...doc, nodes: doc.shapes, edges: doc.links }) },
        ],
      },
    )
    expect(parsed.ok).toBe(true)
  })
})

describe('patches', () => {
  it('diffs and applies partial updates', () => {
    const before = { version: 1, nodes: [rect('a', 0, 0), rect('b', 0, 0)], edges: [] }
    const after = {
      version: 1,
      nodes: [rect('a', 5, 0, { label: 'A' }), rect('c', 0, 0)],
      edges: [],
    }
    const patch = diffDiagrams(before, after)

    expect(patch.nodes).toEqual({
      add: [after.nodes[1]],
      update: [{ id: 'a', x: 5, label: 'A' }],
      remove: ['b'],
    })

    const store = new DiagramStore(before)
    applyDiagramPatch(store, patch)
    expect(store.toDocument().nodes).toEqual(after.nodes)

    store.undo()
    expect(store.toDocument().nodes).toEqual(before.nodes)
  })

  it('preserves insertion order, edge order and document metadata', () => {
    const beforeStore = new DiagramStore({
      version: 1,
      id: 'before',
      name: 'Before',
      meta: { revision: 1 },
      nodes: [rect('a', 0, 0), rect('c', 200, 0)],
      edges: [
        { id: 'e1', source: { nodeId: 'a' }, target: { nodeId: 'c' } },
        { id: 'e2', source: { point: { x: 0, y: 0 } }, target: { nodeId: 'a' } },
      ],
    })
    const before = beforeStore.toDocument()
    const after = {
      ...before,
      id: undefined,
      name: 'After',
      meta: { revision: 2 },
      nodes: [rect('b', 100, 0), before.nodes[0], before.nodes[1]],
      edges: [before.edges[1], before.edges[0]],
    }
    const patch = diffDiagrams(before, after)

    expect(patch.nodeOrder).toEqual(['b', 'a', 'c'])
    expect(patch.edgeOrder).toEqual(['e2', 'e1'])

    applyDiagramPatch(beforeStore, patch)
    expect(beforeStore.toDocument()).toEqual(after)
  })
})

describe('behavior registry', () => {
  it('restores registrations when overrides are removed out of order', () => {
    const registry = new DiagramBehaviorRegistry()
    const builtIn = registry.get('rect')
    const first = { type: 'rect', connectable: false }
    const second = { type: 'rect', selectable: false }
    const removeFirst = registry.register(first)
    const removeSecond = registry.register(second)

    expect(registry.get('rect')).toBe(second)
    removeFirst()
    expect(registry.get('rect')).toBe(second)
    removeSecond()
    expect(registry.get('rect')).toBe(builtIn)
  })
})

describe('units', () => {
  const metric = { pixelsPerMeter: 100, unit: 'm' as const, precision: 2 }
  const imperial = { pixelsPerMeter: 100, unit: 'ft-in' as const, precision: 1 }

  it('converts and formats lengths', () => {
    expect(convertLength(1, 'ft', 'in')).toBeCloseTo(12)
    expect(worldToUnit(250, metric)).toBe(2.5)
    expect(unitToWorld(2.5, metric)).toBe(250)
    expect(formatLength(345, metric)).toBe('3.45 m')
    expect(formatLength(345, { ...metric, unit: 'cm', precision: 0 })).toBe('345 cm')
    expect(formatLength(30.48 * 11 + 2.54 * 4.5, imperial)).toBe('11′ 4 1/2″')
    expect(formatArea(100 * 100 * 12.5, metric)).toBe('12.5 m²')
    expect(formatLength(42, { pixelsPerMeter: 100, unit: 'px', precision: 0 })).toBe('42 px')
  })

  it('parses user input', () => {
    expect(parseLength('3.5 m', metric)).toBe(350)
    expect(parseLength('120cm', metric)).toBe(120)
    expect(parseLength('2', metric)).toBe(200)
    expect(parseLength(`11' 4"`, metric)).toBeCloseTo(30.48 * 11 + 2.54 * 4)
    expect(parseLength('7 ft 2 in', metric)).toBeCloseTo(30.48 * 7 + 2.54 * 2)
    expect(parseLength('abc', metric)).toBeNull()
    expect(parseLength('3 m and more', metric)).toBeNull()
  })

  it('calibrates the scale from a measured distance', () => {
    const scale = calibrateScale(500, 2.5, 'm', metric)
    expect(scale.pixelsPerMeter).toBe(200)
    expect(() => calibrateScale(0, 1, 'm')).toThrow()
  })
})

describe('text', () => {
  const measure = (text: string, font: { size: number }) => text.length * font.size * 0.5

  it('wraps words and keeps paragraphs', () => {
    const lines = wrapRichText(
      plainTextToRichText('Hello wide world\nBye'),
      60,
      { size: 10 },
      measure,
    )
    expect(lines.map((line) => line.runs.map((run) => run.text).join(''))).toEqual([
      'Hello wide',
      'world',
      'Bye',
    ])
  })

  it('breaks words longer than a line', () => {
    const lines = wrapRichText([[{ text: 'abcdefghij' }]], 20, { size: 10 }, measure)
    expect(lines.map((line) => line.runs[0].text)).toEqual(['abcd', 'efgh', 'ij'])
  })

  it('keeps run formatting', () => {
    const [line] = wrapRichText(
      [[{ text: 'plain ' }, { text: 'bold', bold: true }]],
      500,
      { size: 10 },
      measure,
    )
    expect(line.runs.map((run) => [run.text, !!run.bold])).toEqual([
      ['plain ', false],
      ['bold', true],
    ])
  })
})
