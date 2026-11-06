import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue'
import type { DiagramId, DiagramNode } from '../core/types'
import type { DiagramController } from '../vue/use-diagram'
import { getStatusDefinitions, resolveTableStatus, STATUS_STATE_KEY } from './node-types'
import { SEATING_TYPES } from './seating'
import {
  getCapacity,
  getZoneOf,
  mergeTables,
  nextTableNumber,
  renumberTables,
  splitTable,
  summarizeRestaurant,
  validateRestaurantLayout,
  type RestaurantLayoutRules,
} from './tables'

export interface UseRestaurantFloorOptions {
  /**
   * Live statuses by table id, e.g. from a reservation or POS system. They are shown without
   * being written to the document, so the saved layout stays free of operational data.
   */
  statuses?: MaybeRefOrGetter<Record<DiagramId, string> | undefined>
  /** Rules of `issues` */
  rules?: MaybeRefOrGetter<RestaurantLayoutRules | undefined>
}

export interface RestaurantTable {
  id: DiagramId
  node: DiagramNode
  number: string | number | undefined
  seats: number
  status: string
  zone: DiagramNode | undefined
}

/** Reactive tables, statuses, capacity and layout validation of a restaurant floor. */
export function useRestaurantFloor(
  controller: DiagramController,
  options: UseRestaurantFloorOptions = {},
) {
  const { editor } = controller

  watch(
    () => toValue(options.statuses),
    (statuses) => {
      controller.state[STATUS_STATE_KEY] = statuses ? { ...statuses } : undefined
    },
    { immediate: true, deep: true },
  )

  const definitions = computed(() => getStatusDefinitions(controller))

  const tables = computed<RestaurantTable[]>(() => {
    void controller.version.value
    void controller.state[STATUS_STATE_KEY]

    return editor.store
      .getNodes()
      .filter((node) => SEATING_TYPES.has(node.type) && editor.isNodeVisible(node))
      .map((node) => ({
        id: node.id,
        node,
        number: node.data?.number,
        seats: getCapacity(node),
        status: resolveTableStatus(controller, node),
        zone: getZoneOf(editor, node),
      }))
  })

  const summary = computed(() => {
    void controller.version.value
    void controller.state[STATUS_STATE_KEY]

    return summarizeRestaurant(editor, {
      statuses: definitions.value,
      statusOf: (node) => resolveTableStatus(controller, node),
    })
  })

  const issues = computed(() => {
    void controller.commitVersion.value
    void controller.version.value

    return validateRestaurantLayout(editor, toValue(options.rules))
  })

  /**
   * Changes the status of a table. `persist` stores it in the document without an undo step,
   * otherwise only the live status map changes.
   */
  function setStatus(id: DiagramId, status: string, setOptions: { persist?: boolean } = {}) {
    if (setOptions.persist) {
      editor.store.transact('Change status', () => editor.store.updateNodeData(id, { status }), {
        history: false,
      })
      return
    }

    const live = (controller.state[STATUS_STATE_KEY] as Record<string, string> | undefined) ?? {}
    controller.state[STATUS_STATE_KEY] = { ...live, [id]: status }
  }

  /** Tables that seat a party: free, large enough and above their minimum party size. */
  function findTablesFor(guests: number) {
    return tables.value
      .filter((table) => definitions.value[table.status]?.available)
      .filter((table) => table.seats >= guests && (table.node.data?.minSeats ?? 0) <= guests)
      .sort((a, b) => a.seats - b.seats)
  }

  return {
    tables,
    summary,
    issues,
    definitions,
    statusOf: (id: DiagramId) => {
      const node = editor.store.getNode(id)
      return node ? resolveTableStatus(controller, node) : undefined
    },
    setStatus,
    findTablesFor,
    merge: (ids: Iterable<DiagramId>) => mergeTables(editor, ids),
    split: (id: DiagramId) => splitTable(editor, id),
    renumber: (renumberOptions?: { start?: number; prefix?: string }) =>
      renumberTables(editor, renumberOptions),
    nextNumber: () => nextTableNumber(editor),
  }
}
