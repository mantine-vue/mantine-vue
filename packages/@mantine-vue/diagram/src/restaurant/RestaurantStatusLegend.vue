<script setup lang="ts">
import { computed } from 'vue'
import { useDiagramContext } from '../vue/context'
import { getStatusDefinitions, resolveTableStatus } from './node-types'
import { SEATING_TYPES } from './seating'
import { getCapacity } from './tables'
import classes from './restaurant.module.css'

defineOptions({ name: 'RestaurantStatusLegend' })

const props = withDefaults(
  defineProps<{
    /** Shows the number of tables and seats of each status */
    withCounts?: boolean
  }>(),
  { withCounts: true },
)

const { controller, resolveColor } = useDiagramContext()

const items = computed(() => {
  void controller.version.value
  const definitions = getStatusDefinitions(controller)
  const counts = new Map<string, { tables: number; seats: number }>()

  for (const node of controller.editor.store.getNodes()) {
    if (SEATING_TYPES.has(node.type) && controller.editor.isNodeVisible(node)) {
      const status = resolveTableStatus(controller, node)
      const entry = counts.get(status) ?? { tables: 0, seats: 0 }
      entry.tables += 1
      entry.seats += getCapacity(node)
      counts.set(status, entry)
    }
  }

  return Object.entries(definitions).map(([key, definition]) => ({
    key,
    label: definition.label,
    color: resolveColor(definition.color),
    tables: counts.get(key)?.tables ?? 0,
    seats: counts.get(key)?.seats ?? 0,
  }))
})
</script>

<template>
  <div :class="classes.legend" role="list" aria-label="Table statuses">
    <span
      v-for="item in items"
      :key="item.key"
      :class="classes.legendItem"
      role="listitem"
      :data-status="item.key"
    >
      <span :class="classes.legendSwatch" :style="{ background: item.color }" aria-hidden="true" />
      <span>{{ item.label }}</span>
      <span v-if="props.withCounts" style="opacity: 0.7"
        >{{ item.tables }} · {{ item.seats }} seats</span
      >
    </span>
  </div>
</template>
