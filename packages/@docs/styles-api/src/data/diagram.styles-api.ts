import type { StylesApiData } from '../types'

const DIAGRAM_VARS = {
  '--diagram-accent': 'Controls color of selections, handles, guides and measurements',
  '--diagram-accent-light': 'Controls background of marquee selections and active rows',
  '--diagram-radius': 'Controls `border-radius` of the canvas and panels',
  '--diagram-background': 'Controls background color of the canvas',
}

export const DiagramStylesApi: StylesApiData<
  | 'root'
  | 'provider'
  | 'canvas'
  | 'svg'
  | 'page'
  | 'node'
  | 'htmlNode'
  | 'edge'
  | 'edgePath'
  | 'edgeLabel'
  | 'selectionLayer'
  | 'selectionFrame'
  | 'resizeHandle'
  | 'rotateHandle'
  | 'rotateLine'
  | 'vertexHandle'
  | 'edgeSelection'
  | 'segmentHandle'
  | 'waypointHandle'
  | 'edgeEndHandle'
  | 'port'
  | 'overlayLayer'
  | 'snapLine'
  | 'guide'
  | 'marquee'
  | 'draft'
  | 'draftPoint'
  | 'connectionPreview'
  | 'measurement'
  | 'measurementLine'
  | 'textEditor'
  | 'panel'
  | 'toolbar'
  | 'toolbarDivider'
  | 'controls'
  | 'zoomLabel'
  | 'minimap'
  | 'minimapCanvas'
  | 'ruler'
  | 'rulerHighlight'
  | 'rulerCorner'
  | 'sidePanel'
  | 'sidePanelTitle'
  | 'layerRow'
  | 'layerName'
  | 'objectRow'
  | 'paletteGrid'
  | 'paletteItem'
  | 'liveRegion'
> = {
  selectors: {
    root: 'Root element, the focusable canvas container',
    provider: 'Wrapper rendered by `DiagramProvider`, carries the design tokens',
    canvas: 'Element that receives pointer, wheel and drop events',
    svg: 'SVG element of the canvas',
    page: 'Page or floor boundary behind the content',
    node: 'Group of a node',
    htmlNode: '`foreignObject` of nodes rendered with HTML',
    edge: 'Group of a connector',
    edgePath: 'Visible path of a connector',
    edgeLabel: 'Label of a connector',
    selectionLayer: 'Layer with selection frames and handles',
    selectionFrame: 'Frame around selected nodes',
    resizeHandle: 'Resize handle',
    rotateHandle: 'Rotate handle',
    rotateLine: 'Line between the frame and the rotate handle',
    vertexHandle: 'Handle of a vertex of a polygon or polyline',
    edgeSelection: 'Highlight of a selected connector',
    segmentHandle: 'Handle that adds a control point to a connector',
    waypointHandle: 'Control point of a connector',
    edgeEndHandle: 'Handle that reconnects an end of a connector',
    port: 'Connection port',
    overlayLayer: 'Layer with guides, snap lines and drafts',
    snapLine: 'Smart guide shown while moving or resizing',
    guide: 'User guide line created from a ruler',
    marquee: 'Marquee and lasso selection',
    draft: 'Shape being drawn',
    draftPoint: 'Point of a polyline being drawn',
    connectionPreview: 'Connector being drawn',
    measurement: 'Measurement label',
    measurementLine: 'Measurement line',
    textEditor: 'Inline text editor',
    panel: 'Panel positioned over the canvas',
    toolbar: 'Toolbar',
    toolbarDivider: 'Divider between toolbar groups',
    controls: 'View controls',
    zoomLabel: 'Zoom level of the view controls',
    minimap: 'Minimap',
    minimapCanvas: 'Canvas of the minimap',
    ruler: 'Horizontal and vertical rulers',
    rulerHighlight: 'Extent of the selection on the rulers',
    rulerCorner: 'Corner between the rulers',
    sidePanel: 'Layers, properties and palette panels',
    sidePanelTitle: 'Title of a side panel',
    layerRow: 'Layer of the layers panel',
    layerName: 'Name of a layer or object',
    objectRow: 'Object of the layers panel',
    paletteGrid: 'Grid of palette templates',
    paletteItem: 'Template of the palette',
    liveRegion: 'Visually hidden instructions and announcements',
  },
  vars: {
    root: DIAGRAM_VARS,
    provider: DIAGRAM_VARS,
  },
  modifiers: [
    { modifier: 'data-mode', selector: 'root', condition: 'Always, `edit`, `select` or `view`' },
    { modifier: 'data-with-rulers', selector: 'canvas', condition: 'Rulers are shown' },
    { modifier: 'data-panning', selector: 'canvas', condition: 'The view is being panned' },
    { modifier: 'data-id', selector: ['node', 'edge'], condition: 'Always, the id of the element' },
    { modifier: 'data-type', selector: 'node', condition: 'Always, the node type' },
    { modifier: 'data-selected', selector: ['node', 'edge'], condition: 'The element is selected' },
    {
      modifier: 'data-locked',
      selector: ['node', 'selectionFrame'],
      condition: 'The element is locked',
    },
    {
      modifier: 'data-colliding',
      selector: 'node',
      condition: 'The node overlaps another one (floor plan extension)',
    },
    {
      modifier: 'data-active',
      selector: ['port', 'layerRow', 'objectRow'],
      condition: 'The port is the connection target, the layer is active or the object is selected',
    },
    {
      modifier: 'data-invalid',
      selector: 'connectionPreview',
      condition: 'The connection is not allowed',
    },
    {
      modifier: 'data-position',
      selector: 'panel',
      condition: 'Always, the position of the panel',
    },
    {
      modifier: 'data-orientation',
      selector: ['toolbar', 'controls', 'ruler'],
      condition: 'Always, `horizontal` or `vertical`',
    },
  ],
}
