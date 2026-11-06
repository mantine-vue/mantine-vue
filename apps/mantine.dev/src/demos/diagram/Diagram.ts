import { computed, defineComponent, h, ref, shallowRef, watch, type PropType } from 'vue'
import {
  Alert,
  Badge,
  Button,
  Code,
  FileButton,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine-vue/core'
import {
  createShapeTool,
  Diagram,
  DiagramControls,
  DiagramMinimap,
  DiagramNodeLabel,
  DiagramPalette,
  DiagramPanel,
  DiagramPropertiesPanel,
  DiagramLayers,
  DiagramProvider,
  DiagramToolbar,
  floorPlanExtension,
  importFloorPlanImage,
  parseDiagram,
  restaurantExtension,
  RestaurantStatusLegend,
  useDiagram,
  useDiagramExport,
  useFloorPlanFloors,
  useRestaurantFloor,
  mergeTables,
  splitTable,
  polylinePath,
} from '@mantine-vue/diagram'
import type {
  DiagramCommand,
  DiagramDocument,
  DiagramExtension,
  DiagramNode,
  DiagramNodeType,
  DiagramPlugin,
  DiagramRouter,
} from '@mantine-vue/diagram'
import type { MantineDemo } from '@/demo'
import {
  createApartmentDocument,
  createBasicDocument,
  createFlowchartDocument,
  createOrgChartDocument,
  createRestaurantDocument,
  FLOWCHART_TEMPLATES,
  SIMULATED_STATUSES,
} from './_data'

const HEIGHT = '520px'

/** Side panels next to the canvas that wrap below it on narrow screens. */
function workspace(...children: (any | null)[]) {
  return h(
    'div',
    { style: { display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'stretch' } },
    children.filter(Boolean),
  )
}

/** Panels below the canvas, side by side when there is room. */
const side = (width: number, child: any) =>
  h(
    'div',
    { style: { flex: `1 1 ${width}px`, minWidth: '200px', maxHeight: '420px', overflow: 'auto' } },
    [child],
  )

/** The canvas takes the full width of the demo. */
const main = (child: any) =>
  h('div', { style: { flex: '1 1 100%', minWidth: '280px', height: HEIGHT } }, [child])

/* 1. Basic editor */

const basicCode = `
<script setup lang="ts">
import { Diagram, DiagramControls, DiagramMinimap, DiagramToolbar } from '@mantine-vue/diagram'
import type { DiagramDocument } from '@mantine-vue/diagram'

const document: DiagramDocument = {
  version: 1,
  nodes: [
    { id: 'box', type: 'rect', x: 280, y: 60, width: 160, height: 70, label: 'Rectangle' },
    { id: 'circle', type: 'ellipse', x: 520, y: 50, width: 140, height: 90, label: 'Ellipse' },
  ],
  edges: [
    { id: 'e1', type: 'orthogonal', source: { nodeId: 'box' }, target: { nodeId: 'circle' } },
  ],
}
</script>

<template>
  <Diagram :default-value="document" rulers fit-view style="height: 520px">
    <DiagramToolbar />
    <DiagramControls />
    <DiagramMinimap />
  </Diagram>
</template>
`

const Basic = defineComponent({
  name: 'DiagramBasicDemo',
  setup: () => () =>
    h(
      Diagram,
      {
        defaultValue: createBasicDocument(),
        rulers: true,
        fitView: true,
        style: { height: HEIGHT },
      },
      () => [h(DiagramToolbar), h(DiagramControls), h(DiagramMinimap)],
    ),
})

export const basic: MantineDemo = {
  type: 'code',
  component: Basic,
  code: basicCode,
  maxWidth: '100%',
}

/* 2. Flowchart editor */

const flowchartCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@mantine-vue/core'
import {
  Diagram,
  DiagramControls,
  DiagramPalette,
  DiagramPanel,
  DiagramPropertiesPanel,
  DiagramProvider,
  DiagramToolbar,
  useDiagram,
} from '@mantine-vue/diagram'
import type { DiagramDocument, DiagramTemplate } from '@mantine-vue/diagram'

const templates: DiagramTemplate[] = [
  { id: 'process', label: 'Process', category: 'Flowchart', node: { type: 'rect', label: 'Process' } },
  { id: 'decision', label: 'Decision', category: 'Flowchart', node: { type: 'diamond', label: 'Decision?' } },
  { id: 'start', label: 'Start / end', category: 'Flowchart', node: { type: 'stadium', label: 'Start' } },
]

const controller = useDiagram({
  templates,
  defaultEdge: { type: 'orthogonal', targetArrow: 'triangle', style: { cornerRadius: 8 } },
})
const document = ref<DiagramDocument>(loadFlowchart())

controller.load(document.value)

function arrange() {
  controller.editor.applyLayout('layered', { direction: 'TB', rankGap: 70, nodeGap: 40 })
  controller.editor.fitView({ animate: true })
}
</script>

<template>
  <DiagramProvider :controller="controller">
    <div style="display: flex; gap: 12px">
      <DiagramPalette style="width: 220px" />
      <Diagram v-model="document" :controller="controller" fit-view style="flex: 1; height: 520px">
        <DiagramToolbar />
        <DiagramControls />
        <DiagramPanel position="top-right">
          <Button size="xs" variant="default" @click="arrange">Auto layout</Button>
        </DiagramPanel>
      </Diagram>
      <DiagramPropertiesPanel style="width: 260px" />
    </div>
  </DiagramProvider>
</template>
`

const Flowchart = defineComponent({
  name: 'DiagramFlowchartDemo',
  setup() {
    const controller = useDiagram({
      templates: FLOWCHART_TEMPLATES,
      defaultEdge: { type: 'orthogonal', targetArrow: 'triangle', style: { cornerRadius: 8 } },
    })
    const document = shallowRef<DiagramDocument>(createFlowchartDocument())
    controller.load(document.value)
    controller.editor.applyLayout('layered', { direction: 'TB', rankGap: 70, nodeGap: 40 })
    document.value = controller.toDocument()

    const arrange = () => {
      controller.editor.applyLayout('layered', { direction: 'TB', rankGap: 70, nodeGap: 40 })
      controller.editor.fitView({ animate: true })
    }

    return () =>
      h(DiagramProvider, { controller }, () =>
        workspace(
          main(
            h(
              Diagram,
              {
                controller,
                modelValue: document.value,
                'onUpdate:modelValue': (value: DiagramDocument) => (document.value = value),
                fitView: true,
                style: { height: '100%' },
              },
              () => [
                h(DiagramToolbar),
                h(DiagramControls),
                h(DiagramPanel, { position: 'top-right' }, () =>
                  h(
                    Button,
                    { size: 'xs', variant: 'default', onClick: arrange },
                    () => 'Auto layout',
                  ),
                ),
              ],
            ),
          ),
          side(220, h(DiagramPalette)),
          side(260, h(DiagramPropertiesPanel)),
        ),
      )
  },
})

export const flowchart: MantineDemo = {
  type: 'code',
  component: Flowchart,
  code: flowchartCode,
  maxWidth: '100%',
}

/* 3. Custom nodes */

const customNodeCode = `
<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { Diagram, DiagramControls, useDiagram } from '@mantine-vue/diagram'
import type { DiagramNodeRendererProps, DiagramNodeType } from '@mantine-vue/diagram'
import PersonCard from './PersonCard.vue'

// SVG renderer: draws in local coordinates, 0,0 to width,height.
const ProgressNode = defineComponent({
  props: ['node', 'selected', 'controller'],
  setup: (props: DiagramNodeRendererProps) => () => {
    const { width, height, data } = props.node
    return h('g', [
      h('rect', { width, height, rx: 10, fill: 'var(--mantine-color-body)', stroke: 'var(--mantine-color-blue-6)' }),
      h('rect', { x: 12, y: height - 18, width: ((width - 24) * data.progress) / 100, height: 6, rx: 3, fill: 'var(--mantine-color-blue-6)' }),
    ])
  },
})

const nodeTypes: DiagramNodeType[] = [
  // HTML renderer inside a foreignObject: buttons and inputs keep working.
  { type: 'person', name: 'Person', component: PersonCard, html: true, renderLabel: false, resizable: false },
  { type: 'progress', name: 'Progress', component: ProgressNode, defaults: { width: 180, height: 70 },
    properties: [{ path: 'data.progress', label: 'Progress', type: 'number', min: 0, max: 100 }] },
]

const controller = useDiagram({ nodeTypes, document: orgChart })
controller.editor.applyLayout('tree', { direction: 'TB', rankGap: 60, nodeGap: 24 })
</script>

<template>
  <Diagram :controller="controller" fit-view style="height: 520px">
    <DiagramControls />
  </Diagram>
</template>
`

const PersonCard = defineComponent({
  name: 'PersonCard',
  props: {
    node: { type: Object as PropType<DiagramNode>, required: true },
    selected: Boolean,
    controller: { type: Object, required: true },
  },
  setup(props) {
    const bump = (delta: number) => {
      const controller = props.controller as ReturnType<typeof useDiagram>
      const progress = Math.max(0, Math.min(100, (props.node.data?.progress ?? 0) + delta))
      controller.editor.updateNode(
        props.node.id,
        (node) => ({ ...node, data: { ...node.data, progress } }),
        'Update progress',
      )
    }

    return () =>
      h(
        'div',
        {
          style: {
            boxSizing: 'border-box',
            height: '100%',
            padding: '8px 10px',
            borderRadius: '10px',
            background: 'var(--mantine-color-body)',
            border: `2px solid ${props.selected ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-default-border)'}`,
            fontFamily: 'var(--mantine-font-family)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          },
        },
        [
          h('div', { style: { fontWeight: 600, fontSize: '14px' } }, props.node.data?.name),
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--mantine-color-dimmed)',
              },
            },
            [
              h(
                'span',
                { style: { flex: 1 } },
                `${props.node.data?.role} · ${props.node.data?.progress ?? 0}%`,
              ),
              // Interactive content is excluded from canvas gestures.
              h(
                'button',
                {
                  type: 'button',
                  'data-diagram-no-pointer': '',
                  'aria-label': 'Decrease progress',
                  onClick: () => bump(-10),
                },
                '−',
              ),
              h(
                'button',
                {
                  type: 'button',
                  'data-diagram-no-pointer': '',
                  'aria-label': 'Increase progress',
                  onClick: () => bump(10),
                },
                '+',
              ),
            ],
          ),
        ],
      )
  },
})

const ProgressNode = defineComponent({
  name: 'ProgressNode',
  props: {
    node: { type: Object as PropType<DiagramNode>, required: true },
    selected: Boolean,
    controller: { type: Object, required: true },
  },
  setup(props) {
    return () => {
      const { width, height, data } = props.node
      const progress = Math.max(0, Math.min(100, data?.progress ?? 0))

      return h('g', [
        h('rect', {
          width,
          height,
          rx: 10,
          fill: 'var(--mantine-color-body)',
          stroke: 'var(--mantine-color-blue-6)',
          'stroke-width': 1.5,
        }),
        h('rect', {
          x: 12,
          y: height - 18,
          width: width - 24,
          height: 6,
          rx: 3,
          fill: 'var(--mantine-color-default-border)',
        }),
        h('rect', {
          x: 12,
          y: height - 18,
          width: ((width - 24) * progress) / 100,
          height: 6,
          rx: 3,
          fill: 'var(--mantine-color-blue-6)',
        }),
        h(DiagramNodeLabel, { node: props.node, box: { x: 0, y: 0, width, height: height - 20 } }),
      ])
    }
  },
})

const customNodeTypes: DiagramNodeType[] = [
  {
    type: 'person',
    name: 'Person',
    component: PersonCard,
    html: true,
    renderLabel: false,
    resizable: false,
    editableText: false,
  },
  {
    type: 'progress',
    name: 'Progress',
    component: ProgressNode,
    renderLabel: false,
    defaults: { width: 180, height: 70, label: 'Milestone', data: { progress: 40 } },
    properties: [{ path: 'data.progress', label: 'Progress', type: 'number', min: 0, max: 100 }],
  },
]

const CustomNodes = defineComponent({
  name: 'DiagramCustomNodesDemo',
  setup() {
    const controller = useDiagram({
      nodeTypes: customNodeTypes,
      document: createOrgChartDocument(),
    })
    controller.editor.applyLayout('tree', { direction: 'TB', rankGap: 60, nodeGap: 24 })
    controller.editor.addNode({
      type: 'progress',
      x: 0,
      y: -160,
      label: 'Q3 roadmap',
      data: { progress: 65 },
    })

    return () =>
      h(DiagramProvider, { controller }, () =>
        workspace(
          main(
            h(Diagram, { controller, fitView: true, style: { height: '100%' } }, () => [
              h(DiagramControls),
            ]),
          ),
          side(240, h(DiagramPropertiesPanel, { withStyle: false })),
        ),
      )
  },
})

export const customNodes: MantineDemo = {
  type: 'code',
  component: CustomNodes,
  code: customNodeCode,
  maxWidth: '100%',
}

/* 4. Floor planner */

const floorPlanCode = `
<script setup lang="ts">
import { FileButton, Button, SegmentedControl } from '@mantine-vue/core'
import {
  Diagram,
  DiagramControls,
  DiagramLayers,
  DiagramPalette,
  DiagramPanel,
  DiagramPropertiesPanel,
  DiagramProvider,
  DiagramToolbar,
  floorPlanExtension,
  importFloorPlanImage,
  useDiagram,
  useFloorPlanFloors,
} from '@mantine-vue/diagram'

const controller = useDiagram({
  extensions: [floorPlanExtension({ collisions: 'highlight' })],
  document: apartment,
})
const floors = useFloorPlanFloors(controller, { others: 'ghost' })

const toolbar = ['select', 'pan', '|', 'wall', 'room', 'door', 'window', 'dimension', '|', 'undo', 'redo', '|', 'duplicate', 'delete', 'rotateClockwise', 'flipHorizontal']

async function importPlan(file: File | null) {
  if (file) await importFloorPlanImage(controller, file, { width: 1200, opacity: 0.5 })
}
</script>

<template>
  <DiagramProvider :controller="controller">
    <div style="display: flex; gap: 12px">
      <DiagramPalette style="width: 220px" />
      <Diagram :controller="controller" rulers fit-view style="flex: 1; height: 520px">
        <DiagramToolbar :items="toolbar" />
        <DiagramControls />
        <DiagramPanel position="top-right">
          <FileButton accept="image/*" @change="importPlan">
            <template #default="{ props }">
              <Button size="xs" variant="default" v-bind="props">Import plan image</Button>
            </template>
          </FileButton>
        </DiagramPanel>
      </Diagram>
      <div style="width: 260px">
        <DiagramLayers />
        <DiagramPropertiesPanel />
      </div>
    </div>
  </DiagramProvider>
</template>
`

const FLOOR_TOOLBAR = [
  'select',
  'pan',
  '|',
  'wall',
  'room',
  'door',
  'window',
  'dimension',
  '|',
  'undo',
  'redo',
  '|',
  'duplicate',
  'delete',
  'rotateClockwise',
  'flipHorizontal',
  'flipVertical',
]

const FloorPlanner = defineComponent({
  name: 'DiagramFloorPlannerDemo',
  setup() {
    const controller = useDiagram({
      extensions: [floorPlanExtension({ collisions: 'highlight' })],
      document: createApartmentDocument(),
    })
    const floors = useFloorPlanFloors(controller, { others: 'ghost' })
    const unit = ref(controller.editor.scale.unit)

    watch(unit, (value) =>
      controller.editor.updateSettings(
        {
          scale: { ...controller.editor.scale, unit: value, precision: value === 'ft-in' ? 2 : 2 },
        },
        'Change units',
      ),
    )

    const importPlan = async (value: File | File[] | null) => {
      const file = Array.isArray(value) ? value[0] : value

      if (file) {
        await importFloorPlanImage(controller, file, { width: 1200, opacity: 0.5 })
      }
    }

    return () =>
      h(DiagramProvider, { controller }, () =>
        workspace(
          main(
            h(
              Diagram,
              { controller, rulers: true, fitView: true, gridSize: 25, style: { height: '100%' } },
              () => [
                h(DiagramToolbar, { items: FLOOR_TOOLBAR }),
                h(DiagramControls),
                h(DiagramPanel, { position: 'bottom-right' }, () =>
                  h(Group, { gap: 6 }, () => [
                    h(SegmentedControl, {
                      size: 'xs',
                      data: [
                        { value: 'm', label: 'm' },
                        { value: 'cm', label: 'cm' },
                        { value: 'ft-in', label: 'ft-in' },
                      ],
                      modelValue: unit.value,
                      'onUpdate:modelValue': (value: any) => (unit.value = value),
                    }),
                    h(
                      FileButton,
                      { accept: 'image/png,image/jpeg,image/svg+xml', onChange: importPlan },
                      {
                        default: ({ props }: any) =>
                          h(
                            Button,
                            { size: 'xs', variant: 'default', ...props },
                            () => 'Import image',
                          ),
                      },
                    ),
                    h(
                      Button,
                      { size: 'xs', variant: 'default', onClick: () => floors.addFloor() },
                      () => 'Add floor',
                    ),
                  ]),
                ),
              ],
            ),
          ),
          side(220, h(DiagramPalette, { expanded: false })),
          side(
            260,
            h(Stack, { gap: 'sm' }, () => [
              h(DiagramLayers, { withObjects: false }),
              h(DiagramPropertiesPanel),
            ]),
          ),
        ),
      )
  },
})

export const floorPlanner: MantineDemo = {
  type: 'code',
  component: FloorPlanner,
  code: floorPlanCode,
  maxWidth: '100%',
}

/* 5. Restaurant floor planner */

const restaurantCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { SegmentedControl } from '@mantine-vue/core'
import {
  Diagram,
  DiagramControls,
  DiagramPalette,
  DiagramPanel,
  DiagramProvider,
  DiagramToolbar,
  floorPlanExtension,
  restaurantExtension,
  RestaurantStatusLegend,
  useDiagram,
  useRestaurantFloor,
} from '@mantine-vue/diagram'
import type { DiagramNode } from '@mantine-vue/diagram'

const controller = useDiagram({
  extensions: [floorPlanExtension({ collisions: false }), restaurantExtension()],
  document: restaurant,
})

// Statuses from your reservation or POS backend, never written to the layout.
const statuses = ref<Record<string, string>>({})
const floor = useRestaurantFloor(controller, { statuses, rules: { minSpacing: 60 } })
const mode = ref<'edit' | 'view'>('edit')

function onTableClick(node: DiagramNode) {
  if (mode.value === 'view') {
    const next = floor.statusOf(node.id) === 'occupied' ? 'available' : 'occupied'
    statuses.value = { ...statuses.value, [node.id]: next }
  }
}
</script>

<template>
  <DiagramProvider :controller="controller">
    <Diagram :controller="controller" :mode="mode" fit-view style="height: 520px" @node-click="onTableClick">
      <DiagramToolbar v-if="mode === 'edit'" />
      <DiagramControls />
      <DiagramPanel position="top-right">
        <SegmentedControl v-model="mode" :data="[{ value: 'edit', label: 'Layout' }, { value: 'view', label: 'Service' }]" />
      </DiagramPanel>
      <DiagramPanel position="bottom">
        <RestaurantStatusLegend />
      </DiagramPanel>
    </Diagram>
    <p>{{ floor.summary.value.availableSeats }} of {{ floor.summary.value.seats }} seats free</p>
  </DiagramProvider>
</template>
`

const RESTAURANT_TOOLBAR = [
  'select',
  'pan',
  '|',
  'wall',
  'door',
  '|',
  'undo',
  'redo',
  '|',
  'duplicate',
  'delete',
  'mergeTables',
  'splitTable',
  'renumberTables',
  'rotateClockwise',
]

const RestaurantPlanner = defineComponent({
  name: 'DiagramRestaurantDemo',
  setup() {
    const controller = useDiagram({
      extensions: [
        floorPlanExtension({ collisions: false, templates: false }),
        restaurantExtension(),
      ],
      document: createRestaurantDocument(),
    })
    const statuses = ref<Record<string, string>>({})
    const floor = useRestaurantFloor(controller, { statuses, rules: { minSpacing: 60 } })
    const mode = ref<'edit' | 'view'>('edit')

    const onTableClick = (node: DiagramNode) => {
      if (
        mode.value !== 'view' ||
        !['restaurant-table', 'restaurant-booth', 'restaurant-bar'].includes(node.type)
      ) {
        return
      }

      const current = floor.statusOf(node.id) ?? 'available'
      const next =
        SIMULATED_STATUSES[
          (SIMULATED_STATUSES.indexOf(current as any) + 1) % SIMULATED_STATUSES.length
        ]
      statuses.value = { ...statuses.value, [node.id]: next }
    }

    const simulate = () => {
      const next: Record<string, string> = {}

      for (const table of floor.tables.value) {
        next[table.id] = SIMULATED_STATUSES[Math.floor(Math.random() * SIMULATED_STATUSES.length)]
      }

      statuses.value = next
    }

    const header = () =>
      h(Group, { gap: 6, mb: 'xs' }, () => [
        h(SegmentedControl, {
          size: 'xs',
          data: [
            { value: 'edit', label: 'Layout' },
            { value: 'view', label: 'Service' },
          ],
          modelValue: mode.value,
          'onUpdate:modelValue': (value: any) => (mode.value = value),
        }),
        mode.value === 'view'
          ? h(
              Button,
              { size: 'xs', variant: 'default', onClick: simulate },
              () => 'Simulate POS update',
            )
          : null,
      ])

    return () =>
      h(DiagramProvider, { controller }, () =>
        workspace(
          h('div', { style: { flex: '1 1 100%' } }, [header()]),
          main(
            h(
              Diagram,
              {
                controller,
                mode: mode.value,
                fitView: true,
                gridSize: 25,
                style: { height: '100%' },
                onNodeClick: onTableClick,
              },
              () => [
                mode.value === 'edit' ? h(DiagramToolbar, { items: RESTAURANT_TOOLBAR }) : null,
                h(DiagramControls),
                h(DiagramPanel, { position: 'bottom' }, () => h(RestaurantStatusLegend)),
              ],
            ),
          ),
          mode.value === 'edit' ? side(220, h(DiagramPalette, { expanded: false })) : null,
          side(
            260,
            h(Stack, { gap: 'xs' }, () => [
              h(Text, { fw: 600, size: 'sm' }, () => 'Capacity'),
              h(
                Text,
                { size: 'sm' },
                () =>
                  `${floor.summary.value.availableSeats} of ${floor.summary.value.seats} seats free at ${floor.summary.value.tables} tables`,
              ),
              ...Object.values(floor.summary.value.byZone).map((zone) =>
                h(Group, { justify: 'space-between', key: zone.name }, () => [
                  h(Text, { size: 'xs' }, () => zone.name),
                  h(Badge, { variant: 'light' }, () => `${zone.seats} seats`),
                ]),
              ),
              h(
                Text,
                { fw: 600, size: 'sm', mt: 'sm' },
                () => `Layout checks (${floor.issues.value.length})`,
              ),
              ...floor.issues.value.slice(0, 6).map((issue, index) =>
                h(
                  Alert,
                  {
                    key: index,
                    color: issue.severity === 'error' ? 'red' : 'yellow',
                    p: 6,
                    variant: 'light',
                  },
                  () => h(Text, { size: 'xs' }, () => issue.message),
                ),
              ),
              mode.value === 'view'
                ? h(
                    Text,
                    { size: 'xs', c: 'dimmed' },
                    () =>
                      'Click a table to change its status. Statuses stay out of the saved layout.',
                  )
                : null,
            ]),
          ),
        ),
      )
  },
})

export const restaurant: MantineDemo = {
  type: 'code',
  component: RestaurantPlanner,
  code: restaurantCode,
  maxWidth: '100%',
}

/* 6. Table and seating editor */

const tableEditorCode = `
<script setup lang="ts">
import { computed } from 'vue'
import { Button, NumberInput, Select } from '@mantine-vue/core'
import { Diagram, mergeTables, restaurantExtension, splitTable, useDiagram, useDiagramSelection } from '@mantine-vue/diagram'

const controller = useDiagram({ extensions: [restaurantExtension()], document: tables })
const selection = useDiagramSelection(controller)
const table = computed(() => selection.nodes.value.find((node) => node.type === 'restaurant-table'))

function update(data: Record<string, unknown>) {
  if (table.value) controller.editor.updateNode(table.value.id, (node) => ({ ...node, data: { ...node.data, ...data } }))
}
</script>

<template>
  <Diagram :controller="controller" fit-view style="height: 420px" />
  <Select label="Shape" :data="['round', 'oval', 'square', 'rectangle']" :model-value="table?.data?.shape" @update:model-value="update({ shape: $event })" />
  <NumberInput label="Seats" :min="0" :max="20" :model-value="table?.data?.seats" @update:model-value="update({ seats: $event })" />
  <Button @click="mergeTables(controller.editor, controller.selection.value)">Merge selected</Button>
  <Button @click="table && splitTable(controller.editor, table.id)">Split</Button>
</template>
`

const TableEditor = defineComponent({
  name: 'DiagramTableEditorDemo',
  setup() {
    const controller = useDiagram({
      extensions: [restaurantExtension({ templates: false })],
      document: {
        version: 1,
        nodes: [
          {
            id: 'a',
            type: 'restaurant-table',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            data: { shape: 'round', seats: 5, number: 1 },
          },
          {
            id: 'b',
            type: 'restaurant-table',
            x: 220,
            y: 10,
            width: 80,
            height: 80,
            data: { shape: 'square', seats: 4, number: 2 },
          },
          {
            id: 'c',
            type: 'restaurant-table',
            x: 300,
            y: 10,
            width: 80,
            height: 80,
            data: { shape: 'square', seats: 4, number: 3 },
          },
          {
            id: 'd',
            type: 'restaurant-table',
            x: 480,
            y: 0,
            width: 220,
            height: 90,
            data: { shape: 'rectangle', seats: 7, number: 4, seatLayout: 'long-sides' },
          },
        ],
        edges: [],
      },
    })
    controller.editor.setSelection(['a'])
    const tables = computed(() =>
      controller.selection.value
        .map((id) => controller.nodeRef(id).value)
        .filter((node): node is DiagramNode => node?.type === 'restaurant-table'),
    )
    const table = computed(() => (tables.value.length === 1 ? tables.value[0] : null))
    const update = (data: Record<string, unknown>) => {
      const current = table.value

      if (current) {
        controller.editor.updateNode(
          current.id,
          (node) => ({ ...node, data: { ...node.data, ...data } }),
          'Edit table',
        )
      }
    }

    return () =>
      workspace(
        main(
          h(Diagram, { controller, fitView: true, style: { height: '100%' } }, () => [
            h(DiagramControls, { withFullscreen: false }),
          ]),
        ),
        side(
          240,
          h(Stack, { gap: 'xs' }, () =>
            table.value
              ? [
                  h(
                    Text,
                    { fw: 600, size: 'sm' },
                    () => `Table ${table.value!.data?.number ?? ''}`,
                  ),
                  h(Select, {
                    label: 'Shape',
                    size: 'xs',
                    data: ['round', 'oval', 'square', 'rectangle'],
                    allowDeselect: false,
                    modelValue: table.value.data?.shape ?? 'round',
                    'onUpdate:modelValue': (value: any) => update({ shape: value }),
                  }),
                  h(NumberInput, {
                    label: 'Seats',
                    size: 'xs',
                    min: 0,
                    max: 20,
                    modelValue: table.value.data?.seats ?? 0,
                    'onUpdate:modelValue': (value: any) =>
                      typeof value === 'number' && update({ seats: value }),
                  }),
                  h(Select, {
                    label: 'Chairs',
                    size: 'xs',
                    allowDeselect: false,
                    disabled:
                      table.value.data?.shape === 'round' || table.value.data?.shape === 'oval',
                    data: [
                      { value: 'around', label: 'All sides' },
                      { value: 'long-sides', label: 'Long sides' },
                      { value: 'one-side', label: 'One side' },
                      { value: 'ends', label: 'Ends' },
                    ],
                    modelValue: table.value.data?.seatLayout ?? 'around',
                    'onUpdate:modelValue': (value: any) => update({ seatLayout: value }),
                  }),
                  table.value.data?.mergedFrom
                    ? h(
                        Button,
                        {
                          size: 'xs',
                          variant: 'light',
                          onClick: () => splitTable(controller.editor, table.value!.id),
                        },
                        () => 'Split table',
                      )
                    : null,
                ]
              : [
                  h(Text, { size: 'sm', c: 'dimmed' }, () =>
                    tables.value.length > 1
                      ? `${tables.value.length} tables selected`
                      : 'Select a table to edit its seating.',
                  ),
                  h(
                    Button,
                    {
                      size: 'xs',
                      disabled: tables.value.length < 2,
                      onClick: () => mergeTables(controller.editor, controller.selection.value),
                    },
                    () => 'Merge tables',
                  ),
                  h(
                    Text,
                    { size: 'xs', c: 'dimmed' },
                    () => 'Shift + click selects several tables, try tables 2 and 3.',
                  ),
                ],
          ),
        ),
      )
  },
})

export const tableEditor: MantineDemo = {
  type: 'code',
  component: TableEditor,
  code: tableEditorCode,
  maxWidth: '100%',
}

/* 7. Serialization */

const serializationCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Textarea } from '@mantine-vue/core'
import { Diagram, parseDiagram, useDiagram, useDiagramExport } from '@mantine-vue/diagram'

const controller = useDiagram({ document })
const exporter = useDiagramExport(controller)
const json = ref(exporter.toJson())
const errors = ref<string[]>([])

function restore() {
  const result = parseDiagram(json.value)
  errors.value = result.issues.map((issue) => \`\${issue.path}: \${issue.message}\`)
  if (result.ok) controller.load(result.document)
}
</script>

<template>
  <Diagram :controller="controller" style="height: 360px" @change="json = exporter.toJson()" />
  <Textarea v-model="json" autosize :max-rows="12" />
  <Button @click="restore">Restore from JSON</Button>
  <Button @click="exporter.downloadSvg()">SVG</Button>
  <Button @click="exporter.downloadImage('diagram.png', { pixelRatio: 2 })">PNG</Button>
  <Button @click="exporter.print()">Print</Button>
</template>
`

const Serialization = defineComponent({
  name: 'DiagramSerializationDemo',
  setup() {
    const controller = useDiagram({ document: createBasicDocument() })
    const exporter = useDiagramExport(controller)
    const json = ref(exporter.toJson())
    const issues = ref<string[]>([])
    const restored = ref(false)

    const restore = () => {
      const result = parseDiagram(json.value)
      issues.value = result.issues.map((issue) => `${issue.path || 'document'}: ${issue.message}`)
      restored.value = result.ok

      if (result.ok) {
        controller.load(result.document)
      }
    }

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h('div', { style: { height: '360px' } }, [
          h(
            Diagram,
            {
              controller,
              fitView: true,
              style: { height: '100%' },
              onChange: () => (json.value = exporter.toJson()),
            },
            () => [h(DiagramToolbar), h(DiagramControls)],
          ),
        ]),
        h(Group, { gap: 'xs' }, () => [
          h(Button, { size: 'xs', onClick: restore }, () => 'Restore from JSON'),
          h(
            Button,
            { size: 'xs', variant: 'default', onClick: () => exporter.downloadJson() },
            () => 'Download JSON',
          ),
          h(
            Button,
            {
              size: 'xs',
              variant: 'default',
              onClick: () => exporter.downloadSvg('diagram.svg', { background: '#ffffff' }),
            },
            () => 'Download SVG',
          ),
          h(
            Button,
            {
              size: 'xs',
              variant: 'default',
              onClick: () =>
                exporter.downloadImage('diagram.png', { pixelRatio: 2, background: '#ffffff' }),
            },
            () => 'Download PNG',
          ),
          h(
            Button,
            { size: 'xs', variant: 'default', onClick: () => exporter.print({ title: 'Diagram' }) },
            () => 'Print',
          ),
        ]),
        restored.value && issues.value.length === 0
          ? h(Text, { size: 'xs', c: 'teal' }, () => 'Restored, the history was reset.')
          : null,
        ...issues.value.map((issue) =>
          h(Alert, { color: restored.value ? 'yellow' : 'red', p: 6, variant: 'light' }, () =>
            h(Code, () => issue),
          ),
        ),
        h(Textarea, {
          label: 'Document JSON, edit it and restore',
          autosize: true,
          minRows: 6,
          maxRows: 14,
          styles: {
            input: { fontFamily: 'var(--mantine-font-family-monospace)', fontSize: '12px' },
          },
          modelValue: json.value,
          'onUpdate:modelValue': (value: string) => (json.value = value),
        }),
      ])
  },
})

export const serialization: MantineDemo = {
  type: 'code',
  component: Serialization,
  code: serializationCode,
  maxWidth: '100%',
}

/* 8. Custom tools, commands, routers and plugins */

const extensionsCode = `
<script setup lang="ts">
import { Diagram, DiagramToolbar, createShapeTool, polylinePath } from '@mantine-vue/diagram'
import type { DiagramCommand, DiagramExtension, DiagramPlugin, DiagramRouter } from '@mantine-vue/diagram'

// A router draws connectors: here a zigzag through the middle.
const zigzag: DiagramRouter = ({ source, target }) => {
  const midX = (source.point.x + target.point.x) / 2
  const points = [source.point, { x: midX, y: source.point.y - 30 }, { x: midX, y: target.point.y + 30 }, target.point]
  return { path: polylinePath(points), points }
}

// A command with a shortcut, shown in toolbars and menus.
const shuffleColors: DiagramCommand = {
  id: 'shuffleColors',
  label: 'Shuffle colors',
  shortcuts: ['mod+shift+K'],
  isEnabled: (editor) => editor.selection.size > 0,
  run: (editor) => editor.updateElements(editor.selection, () => ({ style: { fill: randomColor() } }), 'Shuffle colors'),
}

// A plugin hooks into the engine: number every new sticky note.
const numbering: DiagramPlugin = {
  name: 'numbering',
  install: (editor) => editor.addTransformHook((target, ids) => { ... }),
}

const extension: DiagramExtension = {
  name: 'demo-tools',
  tools: [createShapeTool({ id: 'sticky', label: 'Sticky note', icon: 'rect', node: { type: 'note' }, sticky: true })],
  commands: [shuffleColors],
  routers: { zigzag },
  plugins: [numbering],
}
</script>

<template>
  <Diagram
    :extensions="[extension]"
    :default-edge="{ type: 'zigzag' }"
    :connection-rules="{ validate: ({ sourceNodeId, targetNodeId }) => sourceNodeId !== targetNodeId }"
    :shortcuts="{ duplicate: 'mod+J' }"
    style="height: 480px"
  >
    <DiagramToolbar :items="['select', 'sticky', 'connector', '|', 'shuffleColors', 'undo', 'redo']" />
  </Diagram>
</template>
`

const COLORS = ['blue.1', 'teal.1', 'yellow.2', 'grape.1', 'orange.1', 'red.1', 'lime.2']

const zigzag: DiagramRouter = ({ source, target }) => {
  const midX = (source.point.x + target.point.x) / 2
  const points = [
    source.point,
    { x: midX, y: source.point.y - 30 },
    { x: midX, y: target.point.y + 30 },
    target.point,
  ]

  return { path: polylinePath(points), points }
}

const shuffleColors: DiagramCommand = {
  id: 'shuffleColors',
  label: 'Shuffle colors',
  shortcuts: ['mod+shift+K'],
  isEnabled: (editor) => editor.getSelectedNodes().length > 0,
  run: (editor) =>
    editor.updateElements(
      editor.selection,
      (element) => ({
        style: { ...element.style, fill: COLORS[Math.floor(Math.random() * COLORS.length)] },
      }),
      'Shuffle colors',
    ),
}

const numbering: DiagramPlugin = {
  name: 'numbering',
  install: (editor) =>
    editor.addTransformHook((target, ids) => {
      for (const id of ids) {
        const node = target.store.getNode(id)

        if (node?.type === 'note' && !node.label) {
          const count = target.store.getNodes().filter((item) => item.type === 'note').length
          target.store.updateNode(id, { label: `Note ${count}` })
        }
      }
    }),
}

const demoExtension: DiagramExtension = {
  name: 'demo-tools',
  tools: [
    createShapeTool({
      id: 'sticky',
      label: 'Sticky note',
      icon: 'rect',
      node: { type: 'note', width: 150, height: 110 },
      sticky: true,
    }),
  ],
  commands: [shuffleColors],
  routers: { zigzag },
  plugins: [numbering],
}

const Extensions = defineComponent({
  name: 'DiagramExtensionsDemo',
  setup() {
    const log = ref<string[]>([])
    const push = (entry: string) => (log.value = [entry, ...log.value].slice(0, 5))
    const sticky = computed(
      () =>
        'Pick "Sticky note", click the canvas a few times, connect notes and press Ctrl + Shift + K.',
    )

    return () =>
      h(Stack, { gap: 'xs' }, () => [
        h(Text, { size: 'sm', c: 'dimmed' }, () => sticky.value),
        h('div', { style: { height: '440px' } }, [
          h(
            Diagram,
            {
              extensions: [demoExtension],
              defaultEdge: { type: 'zigzag', targetArrow: 'triangle' },
              connectionRules: {
                validate: ({ sourceNodeId, targetNodeId }: any) => sourceNodeId !== targetNodeId,
              },
              shortcuts: { duplicate: 'mod+J' },
              defaultValue: {
                version: 1,
                nodes: [
                  {
                    id: 'n1',
                    type: 'note',
                    x: 40,
                    y: 60,
                    width: 150,
                    height: 110,
                    label: 'Note 1',
                  },
                  {
                    id: 'n2',
                    type: 'note',
                    x: 380,
                    y: 200,
                    width: 150,
                    height: 110,
                    label: 'Note 2',
                  },
                ],
                edges: [
                  {
                    id: 'z',
                    type: 'zigzag',
                    source: { nodeId: 'n1' },
                    target: { nodeId: 'n2' },
                    targetArrow: 'triangle',
                  },
                ],
              },
              style: { height: '100%' },
              onConnect: () => push('connect: a connector was created'),
              onNodeDoubleClick: (node: DiagramNode) =>
                push(`nodeDoubleClick: ${node.label ?? node.id}`),
              onConnectEnd: () => push('connectEnd: dropped on the canvas'),
            },
            () => [
              h(DiagramToolbar, {
                items: [
                  'select',
                  'pan',
                  '|',
                  'sticky',
                  'connector',
                  '|',
                  'shuffleColors',
                  'duplicate',
                  'delete',
                  'undo',
                  'redo',
                ],
              }),
            ],
          ),
        ]),
        ...log.value.map((entry, index) =>
          h(Code, { key: `${index}-${entry}`, block: false }, () => entry),
        ),
      ])
  },
})

export const extensions: MantineDemo = {
  type: 'code',
  component: Extensions,
  code: extensionsCode,
  maxWidth: '100%',
}

/* Theming */

const themingCode = `
<template>
  <Diagram
    :default-value="document"
    color="grape"
    radius="lg"
    background="gray.0"
    :grid="{ type: 'dots' }"
    :styles="{ selectionFrame: { strokeDasharray: '4 2' } }"
    style="height: 360px"
  />
</template>
`

const Theming = defineComponent({
  name: 'DiagramThemingDemo',
  setup: () => () =>
    h(Diagram, {
      defaultValue: createBasicDocument(),
      selection: ['box'],
      color: 'grape',
      radius: 'lg',
      grid: { type: 'dots' },
      fitView: true,
      styles: { selectionFrame: { strokeDasharray: '4 2' } },
      style: { height: '360px' },
    }),
})

export const theming: MantineDemo = {
  type: 'code',
  component: Theming,
  code: themingCode,
  maxWidth: '100%',
}

/* Large diagrams */

const largeCode = `
<script setup lang="ts">
import { Diagram, DiagramControls, DiagramMinimap, useDiagram } from '@mantine-vue/diagram'

const nodes = Array.from({ length: 5000 }, (_, index) => ({
  id: \`n\${index}\`,
  type: index % 3 === 0 ? 'ellipse' : 'rect',
  x: (index % 100) * 180,
  y: Math.floor(index / 100) * 120,
  width: 140,
  height: 70,
  label: \`Node \${index}\`,
}))
const controller = useDiagram({ document: { version: 1, nodes, edges } })
</script>

<template>
  <!-- Nodes outside of the view are not rendered once there are 300 or more. -->
  <Diagram :controller="controller" :culling="300" style="height: 520px">
    <DiagramControls />
    <DiagramMinimap />
  </Diagram>
</template>
`

const Large = defineComponent({
  name: 'DiagramLargeDemo',
  setup() {
    const count = ref(5000)
    const build = (total: number): DiagramDocument => ({
      version: 1,
      nodes: Array.from({ length: total }, (_, index) => ({
        id: `n${index}`,
        type: index % 3 === 0 ? 'ellipse' : 'rect',
        x: (index % 100) * 180,
        y: Math.floor(index / 100) * 120,
        width: 140,
        height: 70,
        label: `Node ${index}`,
        style: { fill: index % 3 === 0 ? 'teal.0' : 'blue.0' },
      })),
      edges: Array.from({ length: Math.floor(total / 2) }, (_, index) => ({
        id: `e${index}`,
        type: 'straight',
        source: { nodeId: `n${index * 2}` },
        target: { nodeId: `n${index * 2 + 1}` },
      })),
    })
    const controller = useDiagram({ document: build(count.value) })
    const reload = (value: unknown) => {
      if (typeof value === 'number' && value > 0) {
        count.value = value
        controller.load(build(Math.min(value, 20000)))
      }
    }

    return () =>
      h(Stack, { gap: 'xs' }, () => [
        h(NumberInput, {
          label: 'Nodes',
          size: 'xs',
          w: 160,
          min: 100,
          max: 20000,
          step: 1000,
          modelValue: count.value,
          'onUpdate:modelValue': reload,
        }),
        h('div', { style: { height: HEIGHT } }, [
          h(Diagram, { controller, culling: 300, style: { height: '100%' } }, () => [
            h(DiagramControls),
            h(DiagramMinimap),
          ]),
        ]),
      ])
  },
})

export const large: MantineDemo = {
  type: 'code',
  component: Large,
  code: largeCode,
  maxWidth: '100%',
}
