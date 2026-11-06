# @mantine-vue/diagram

Extensible Vue 3 diagram editor for flowcharts, organizational charts, network diagrams, floor
plans and restaurant layouts. It combines an interactive SVG canvas with a serializable document
model, undo history, keyboard controls and export utilities.

## Features

- Built-in flowchart shapes and custom SVG or HTML Vue nodes
- Straight, orthogonal, rounded and Bézier connectors with ports and validation
- Selection, snapping, alignment, layers, groups, clipboard, undo and redo
- Toolbars, controls, minimap, palettes, properties panel, rulers and guides
- Versioned JSON documents with validation, migrations and patches
- SVG, PNG, JPEG and WebP export, plus browser printing
- Optional floor plan and restaurant layout extensions

## Installation

```bash
yarn add @mantine-vue/diagram @mantine-vue/core @mantine-vue/hooks

# or with npm
npm install @mantine-vue/diagram @mantine-vue/core @mantine-vue/hooks
```

Import the styles once at the root of your application, after Mantine core styles:

```ts
import '@mantine-vue/core/styles.css'
import '@mantine-vue/diagram/styles.css'
```

## Usage

`Diagram` fills its container, so give it an explicit height. Use `v-model` when application state
must track each committed document change.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Diagram, DiagramControls, DiagramMinimap, DiagramToolbar } from '@mantine-vue/diagram'
import type { DiagramDocument } from '@mantine-vue/diagram'

const document = ref<DiagramDocument>({
  version: 1,
  nodes: [
    { id: 'start', type: 'rect', x: 0, y: 0, width: 160, height: 70, label: 'Start' },
    { id: 'end', type: 'ellipse', x: 280, y: 0, width: 140, height: 90, label: 'End' },
  ],
  edges: [
    {
      id: 'flow',
      type: 'orthogonal',
      source: { nodeId: 'start' },
      target: { nodeId: 'end' },
      targetArrow: 'triangle',
    },
  ],
})
</script>

<template>
  <Diagram v-model="document" rulers fit-view style="height: 520px">
    <DiagramToolbar />
    <DiagramControls />
    <DiagramMinimap />
  </Diagram>
</template>
```

Use `default-value` instead of `v-model` when the diagram should own its document state.

## Floor plan and restaurant extensions

Domain features use the same document and editor APIs as the core diagram component:

```ts
import { computed, ref } from 'vue'
import {
  floorPlanExtension,
  restaurantExtension,
  useDiagram,
  useRestaurantFloor,
} from '@mantine-vue/diagram'

const liveStatuses = ref<Record<string, string>>({})

const controller = useDiagram({
  extensions: [floorPlanExtension({ collisions: 'highlight' }), restaurantExtension()],
})

const restaurant = useRestaurantFloor(controller, { statuses: liveStatuses })

function updateTableStatus(id: string, status: string) {
  liveStatuses.value = { ...liveStatuses.value, [id]: status }
}

const availableSeats = computed(() => restaurant.summary.value.availableSeats)
```

Pass the controller to `<Diagram :controller="controller">`. Live statuses remain outside the
saved layout; call `restaurant.setStatus(id, status, { persist: true })` when a status should be
stored in the document.

## Documentation

- [Getting started](https://mantine-vue.dev/diagram/getting-started)
- [Diagram component](https://mantine-vue.dev/diagram/diagram)
- [Nodes and custom Vue components](https://mantine-vue.dev/diagram/nodes)
- [Connectors and routing](https://mantine-vue.dev/diagram/connectors)
- [Floor plan editor](https://mantine-vue.dev/diagram/floor-plans)
- [Restaurant floor plans](https://mantine-vue.dev/diagram/restaurant)
- [Saving and export](https://mantine-vue.dev/diagram/serialization)
- [Extensions and editor API](https://mantine-vue.dev/diagram/extensions)
- [Performance and architecture](https://mantine-vue.dev/diagram/performance)
- [Features and limitations](https://mantine-vue.dev/diagram/features)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core` matching the installed diagram package version
- `@mantine-vue/hooks` matching the installed diagram package version

## License

MIT
