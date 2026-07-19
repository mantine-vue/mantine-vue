# @mantine-vue/table

A fully featured Vue 3 data table built on [TanStack Table v8](https://tanstack.com/table/v8) and [Mantine Vue](https://github.com/) — a community port of [Mantine React Table](https://www.mantine-react-table.com/) to Vue.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team. `@mantine-vue/table` is a port of Kevin Vandy's [Mantine React Table](https://www.mantine-react-table.com/); huge credit to that project and to [TanStack Table](https://tanstack.com/table/v8).

## Features

- Sorting, filtering (per-column + global fuzzy), and pagination
- Row selection with checkboxes/radios/switches, including **shift-click range selection**
- Column ordering, pinning, resizing, hiding, and a per-column actions menu
- Row ordering (drag & drop) and row pinning
- Editing (cell, row, table, and modal display modes)
- Expandable detail panels and sub-row grouping/aggregation
- Row & column virtualization for large datasets
- Click-to-copy cells, sticky header/footer, full-screen, density toggle
- **Vue-native named slots** for every renderable section, alongside the equivalent render-prop options
- Fully reactive, controlled or uncontrolled state
- Written in strict TypeScript with complete type inference from your data
- Localization (i18n) support

## Installation

`@mantine-vue/table` builds on Mantine Vue and TanStack, which are peer dependencies:

```bash
# npm
npm i @mantine-vue/table @mantine-vue/core @mantine-vue/hooks @mantine-vue/dates \
  @tanstack/vue-table @tanstack/vue-virtual @tanstack/match-sorter-utils \
  @tabler/icons-vue clsx dayjs

# yarn
yarn add @mantine-vue/table @mantine-vue/core @mantine-vue/hooks @mantine-vue/dates \
  @tanstack/vue-table @tanstack/vue-virtual @tanstack/match-sorter-utils \
  @tabler/icons-vue clsx dayjs
```

Your app must be wrapped in a `MantineProvider` (from `@mantine-vue/core`), and you need to import the table styles once:

```ts
// main.ts
import '@mantine-vue/core/styles.css'
import '@mantine-vue/table/styles.css'
```

## Quick start

The recommended pattern is to build the table instance with the `useMantineVueTable` composable and pass it to the `<MantineVueTable>` component:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'

interface Person {
  age: number
  firstName: string
  lastName: string
}

// Define columns once (they should be stable).
const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
]

const data = ref<Person[]>([
  { firstName: 'Jane', lastName: 'Doe', age: 30 },
  { firstName: 'John', lastName: 'Smith', age: 25 },
])

// Build the instance with reactive getters so data/columns stay reactive.
const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
```

> **Why getters?** `useMantineVueTable` reads your options once. Passing `data`/`columns` as getters (`get data() { return data.value }`) keeps them reactive, so the table updates whenever your `ref` changes.

You can also pass options directly to the component without the composable — handy for simple, static tables:

```vue
<MantineVueTable :columns="columns" :data="data" />
```

## Columns

Columns are TanStack column definitions with extra options. Use `accessorKey` (supports dot-notation) or an `accessorFn` + `id`:

```ts
const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'name.first', header: 'First' }, // deep key
  { accessorFn: (row) => `${row.first} ${row.last}`, id: 'name', header: 'Name' },
  {
    accessorKey: 'age',
    header: 'Age',
    // Custom cell renderer (a function returning a Vue VNode)
    Cell: ({ cell }) => h('strong', `${cell.getValue<number>()} yrs`),
  },
]
```

A typed column helper is also available:

```ts
import { createMVTColumnHelper } from '@mantine-vue/table'

const columnHelper = createMVTColumnHelper<Person>()
const columns = [
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor((row) => row.age, { id: 'age', header: 'Age' }),
]
```

## Features at a glance

Every feature is an `enable*` option. A few examples:

```ts
useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },

  // interaction
  enableSorting: true, // on by default
  enableColumnFilters: true, // on by default
  enableGlobalFilter: true, // on by default
  enablePagination: true, // on by default

  // selection
  enableRowSelection: true,
  enableBatchRowSelection: true, // shift-click range selection

  // columns
  enableColumnOrdering: true, // drag columns to reorder
  enableColumnPinning: true,
  enableColumnResizing: true,

  // rows
  enableRowOrdering: true, // drag rows (you apply the reorder, see below)
  enableRowActions: true,
  enableExpanding: true,

  // performance
  enableRowVirtualization: true,
})
```

### Reading & controlling state

State can be read at any time and controlled externally:

```ts
const table = useMantineVueTable<Person>({
  /* … */
})

// read
table.getState().rowSelection
table.getSelectedRowModel().rows

// imperative
table.setPageIndex(0)
table.resetSorting()
```

To fully control a piece of state, pass it in `state` and handle the matching `onXChange`:

```ts
const sorting = ref<MVT_SortingState>([])
useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  state: {
    get sorting() {
      return sorting.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
})
```

### Row drag-and-drop

The table tracks the drag state (`draggingRow` / `hoveredRow`); you own the data, so apply the reorder on drop:

```ts
useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableRowOrdering: true,
  enableSorting: false,
  mantineRowDragHandleProps: ({ table }) => ({
    onDragEnd: () => {
      const { draggingRow, hoveredRow } = table.getState()
      if (hoveredRow && draggingRow) {
        data.value.splice(hoveredRow.index, 0, data.value.splice(draggingRow.index, 1)[0])
        data.value = [...data.value]
      }
    },
  }),
})
```

> Use the `*Ordering` flags (`enableColumnOrdering` / `enableRowOrdering`) to reorder — the `*Dragging` flags only render a drag handle for custom use and do not track the drop target.

### Editing

```ts
useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableEditing: true,
  editDisplayMode: 'modal', // 'cell' | 'row' | 'table' | 'modal'
  onEditingRowSave: ({ row, values, exitEditingMode }) => {
    data.value[row.index] = values as Person
    data.value = [...data.value]
    exitEditingMode()
  },
})
```

## Named slots (Vue-native) vs. render props

Every renderable section can be customized **either** with a Vue named slot on `<MantineVueTable>` **or** the equivalent `renderX` option. A named slot takes precedence, and both receive the same scoped argument:

```vue
<MantineVueTable :table="table">
  <template #detailPanel="{ row }">Age: {{ row.original.age }}</template>
  <template #rowActionMenuItems="{ row, table }">
    <Menu.Item @click="() => table.setEditingRow(row)">Edit</Menu.Item>
  </template>
  <template #topToolbarCustomActions>
    <Button>Export</Button>
  </template>
</MantineVueTable>
```

| Named slot                   | Equivalent option                  |
| ---------------------------- | ---------------------------------- |
| `detailPanel`                | `renderDetailPanel`                |
| `rowActions`                 | `renderRowActions`                 |
| `rowActionMenuItems`         | `renderRowActionMenuItems`         |
| `columnActionsMenuItems`     | `renderColumnActionsMenuItems`     |
| `topToolbarCustomActions`    | `renderTopToolbarCustomActions`    |
| `bottomToolbarCustomActions` | `renderBottomToolbarCustomActions` |
| `toolbarInternalActions`     | `renderToolbarInternalActions`     |
| `emptyRowsFallback`          | `renderEmptyRowsFallback`          |

Column-level renderers (`Cell`, `Header`, `Footer`, `Edit`) stay on the column definition.

## Styling

- Import `@mantine-vue/table/styles.css` once (or `styles.layer.css` to use CSS layers).
- Pass Mantine props to any internal component via the `mantineXProps` options — e.g. `mantineTableProps`, `mantinePaperProps`, `mantineTableBodyCellProps`, `mantineRowDragHandleProps`. Each accepts an object or a function of context.
- Override the exposed `mvt-*` global classes (e.g. `.mvt-table-paper`, `.mvt-table-body-cell`) from your own CSS.

```ts
useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  mantineTableProps: { striped: true, highlightOnHover: true },
  mantinePaperProps: { shadow: 'md', radius: 'lg' },
})
```

## Localization

The English locale ships by default. Pass a custom `localization` (partial is merged over English):

```ts
import { MVT_Localization_EN } from '@mantine-vue/table/locales/en'

useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  localization: { ...MVT_Localization_EN, actions: 'Options' },
})
```

## TypeScript

Everything is generic over your row type. Pass `<Person>` to `useMantineVueTable`/`MVT_ColumnDef` and cell/row callbacks are fully typed. Public types are exported with the `MVT_` prefix (`MVT_TableInstance`, `MVT_ColumnDef`, `MVT_Row`, `MVT_Cell`, `MVT_TableOptions`, `MVT_TableState`, …).

## Examples

Runnable demos live in [`examples/`](./examples):

- [`BasicExample.vue`](./examples/BasicExample.vue) — full-featured (ordering, pinning, resizing, selection, drag rows)
- [`MinimalExample.vue`](./examples/MinimalExample.vue) — the smallest possible table
- [`RowSelectionExample.vue`](./examples/RowSelectionExample.vue) — selection + batch + reading selected rows
- [`EditingExample.vue`](./examples/EditingExample.vue) — modal row editing with save
- [`DetailPanelSlotExample.vue`](./examples/DetailPanelSlotExample.vue) — named slots for detail panel & row actions
- [`RemoteDataExample.vue`](./examples/RemoteDataExample.vue) — server-side pagination/sorting/filtering
- [`VirtualizedExample.vue`](./examples/VirtualizedExample.vue) — 10,000 rows with row virtualization

## Credits

Ported from [Mantine React Table](https://www.mantine-react-table.com/) by Kevin Vandy. Built on [TanStack Table](https://tanstack.com/table/v8) and [TanStack Virtual](https://tanstack.com/virtual). Styled with [Mantine Vue](https://github.com/).

## License

MIT
