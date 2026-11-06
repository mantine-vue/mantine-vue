import type { Component } from 'vue'
import type { DiagramCommand, DiagramPlugin, DiagramTool } from '../core/editor'
import type { DiagramRouter } from '../core/routing'
import type { DiagramNodeBehavior } from '../core/shapes'
import type { DiagramEdge, DiagramNode } from '../core/types'
import type { DiagramController } from './use-diagram'

/** Props every node renderer receives. Renderers draw in local coordinates: `0,0` to `width,height`. */
export interface DiagramNodeRendererProps {
  node: DiagramNode
  selected: boolean
  controller: DiagramController
}

/** A field of the properties panel, bound to a path of the node, e.g. `'data.seats'`. */
export interface DiagramPropertyField {
  /** Dot separated path inside the node, e.g. `'label'`, `'style.fill'` or `'data.seats'` */
  path: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'switch' | 'length'
  /** Options of `select` fields */
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  /** Value shown when the node has none */
  defaultValue?: unknown
}

/** A node type: geometry behavior plus the Vue component that renders it. */
export interface DiagramNodeType extends DiagramNodeBehavior {
  /** Display name used by palettes and the properties panel */
  name?: string
  /** Renderer component. SVG by default, HTML when `html` is set */
  component?: Component
  /** Renders the component inside a `foreignObject`, for nodes made of regular HTML */
  html?: boolean
  /** Whether the shared label renderer draws `label` and `richText`, `true` by default */
  renderLabel?: boolean
  /** Fields shown in the properties panel for this type */
  properties?: DiagramPropertyField[]
}

/** A reusable preset that palettes insert into the diagram. */
export interface DiagramTemplate {
  id: string
  label: string
  /** Palette group */
  category?: string
  /** Text matched by palette search in addition to the label */
  keywords?: string[]
  /** Node created by the template, positioned by the drop point */
  node?: Partial<Omit<DiagramNode, 'id'>> & { type: string }
  /** Several nodes, positioned relative to each other, and edges between them by index */
  nodes?: (Partial<Omit<DiagramNode, 'id'>> & { type: string })[]
  edges?: (Partial<Omit<DiagramEdge, 'id' | 'source' | 'target'>> & {
    source: number
    target: number
  })[]
}

/**
 * Bundles node types, tools, commands, routers, templates and core plugins. Floor planning and
 * restaurant layouts are extensions, so applications only pay for what they register.
 */
export interface DiagramExtension {
  name: string
  nodeTypes?: DiagramNodeType[]
  tools?: DiagramTool[]
  commands?: DiagramCommand[]
  routers?: Record<string, DiagramRouter>
  templates?: DiagramTemplate[]
  plugins?: DiagramPlugin[]
  /** Runs once when the extension is added to a controller. The returned function cleans up */
  setup?: (controller: DiagramController) => void | (() => void)
}

/** Corner or edge of the canvas a panel is attached to. */
export type DiagramPanelPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

/** An entry of `DiagramToolbar`. */
export type DiagramToolbarItem =
  /** A tool id or a command id, `'|'` is a divider */
  | string
  /** A menu of command ids */
  | { menu: string; icon: string; items: string[] }
  /** A custom button */
  | {
      id: string
      label: string
      icon: string
      active?: (controller: DiagramController) => boolean
      disabled?: (controller: DiagramController) => boolean
      onClick: (controller: DiagramController) => void
    }
