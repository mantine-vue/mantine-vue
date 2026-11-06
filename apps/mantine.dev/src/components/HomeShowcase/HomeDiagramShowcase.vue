<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button, Group, SegmentedControl, Stack, Text } from '@mantine-vue/core'
import {
  Diagram,
  DiagramControls,
  DiagramLayers,
  DiagramMinimap,
  DiagramPalette,
  DiagramPanel,
  DiagramPropertiesPanel,
  DiagramProvider,
  DiagramToolbar,
  floorPlanExtension,
  restaurantExtension,
  RestaurantStatusLegend,
  useDiagram,
  useRestaurantFloor,
} from '@mantine-vue/diagram'
import type { DiagramNode } from '@mantine-vue/diagram'
import {
  createApartmentDocument,
  createFlowchartDocument,
  createRestaurantDocument,
  FLOWCHART_TEMPLATES,
  SIMULATED_STATUSES,
} from '@/demos/diagram/_data'

type Scene = 'flowchart' | 'floor-plan' | 'restaurant'

const scene = ref<Scene>('flowchart')

const scenes = [
  { value: 'flowchart', label: 'Flowchart' },
  { value: 'floor-plan', label: 'Floor plan' },
  { value: 'restaurant', label: 'Restaurant' },
]

/* Flowchart */

const flowchart = useDiagram({
  templates: FLOWCHART_TEMPLATES,
  document: createFlowchartDocument(),
  defaultEdge: { type: 'orthogonal', targetArrow: 'triangle', style: { cornerRadius: 8 } },
})
flowchart.editor.applyLayout('layered', { direction: 'TB', rankGap: 70, nodeGap: 40 })

function arrangeFlowchart() {
  flowchart.editor.applyLayout('layered', { direction: 'TB', rankGap: 70, nodeGap: 40 })
  flowchart.editor.fitView({ animate: true })
}

/* Floor plan */

const floorPlan = useDiagram({
  extensions: [floorPlanExtension({ collisions: 'highlight' })],
  document: createApartmentDocument(),
})

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
]

/* Restaurant */

const restaurant = useDiagram({
  extensions: [floorPlanExtension({ collisions: false, templates: false }), restaurantExtension()],
  document: createRestaurantDocument(),
})
const tableStatuses = ref<Record<string, string>>({})
const floor = useRestaurantFloor(restaurant, {
  statuses: tableStatuses,
  rules: { minSpacing: 60 },
})
const restaurantMode = ref<'view' | 'edit'>('view')

const TABLE_TYPES = ['restaurant-table', 'restaurant-booth', 'restaurant-bar']

const RESTAURANT_TOOLBAR = [
  'select',
  'pan',
  '|',
  'undo',
  'redo',
  '|',
  'duplicate',
  'delete',
  'mergeTables',
  'splitTable',
  'rotateClockwise',
]

function simulateService() {
  const next: Record<string, string> = {}
  for (const table of floor.tables.value) {
    next[table.id] = SIMULATED_STATUSES[Math.floor(Math.random() * SIMULATED_STATUSES.length)]
  }
  tableStatuses.value = next
}

function cycleTableStatus(node: DiagramNode) {
  if (restaurantMode.value !== 'view' || !TABLE_TYPES.includes(node.type)) return
  const current = (floor.statusOf(node.id) ?? 'available') as (typeof SIMULATED_STATUSES)[number]
  const next =
    SIMULATED_STATUSES[(SIMULATED_STATUSES.indexOf(current) + 1) % SIMULATED_STATUSES.length]
  tableStatuses.value = { ...tableStatuses.value, [node.id]: next }
}

simulateService()

const occupancy = computed(() => {
  const { seats, availableSeats } = floor.summary.value
  return seats ? Math.round(((seats - availableSeats) / seats) * 100) : 0
})
</script>

<template>
  <div class="diagramFrame">
    <header class="diagramHeader">
      <div class="diagramTitle">
        <span class="windowDots" aria-hidden="true"><i /><i /><i /></span>
        <Text fw="700" size="sm">Diagram editor</Text>
        <Badge variant="light" size="xs" radius="sm">Live</Badge>
      </div>
      <SegmentedControl
        v-model="scene"
        :data="scenes"
        size="xs"
        radius="md"
        aria-label="Diagram example"
      />
    </header>

    <DiagramProvider v-if="scene === 'flowchart'" :controller="flowchart">
      <div class="diagramBody withPalette">
        <aside class="diagramSide diagramSideStart">
          <DiagramPalette />
        </aside>
        <div class="diagramCanvas">
          <Diagram :controller="flowchart" fit-view style="height: 100%">
            <DiagramToolbar />
            <DiagramControls />
            <DiagramMinimap />
            <DiagramPanel position="top-right">
              <Button size="xs" variant="default" @click="arrangeFlowchart">Auto layout</Button>
            </DiagramPanel>
          </Diagram>
        </div>
        <aside class="diagramSide diagramSideEnd">
          <DiagramPropertiesPanel />
        </aside>
      </div>
    </DiagramProvider>

    <DiagramProvider v-else-if="scene === 'floor-plan'" :controller="floorPlan">
      <div class="diagramBody">
        <div class="diagramCanvas">
          <Diagram :controller="floorPlan" rulers fit-view :grid-size="25" style="height: 100%">
            <DiagramToolbar :items="FLOOR_TOOLBAR" />
            <DiagramControls />
          </Diagram>
        </div>
        <aside class="diagramSide diagramSideEnd">
          <Stack gap="sm">
            <DiagramLayers :with-objects="false" />
            <DiagramPropertiesPanel />
          </Stack>
        </aside>
      </div>
    </DiagramProvider>

    <DiagramProvider v-else :controller="restaurant">
      <div class="diagramBody">
        <div class="diagramCanvas">
          <Diagram
            :controller="restaurant"
            :mode="restaurantMode"
            fit-view
            :grid-size="25"
            style="height: 100%"
            @node-click="cycleTableStatus"
          >
            <DiagramToolbar v-if="restaurantMode === 'edit'" :items="RESTAURANT_TOOLBAR" />
            <DiagramControls />
            <DiagramPanel position="bottom">
              <RestaurantStatusLegend />
            </DiagramPanel>
          </Diagram>
        </div>
        <aside class="diagramSide diagramSideEnd">
          <Stack gap="md">
            <SegmentedControl
              v-model="restaurantMode"
              :data="[
                { value: 'view', label: 'Service' },
                { value: 'edit', label: 'Layout' },
              ]"
              size="xs"
              fullWidth
            />
            <div>
              <Text c="dimmed" size="xs" fw="600">Occupancy</Text>
              <div class="statValue">{{ occupancy }}%</div>
              <Text size="xs" c="dimmed">
                {{ floor.summary.value.availableSeats }} of {{ floor.summary.value.seats }} seats
                free across {{ floor.summary.value.tables }} tables
              </Text>
            </div>
            <Stack :gap="6">
              <Group
                v-for="zone in Object.values(floor.summary.value.byZone)"
                :key="zone.name"
                justify="space-between"
                wrap="nowrap"
              >
                <Text size="xs">{{ zone.name }}</Text>
                <Badge variant="light" size="sm">{{ zone.seats }} seats</Badge>
              </Group>
            </Stack>
            <Button
              v-if="restaurantMode === 'view'"
              size="xs"
              variant="default"
              @click="simulateService"
            >
              Simulate POS update
            </Button>
            <Text size="xs" c="dimmed">
              {{
                restaurantMode === 'view'
                  ? 'Click a table to change its status.'
                  : 'Drag, rotate, merge, and split tables.'
              }}
            </Text>
          </Stack>
        </aside>
      </div>
    </DiagramProvider>
  </div>
</template>

<style scoped>
.diagramFrame {
  overflow: hidden;
  border: 1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5));
  border-radius: var(--mantine-radius-lg);
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  box-shadow: 0 24px 70px alpha(var(--mantine-color-black), 0.08);
}

.diagramHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5));
}

.diagramTitle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.windowDots {
  display: flex;
  gap: 6px;
  margin-right: 4px;
}

.windowDots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
}

.diagramBody {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  height: 600px;
}

.diagramBody.withPalette {
  grid-template-columns: 220px minmax(0, 1fr) 270px;
}

.diagramCanvas {
  min-width: 0;
  height: 100%;
}

.diagramSide {
  min-height: 0;
  overflow: auto;
  padding: 12px;
  background: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8));
}

.diagramSideStart {
  border-right: 1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5));
}

.diagramSideEnd {
  border-left: 1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5));
}

.statValue {
  margin: 2px 0;
  color: var(--mantine-color-bright);
  font-size: 26px;
  font-weight: 750;
  letter-spacing: -0.035em;
}

@media (max-width: 1080px) {
  .diagramBody.withPalette {
    grid-template-columns: minmax(0, 1fr) 260px;
  }

  .diagramSideStart {
    display: none;
  }
}

@media (max-width: 760px) {
  .diagramHeader {
    align-items: flex-start;
    flex-direction: column;
  }

  .diagramBody,
  .diagramBody.withPalette {
    grid-template-columns: 1fr;
    grid-template-rows: 460px auto;
    height: auto;
  }

  .diagramSide {
    max-height: 320px;
    border-top: 1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5));
    border-left: 0;
  }
}
</style>
