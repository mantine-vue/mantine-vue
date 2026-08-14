import { type Component, type VNodeChild } from 'vue'

import type {
  HTMLPropsRef,
  MVT_Column,
  MVT_ColumnFiltersState,
  MVT_Node,
  MVT_PaginationState,
  MVT_RowData,
  MVT_SortingState,
  MVT_TableInstance,
} from '../types'
import type { TableTrProps } from '../mantine.types'

/**
 * Stable identifier of a location inside the server-grouping hierarchy.
 *
 * - `'__root__'` — the root level (first group-by field, or the flat record
 *   list when `grouping` is empty).
 * - `'country:BH'` — content under the root group `BH` of field `country`.
 * - `'country:BH/salesperson:42'` — content nested one level deeper.
 *
 * Path ids are never derived from row indexes, so they stay stable across
 * pagination, sorting, and reloads. Segment values are escaped, so group ids
 * may safely contain `/` or `:`.
 */
export type MVT_ServerGroupPathId = string

export const MVT_SERVER_GROUPING_ROOT_PATH_ID = '__root__' as const

/**
 * Normalized group node. This is the internal contract between a
 * {@link MVT_ServerGroupingProvider} and the table — the original backend
 * response shape is preserved in `original` and never dictated.
 */
export interface MVT_ServerGroupNode<TGroup = unknown> {
  id: string
  label: string
  value?: unknown
  count?: number
  original: TGroup
  meta?: Record<string, unknown>
  hasChildren?: boolean
}

/** Normalized page of group nodes. */
export interface MVT_ServerGroupPage<TGroup = unknown> {
  groups: MVT_ServerGroupNode<TGroup>[]
  rowCount: number
}

/** Normalized page of final records. */
export interface MVT_ServerRecordPage<TData> {
  rows: TData[]
  rowCount: number
}

/**
 * One resolved ancestor group on the path to the level being loaded. Preserves
 * both the normalized node data and the `original` backend group object so a
 * provider can construct any follow-up request (scope/domain/cursor/…).
 */
export interface MVT_ServerGroupPathItem<TGroup = unknown> {
  id: string
  field: string
  depth: number
  label: string
  value?: unknown
  original: TGroup
  meta?: Record<string, unknown>
}

/**
 * Pagination state for one group path. Extends the standard offset model with
 * an opaque `cursor` slot for cursor-based backends — the provider decides
 * whether `pageIndex * pageSize` or `cursor` drives the actual request.
 */
export interface MVT_ServerPageState extends MVT_PaginationState {
  cursor?: unknown
}

export type MVT_ServerGroupingSortingMode = 'independent' | 'records-only' | 'shared'

export type MVT_ServerGroupingFilteringMode = 'independent' | 'records-only' | 'shared'

/** Common request context shared by group and record requests. */
export interface MVT_ServerGroupingBaseRequest<TGroup = unknown> {
  /** All active group-by field identifiers (opaque strings, e.g. `'createdAt:month'`). */
  grouping: string[]
  /** Zero-based depth of the level being loaded. */
  depth: number
  /** Stable path id of the level being loaded. */
  pathId: MVT_ServerGroupPathId
  /** Every resolved ancestor group, outermost first. */
  parentGroups: MVT_ServerGroupPathItem<TGroup>[]
  /** The direct parent group (`parentGroups.at(-1)`), if any. */
  parentGroup?: MVT_ServerGroupPathItem<TGroup>
  pagination: MVT_ServerPageState
  sorting: MVT_SortingState
  columnFilters: MVT_ColumnFiltersState
  globalFilter: unknown
  /** Aborted when the request becomes obsolete. Forward it to your HTTP client. */
  signal: AbortSignal
  table: MVT_TableInstance<any>
}

/** Request context for loading one page of child groups. */
export interface MVT_ServerGroupRequest<
  TGroup = unknown,
> extends MVT_ServerGroupingBaseRequest<TGroup> {
  /** The group-by field identifier for the level being loaded (`grouping[depth]`). */
  groupingField: string
}

/** Request context for loading one page of final records. */
export type MVT_ServerRecordRequest<TGroup = unknown> = MVT_ServerGroupingBaseRequest<TGroup>

/** Context given to the per-group adapter functions of a provider. */
export interface MVT_ServerGroupingContext<TGroup = unknown> {
  field: string
  depth: number
  request: MVT_ServerGroupRequest<TGroup>
}

/**
 * A server-grouping provider loads and normalizes groups and records. It is
 * the only integration point with your backend — REST, GraphQL, RPC,
 * Elasticsearch aggregations, cursor APIs, … anything works, as
 * long as the adapter functions can map the response into the normalized
 * internal model. Use {@link createServerGroupingProvider} for less boilerplate.
 */
export interface MVT_ServerGroupingProvider<
  TData extends MVT_RowData = MVT_RowData,
  TGroup = unknown,
  TGroupResponse = unknown,
  TRecordResponse = unknown,
> {
  /** Stable id of a group within its own level (never a row index). */
  getGroupId: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => string
  getGroupLabel: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => string
  /** Raw group value. Defaults to the group object itself. */
  getGroupValue?: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => unknown
  /** Optional record count shown next to the label. */
  getGroupCount?: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => number | undefined
  /** Optional metadata (aggregates, scopes, cursors, …). Defaults to `{}`. */
  getGroupMeta?: (
    group: TGroup,
    context: MVT_ServerGroupingContext<TGroup>,
  ) => Record<string, unknown>
  /** Whether the group can be expanded. Defaults to `true`. */
  hasGroupChildren?: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => boolean

  loadGroups: (request: MVT_ServerGroupRequest<TGroup>) => Promise<TGroupResponse>
  getGroups: (response: TGroupResponse) => TGroup[]
  getGroupRowCount: (response: TGroupResponse) => number

  loadRecords: (request: MVT_ServerRecordRequest<TGroup>) => Promise<TRecordResponse>
  getRecords: (response: TRecordResponse) => TData[]
  getRecordRowCount: (response: TRecordResponse) => number

  /** Stable record row id. Falls back to the table's `getRowId`, then to a path-scoped index. */
  getRowId?: (row: TData) => string

  /**
   * Customize the cache key for a request. The returned parts are appended to
   * the built-in key (path id, grouping, depth, pagination, sorting, filters).
   */
  getCacheKey?: (
    request: MVT_ServerGroupRequest<TGroup> | MVT_ServerRecordRequest<TGroup>,
  ) => unknown[]
}

/** Per-path request lifecycle state. */
export interface MVT_ServerGroupingRequestState {
  isLoading: boolean
  isFetching: boolean
  error: unknown
  updatedAt?: number
}

/** Loaded content + query state of one group path. */
export interface MVT_ServerGroupingPathState<
  TData extends MVT_RowData = MVT_RowData,
  TGroup = unknown,
> extends MVT_ServerGroupingRequestState {
  pathId: MVT_ServerGroupPathId
  depth: number
  /** `'groups'` for intermediate levels, `'records'` for the final level. */
  kind: 'groups' | 'records'
  pagination: MVT_ServerPageState
  /** Per-path sorting override (see `sortingMode`). */
  sorting?: MVT_SortingState
  /** Per-path column filters override (see `filteringMode`). */
  columnFilters?: MVT_ColumnFiltersState
  /** Per-path global filter override (see `filteringMode`). */
  globalFilter?: unknown
  rowCount: number
  groups?: MVT_ServerGroupNode<TGroup>[]
  rows?: TData[]
}

export type MVT_ServerGroupingExpandedState = Record<MVT_ServerGroupPathId, boolean>

/** Aggregated server-grouping state, returned by `table.getServerGroupingState()`. */
export interface MVT_ServerGroupingState<
  TData extends MVT_RowData = MVT_RowData,
  TGroup = unknown,
> {
  enabled: boolean
  grouping: string[]
  expanded: MVT_ServerGroupingExpandedState
  paths: Record<MVT_ServerGroupPathId, MVT_ServerGroupingPathState<TData, TGroup>>
}

export interface MVT_ServerGroupingCacheOptions {
  enabled?: boolean
  /** Milliseconds a cached page is served without refetching. @default 0 */
  staleTime?: number
  /** Milliseconds before an unused cached page is garbage collected. @default 300_000 */
  gcTime?: number
  /** Keep loaded content of collapsed groups. @default true */
  keepCollapsedGroups?: boolean
}

export interface MVT_ServerGroupingPaginationOptions {
  enabled?: boolean
  /**
   * Fixed page size applied to every group and record level. Nested levels
   * cannot change their page size at runtime — nested pagination bars show
   * only page navigation and row-count info.
   *
   * @default 10 (or `serverGrouping.initialPageSize`)
   */
  defaultPageSize?: number
  /**
   * Render an inline pagination row for the root level inside the table body.
   * Defaults to `false` because the root level is paginated by the regular
   * bottom toolbar (`positionPagination`, `mantinePaginationProps`), exactly
   * like an ungrouped server-side table; it defaults to `true` when the
   * toolbar pagination is turned off.
   */
  showAtRoot?: boolean
  /** @default true */
  showForGroups?: boolean
  /** @default true */
  showForRecords?: boolean
  /** Extra Mantine props for the nested prev/next `ActionIcon`s (merged safely). */
  mantineActionIconProps?: Record<string, any>
}

/** Request context of `selection.loadAllMatchingRowIds`. */
export interface MVT_ServerGroupingSelectAllRequest {
  grouping: string[]
  sorting: MVT_SortingState
  columnFilters: MVT_ColumnFiltersState
  globalFilter: unknown
  table: MVT_TableInstance<any>
}

/**
 * "Select all matching records" state.
 *
 * Selecting a filtered dataset of millions of rows must never materialize row
 * ids. Instead the selection flips to *exclude mode*: it means "everything
 * matching the current query", and only the rows the user explicitly unchecks
 * afterwards are tracked. Bulk actions then send the query + exclusions.
 */
export interface MVT_ServerGroupingSelectAllState {
  /** Whether "all matching records" is active (exclude mode). */
  active: boolean
  /** Row ids explicitly deselected while exclude mode is active. */
  excludedRowIds: string[]
}

/**
 * What a bulk action should send to the server.
 *
 * - `'include'`: act on `rowIds` (the classic, explicit selection).
 * - `'exclude'`: act on every record matching `grouping`/`sorting`/filters,
 *   except `excludedRowIds`. No id list is ever transferred.
 */
export interface MVT_ServerGroupingSelectionPayload {
  mode: 'exclude' | 'include'
  rowIds: string[]
  excludedRowIds: string[]
  grouping: string[]
  sorting: MVT_SortingState
  columnFilters: MVT_ColumnFiltersState
  globalFilter: unknown
}

/** Header-checkbox / selection state of a server-grouped table. */
export interface MVT_ServerGroupingSelectionSummary {
  /** Every selectable loaded record inside expanded groups is selected. */
  isAll: boolean
  /** Some — but not all — are selected (indeterminate header checkbox). */
  isSome: boolean
  /** How many loaded records are currently selectable. */
  selectableCount: number
  /** How many of those are selected. */
  selectedCount: number
  /** Explicitly selected row ids (empty in exclude mode). */
  selectedRowIds: string[]
  /** `'exclude'` while "all matching records" is active. */
  mode: 'exclude' | 'include'
  /** Convenience flag: `mode === 'exclude'`. */
  isSelectAllMatching: boolean
  /** Rows unchecked after "select all matching records". */
  excludedRowIds: string[]
}

export interface MVT_ServerGroupingSelectionOptions {
  /**
   * Deselect a group's records when it is collapsed.
   *
   * Defaults to `false`: collapsing is a view operation, so selections survive
   * it (the toolbar alert keeps counting them, and unchecking the header
   * checkbox clears everything). Set to `true` for a strictly
   * "what you see is what is selected" behavior.
   *
   * @default false
   */
  clearOnCollapse?: boolean
  /**
   * Show a built-in "select all matching records" action in the toolbar alert
   * banner once every loaded record is selected.
   */
  enableSelectAllMatching?: boolean
  /**
   * How "select all matching records" represents the selection.
   *
   * - `'query'` (default, recommended): flips to exclude mode — no request, no
   *   ids transferred, works with millions of rows. Send
   *   `table.getServerGroupingSelectionPayload()` to your bulk endpoint.
   * - `'ids'`: materializes every matching row id through
   *   {@link MVT_ServerGroupingSelectionOptions.loadAllMatchingRowIds}. Only
   *   suitable for small, bounded datasets.
   *
   * @default 'query'
   */
  selectAllMode?: 'ids' | 'query'
  /**
   * Resolve every row id matching the current filters. Only used (and
   * required) when `selectAllMode: 'ids'`.
   */
  loadAllMatchingRowIds?: (request: MVT_ServerGroupingSelectAllRequest) => Promise<string[]>
}

/** A column offered by the built-in group-by toolbar control. */
export interface MVT_ServerGroupableColumn {
  /** Grouping field id sent to the provider. */
  id: string
  /** Display label (column header, or the raw id for custom descriptors). */
  label: string
}

/** Scoped argument of the group-by control slot / render callback. */
export interface MVT_ServerGroupingGroupByContext {
  /** Active grouping fields, outermost first. */
  grouping: string[]
  /** Columns/fields the user may group by. */
  groupableColumns: MVT_ServerGroupableColumn[]
  addGroup: (field: string) => void
  removeGroup: (field: string) => void
  /** Move an active level up (`-1`) or down (`1`). */
  moveGroup: (field: string, direction: -1 | 1) => void
  clearGrouping: () => void
  table: MVT_TableInstance<any>
}

/**
 * Built-in group-by toolbar control. Rendered in the top toolbar whenever
 * server grouping is active and grouping is driven by the table's `grouping`
 * state (with a static `serverGrouping.grouping` array the control is hidden
 * unless `enabled: true` is forced, since it could not change anything).
 */
export interface MVT_ServerGroupingGroupByOptions {
  /** @default true */
  enabled?: boolean
  /** Show the per-level reorder arrows. @default true */
  allowReorder?: boolean
  /**
   * Also offer "Group by" / "Ungroup by" / "Clear grouping" in each groupable
   * column's action menu.
   *
   * @default true
   */
  showInColumnActions?: boolean
  /** Show the "clear grouping" action. @default true */
  allowClearAll?: boolean
  /**
   * Explicit whitelist of groupable field ids (may include custom descriptors
   * like `'createdAt:month'`). When omitted, every `data` column whose
   * `enableGrouping` is not `false` is offered.
   */
  columns?: string[]
  /** Resolve the display label of a field. Defaults to the column header, or the raw id. */
  getFieldLabel?: (field: string, table: MVT_TableInstance<any>) => string
  /**
   * Replace the entire default control. A `#serverGroupByControl` slot takes
   * precedence over this callback; both receive the same context.
   */
  renderControl?: (context: MVT_ServerGroupingGroupByContext) => MVT_Node
  /** Extra Mantine props for the "Group by" `Button` (merged safely). */
  mantineButtonProps?: Record<string, any>
  /** Extra Mantine props for the `Menu` (merged safely). */
  mantineMenuProps?: Record<string, any>
  /** Extra Mantine props for each active-level `Pill` (merged safely). */
  mantinePillProps?:
    | ((context: { field: string; index: number }) => Record<string, any>)
    | Record<string, any>
}

/** Scoped argument of group-row render callbacks and slots. */
export interface MVT_ServerGroupRowContext<TGroup = unknown> {
  group: MVT_ServerGroupNode<TGroup>
  field: string
  depth: number
  pathId: MVT_ServerGroupPathId
  parentGroups: MVT_ServerGroupPathItem<TGroup>[]
  isExpanded: boolean
  table: MVT_TableInstance<any>
}

/** Scoped argument of per-column aggregate cell rendering. */
export interface MVT_ServerGroupCellContext<
  TGroup = unknown,
> extends MVT_ServerGroupRowContext<TGroup> {
  column: MVT_Column<any>
  value: unknown
}

type MVT_ServerGroupingRenderCallback<TContext, TResult> = {
  bivarianceHack(context: TContext): TResult
}['bivarianceHack']

/** Column-level options for resolving/rendering server aggregate values in group rows. */
export interface MVT_ColumnServerGroupingOptions<TGroup = unknown> {
  /** Resolve this column's value for a group row (commonly from `group.meta`). */
  getValue?: MVT_ServerGroupingRenderCallback<
    Omit<MVT_ServerGroupCellContext<TGroup>, 'value'>,
    unknown
  >
  /** Render the resolved value. Receives the full cell context including `value`. */
  Cell?:
    | Component
    | MVT_ServerGroupingRenderCallback<MVT_ServerGroupCellContext<TGroup>, VNodeChild>
  /** Show this column's aggregate cell in group rows. @default true when `getValue` is set */
  visible?: boolean
}

export interface MVT_ServerGroupingEventPayload<TGroup = unknown> {
  pathId: MVT_ServerGroupPathId
  path: MVT_ServerGroupPathItem<TGroup>[]
}

export interface MVT_ServerGroupingOptions<
  TData extends MVT_RowData = MVT_RowData,
  TGroup = unknown,
  TGroupResponse = unknown,
  TRecordResponse = unknown,
> {
  /** @default true when a provider is set */
  enabled?: boolean
  /**
   * Group-by field identifiers, outermost first. Treated as opaque strings —
   * custom descriptors like `'createdAt:month'` are passed through to the
   * provider untouched. When omitted, the table's regular `grouping` state is
   * used, so `state.grouping` / `onGroupingChange` keep working.
   */
  grouping?: string[]
  /**
   * Initial grouping fields used when neither `serverGrouping.grouping` nor a
   * controlled/initial table `grouping` state is provided. An empty or omitted
   * value starts the table in normal (ungrouped) server-side mode — the user
   * can still add levels from the group-by toolbar. Controlled grouping state
   * always takes precedence.
   */
  defaultGrouping?: string[]
  provider: MVT_ServerGroupingProvider<TData, TGroup, TGroupResponse, TRecordResponse>

  /** Initial page size for every level. @default 10 */
  initialPageSize?: number
  pagination?: MVT_ServerGroupingPaginationOptions
  /** Built-in group-by toolbar control. Enabled by default. */
  groupBy?: MVT_ServerGroupingGroupByOptions
  /** Row-selection behavior for grouped tables. */
  selection?: MVT_ServerGroupingSelectionOptions
  cache?: MVT_ServerGroupingCacheOptions

  /** @default 'independent' */
  sortingMode?: MVT_ServerGroupingSortingMode
  /** @default 'shared' */
  filteringMode?: MVT_ServerGroupingFilteringMode

  /** Reset expansion when grouping fields change. @default true */
  resetExpansionOnGroupingChange?: boolean

  renderGroupLabel?: (context: MVT_ServerGroupRowContext<TGroup>) => MVT_Node
  renderGroupCount?: (context: MVT_ServerGroupRowContext<TGroup>) => MVT_Node
  renderGroupError?: (context: {
    error: unknown
    pathId: MVT_ServerGroupPathId
    retry: () => void
    table: MVT_TableInstance<any>
  }) => MVT_Node
  renderGroupEmpty?: (context: {
    field?: string
    parentGroup?: MVT_ServerGroupPathItem<TGroup>
    pathId: MVT_ServerGroupPathId
    table: MVT_TableInstance<any>
  }) => MVT_Node
  renderGroupLoading?: (context: {
    depth: number
    pathId: MVT_ServerGroupPathId
    table: MVT_TableInstance<any>
  }) => MVT_Node

  mantineGroupRowProps?:
    | ((
        context: MVT_ServerGroupRowContext<TGroup>,
      ) => HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
    | (HTMLPropsRef<HTMLTableRowElement> & TableTrProps)

  onGroupExpand?: (
    payload: { group: MVT_ServerGroupNode<TGroup> } & MVT_ServerGroupingEventPayload<TGroup>,
  ) => void
  onGroupCollapse?: (
    payload: { group: MVT_ServerGroupNode<TGroup> } & MVT_ServerGroupingEventPayload<TGroup>,
  ) => void
  onGroupLoadStart?: (
    payload: {
      request: MVT_ServerGroupRequest<TGroup> | MVT_ServerRecordRequest<TGroup>
    } & MVT_ServerGroupingEventPayload<TGroup>,
  ) => void
  onGroupLoadSuccess?: (
    payload: {
      groups: MVT_ServerGroupNode<TGroup>[]
      request: MVT_ServerGroupRequest<TGroup>
      response: TGroupResponse
    } & MVT_ServerGroupingEventPayload<TGroup>,
  ) => void
  onRecordLoadSuccess?: (
    payload: {
      request: MVT_ServerRecordRequest<TGroup>
      response: TRecordResponse
      rows: TData[]
    } & MVT_ServerGroupingEventPayload<TGroup>,
  ) => void
  onError?: (
    payload: {
      error: unknown
      request: MVT_ServerGroupRequest<TGroup> | MVT_ServerRecordRequest<TGroup>
    } & MVT_ServerGroupingEventPayload<TGroup>,
  ) => void
}

/** Server-grouping methods exposed on the table instance. */
export interface MVT_ServerGroupingTableApi<TData extends MVT_RowData = MVT_RowData> {
  getServerGroupingState: () => MVT_ServerGroupingState<TData>
  getServerGroupingPathState: (
    pathId: MVT_ServerGroupPathId,
  ) => MVT_ServerGroupingPathState<TData> | undefined
  expandServerGroup: (pathId: MVT_ServerGroupPathId) => void
  collapseServerGroup: (pathId: MVT_ServerGroupPathId) => void
  toggleServerGroup: (pathId: MVT_ServerGroupPathId) => void
  reloadServerGrouping: () => void
  reloadServerGroupingPath: (pathId: MVT_ServerGroupPathId) => void
  invalidateServerGrouping: () => void
  invalidateServerGroupingPath: (pathId: MVT_ServerGroupPathId) => void
  resetServerGroupingState: () => void
  setServerGroupingExpanded: (
    updaterOrValue:
      | ((prev: MVT_ServerGroupingExpandedState) => MVT_ServerGroupingExpandedState)
      | MVT_ServerGroupingExpandedState,
  ) => void
  setServerGroupingPagination: (
    pathId: MVT_ServerGroupPathId,
    pagination: ((prev: MVT_ServerPageState) => MVT_ServerPageState) | Partial<MVT_ServerPageState>,
  ) => void
  setServerGroupingSorting: (
    pathId: MVT_ServerGroupPathId,
    sorting: ((prev: MVT_SortingState) => MVT_SortingState) | MVT_SortingState,
  ) => void
  setServerGroupingColumnFilters: (
    pathId: MVT_ServerGroupPathId,
    columnFilters:
      | ((prev: MVT_ColumnFiltersState) => MVT_ColumnFiltersState)
      | MVT_ColumnFiltersState,
  ) => void
  setServerGroupingGlobalFilter: (pathId: MVT_ServerGroupPathId, globalFilter: unknown) => void
  /** Header-checkbox / selection state over loaded records in expanded groups. */
  getServerGroupingSelectionSummary: () => MVT_ServerGroupingSelectionSummary
  /** Select or deselect every loaded record inside expanded groups. */
  toggleAllServerGroupingRecordsSelected: (value?: boolean) => void
  /**
   * Select every record matching the current filters. With the default
   * `selectAllMode: 'query'` this is synchronous and transfers nothing.
   */
  selectAllMatchingServerGroupingRecords: () => Promise<void>
  /** Raw "all matching" state (exclude mode + its exclusions). */
  getServerGroupingSelectAllState: () => MVT_ServerGroupingSelectAllState
  setServerGroupingSelectAllState: (
    updaterOrValue:
      | ((prev: MVT_ServerGroupingSelectAllState) => MVT_ServerGroupingSelectAllState)
      | MVT_ServerGroupingSelectAllState,
  ) => void
  /** Everything a bulk action needs to send to the server. */
  getServerGroupingSelectionPayload: () => MVT_ServerGroupingSelectionPayload
}
