# Server-Side Grouping

`@mantine-vue/table` ships built-in, opt-in support for **lazy, server-side
grouping** — a hierarchical view where every group level is loaded from the
server only when the user expands it, and every nested level has its own
pagination, sorting, filtering, loading, and error state.

```text
Country groups                ← loaded on mount
  └── Salesperson groups      ← loaded when a country is expanded
        └── Month groups      ← loaded when a salesperson is expanded
              └── Records     ← loaded when a month is expanded
```

The feature is completely backend-agnostic: your server response can have any
shape, any protocol (REST, GraphQL, RPC, SQL services,
Elasticsearch aggregations, cursor APIs, …) — adapter functions map it into a
small normalized internal model.

- [Public API overview](#public-api-overview)
- [Quick start](#quick-start)
- [The provider](#the-provider)
- [Request context](#request-context)
- [Grouping fields](#grouping-fields)
- [Nested pagination](#nested-pagination)
- [Group-by toolbar, default grouping, normal mode](#group-by-toolbar-default-grouping-normal-mode)
- [One continuous table](#one-continuous-table)
- [Row selection](#row-selection)
- [Sorting and filtering](#sorting-and-filtering)
- [Aggregate columns](#aggregate-columns)
- [Custom rendering (callbacks and slots)](#custom-rendering)
- [Controlled state](#controlled-state)
- [Loading, errors, cancellation, retry](#loading-errors-cancellation-retry)
- [Caching and invalidation](#caching-and-invalidation)
- [Table instance methods](#table-instance-methods)
- [Events](#events)
- [Cursor pagination](#cursor-pagination)
- [Scoped RPC backend sketch](#scoped-rpc-backend-sketch)
- [Using TanStack Query / Vue Query](#using-an-external-query-library)
- [TypeScript](#typescript)
- [Accessibility](#accessibility)
- [Migration and compatibility](#migration-and-compatibility)
- [Complete examples](#complete-examples)

## Public API overview

Everything lives behind one opt-in table option plus a provider object:

```ts
const table = useMantineVueTable({
  columns,
  data: [], //ignored while server grouping is enabled

  serverGrouping: {
    enabled: true, //default true when provider is set
    grouping: ['country', 'salesperson'], //or reuse table `state.grouping`
    provider, //created via createServerGroupingProvider

    initialPageSize: 15,
    pagination: { defaultPageSize: 15 },
    cache: { enabled: true, staleTime: 30_000 },
    sortingMode: 'independent', //'independent' | 'shared' | 'records-only'
    filteringMode: 'shared', //'shared' | 'independent' | 'records-only'
  },
})
```

Exports: `createServerGroupingProvider`, `MVT_ServerGroupingProvider`,
`MVT_ServerGroupingOptions`, `MVT_ServerGroupNode`, `MVT_ServerGroupPage`,
`MVT_ServerRecordPage`, `MVT_ServerGroupRequest`, `MVT_ServerRecordRequest`,
`MVT_ServerGroupPathItem`, `MVT_ServerGroupPathId`,
`MVT_ServerGroupingPathState`, `createServerGroupPathId`,
`parseServerGroupPathId`, and the `table.*ServerGrouping*` instance methods.

## Quick start

```ts
import { createServerGroupingProvider, useMantineVueTable } from '@mantine-vue/table'

const provider = createServerGroupingProvider<Sale, ApiGroup, ApiGroupResponse, ApiRecordResponse>({
  loadGroups: async ({ groupingField, parentGroups, pagination, sorting, columnFilters, signal }) =>
    api.get('/sales/groups', {
      signal,
      params: {
        groupBy: groupingField,
        path: parentGroups.map((group) => group.value),
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    }),
  groups: (response) => response.data.items,
  groupRowCount: (response) => response.data.total,
  groupId: (group) => group.key,
  groupLabel: (group) => group.name,
  // `value` is passed to child requests as `parentGroups[n].value`.
  groupValue: (group) => group.key,
  groupCount: (group) => group.recordCount,

  loadRecords: async ({ parentGroups, pagination, signal }) =>
    api.get('/sales', {
      signal,
      params: {
        scope: parentGroups.at(-1)?.meta?.scope,
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    }),
  records: (response) => response.data.items,
  recordRowCount: (response) => response.data.total,
  rowId: (row) => String(row.id),
})

const table = useMantineVueTable({
  columns,
  data: [],
  serverGrouping: { grouping: ['country', 'salesperson'], provider },
})
```

```vue
<MantineVueTable :table="table" />
```

That is the whole consumer surface — the recursive rendering, lazy loading,
per-level pagination, cancellation, and error handling are all built in. You
never write recursive components, spawn nested `useMantineVueTable` instances,
implement detail panels, or track nested pagination/loading/sorting maps.

## The provider

A provider implements `MVT_ServerGroupingProvider<TData, TGroup, TGroupResponse, TRecordResponse>`:

| Member                         | Required | Purpose                                           |
| ------------------------------ | -------- | ------------------------------------------------- |
| `loadGroups(request)`          | ✓        | Load one page of child groups for a level         |
| `getGroups(response)`          | ✓\*      | Extract the group array from your response        |
| `getGroupRowCount(response)`   | ✓\*      | Total number of groups at that level              |
| `getGroupId(group, ctx)`       | ✓\*      | Stable id of a group within its level             |
| `getGroupLabel(group, ctx)`    | ✓\*      | Display label                                     |
| `getGroupValue(group, ctx)`    |          | Raw value (defaults to the group itself)          |
| `getGroupCount(group, ctx)`    |          | Optional record count                             |
| `getGroupMeta(group, ctx)`     |          | Optional metadata: aggregates, scopes, cursors, … |
| `hasGroupChildren(group, ctx)` |          | Defaults to `true`                                |
| `loadRecords(request)`         | ✓        | Load one page of final records                    |
| `getRecords(response)`         | ✓\*      | Extract the record array                          |
| `getRecordRowCount(response)`  | ✓\*      | Total record count for the group                  |
| `getRowId(row)`                |          | Falls back to the table's `getRowId`              |
| `getCacheKey(request)`         |          | Extra cache-key parts                             |

\* `createServerGroupingProvider` supplies defaults where possible (array
responses map to themselves, row counts default to array length, id/label
default to the stringified group value) and also accepts the concise aliases
shown in the quick start (`groups`, `groupId`, `records`, `rowId`, …).

Nothing about the _original_ response shape is prescribed — no `rows`, `total`,
`items`, `scope`, `domain`, `offset`, `page`, or `aggregates` fields are ever
required. The normalized types (`MVT_ServerGroupNode`, `MVT_ServerGroupPage`,
`MVT_ServerRecordPage`) are internal contracts produced _by your adapters_.

## Request context

Both `loadGroups` and `loadRecords` receive a generic request:

```ts
{
  grouping: string[]            //all active group-by fields
  groupingField: string         //loadGroups only: grouping[depth]
  depth: number
  pathId: MVT_ServerGroupPathId //stable path id, e.g. 'country:BH/salesperson:42'
  parentGroups: MVT_ServerGroupPathItem[] //each has id, field, depth, label, value, original, meta
  parentGroup?: MVT_ServerGroupPathItem
  pagination: { pageIndex, pageSize, cursor? }
  sorting: MVT_SortingState
  columnFilters: MVT_ColumnFiltersState
  globalFilter: unknown
  signal: AbortSignal
  table: MVT_TableInstance<any>
}
```

Every parent group keeps its **original** backend object plus `value` and
`meta`, so you can construct any follow-up request — a filter domain, a GraphQL
cursor, an Elasticsearch `after_key`, a REST scope token, etc.

## Grouping fields

Grouping identifiers are **opaque strings**. `'createdAt:month'` is not parsed
by the library — your provider decides what it means. Grouping comes from
either:

- `serverGrouping.grouping: ['country', 'salesperson']`, or
- the table's regular grouping state (preferred for dynamic grouping):

```ts
const grouping = ref(['country', 'salesperson'])

useMantineVueTable({
  columns,
  data: [],
  state: {
    get grouping() {
      return grouping.value
    },
  },
  onGroupingChange: (updater) => {
    grouping.value = typeof updater === 'function' ? updater(grouping.value) : updater
  },
  serverGrouping: { provider },
})

// Later, at runtime:
grouping.value = ['department', 'status']
```

Changing grouping cancels in-flight requests, drops incompatible cached pages,
resets expansion (disable with `resetExpansionOnGroupingChange: false`) and
pagination, and reloads the new root. Column definitions are untouched.

## Nested pagination

Every group path has independent pagination state keyed by its stable path id:

```ts
{
  '__root__':                      { pageIndex: 0, pageSize: 25 },
  'country:BH':                    { pageIndex: 2, pageSize: 15 },
  'country:BH/salesperson:42':     { pageIndex: 0, pageSize: 15 },
}
```

Changing one path never affects parents, siblings, or other expanded groups.
Default pagination controls render below every level; configure them with:

```ts
serverGrouping: {
  pagination: {
    enabled: true,
    defaultPageSize: 15,
    showAtRoot: true,
    showForGroups: true,
    showForRecords: true,
  },
}
```

Programmatic control: `table.setServerGroupingPagination('country:BH', { pageIndex: 2 })`.

## Group-by toolbar, default grouping, normal mode

A built-in **group-by control** renders in the top toolbar whenever grouping is
driven by the table's `grouping` state (a static `serverGrouping.grouping`
array hides it, since it could not change anything). Users can add levels,
remove them (menu or pills), reorder them, and clear all grouping. Only
groupable columns are offered: `data` columns whose `enableGrouping` is not
`false`, or an explicit `groupBy.columns` whitelist (may include custom
descriptors like `'createdAt:month'`; pair with `getFieldLabel`). Configure via
`serverGrouping.groupBy` (`enabled`, `allowReorder`, `allowClearAll`,
`columns`, `getFieldLabel`, `renderControl`, `mantineButtonProps`,
`mantineMenuProps`, `mantinePillProps`) or replace it entirely with the
`#serverGroupByControl` slot (wins over `renderControl`).

Each groupable column's **actions menu** carries one action scoped to that
column: "Group by {column}" when it is not a grouping level, and "Clear
grouping" when it is — which removes _only that column's_ level and leaves the
other grouped columns untouched (use the toolbar control to clear them all).
Only groupable columns get it, under the same rules as the toolbar control;
turn it off with `groupBy.showInColumnActions: false`.

`serverGrouping.defaultGrouping` sets the initial hierarchy for uncontrolled
tables; controlled `state.grouping` and `initialState.grouping` take
precedence. Omitted or empty, the table starts in **normal server-side mode**:
no group rows, records load directly at the root, every regular server-side
feature keeps working, and levels can still be added from the toolbar. Unknown
fields log a dev warning (declare descriptors in `groupBy.columns` to silence)
without breaking rendering.

## One continuous table

The hierarchy renders as flat rows of the root table
expanded group levels and record rows are regular `<tr>`s of the root
`<tbody>`, so every level shares the root table's column order, widths,
visibility, alignment, density, and row styling automatically — no per-level
column layout is calculated, and resizing/reordering a root column updates all
rendered levels. Only the root table displays a header; nested levels render
none. Nested content expands naturally with the document (no internal scroll
container, no extra padded wrappers) and hierarchy indentation is applied only
to the group-label/expand cell. To constrain overall height, wrap the whole
table via `mantineTableContainerProps` as usual.

The **root level is paginated by the regular bottom toolbar**: it is bound to
the table's own `pagination` state, and `options.rowCount` falls back to the
root level's server-reported total, so `positionPagination`,
`paginationDisplayMode`, and `mantinePaginationProps` behave exactly as in an
ungrouped server-side table. Nested levels render a compact inline bar below
their content (page navigation + row-count info); their page size is **fixed**
at the configured value (`initialPageSize` / `pagination.defaultPageSize`;
invalid values warn and fall back to 10), which also seeds the root table's
initial page size. Set `pagination.showAtRoot: true` to get an inline root bar
instead (the default when toolbar pagination is disabled), and
`pagination.mantineActionIconProps` to customize the nested buttons.

## Row selection

`enableRowSelection` works unchanged in grouped mode, with grouped-aware
semantics:

- Checkboxes render on **record rows only** — group rows never get one (display
  columns render empty, aligned placeholder cells in group rows).
- The header checkbox covers **loaded records inside expanded groups**: checked
  when all of them are selected, indeterminate when only some are, disabled
  while nothing is loaded.
- Records inside collapsed or never-loaded groups are never implicitly
  selected. With server pagination, selection therefore applies to loaded
  records by default.
- **Collapsing keeps the selection** (it is a view operation, not a data
  operation). The records leave the header checkbox's scope, so the checkbox
  goes _indeterminate_ and the toolbar alert keeps counting them — the
  selection is never silently invisible. Opt into the stricter
  "what you see is what is selected" behavior with
  `selection.clearOnCollapse: true`, which deselects a group's records when it
  is collapsed.
- **Unchecking the header clears the entire selection**, including records in
  collapsed groups and everything added by "select all matching records" —
  removing only the on-screen ids would leave invisible records selected while
  the checkbox reads unchecked.
- Selection is keyed by row id, so always provide `provider.getRowId` (or the
  table's `getRowId`) for stable ids across pages and reloads.

### Select all matching records (without loading ids)

Selecting "everything that matches the current filters" must never materialize
row ids — with millions of matching records that is a huge payload, unbounded
client memory, and a slow request. Instead the selection switches to
**exclude mode**: it _is_ the query, and only the rows the user unchecks
afterwards are tracked.

```ts
serverGrouping: {
  selection: {
    enableSelectAllMatching: true,
    // Query mode is the default: no request, no ids, O(exclusions).
  },
}
```

Clicking the action in the toolbar alert makes no request at all. Bulk actions
then send the query instead of a list:

```ts
const payload = table.getServerGroupingSelectionPayload()
// {
//   mode: 'exclude',            // or 'include' for an explicit selection
//   rowIds: [],                 // only in include mode
//   excludedRowIds: ['42'],     // rows unchecked after "select all matching"
//   grouping, sorting, columnFilters, globalFilter,
// }
await api.bulkArchive(payload) // server: WHERE <filters> AND id NOT IN (excluded)
```

Semantics in exclude mode:

- Every record matching the query counts as selected, including records not
  loaded (or not even paged in) yet.
- Unchecking a row adds it to `excludedRowIds`; re-checking removes it. The
  header checkbox turns indeterminate while exclusions exist.
- Unchecking the header leaves exclude mode entirely.
- The mode is dropped automatically when grouping or the shared filters change,
  because "all matching" referred to the previous query.
- State is readable/controllable: `state.serverGroupingSelectAll` +
  `onServerGroupingSelectAllChange`, or
  `table.getServerGroupingSelectAllState()` /
  `table.setServerGroupingSelectAllState()`.

If your dataset is small and bounded and you really want explicit ids, opt in
with `selectAllMode: 'ids'` plus `loadAllMatchingRowIds` — the previous
behavior, unsuitable for large datasets.

Programmatic APIs: `table.getServerGroupingSelectionSummary()` (adds `mode`,
`isSelectAllMatching`, `excludedRowIds`),
`table.toggleAllServerGroupingRecordsSelected(value?)`,
`table.selectAllMatchingServerGroupingRecords()`, and
`table.getServerGroupingSelectionPayload()`. Controlled `state.rowSelection` /
`onRowSelectionChange` behave exactly as in an ungrouped table.

## Sorting and filtering

`sortingMode` (default `'independent'`):

- `'independent'` — each path owns its sorting (set via
  `table.setServerGroupingSorting(pathId, sorting)`); table-header sorting
  drives the root level.
- `'shared'` — the table's sorting state is sent to every level.
- `'records-only'` — the table's sorting applies only to final record pages.

A sorting change resets only the affected path's pagination.

`filteringMode` (default `'shared'`, since filters usually describe the whole
dataset):

- `'shared'` — table column filters + global filter are sent to every level;
  when they change, loaded pages are invalidated, pagination resets, expanded
  paths reload, and stale results are never shown.
- `'records-only'` — filters are sent to (and reload) record pages only.
- `'independent'` — nothing is shared; use
  `table.setServerGroupingColumnFilters(pathId, filters)` and
  `table.setServerGroupingGlobalFilter(pathId, value)`.

## Aggregate columns

Group rows can show server-provided aggregates. The normalized group retains the
typed backend object in `group.original`, so aggregates can be resolved without
type assertions:

```ts
interface SalesGroup {
  totals: { amount: number }
}

const amountColumn: MVT_ColumnDef<Sale, unknown, SalesGroup> = {
  accessorKey: 'amount',
  header: 'Amount',
  serverGrouping: {
    getValue: ({ group }: Omit<MVT_ServerGroupCellContext<SalesGroup>, 'value'>) =>
      group.original.totals.amount,
    Cell: ({ value }: MVT_ServerGroupCellContext<SalesGroup>) => formatCurrency(value),
    visible: true,
  },
}
```

Aggregates are optional — the feature works when the server returns only labels
(counts are optional too).

## Custom rendering

Render callbacks on the option:

```ts
serverGrouping: {
  renderGroupLabel: ({ group, field, depth }) => group.label,
  renderGroupCount: ({ group }) => `${group.count} records`,
  renderGroupError: ({ error, retry }) => /* … */,
  renderGroupEmpty: ({ field, parentGroup }) => /* … */,
  renderGroupLoading: ({ depth }) => /* … */,
  mantineGroupRowProps: ({ group }) => ({ style: { fontWeight: 600 } }),
}
```

Vue-native named slots (they win over the equivalent callback):

```vue
<MantineVueTable :table="table">
  <template #serverGroupLabel="{ group, field, depth }">{{ group.label }}</template>
  <template #serverGroupCount="{ group }">{{ group.count }}</template>
  <template #serverGroupCell="{ group, column, value }"><!-- aggregates --></template>
  <template #serverGroupError="{ error, retry }"><!-- custom error UI --></template>
  <template #serverGroupEmpty="{ field, parentGroup }"><!-- empty state --></template>
  <template #serverGroupLoading="{ depth }"><!-- loading state --></template>
</MantineVueTable>
```

## Controlled state

Everything can run uncontrolled (default) or controlled:

```ts
const expanded = ref<MVT_ServerGroupingExpandedState>({})

useMantineVueTable({
  //…
  state: {
    get serverGroupingExpanded() {
      return expanded.value
    },
  },
  onServerGroupingExpandedChange: (updater) => {
    expanded.value = typeof updater === 'function' ? updater(expanded.value) : updater
  },
  serverGrouping: { provider },
})
```

Nested state is always keyed by **stable path ids** (`'country:BH'`,
`'country:BH/salesperson:42'`), never by row index. Per-path pagination,
sorting, and filters are controlled through the corresponding instance methods,
and loading/error state can be read per path with
`getServerGroupingPathState(pathId)`.

## Loading, errors, cancellation, retry

- Every request receives an `AbortSignal`. Obsolete requests are cancelled on
  pagination/sorting/filter/grouping changes, on collapse, on unmount, and when
  a newer request replaces an older one for the same path.
- Stale responses can never overwrite newer data (per-path request versioning:
  if page 2 answers before page 1, page 1 is discarded).
- An aborted request is never displayed as an error.
- Errors are isolated per path — a failed group never breaks the root, its
  parent, siblings, or other expanded groups. Each failed path renders a retry
  button (`table.reloadServerGroupingPath(pathId)` does the same).
- Per-path state: `{ isLoading, isFetching, error, updatedAt }` via
  `table.getServerGroupingPathState(pathId)`.

```ts
serverGrouping: {
  onError: ({ error, request, pathId }) => console.error(error),
}
```

## Caching and invalidation

```ts
serverGrouping: {
  cache: {
    enabled: true,
    staleTime: 30_000,       //serve without refetch
    gcTime: 300_000,         //drop unused entries
    keepCollapsedGroups: true,
  },
}
```

Cache keys automatically include the path id, grouping fields, depth,
pagination, sorting, column filters, global filter — plus anything returned by
`provider.getCacheKey(request)`. A stale hit is served instantly and refetched
in the background (`isFetching`), a fresh hit skips the request entirely.

```ts
table.invalidateServerGrouping()
table.invalidateServerGroupingPath('country:BH')
table.reloadServerGrouping()
table.reloadServerGroupingPath('country:BH')
```

No external query library is required, but the provider functions are plain
async functions — implement them with TanStack Query, Vue Query, Pinia, or any
cache you like (see below).

## Table instance methods

```ts
table.getServerGroupingState()
table.getServerGroupingPathState(pathId)
table.expandServerGroup(pathId)
table.collapseServerGroup(pathId)
table.toggleServerGroup(pathId)
table.reloadServerGrouping()
table.reloadServerGroupingPath(pathId)
table.invalidateServerGrouping()
table.invalidateServerGroupingPath(pathId)
table.resetServerGroupingState()
table.setServerGroupingExpanded(updaterOrValue)
table.setServerGroupingPagination(pathId, pagination)
table.setServerGroupingSorting(pathId, sorting)
table.setServerGroupingColumnFilters(pathId, columnFilters)
table.setServerGroupingGlobalFilter(pathId, globalFilter)
```

All methods are safe no-ops when server grouping is disabled.

## Events

```ts
serverGrouping: {
  onGroupExpand: ({ group, path, pathId }) => {},
  onGroupCollapse: ({ group, path, pathId }) => {},
  onGroupLoadStart: ({ request, path, pathId }) => {},
  onGroupLoadSuccess: ({ request, response, groups, path, pathId }) => {},
  onRecordLoadSuccess: ({ request, response, rows, path, pathId }) => {},
  onError: ({ error, request, path, pathId }) => {},
}
```

Callbacks receive normalized context and, where available, the original
provider response.

## Cursor pagination

`pagination` is `{ pageIndex, pageSize, cursor? }` — the library never assumes
`pageIndex * pageSize` is valid for your backend. Store the next cursor in
group `meta` or feed it back through `setServerGroupingPagination`:

```ts
loadRecords: async ({ pagination, parentGroups, signal }) =>
  api.get('/sales', {
    signal,
    params: { after: pagination.cursor ?? null, limit: pagination.pageSize },
  }),

onRecordLoadSuccess: ({ response, pathId }) => {
  nextCursors.set(pathId, response.pageInfo.endCursor)
},

// Next page:
table.setServerGroupingPagination(pathId, (prev) => ({
  ...prev,
  pageIndex: prev.pageIndex + 1,
  cursor: nextCursors.get(pathId),
}))
```

## Scoped RPC backend sketch

Many RPC-style backends return an opaque _scope_ (a filter expression, a domain,
a query token) with every group, which the client must send back to load that
group's children. Store it in `meta` and read it from `parentGroups`:

```ts
const provider = createServerGroupingProvider<SaleOrder, RpcGroup, RpcGroup[], RpcSearchResult>({
  loadGroups: ({ groupingField, parentGroups, pagination, signal }) =>
    rpc.readGroups('sale.order', {
      scope: parentGroups.at(-1)?.meta?.scope ?? null,
      groupBy: groupingField, //'date_order:month' passes through untouched
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      signal,
    }),
  groups: (groups) => groups,
  groupId: (group) => String(group.key),
  groupLabel: (group) => group.displayName ?? String(group.key),
  groupCount: (group) => group.recordCount,
  groupMeta: (group) => ({ scope: group.childScope, totals: { amount_total: group.amountTotal } }),

  loadRecords: ({ parentGroups, pagination, sorting, signal }) =>
    rpc.searchRead('sale.order', {
      scope: parentGroups.at(-1)!.meta!.scope,
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      order: sorting.map((sort) => `${sort.id} ${sort.desc ? 'desc' : 'asc'}`).join(', '),
      signal,
    }),
  records: (result) => result.records,
  recordRowCount: (result) => result.total,
})
```

## Using an external query library

The built-in cache is optional. Providers are plain async functions, so you can
delegate to Vue Query and use its cache instead:

```ts
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()

const provider = createServerGroupingProvider({
  loadGroups: (request) =>
    queryClient.fetchQuery({
      queryKey: ['sales-groups', request.pathId, request.pagination, request.sorting],
      queryFn: ({ signal }) => fetchGroups(request, signal ?? request.signal),
      staleTime: 30_000,
    }),
  //…
})
```

`queryClient.invalidateQueries({ queryKey: ['sales-groups'] })` +
`table.reloadServerGrouping()` then cooperate naturally.

## TypeScript

The provider carries the four generics; the table option accepts any provider
for its row type:

```ts
createServerGroupingProvider<Sale, ApiGroup, ApiGroupResponse, ApiRecordResponse>({ … })
```

All adapters, request contexts, render callbacks, slots, path states, and
instance methods are fully typed — no `any` needed in consumer code. Generic
defaults (`TGroup = unknown`, …) keep simple usage concise.

## Accessibility

- Expand/collapse controls are real buttons (keyboard accessible, focus is
  retained after toggling).
- Group rows carry `aria-expanded`, `aria-level`, and `data-depth`; expand
  buttons have accessible labels including the group name.
- Loading and error states are announced (`role="alert"` on errors).
- Hierarchy is conveyed by level attributes and chevrons, not by indentation
  alone. Table semantics (`<tr>`/`<td>`) are preserved — group headers are
  regular table rows.

## Migration and compatibility

Server grouping is **fully opt-in**: when `serverGrouping` is omitted (or
`enabled: false`), nothing changes — client-side grouping, `manualGrouping`,
`manualPagination`, detail panels, row expansion, controlled state APIs, column
definitions, and manual server-side sorting/filtering behave exactly as before.

When enabled:

- `data` is ignored (pass `[]`); rows come from the provider.
- `manualFiltering`, `manualPagination`, and `manualSorting` are forced on.
- The root level uses the regular toolbar pagination; nested levels render
  compact inline pagination controls.
- Combining it with client-side `enableGrouping`/`manualGrouping` logs a dev
  warning and server grouping takes precedence for rendering.
- Row virtualization and detail panels are not applied to server-grouped
  content in this first iteration.

No breaking changes; no migration steps are required for existing tables.

## Complete examples

Three runnable examples live in [`../examples`](../examples):

1. **`ServerGroupingMinimalExample.vue`** — smallest possible setup with the
   provider helper and array responses.
2. **`ServerGroupingCustomResponseExample.vue`** — mapping a REST response
   whose field names do not match the internal model at all.
3. **`ServerGroupingAdvancedExample.vue`** — three grouping levels, aggregates,
   metadata, independent pagination, controlled expansion, cache invalidation,
   and targeted reloads.
