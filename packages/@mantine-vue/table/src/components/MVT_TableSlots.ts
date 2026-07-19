import { inject, type InjectionKey, provide, type Slots, type VNodeChild } from 'vue'

import {
  type MVT_Cell,
  type MVT_Column,
  type MVT_InternalFilterOption,
  type MVT_Node,
  type MVT_Row,
  type MVT_RowData,
  type MVT_TableInstance,
} from '../types'
import { parseFromValuesOrFunc } from '../utils/utils'

/**
 * Scoped named slots supported on `<MantineVueTable>`.
 *
 * Each slot mirrors the equivalent `renderX` table option and receives the same
 * scoped argument object. A provided named slot takes precedence over the option
 * (see {@link renderMVT_Renderable})
 *
 * ```vue
 * <MantineVueTable :table="table">
 *   <template #detailPanel="{ row }">Age: {{ row.original.age }}</template>
 *   <template #rowActionMenuItems="{ row }">
 *     <MenuItem @click="() => edit(row)">Edit</MenuItem>
 *   </template>
 * </MantineVueTable>
 * ```
 */
export interface MVT_TableSlots<TData extends MVT_RowData = MVT_RowData> {
  bottomToolbar?: (arg: { table: MVT_TableInstance<TData> }) => VNodeChild
  bottomToolbarCustomActions?: (arg: { table: MVT_TableInstance<TData> }) => VNodeChild
  columnActionsMenuItems?: (arg: {
    column: MVT_Column<TData>
    internalColumnMenuItems: MVT_Node
    table: MVT_TableInstance<TData>
  }) => VNodeChild
  columnFilterModeMenuItems?: (arg: {
    column: MVT_Column<TData>
    internalFilterOptions: MVT_InternalFilterOption[]
    onSelectFilterMode: (filterMode: string) => void
    table: MVT_TableInstance<TData>
  }) => VNodeChild
  createRowModalContent?: (arg: {
    internalEditComponents: MVT_Node[]
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => VNodeChild
  detailPanel?: (arg: {
    internalEditComponents: MVT_Node[]
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => VNodeChild
  editRowModalContent?: (arg: {
    internalEditComponents: MVT_Node[]
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => VNodeChild
  emptyRowsFallback?: (arg: { table: MVT_TableInstance<TData> }) => VNodeChild
  globalFilterModeMenuItems?: (arg: {
    internalFilterOptions: MVT_InternalFilterOption[]
    onSelectFilterMode: (filterMode: string) => void
    table: MVT_TableInstance<TData>
  }) => VNodeChild
  rowActionMenuItems?: (arg: {
    renderedRowIndex?: number
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => VNodeChild
  rowActions?: (arg: {
    cell: MVT_Cell<TData>
    renderedRowIndex?: number
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => VNodeChild
  toolbarAlertBannerContent?: (arg: {
    groupedAlert: MVT_Node | null
    selectedAlert: MVT_Node | null
    table: MVT_TableInstance<TData>
  }) => VNodeChild
  toolbarInternalActions?: (arg: { table: MVT_TableInstance<TData> }) => VNodeChild
  topToolbar?: (arg: { table: MVT_TableInstance<TData> }) => VNodeChild
  topToolbarCustomActions?: (arg: { table: MVT_TableInstance<TData> }) => VNodeChild
}

/** Union of the named-slot keys `<MantineVueTable>` understands. */
export type MVT_TableSlotName = keyof MVT_TableSlots

const MVT_SLOTS_KEY: InjectionKey<Slots> = Symbol('MVT_Slots')

/**
 * Provide the top-level `<MantineVueTable>` slots to every descendant section.
 * Called once, from the root component's `setup`.
 */
export const provideMVT_Slots = (slots: Slots): void => {
  provide(MVT_SLOTS_KEY, slots)
}

/**
 * Inject the top-level `<MantineVueTable>` slots inside a deep section
 * component (detail panel, row/column action menus, toolbars, …).
 */
export const useMVT_Slots = (): Slots => inject(MVT_SLOTS_KEY, {})

/**
 * Resolve a renderable section. A named slot takes precedence over the
 * equivalent `renderX` option/prop; both receive the same scoped argument, so a
 * section can be customized either way with identical semantics.
 */
export const renderMVT_Renderable = <TArg extends Record<string, any>>(
  slot: ((arg: TArg) => VNodeChild) | undefined,
  renderProp: ((arg: TArg) => VNodeChild) | MVT_Node | undefined,
  arg: TArg,
): VNodeChild => (slot ? slot(arg) : parseFromValuesOrFunc(renderProp as any, arg))
