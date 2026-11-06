import type { Frontmatter } from '@/types'

const PACKAGE = '@mantine-vue/diagram'

export const DIAGRAM_MDX_DATA: Record<string, Frontmatter> = {
  DiagramGettingStarted: {
    title: 'Vue 3 diagram editor: getting started',
    package: PACKAGE,
    slug: '/diagram/getting-started',
    description:
      'Install @mantine-vue/diagram and build an interactive Vue 3 flowchart editor with custom nodes, connectors, pan, zoom and undo.',
    docs: 'diagram/getting-started.mdx',
    searchTags:
      'vue diagram, vue 3 diagram editor, vue flowchart, flowchart editor, node editor, installation',
  },
  Diagram: {
    title: 'Vue Diagram component',
    package: PACKAGE,
    slug: '/diagram/diagram',
    props: ['Diagram'],
    styles: ['Diagram'],
    description:
      'Configure the Vue Diagram component with v-model, interaction modes, events, toolbars, a minimap, rulers and Mantine theming.',
    source: '@mantine-vue/diagram/src/components/Diagram/Diagram.ts',
    docs: 'diagram/diagram.mdx',
    searchTags:
      'vue diagram component, v-model, diagram toolbar, minimap, rulers, controls, palette, properties panel',
  },
  DiagramNodes: {
    title: 'Diagram nodes, shapes and custom Vue components',
    package: PACKAGE,
    slug: '/diagram/nodes',
    description:
      'Create diagram nodes with built-in shapes, custom SVG or HTML Vue components, connection ports, labels, templates and palettes.',
    docs: 'diagram/nodes.mdx',
    searchTags:
      'custom node, vue component node, shapes, ports, templates, palette, rich text, org chart',
  },
  DiagramConnectors: {
    title: 'Diagram connectors, edges and routing',
    package: PACKAGE,
    slug: '/diagram/connectors',
    description:
      'Connect Vue diagram nodes with straight, orthogonal, rounded or Bézier edges, obstacle routing, arrowheads and validation rules.',
    docs: 'diagram/connectors.mdx',
    searchTags:
      'edges, connectors, links, routing, orthogonal, bezier, arrowheads, ports, connection validation',
  },
  DiagramEditing: {
    title: 'Diagram editing, keyboard shortcuts and accessibility',
    package: PACKAGE,
    slug: '/diagram/editing',
    description:
      'Implement diagram selection, transforms, snapping, layers, clipboard, undo, keyboard shortcuts and accessible interaction.',
    docs: 'diagram/editing.mdx',
    searchTags:
      'selection, marquee, lasso, resize, rotate, snapping, smart guides, undo redo, keyboard shortcuts, accessibility',
  },
  DiagramFloorPlans: {
    title: 'Vue floor plan editor',
    package: PACKAGE,
    slug: '/diagram/floor-plans',
    description:
      'Build a Vue floor plan editor with walls, doors, windows, rooms, dimensions, metric or imperial units and furniture.',
    docs: 'diagram/floor-plans.mdx',
    searchTags:
      'floor planner, interior design, walls, doors, windows, rooms, furniture, metric, imperial, multi floor',
  },
  DiagramRestaurant: {
    title: 'Restaurant floor plan and seating editor',
    package: PACKAGE,
    slug: '/diagram/restaurant',
    description:
      'Build restaurant floor plans and seating charts with tables, booths, zones, live statuses, capacity summaries and validation.',
    docs: 'diagram/restaurant.mdx',
    searchTags:
      'restaurant floor plan, table management, seating chart, reservations, pos, table status, booths',
  },
  DiagramSerialization: {
    title: 'Save, load and export diagrams',
    package: PACKAGE,
    slug: '/diagram/serialization',
    description:
      'Save and load versioned diagram JSON, validate and migrate documents, apply patches, and export SVG, PNG, JPEG or WebP.',
    docs: 'diagram/serialization.mdx',
    searchTags: 'json, save, load, schema, migration, patch, export svg, export png, print',
  },
  DiagramExtensions: {
    title: 'Diagram extensions, plugins and editor API',
    package: PACKAGE,
    slug: '/diagram/extensions',
    description:
      'Extend the Vue diagram editor with custom node types, tools, commands, routers, plugins and reactive composables.',
    docs: 'diagram/extensions.mdx',
    searchTags:
      'plugins, extensions, custom tools, commands, routers, headless, composables, useDiagram',
  },
  DiagramPerformance: {
    title: 'Diagram performance and architecture',
    package: PACKAGE,
    slug: '/diagram/performance',
    description:
      'Understand the SVG renderer, viewport culling, spatial index, route caching and performance guidance for large Vue diagrams.',
    docs: 'diagram/performance.mdx',
    searchTags: 'performance, large diagrams, svg vs canvas, culling, spatial index, architecture',
  },
  DiagramFeatures: {
    title: 'Diagram features and limitations',
    package: PACKAGE,
    slug: '/diagram/features',
    description:
      'Review the diagram editor feature set, production considerations and current limitations before choosing it for your Vue app.',
    docs: 'diagram/features.mdx',
    searchTags:
      'vue diagram features, flowchart editor features, floor plan editor, restaurant seating chart, limitations, production checklist',
  },
}
