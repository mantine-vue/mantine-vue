import { unionRects, type Point } from '../core/geometry'
import { snapPointToGrid } from '../core/snapping'
import type { DiagramNode } from '../core/types'
import type { DiagramTemplate } from './types'
import type { DiagramController } from './use-diagram'

export const TEMPLATE_MIME = 'application/x-mantine-vue-diagram-template'

/**
 * Inserts a template centered at a world point as one undoable step and selects the result.
 * Returns the ids of the created nodes.
 */
export function insertTemplate(
  controller: DiagramController,
  template: DiagramTemplate,
  at: Point,
): string[] {
  const { editor } = controller

  if (!editor.canEdit) {
    return []
  }

  const partials = template.nodes ?? (template.node ? [template.node] : [])

  if (partials.length === 0) {
    return []
  }

  const nodes = partials.map((partial) => editor.createNode({ ...partial }))
  const bounds = unionRects(
    nodes.map((node) => ({ x: node.x, y: node.y, width: node.width, height: node.height })),
  )!
  let origin = { x: at.x - bounds.width / 2, y: at.y - bounds.height / 2 }

  if (editor.options.snapToGrid) {
    origin = snapPointToGrid(origin, editor.gridSize)
  }

  const placed: DiagramNode[] = nodes.map((node) => ({
    ...node,
    x: origin.x + node.x - bounds.x,
    y: origin.y + node.y - bounds.y,
  }))

  editor.store.transact(`Add ${template.label}`, () => {
    placed.forEach((node) => editor.store.addNode(node))
    // Placing is a transform too: extensions snap doors into walls and so on.
    editor.notifyTransform(placed.map((node) => node.id))

    for (const edge of template.edges ?? []) {
      const source = placed[edge.source]
      const target = placed[edge.target]

      if (source && target) {
        const { source: _source, target: _target, ...rest } = edge
        editor.store.addEdge(
          editor.createEdge({
            ...rest,
            source: { nodeId: source.id },
            target: { nodeId: target.id },
          }),
        )
      }
    }
  })

  const ids = placed.filter((node) => !node.parentId).map((node) => node.id)
  editor.setSelection(ids)

  return ids
}
