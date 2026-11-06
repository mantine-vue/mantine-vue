/** Every user facing string of the diagram components. */
export interface DiagramLabels {
  /** Accessible name of the canvas */
  canvas: string
  /** `aria-roledescription` of the canvas */
  canvasRole: string
  /** Instructions announced with the canvas */
  instructions: string
  toolbar: string
  controls: string
  minimap: string
  layers: string
  properties: string
  palette: string
  contextMenu: string
  /** Labels of commands by command id, the English command label is used otherwise */
  commands: Record<string, string>
  /** Labels of tools by tool id, the tool label is used otherwise */
  tools: Record<string, string>
  zoomLevel: (percent: number) => string
  fullscreen: string
  exitFullscreen: string
  toggleGrid: string
  toggleSnap: string
  interactive: string
  locked: string
  align: string
  arrange: string
  more: string
  addLayer: string
  removeLayer: string
  renameLayer: string
  showLayer: string
  hideLayer: string
  lockLayer: string
  unlockLayer: string
  moveLayerUp: string
  moveLayerDown: string
  activeLayer: string
  objects: string
  noSelection: string
  multipleSelection: (count: number) => string
  searchTemplates: string
  noTemplates: string
  addTemplate: (label: string) => string
  /** Announced when the selection changes */
  selectionAnnouncement: (names: string[]) => string
  nodeDescription: (name: string, type: string) => string
  edgeDescription: (from: string, to: string) => string
  untitled: string
  editText: string
  fields: {
    label: string
    x: string
    y: string
    width: string
    height: string
    rotation: string
    fill: string
    stroke: string
    strokeWidth: string
    opacity: string
    cornerRadius: string
    fontSize: string
    textColor: string
    locked: string
    hidden: string
    layer: string
    router: string
    sourceArrow: string
    targetArrow: string
    dashed: string
  }
  routers: Record<string, string>
  arrowheads: Record<string, string>
}

export type DiagramLabelsOverride = Partial<
  Omit<DiagramLabels, 'commands' | 'tools' | 'fields'>
> & {
  commands?: Record<string, string>
  tools?: Record<string, string>
  fields?: Partial<DiagramLabels['fields']>
}

export const DEFAULT_DIAGRAM_LABELS: DiagramLabels = {
  canvas: 'Diagram',
  canvasRole: 'diagram editor',
  instructions:
    'Use Tab to move between elements, arrow keys to move them, Delete to remove them and Enter to edit text.',
  toolbar: 'Diagram tools',
  controls: 'View controls',
  minimap: 'Overview, click to navigate',
  layers: 'Layers',
  properties: 'Properties',
  palette: 'Shapes',
  contextMenu: 'Actions',
  commands: {},
  tools: {},
  zoomLevel: (percent) => `${percent}%`,
  fullscreen: 'Enter fullscreen',
  exitFullscreen: 'Exit fullscreen',
  toggleGrid: 'Show grid',
  toggleSnap: 'Snap to grid',
  interactive: 'Editing enabled',
  locked: 'Editing disabled',
  align: 'Align',
  arrange: 'Arrange',
  more: 'More actions',
  addLayer: 'Add layer',
  removeLayer: 'Remove layer',
  renameLayer: 'Rename layer',
  showLayer: 'Show layer',
  hideLayer: 'Hide layer',
  lockLayer: 'Lock layer',
  unlockLayer: 'Unlock layer',
  moveLayerUp: 'Move layer up',
  moveLayerDown: 'Move layer down',
  activeLayer: 'Active layer',
  objects: 'Objects',
  noSelection: 'Select an element to edit its properties',
  multipleSelection: (count) => `${count} elements selected`,
  searchTemplates: 'Search shapes',
  noTemplates: 'Nothing found',
  addTemplate: (label) => `Add ${label}`,
  selectionAnnouncement: (names) =>
    names.length === 0
      ? 'Selection cleared'
      : names.length === 1
        ? `${names[0]} selected`
        : `${names.length} elements selected`,
  nodeDescription: (name, type) => (name === type ? name : `${name}, ${type}`),
  edgeDescription: (from, to) => `Connector from ${from} to ${to}`,
  untitled: 'Untitled',
  editText: 'Edit text',
  fields: {
    label: 'Label',
    x: 'X',
    y: 'Y',
    width: 'Width',
    height: 'Height',
    rotation: 'Rotation',
    fill: 'Fill',
    stroke: 'Stroke',
    strokeWidth: 'Stroke width',
    opacity: 'Opacity',
    cornerRadius: 'Corner radius',
    fontSize: 'Font size',
    textColor: 'Text color',
    locked: 'Locked',
    hidden: 'Hidden',
    layer: 'Layer',
    router: 'Routing',
    sourceArrow: 'Start arrow',
    targetArrow: 'End arrow',
    dashed: 'Dashed',
  },
  routers: {
    straight: 'Straight',
    orthogonal: 'Orthogonal',
    rounded: 'Rounded',
    bezier: 'Curved',
  },
  arrowheads: {
    none: 'None',
    arrow: 'Arrow',
    triangle: 'Triangle',
    'open-triangle': 'Open triangle',
    diamond: 'Diamond',
    'open-diamond': 'Open diamond',
    circle: 'Circle',
    'open-circle': 'Open circle',
    bar: 'Bar',
  },
}

export function mergeDiagramLabels(override?: DiagramLabelsOverride): DiagramLabels {
  if (!override) {
    return DEFAULT_DIAGRAM_LABELS
  }

  return {
    ...DEFAULT_DIAGRAM_LABELS,
    ...override,
    commands: { ...DEFAULT_DIAGRAM_LABELS.commands, ...override.commands },
    tools: { ...DEFAULT_DIAGRAM_LABELS.tools, ...override.tools },
    fields: { ...DEFAULT_DIAGRAM_LABELS.fields, ...override.fields },
    routers: { ...DEFAULT_DIAGRAM_LABELS.routers, ...override.routers },
    arrowheads: { ...DEFAULT_DIAGRAM_LABELS.arrowheads, ...override.arrowheads },
  }
}
