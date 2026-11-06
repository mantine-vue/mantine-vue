import { describe, expect, it, vi } from 'vitest'
import { DiagramStore } from '../core/store'
import { rect } from './test-utils'

describe('DiagramStore', () => {
  it('adds, updates and removes nodes with change events', () => {
    const store = new DiagramStore()
    const listener = vi.fn()
    store.events.on('change', listener)

    store.addNode(rect('a', 0, 0))
    store.updateNode('a', { x: 10 })

    expect(store.getNode('a')?.x).toBe(10)
    expect(listener).toHaveBeenCalledTimes(2)
    expect([...listener.mock.calls[0][0].nodes]).toEqual(['a'])
    expect(listener.mock.calls[0][0].nodeOrder).toBe(true)

    store.removeNode('a')
    expect(store.getNode('a')).toBeUndefined()
    expect(store.getNodes()).toEqual([])
  })

  it('rejects duplicate ids across nodes and edges', () => {
    const store = new DiagramStore({ nodes: [rect('a', 0, 0)], edges: [] })
    expect(() => store.addNode(rect('a', 1, 1))).toThrow(/Duplicate/)
    expect(() =>
      store.addEdge({
        id: 'a',
        source: { point: { x: 0, y: 0 } },
        target: { point: { x: 1, y: 1 } },
      }),
    ).toThrow()
  })

  it('does not alias records passed in', () => {
    const node = rect('a', 0, 0, { data: { nested: { value: 1 } } })
    const store = new DiagramStore()
    store.addNode(node)
    node.data!.nested.value = 2

    expect(store.getNode('a')?.data?.nested.value).toBe(1)
  })

  it('undoes and redoes transactions as single steps', () => {
    const store = new DiagramStore()

    store.transact('Add two', () => {
      store.addNode(rect('a', 0, 0))
      store.addNode(rect('b', 100, 0))
    })
    store.updateNode('a', { x: 50 })

    expect(store.getHistory().undo.map((entry) => entry.label)).toEqual(['Add two', 'Update node'])

    store.undo()
    expect(store.getNode('a')?.x).toBe(0)

    store.undo()
    expect(store.nodeCount).toBe(0)
    expect(store.canUndo).toBe(false)

    store.redo()
    expect(store.getNodes().map((node) => node.id)).toEqual(['a', 'b'])

    store.redo()
    expect(store.getNode('a')?.x).toBe(50)
    expect(store.canRedo).toBe(false)
  })

  it('removes connected edges with a node and restores them on undo', () => {
    const store = new DiagramStore({
      nodes: [rect('a', 0, 0), rect('b', 200, 0)],
      edges: [{ id: 'e', source: { nodeId: 'a' }, target: { nodeId: 'b' } }],
    })

    store.removeNode('a')
    expect(store.edgeCount).toBe(0)
    expect(store.getConnectedEdges('b')).toEqual([])

    store.undo()
    expect(store.getEdge('e')).toBeDefined()
    expect(store.getConnectedEdges('b').map((edge) => edge.id)).toEqual(['e'])
  })

  it('merges transactions with the same merge key', () => {
    const store = new DiagramStore({ nodes: [rect('a', 0, 0)], edges: [] })

    store.transact('Nudge', () => store.updateNode('a', { x: 1 }), { mergeKey: 'nudge' })
    store.transact('Nudge', () => store.updateNode('a', { x: 2 }), { mergeKey: 'nudge' })
    store.transact('Nudge', () => store.updateNode('a', { x: 3 }), { mergeKey: 'nudge' })

    expect(store.getHistory().undo).toHaveLength(1)
    store.undo()
    expect(store.getNode('a')?.x).toBe(0)
  })

  it('limits the history', () => {
    const store = new DiagramStore({ nodes: [rect('a', 0, 0)], edges: [] }, { historyLimit: 3 })

    for (let index = 1; index <= 5; index += 1) {
      store.updateNode('a', { x: index })
    }

    expect(store.getHistory().undo).toHaveLength(3)
    while (store.undo()) {
      // Undo everything that is left.
    }
    expect(store.getNode('a')?.x).toBe(2)
  })

  it('rolls back an open transaction', () => {
    const store = new DiagramStore({ nodes: [rect('a', 0, 0)], edges: [] })

    store.begin('Drag')
    store.updateNode('a', { x: 40 })
    store.addNode(rect('b', 0, 0))
    store.rollback()

    expect(store.getNode('a')?.x).toBe(0)
    expect(store.hasNode('b')).toBe(false)
    expect(store.canUndo).toBe(false)
  })

  it('rolls back when a transaction throws', () => {
    const store = new DiagramStore({ nodes: [rect('a', 0, 0)], edges: [] })

    expect(() =>
      store.transact('Broken', () => {
        store.updateNode('a', { x: 40 })
        throw new Error('boom')
      }),
    ).toThrow('boom')
    expect(store.getNode('a')?.x).toBe(0)
  })

  it('applies changes without history', () => {
    const store = new DiagramStore({ nodes: [rect('a', 0, 0)], edges: [] })
    const onCommit = vi.fn()
    store.events.on('commit', onCommit)
    store.transact('Status', () => store.updateNodeData('a', { status: 'busy' }), {
      history: false,
    })

    expect(store.getNode('a')?.data?.status).toBe('busy')
    expect(store.canUndo).toBe(false)
    expect(onCommit).toHaveBeenCalledOnce()
    expect(onCommit.mock.calls[0][0].label).toBe('Status')
  })

  it('tracks group children and ancestors', () => {
    const store = new DiagramStore({
      nodes: [
        { ...rect('g', 0, 0), type: 'group' },
        rect('a', 0, 0, { parentId: 'g' }),
        { ...rect('inner', 0, 0, { parentId: 'g' }), type: 'group' },
        rect('b', 0, 0, { parentId: 'inner' }),
      ],
      edges: [],
    })

    expect(store.getChildren('g').map((node) => node.id)).toEqual(['a', 'inner'])
    expect(store.getDescendants('g').map((node) => node.id)).toEqual(['a', 'inner', 'b'])
    expect(store.getAncestors('b').map((node) => node.id)).toEqual(['inner', 'g'])

    store.removeNode('inner')
    expect(store.getNode('b')?.parentId).toBe('g')
  })

  it('reorders nodes and keeps unknown ids out', () => {
    const store = new DiagramStore({
      nodes: [rect('a', 0, 0), rect('b', 0, 0), rect('c', 0, 0)],
      edges: [],
    })
    store.setNodeOrder(['c', 'missing', 'a'])

    expect(store.getNodeOrder()).toEqual(['c', 'a', 'b'])
    store.undo()
    expect(store.getNodeOrder()).toEqual(['a', 'b', 'c'])
  })

  it('exports documents with layers, settings and metadata', () => {
    const store = new DiagramStore({
      version: 1,
      id: 'doc',
      name: 'Plan',
      nodes: [rect('a', 0, 0)],
      edges: [],
      layers: [{ id: 'l1', name: 'Base' }],
      settings: { gridSize: 10 },
      meta: { owner: 'me' },
    })

    expect(store.toDocument()).toMatchObject({
      version: 1,
      id: 'doc',
      name: 'Plan',
      layers: [{ id: 'l1', name: 'Base' }],
      settings: { gridSize: 10 },
      meta: { owner: 'me' },
    })

    store.updateSettings({ gridSize: 25 })
    store.undo()
    expect(store.getSettings().gridSize).toBe(10)
  })
})
