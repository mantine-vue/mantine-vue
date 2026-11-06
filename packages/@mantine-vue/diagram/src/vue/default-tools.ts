import type { DiagramTool } from '../core/editor'
import {
  createConnectorTool,
  createPointsShapeTool,
  createShapeTool,
  createTextTool,
} from '../core/tools/basic-tools'

/** Drawing tools registered by `useDiagram` unless `defaultTools` is `false`. */
export function createDefaultTools(): DiagramTool[] {
  return [
    createShapeTool({ id: 'rect', label: 'Rectangle', icon: 'rect', node: { type: 'rect' } }),
    createShapeTool({
      id: 'ellipse',
      label: 'Ellipse',
      icon: 'ellipse',
      node: { type: 'ellipse' },
    }),
    createShapeTool({
      id: 'diamond',
      label: 'Decision',
      icon: 'diamond',
      node: { type: 'diamond' },
    }),
    createTextTool(),
    createConnectorTool(),
    createPointsShapeTool({ id: 'line', type: 'line', label: 'Line', icon: 'line' }),
    createPointsShapeTool({ id: 'polygon', type: 'polygon', label: 'Polygon', icon: 'polygon' }),
  ]
}
