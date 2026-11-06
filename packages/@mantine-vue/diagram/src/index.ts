// Framework agnostic engine: data model, geometry, store, history, editor, tools and routing.
export * from './core'
export {
  exportSvg,
  exportImage,
  printSvg,
  downloadFile,
  type DiagramSvgExportOptions,
  type DiagramImageExportOptions,
} from './core/export'

// Vue layer.
export { useDiagram, type DiagramController, type UseDiagramOptions } from './vue/use-diagram'
export {
  useDiagramSelection,
  useDiagramHistory,
  useDiagramViewport,
  useDiagramKeyboard,
  resolveShortcuts,
  type UseDiagramKeyboardOptions,
} from './vue/composables'
export { useDiagramExport } from './vue/use-diagram-export'
export {
  useDiagramContext,
  useOptionalDiagramContext,
  type DiagramContextValue,
} from './vue/context'
export { insertTemplate, TEMPLATE_MIME } from './vue/templates'
export { createDefaultTools } from './vue/default-tools'
export { getPath, setPath } from './vue/paths'
export { COMMAND_ICONS, formatShortcut, runCommand } from './vue/command-ui'
export type {
  DiagramExtension,
  DiagramNodeRendererProps,
  DiagramNodeType,
  DiagramPanelPosition,
  DiagramPropertyField,
  DiagramTemplate,
  DiagramToolbarItem,
} from './vue/types'

export { DEFAULT_DIAGRAM_LABELS, mergeDiagramLabels } from './labels'
export type { DiagramLabels, DiagramLabelsOverride } from './labels'

// Floor planning and restaurant extensions, tree-shaken when not imported.
export * from './floor-plan'
export * from './restaurant'

// Components.
export { Diagram } from './components/Diagram'
export type {
  DiagramContextMenuContext,
  DiagramCssVariables,
  DiagramEmits,
  DiagramExposed,
  DiagramFactory,
  DiagramGridOptions,
  DiagramMenuItem,
  DiagramMenuState,
  DiagramOwnProps,
  DiagramProps,
  DiagramSlots,
  DiagramStylesNames,
} from './components/Diagram'
export { default as DiagramProvider } from './components/DiagramProvider/DiagramProvider.vue'
export { default as DiagramPanel } from './components/DiagramPanel/DiagramPanel.vue'
export { default as DiagramToolbar } from './components/DiagramToolbar/DiagramToolbar.vue'
export { default as DiagramControls } from './components/DiagramControls/DiagramControls.vue'
export { default as DiagramMinimap } from './components/DiagramMinimap/DiagramMinimap.vue'
export { default as DiagramLayers } from './components/DiagramLayers/DiagramLayers.vue'
export { default as DiagramPropertiesPanel } from './components/DiagramPropertiesPanel/DiagramPropertiesPanel.vue'
export { default as DiagramPalette } from './components/DiagramPalette/DiagramPalette.vue'
export { DiagramNodeLabel } from './components/shapes/DiagramNodeLabel'
export { BUILT_IN_NODE_TYPES } from './components/shapes/built-in-node-types'
export {
  getShapeAttrs,
  getShadowFilter,
  isSafeImageUrl,
  sanitizePathData,
} from './components/shapes/shape-utils'
export { default as DiagramIcon } from './icons/DiagramIcon.vue'
export { DIAGRAM_ICON_PATHS, type DiagramIconName } from './icons/icon-paths'
