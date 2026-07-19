import { type CSSProperties, type HTMLAttributes, type Ref, type VNodeChild } from 'vue'

import {
  type AccessorFn,
  type AggregationFn,
  type Cell,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingInfoState,
  type ColumnSizingState,
  type DeepKeys,
  type DeepValue,
  type ExpandedState,
  type FilterFn,
  type GroupingState,
  type Header,
  type HeaderGroup,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingFn,
  type SortingState,
  type Table,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from '@tanstack/vue-table'
import { type VirtualItem, type Virtualizer, type VirtualizerOptions } from '@tanstack/vue-virtual'

import {
  type ActionIconProps,
  type AlertProps,
  type AutocompleteProps,
  type BadgeProps,
  type BoxProps,
  type CheckboxProps,
  type DateInputProps,
  type HighlightProps,
  type LoadingOverlayProps,
  type ModalProps,
  type MultiSelectProps,
  type PaginationProps,
  type PaperProps,
  type ProgressProps,
  type RadioProps,
  type RangeSliderProps,
  type SelectProps,
  type SkeletonProps,
  type SwitchProps,
  type TableProps,
  type TableTbodyProps,
  type TableTdProps,
  type TableTfootProps,
  type TableTheadProps,
  type TableThProps,
  type TableTrProps,
  type TextInputProps,
  type UnstyledButtonProps,
} from './mantine.types'

import { type MVT_AggregationFns } from './fns/aggregationFns'
import { type MVT_FilterFns } from './fns/filterFns'
import { type MVT_SortingFns } from './fns/sortingFns'
import { type MVT_Icons } from './icons'

export type { MVT_Icons }

/**
 * A Vue renderable node. Used for
 * every prop-based render option so components/renderers can be passed through
 * props (in addition to the 0 named slot supported by each component).
 */
export type MVT_Node = VNodeChild

/**
 * State setter. Accepts a
 * next value or an updater function receiving the previous value.
 */
export type MVT_SetState<T> = (updaterOrValue: ((prev: T) => T) | T) => void

export type LiteralUnion<T extends U, U = string> = (Record<never, never> & U) | T

export type Prettify<T> = { [K in keyof T]: T[K] } & unknown

export type Xor<A, B> =
  | Prettify<{ [k in keyof A]?: never } & B>
  | Prettify<{ [k in keyof B]?: never } & A>

/**
 * Passthrough HTML attributes plus an optional Vue template ref.
 */
export type HTMLPropsRef<T extends HTMLElement> = {
  ref?: Ref<null | T> | null
  style?: CSSProperties
} & Omit<Partial<HTMLAttributes>, 'color' | 'label' | 'ref' | 'style' | 'title'>

export type MantineShade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type MVT_PaginationProps = {
  rowsPerPageOptions?: string[]
  showRowsPerPage?: boolean
} & Partial<PaginationProps>

export type MVT_DensityState = 'lg' | 'md' | 'sm' | 'xl' | 'xs'

export type MVT_ColumnFilterFnsState = Record<string, MVT_FilterOption>

export type MVT_RowData = Record<string, any>

export type MVT_CellValue = unknown

export type MVT_ColumnFiltersState = ColumnFiltersState
export type MVT_ColumnOrderState = ColumnOrderState
export type MVT_ColumnPinningState = ColumnPinningState
export type MVT_ColumnSizingInfoState = ColumnSizingInfoState
export type MVT_ColumnSizingState = ColumnSizingState
export type MVT_ExpandedState = ExpandedState
export type MVT_GroupingState = GroupingState
export type MVT_PaginationState = PaginationState
export type MVT_RowSelectionState = RowSelectionState
export type MVT_SortingState = SortingState
export type MVT_Updater<T> = Updater<T>
export type MVT_VirtualItem = VirtualItem
export type MVT_VisibilityState = VisibilityState

export type MVT_VirtualizerOptions<
  TScrollElement extends Element | Window = Element | Window,
  TItemElement extends Element = Element,
> = VirtualizerOptions<TScrollElement, TItemElement>

export type MVT_ColumnVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
> = {
  virtualColumns: MVT_VirtualItem[]
  virtualPaddingLeft?: number
  virtualPaddingRight?: number
} & Virtualizer<TScrollElement, TItemElement>

export type MVT_RowVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
> = {
  virtualRows: MVT_VirtualItem[]
} & Virtualizer<TScrollElement, TItemElement>

export type MVT_ColumnHelper<TData extends MVT_RowData> = {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: MVT_DisplayColumnDef<TData, TValue>,
  ) => MVT_ColumnDef<TData, TValue>
  display: (column: MVT_DisplayColumnDef<TData>) => MVT_ColumnDef<TData>
  group: (column: MVT_GroupColumnDef<TData>) => MVT_ColumnDef<TData>
}

export interface MVT_Localization {
  actions: string
  and: string
  cancel: string
  changeFilterMode: string
  changeSearchMode: string
  clearFilter: string
  clearSearch: string
  clearSelection: string
  clearSort: string
  clickToCopy: string
  collapse: string
  collapseAll: string
  columnActions: string
  copiedToClipboard: string
  copy: string
  dropToGroupBy: string
  edit: string
  expand: string
  expandAll: string
  filterArrIncludes: string
  filterArrIncludesAll: string
  filterArrIncludesSome: string
  filterBetween: string
  filterBetweenInclusive: string
  filterByColumn: string
  filterContains: string
  filterEmpty: string
  filterEndsWith: string
  filterEquals: string
  filterEqualsString: string
  filterFuzzy: string
  filterGreaterThan: string
  filterGreaterThanOrEqualTo: string
  filterIncludesString: string
  filterIncludesStringSensitive: string
  filteringByColumn: string
  filterInNumberRange: string
  filterLessThan: string
  filterLessThanOrEqualTo: string
  filterMode: string
  filterNotEmpty: string
  filterNotEquals: string
  filterStartsWith: string
  filterWeakEquals: string
  goToFirstPage: string
  goToLastPage: string
  goToNextPage: string
  goToPreviousPage: string
  grab: string
  groupByColumn: string
  groupedBy: string
  hideAll: string
  hideColumn: string
  max: string
  min: string
  move: string
  noRecordsToDisplay: string
  noResultsFound: string
  of: string
  or: string
  pin: string
  pinToLeft: string
  pinToRight: string
  resetColumnSize: string
  resetOrder: string
  rowActions: string
  rowNumber: string
  rowNumbers: string
  rowsPerPage: string
  save: string
  search: string
  select: string
  selectedCountOfRowCountRowsSelected: string
  showAll: string
  showAllColumns: string
  showHideColumns: string
  showHideFilters: string
  showHideSearch: string
  sortByColumnAsc: string
  sortByColumnDesc: string
  sortedByColumnAsc: string
  sortedByColumnDesc: string
  thenBy: string
  toggleDensity: string
  toggleFullScreen: string
  toggleSelectAll: string
  toggleSelectRow: string
  toggleVisibility: string
  ungroupByColumn: string
  unpin: string
  unpinAll: string
}

export interface MVT_RowModel<TData extends MVT_RowData> {
  flatRows: MVT_Row<TData>[]
  rows: MVT_Row<TData>[]
  rowsById: { [key: string]: MVT_Row<TData> }
}

export type MVT_TableInstance<TData extends MVT_RowData> = {
  getAllColumns: () => MVT_Column<TData>[]
  getAllFlatColumns: () => MVT_Column<TData>[]
  getAllLeafColumns: () => MVT_Column<TData>[]
  getBottomRows: () => MVT_Row<TData>[]
  getCenterLeafColumns: () => MVT_Column<TData>[]
  getCenterRows: () => MVT_Row<TData>[]
  getColumn: (columnId: string) => MVT_Column<TData>
  getExpandedRowModel: () => MVT_RowModel<TData>
  getFilteredSelectedRowModel: () => MVT_RowModel<TData>
  getFlatHeaders: () => MVT_Header<TData>[]
  getHeaderGroups: () => MVT_HeaderGroup<TData>[]
  getLeftLeafColumns: () => MVT_Column<TData>[]
  getPaginationRowModel: () => MVT_RowModel<TData>
  getPreFilteredRowModel: () => MVT_RowModel<TData>
  getPrePaginationRowModel: () => MVT_RowModel<TData>
  getRightLeafColumns: () => MVT_Column<TData>[]
  getRowModel: () => MVT_RowModel<TData>
  getSelectedRowModel: () => MVT_RowModel<TData>
  getState: () => MVT_TableState<TData>
  getTopRows: () => MVT_Row<TData>[]
  options: MVT_StatefulTableOptions<TData>
  refs: {
    bottomToolbarRef: Ref<HTMLDivElement | null>
    editInputRefs: Ref<Record<string, HTMLInputElement>>
    filterInputRefs: Ref<Record<string, HTMLInputElement>>
    lastSelectedRowId: Ref<null | string>
    searchInputRef: Ref<HTMLInputElement | null>
    tableContainerRef: Ref<HTMLDivElement | null>
    tableFooterRef: Ref<HTMLTableSectionElement | null>
    tableHeadCellRefs: Ref<Record<string, HTMLTableCellElement>>
    tableHeadRef: Ref<HTMLTableSectionElement | null>
    tablePaperRef: Ref<HTMLDivElement | null>
    topToolbarRef: Ref<HTMLDivElement | null>
  }
  setColumnFilterFns: MVT_SetState<MVT_ColumnFilterFnsState>
  setCreatingRow: MVT_SetState<MVT_Row<TData> | null | true>
  setDensity: MVT_SetState<MVT_DensityState>
  setDraggingColumn: MVT_SetState<MVT_Column<TData> | null>
  setDraggingRow: MVT_SetState<MVT_Row<TData> | null>
  setEditingCell: MVT_SetState<MVT_Cell<TData> | null>
  setEditingRow: MVT_SetState<MVT_Row<TData> | null>
  setGlobalFilterFn: MVT_SetState<MVT_FilterOption>
  setHoveredColumn: MVT_SetState<null | Partial<MVT_Column<TData>>>
  setHoveredRow: MVT_SetState<null | Partial<MVT_Row<TData>>>
  setIsFullScreen: MVT_SetState<boolean>
  setShowAlertBanner: MVT_SetState<boolean>
  setShowColumnFilters: MVT_SetState<boolean>
  setShowGlobalFilter: MVT_SetState<boolean>
  setShowToolbarDropZone: MVT_SetState<boolean>
} & Omit<
  Table<TData>,
  | 'getAllColumns'
  | 'getAllFlatColumns'
  | 'getAllLeafColumns'
  | 'getBottomRows'
  | 'getCenterLeafColumns'
  | 'getCenterRows'
  | 'getColumn'
  | 'getExpandedRowModel'
  | 'getFlatHeaders'
  | 'getHeaderGroups'
  | 'getLeftLeafColumns'
  | 'getPaginationRowModel'
  | 'getPreFilteredRowModel'
  | 'getPrePaginationRowModel'
  | 'getRightLeafColumns'
  | 'getRowModel'
  | 'getSelectedRowModel'
  | 'getState'
  | 'getTopRows'
  | 'options'
>

export type MVT_DefinedTableOptions<TData extends MVT_RowData> = {
  icons: MVT_Icons
  localization: MVT_Localization
} & Omit<MVT_TableOptions<TData>, 'icons' | 'localization'>

export type MVT_StatefulTableOptions<TData extends MVT_RowData> = {
  state: Pick<
    MVT_TableState<TData>,
    | 'columnFilterFns'
    | 'columnOrder'
    | 'columnSizingInfo'
    | 'creatingRow'
    | 'density'
    | 'draggingColumn'
    | 'draggingRow'
    | 'editingCell'
    | 'editingRow'
    | 'globalFilterFn'
    | 'grouping'
    | 'hoveredColumn'
    | 'hoveredRow'
    | 'isFullScreen'
    | 'pagination'
    | 'showAlertBanner'
    | 'showColumnFilters'
    | 'showGlobalFilter'
    | 'showToolbarDropZone'
  >
} & MVT_DefinedTableOptions<TData>

export type MVT_TableState<TData extends MVT_RowData> = Prettify<
  {
    columnFilterFns: MVT_ColumnFilterFnsState
    creatingRow: MVT_Row<TData> | null
    density: MVT_DensityState
    draggingColumn: MVT_Column<TData> | null
    draggingRow: MVT_Row<TData> | null
    editingCell: MVT_Cell<TData> | null
    editingRow: MVT_Row<TData> | null
    globalFilterFn: MVT_FilterOption
    hoveredColumn: null | Partial<MVT_Column<TData>>
    hoveredRow: null | Partial<MVT_Row<TData>>
    isFullScreen: boolean
    isLoading: boolean
    isSaving: boolean
    showAlertBanner: boolean
    showColumnFilters: boolean
    showGlobalFilter: boolean
    showLoadingOverlay: boolean
    showProgressBars: boolean
    showSkeletons: boolean
    showToolbarDropZone: boolean
  } & TableState
>

export type MVT_ColumnDef<TData extends MVT_RowData, TValue = unknown> = {
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify a function here to point to the correct property in the data object.
   *
   * @example accessorFn: (row) => row.username
   */
  accessorFn?: (originalRow: TData) => any
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify which key in the row this column should use to access the correct data.
   * Also supports Deep Key Dot Notation.
   *
   * @example accessorKey: 'username' //simple
   * @example accessorKey: 'name.firstName' //deep key dot notation
   */
  accessorKey?: ({} & string) | DeepKeys<TData>
  AggregatedCell?: (props: {
    cell: MVT_Cell<TData, TValue>
    column: MVT_Column<TData, TValue>
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  aggregationFn?: Array<MVT_AggregationFn<TData>> | MVT_AggregationFn<TData>
  Cell?: (props: {
    cell: MVT_Cell<TData, TValue>
    column: MVT_Column<TData, TValue>
    renderedCellValue: MVT_Node | number | string
    renderedColumnIndex?: number
    renderedRowIndex?: number
    row: MVT_Row<TData>
    rowRef?: Ref<HTMLTableRowElement | null>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  /**
   * Specify what type of column this is. Either `data`, `display`, or `group`. Defaults to `data`.
   * Leave this blank if you are just creating a normal data column.
   *
   * @default 'data'
   *
   * @example columnDefType: 'display'
   */
  columnDefType?: 'data' | 'display' | 'group'
  columnFilterModeOptions?: Array<LiteralUnion<MVT_FilterOption & string>> | null
  columns?: MVT_ColumnDef<TData>[]
  Edit?: (props: {
    cell: MVT_Cell<TData, TValue>
    column: MVT_Column<TData, TValue>
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  editVariant?: 'multi-select' | 'select' | 'text'
  enableCellHoverReveal?: boolean
  enableClickToCopy?: ((cell: MVT_Cell<TData>) => boolean) | boolean
  enableColumnActions?: boolean
  enableColumnDragging?: boolean
  enableColumnFilterModes?: boolean
  enableColumnOrdering?: boolean
  enableEditing?: ((row: MVT_Row<TData>) => boolean) | boolean
  enableFilterMatchHighlighting?: boolean
  Filter?: (props: {
    column: MVT_Column<TData, TValue>
    header: MVT_Header<TData>
    rangeFilterIndex?: number
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  filterFn?: MVT_FilterFn<TData>
  filterTooltipValueFn?: MVT_FilterTooltipValueFn
  filterVariant?:
    | 'autocomplete'
    | 'checkbox'
    | 'date'
    | 'date-range'
    | 'multi-select'
    | 'range'
    | 'range-slider'
    | 'select'
    | 'text'
  Footer?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        footer: MVT_Header<TData>
        table: MVT_TableInstance<TData>
      }) => MVT_Node)
    | MVT_Node
  /**
   * footer must be a string. If you want custom JSX to render the footer, you can also specify a `Footer` option. (Capital F)
   */
  footer?: string
  GroupedCell?: (props: {
    cell: MVT_Cell<TData, TValue>
    column: MVT_Column<TData, TValue>
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  /**
   * If `layoutMode` is `'grid'` or `'grid-no-grow'`, you can specify the flex grow value for individual columns to still grow and take up remaining space, or set to `false`/0 to not grow.
   */
  grow?: boolean | number
  Header?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        header: MVT_Header<TData>
        table: MVT_TableInstance<TData>
      }) => MVT_Node)
    | MVT_Node
  /**
   * header must be a string. If you want custom JSX to render the header, you can also specify a `Header` option. (Capital H)
   */
  header: string
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   *
   * If you have also specified an `accessorFn`, MVT still needs to have a valid `id` to be able to identify the column uniquely.
   *
   * `id` defaults to the `accessorKey` or `header` if not specified.
   *
   * @default gets set to the same value as `accessorKey` by default
   */
  id?: LiteralUnion<keyof TData & string>
  mantineColumnActionsButtonProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineColumnDragHandleProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineCopyButtonProps?:
    | ((props: {
        cell: MVT_Cell<TData, TValue>
        column: MVT_Column<TData, TValue>
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<UnstyledButtonProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<UnstyledButtonProps>)
  mantineEditSelectProps?:
    | ((props: {
        cell: MVT_Cell<TData, TValue>
        column: MVT_Column<TData, TValue>
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
  mantineEditTextInputProps?:
    | ((props: {
        cell: MVT_Cell<TData, TValue>
        column: MVT_Column<TData, TValue>
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineFilterAutocompleteProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<AutocompleteProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<AutocompleteProps>)
  mantineFilterCheckboxProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<CheckboxProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<CheckboxProps>)
  mantineFilterDateInputProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>)
  mantineFilterMultiSelectProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<MultiSelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<MultiSelectProps>)
  mantineFilterRangeSliderProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<RangeSliderProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<RangeSliderProps>)
  mantineFilterSelectProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
  mantineFilterTextInputProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineTableBodyCellProps?:
    | ((props: {
        cell: MVT_Cell<TData, TValue>
        column: MVT_Column<TData, TValue>
        renderedRowIndex?: number
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableTdProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableTdProps)
  mantineTableFooterCellProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableThProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableThProps)
  mantineTableHeadCellProps?:
    | ((props: {
        column: MVT_Column<TData, TValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableThProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableThProps)
  PlaceholderCell?: (props: {
    cell: MVT_Cell<TData, TValue>
    column: MVT_Column<TData, TValue>
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderColumnActionsMenuItems?: (props: {
    column: MVT_Column<TData, TValue>
    internalColumnMenuItems: MVT_Node
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderColumnFilterModeMenuItems?: (props: {
    column: MVT_Column<TData, TValue>
    internalFilterOptions: MVT_InternalFilterOption[]
    onSelectFilterMode: (filterMode: MVT_FilterOption) => void
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  sortingFn?: MVT_SortingFn<TData>
  visibleInShowHideMenu?: boolean
} & Omit<
  ColumnDef<TData, TValue>,
  | 'accessorKey'
  | 'aggregatedCell'
  | 'aggregationFn'
  | 'cell'
  | 'columns'
  | 'filterFn'
  | 'footer'
  | 'header'
  | 'id'
  | 'sortingFn'
>

export type MVT_DisplayColumnDef<TData extends MVT_RowData, TValue = unknown> = Omit<
  MVT_ColumnDef<TData, TValue>,
  'accessorFn' | 'accessorKey'
>

export type MVT_GroupColumnDef<TData extends MVT_RowData> = {
  columns: MVT_ColumnDef<TData>[]
} & MVT_DisplayColumnDef<TData, any>

export type MVT_DefinedColumnDef<TData extends MVT_RowData, TValue = unknown> = {
  _filterFn: MVT_FilterOption
  defaultDisplayColumn: Partial<MVT_ColumnDef<TData, TValue>>
  id: string
} & Omit<MVT_ColumnDef<TData, TValue>, 'defaultDisplayColumn' | 'id'>

export type MVT_Column<TData extends MVT_RowData, TValue = unknown> = {
  columnDef: MVT_DefinedColumnDef<TData, TValue>
  columns?: MVT_Column<TData>[]
  filterFn?: MVT_FilterFn<TData>
  footer: string
  header: string
} & Omit<Column<TData, MVT_CellValue>, 'columnDef' | 'columns' | 'filterFn' | 'footer' | 'header'>

export type MVT_Header<TData extends MVT_RowData, TValue = unknown> = {
  column: MVT_Column<TData, TValue>
} & Omit<Header<TData, MVT_CellValue>, 'column'>

export type MVT_HeaderGroup<TData extends MVT_RowData> = {
  headers: MVT_Header<TData>[]
} & Omit<HeaderGroup<TData>, 'headers'>

export type MVT_Row<TData extends MVT_RowData> = {
  _valuesCache: Record<LiteralUnion<DeepKeys<TData> & string>, any>
  getAllCells: () => MVT_Cell<TData>[]
  getVisibleCells: () => MVT_Cell<TData>[]
  subRows?: MVT_Row<TData>[]
} & Omit<Row<TData>, '_valuesCache' | 'getAllCells' | 'getVisibleCells' | 'subRows'>

export type MVT_Cell<TData extends MVT_RowData, TValue = unknown> = {
  column: MVT_Column<TData, TValue>
  row: MVT_Row<TData>
} & Omit<Cell<TData, TValue>, 'column' | 'row'>

export type MVT_AggregationOption = keyof typeof MVT_AggregationFns & string

export type MVT_AggregationFn<TData extends MVT_RowData> =
  | AggregationFn<TData>
  | MVT_AggregationOption

export type MVT_SortingOption = LiteralUnion<keyof typeof MVT_SortingFns & string>

export type MVT_SortingFn<TData extends MVT_RowData> = MVT_SortingOption | SortingFn<TData>

export type MVT_FilterOption = LiteralUnion<keyof typeof MVT_FilterFns & string>

export type MVT_FilterFn<TData extends MVT_RowData> = FilterFn<TData> | MVT_FilterOption

export type MVT_FilterTooltipValueFn<TValue = any> = (value: TValue) => string

export type MVT_InternalFilterOption = {
  divider: boolean
  label: string
  option: string
  symbol: string
}

export type MVT_DisplayColumnIds =
  | 'mvt-row-actions'
  | 'mvt-row-drag'
  | 'mvt-row-expand'
  | 'mvt-row-numbers'
  | 'mvt-row-pin'
  | 'mvt-row-select'
  | 'mvt-row-spacer'

export type MVT_CreateTableFeature<TData extends MVT_RowData, TFeature = any> = (
  table: MVT_TableInstance<TData>,
) => TFeature

/**
 * `columns` and `data` props are the only required props, but there are over 150 other optional props.
 *
 */
export type MVT_TableOptions<TData extends MVT_RowData> = {
  columnFilterDisplayMode?: 'custom' | 'popover' | 'subheader'
  columnFilterModeOptions?: Array<LiteralUnion<MVT_FilterOption & string>> | null
  /**
   * The columns to display in the table. `accessorKey`s or `accessorFn`s must match keys in the `data` prop.
   *
   */
  columns: MVT_ColumnDef<TData>[]
  columnVirtualizerInstanceRef?: Ref<null | Virtualizer<HTMLDivElement, HTMLTableCellElement>>
  columnVirtualizerOptions?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>
  createDisplayMode?: 'custom' | 'modal' | 'row'
  /**
   * Pass your data as an array of objects. Objects can theoretically be any shape, but it's best to keep them consistent.
   *
   */
  data: TData[]
  /**
   * Instead of specifying a bunch of the same options for each column, you can just change an option in the `defaultColumn` prop to change a default option for all columns.
   */
  defaultColumn?: Partial<MVT_ColumnDef<TData>>
  /**
   * Change the default options for display columns.
   */
  defaultDisplayColumn?: Partial<MVT_DisplayColumnDef<TData>>
  displayColumnDefOptions?: Partial<{
    [key in MVT_DisplayColumnIds]: Partial<MVT_DisplayColumnDef<TData>>
  }>
  editDisplayMode?: 'cell' | 'custom' | 'modal' | 'row' | 'table'
  enableBatchRowSelection?: boolean
  enableBottomToolbar?: boolean
  enableClickToCopy?: ((cell: MVT_Cell<TData>) => boolean) | boolean
  enableColumnActions?: boolean
  enableColumnDragging?: boolean
  enableColumnFilterModes?: boolean
  enableColumnOrdering?: boolean
  enableColumnVirtualization?: boolean
  enableDensityToggle?: boolean
  enableEditing?: ((row: MVT_Row<TData>) => boolean) | boolean
  enableExpandAll?: boolean
  enableFacetedValues?: boolean
  enableFilterMatchHighlighting?: boolean
  enableFullScreenToggle?: boolean
  enableGlobalFilterModes?: boolean
  enableGlobalFilterRankedResults?: boolean
  enableHeaderActionsHoverReveal?: boolean
  enablePagination?: boolean
  enableRowActions?: boolean
  enableRowDragging?: boolean
  enableRowNumbers?: boolean
  enableRowOrdering?: boolean
  enableRowSelection?: ((row: MVT_Row<TData>) => boolean) | boolean
  enableRowVirtualization?: boolean
  enableSelectAll?: boolean
  enableStickyFooter?: boolean
  enableStickyHeader?: boolean
  enableTableFooter?: boolean
  enableTableHead?: boolean
  enableToolbarInternalActions?: boolean
  enableTopToolbar?: boolean
  expandRowsFn?: (dataRow: TData) => TData[]
  getRowId?: (originalRow: TData, index: number, parentRow: MVT_Row<TData>) => string | undefined
  globalFilterFn?: MVT_FilterOption
  globalFilterModeOptions?: MVT_FilterOption[] | null
  icons?: Partial<MVT_Icons>
  initialState?: Partial<MVT_TableState<TData>>
  /**
   * Changes which kind of CSS layout is used to render the table. `semantic` uses default semantic HTML elements, while `grid` adds CSS grid and flexbox styles
   */
  layoutMode?: 'grid' | 'grid-no-grow' | 'semantic'
  /**
   * Pass in either a locale imported from `@mantine-vue/table/locales/*` or a custom locale object.
   *
   */
  localization?: Partial<MVT_Localization>
  mantineBottomToolbarProps?:
    | ((props: { table: MVT_TableInstance<TData> }) => BoxProps & HTMLPropsRef<HTMLDivElement>)
    | (BoxProps & HTMLPropsRef<HTMLDivElement>)
  mantineColumnActionsButtonProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineColumnDragHandleProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineCopyButtonProps?:
    | ((props: {
        cell: MVT_Cell<TData, MVT_CellValue>
        column: MVT_Column<TData, MVT_CellValue>
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<UnstyledButtonProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<UnstyledButtonProps>)
  mantineCreateRowModalProps?:
    | ((props: {
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<ModalProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<ModalProps>)
  mantineDetailPanelProps?:
    | ((props: {
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => BoxProps & HTMLPropsRef<HTMLTableCellElement>)
    | (BoxProps & HTMLPropsRef<HTMLTableCellElement>)
  mantineEditRowModalProps?:
    | ((props: {
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<ModalProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<ModalProps>)
  mantineEditSelectProps?:
    | ((props: {
        cell: MVT_Cell<TData, MVT_CellValue>
        column: MVT_Column<TData, MVT_CellValue>
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
  mantineEditTextInputProps?:
    | ((props: {
        cell: MVT_Cell<TData, MVT_CellValue>
        column: MVT_Column<TData, MVT_CellValue>
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineExpandAllButtonProps?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineExpandButtonProps?:
    | ((props: {
        renderedRowIndex?: number
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineFilterAutocompleteProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<AutocompleteProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<AutocompleteProps>)
  mantineFilterCheckboxProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<CheckboxProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<CheckboxProps>)
  mantineFilterDateInputProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>)
  mantineFilterMultiSelectProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<MultiSelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<MultiSelectProps>)
  mantineFilterRangeSliderProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<RangeSliderProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<RangeSliderProps>)
  mantineFilterSelectProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
  mantineFilterTextInputProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        rangeFilterIndex?: number
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineHighlightProps?:
    | ((props: {
        cell: MVT_Cell<TData, MVT_CellValue>
        column: MVT_Column<TData, MVT_CellValue>
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLSpanElement> & Partial<HighlightProps>)
    | (HTMLPropsRef<HTMLSpanElement> & Partial<HighlightProps>)
  mantineLoadingOverlayProps?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<LoadingOverlayProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<LoadingOverlayProps>)
  mantinePaginationProps?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => Partial<HTMLPropsRef<HTMLDivElement> & MVT_PaginationProps>)
    | Partial<HTMLPropsRef<HTMLDivElement> & MVT_PaginationProps>
  mantinePaperProps?:
    | ((props: { table: MVT_TableInstance<TData> }) => HTMLPropsRef<HTMLDivElement> & PaperProps)
    | (HTMLPropsRef<HTMLDivElement> & PaperProps)
  mantineProgressProps?:
    | ((props: {
        isTopToolbar: boolean
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & ProgressProps)
    | (HTMLPropsRef<HTMLDivElement> & ProgressProps)
  mantineRowDragHandleProps?:
    | ((props: {
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineSearchTextInputProps?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineSelectAllCheckboxProps?:
    | ((CheckboxProps | RadioProps | SwitchProps) & HTMLPropsRef<HTMLInputElement>)
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => (CheckboxProps | RadioProps | SwitchProps) & HTMLPropsRef<HTMLInputElement>)
  mantineSelectCheckboxProps?:
    | ((CheckboxProps | RadioProps | SwitchProps) & HTMLPropsRef<HTMLInputElement>)
    | ((props: {
        renderedRowIndex?: number
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => (CheckboxProps | RadioProps | SwitchProps) & HTMLPropsRef<HTMLInputElement>)
  mantineSkeletonProps?:
    | ((props: {
        cell: MVT_Cell<TData, MVT_CellValue>
        column: MVT_Column<TData, MVT_CellValue>
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & SkeletonProps)
    | (HTMLPropsRef<HTMLDivElement> & SkeletonProps)
  mantineTableBodyCellProps?:
    | ((props: {
        cell: MVT_Cell<TData, MVT_CellValue>
        column: MVT_Column<TData, MVT_CellValue>
        renderedColumnIndex?: number
        renderedRowIndex?: number
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableTdProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableTdProps)
  mantineTableBodyProps?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableSectionElement> & TableTbodyProps)
    | (HTMLPropsRef<HTMLTableSectionElement> & TableTbodyProps)
  mantineTableBodyRowProps?:
    | ((props: {
        isDetailPanel?: boolean
        renderedRowIndex?: number
        row: MVT_Row<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
    | (HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
  mantineTableContainerProps?:
    | ((props: { table: MVT_TableInstance<TData> }) => BoxProps & HTMLPropsRef<HTMLDivElement>)
    | (BoxProps & HTMLPropsRef<HTMLDivElement>)
  mantineTableFooterCellProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableThProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableThProps)
  mantineTableFooterProps?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableSectionElement> & TableTfootProps)
    | (HTMLPropsRef<HTMLTableSectionElement> & TableTfootProps)
  mantineTableFooterRowProps?:
    | ((props: {
        footerGroup: MVT_HeaderGroup<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
    | (HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
  mantineTableHeadCellProps?:
    | ((props: {
        column: MVT_Column<TData, MVT_CellValue>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableThProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableThProps)
  mantineTableHeadProps?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableSectionElement> & TableTheadProps)
    | (HTMLPropsRef<HTMLTableSectionElement> & TableTheadProps)
  mantineTableHeadRowProps?:
    | ((props: {
        headerGroup: MVT_HeaderGroup<TData>
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
    | (HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
  mantineTableProps?:
    | ((props: { table: MVT_TableInstance<TData> }) => HTMLPropsRef<HTMLTableElement> & TableProps)
    | (HTMLPropsRef<HTMLTableElement> & TableProps)
  mantineToolbarAlertBannerBadgeProps?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<BadgeProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<BadgeProps>)
  mantineToolbarAlertBannerProps?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<AlertProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<AlertProps>)
  mantineTopToolbarProps?:
    | ((props: { table: MVT_TableInstance<TData> }) => BoxProps & HTMLPropsRef<HTMLDivElement>)
    | (BoxProps & HTMLPropsRef<HTMLDivElement>)
  /**
   * Memoize cells, rows, or the entire table body to potentially improve render performance.
   *
   */
  memoMode?: 'cells' | 'rows' | 'table-body'
  onColumnFilterFnsChange?: OnChangeFn<{ [key: string]: MVT_FilterOption }>
  onCreatingRowCancel?: (props: { row: MVT_Row<TData>; table: MVT_TableInstance<TData> }) => void
  onCreatingRowChange?: OnChangeFn<MVT_Row<TData> | null>
  onCreatingRowSave?: (props: {
    exitCreatingMode: () => void
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
    values: Record<LiteralUnion<DeepKeys<TData> & string>, any>
  }) => void
  onDensityChange?: OnChangeFn<MVT_DensityState>
  onDraggingColumnChange?: OnChangeFn<MVT_Column<TData> | null>
  onDraggingRowChange?: OnChangeFn<MVT_Row<TData> | null>
  onEditingCellChange?: OnChangeFn<MVT_Cell<TData> | null>
  onEditingRowCancel?: (props: { row: MVT_Row<TData>; table: MVT_TableInstance<TData> }) => void
  onEditingRowChange?: OnChangeFn<MVT_Row<TData> | null>
  onEditingRowSave?: (props: {
    exitEditingMode: () => void
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
    values: Record<LiteralUnion<DeepKeys<TData> & string>, any>
  }) => Promise<void> | void
  onGlobalFilterFnChange?: OnChangeFn<MVT_FilterOption>
  onHoveredColumnChange?: OnChangeFn<null | Partial<MVT_Column<TData>>>
  onHoveredRowChange?: OnChangeFn<null | Partial<MVT_Row<TData>>>
  onIsFullScreenChange?: OnChangeFn<boolean>
  onShowAlertBannerChange?: OnChangeFn<boolean>
  onShowColumnFiltersChange?: OnChangeFn<boolean>
  onShowGlobalFilterChange?: OnChangeFn<boolean>
  onShowToolbarDropZoneChange?: OnChangeFn<boolean>
  paginationDisplayMode?: 'custom' | 'default' | 'pages'
  positionActionsColumn?: 'first' | 'last'
  positionCreatingRow?: 'bottom' | 'top' | number
  positionExpandColumn?: 'first' | 'last'
  positionGlobalFilter?: 'left' | 'none' | 'right'
  positionPagination?: 'both' | 'bottom' | 'none' | 'top'
  positionToolbarAlertBanner?: 'bottom' | 'head-overlay' | 'none' | 'top'
  positionToolbarDropZone?: 'both' | 'bottom' | 'none' | 'top'
  renderBottomToolbar?: ((props: { table: MVT_TableInstance<TData> }) => MVT_Node) | MVT_Node
  renderBottomToolbarCustomActions?: (props: { table: MVT_TableInstance<TData> }) => MVT_Node
  renderColumnActionsMenuItems?: (props: {
    column: MVT_Column<TData, MVT_CellValue>
    internalColumnMenuItems: MVT_Node
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderColumnFilterModeMenuItems?: (props: {
    column: MVT_Column<TData, MVT_CellValue>
    internalFilterOptions: MVT_InternalFilterOption[]
    onSelectFilterMode: (filterMode: MVT_FilterOption) => void
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderCreateRowModalContent?: (props: {
    internalEditComponents: MVT_Node[]
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderDetailPanel?: (props: {
    internalEditComponents: MVT_Node[]
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderEditRowModalContent?: (props: {
    internalEditComponents: MVT_Node[]
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderEmptyRowsFallback?: (props: { table: MVT_TableInstance<TData> }) => MVT_Node
  renderGlobalFilterModeMenuItems?: (props: {
    internalFilterOptions: MVT_InternalFilterOption[]
    onSelectFilterMode: (filterMode: MVT_FilterOption) => void
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderRowActionMenuItems?: (props: {
    renderedRowIndex?: number
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderRowActions?: (props: {
    cell: MVT_Cell<TData, MVT_CellValue>
    renderedRowIndex?: number
    row: MVT_Row<TData>
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderToolbarAlertBannerContent?: (props: {
    groupedAlert: MVT_Node | null
    selectedAlert: MVT_Node | null
    table: MVT_TableInstance<TData>
  }) => MVT_Node
  renderToolbarInternalActions?: (props: { table: MVT_TableInstance<TData> }) => MVT_Node
  renderTopToolbar?: ((props: { table: MVT_TableInstance<TData> }) => MVT_Node) | MVT_Node
  renderTopToolbarCustomActions?: (props: { table: MVT_TableInstance<TData> }) => MVT_Node
  rowCount?: number
  rowNumberDisplayMode?: 'original' | 'static'
  rowPinningDisplayMode?:
    | 'bottom'
    | 'select-bottom'
    | 'select-sticky'
    | 'select-top'
    | 'sticky'
    | 'top'
    | 'top-and-bottom'
  rowVirtualizerInstanceRef?: Ref<null | Virtualizer<HTMLDivElement, HTMLTableRowElement>>
  rowVirtualizerOptions?:
    | ((props: {
        table: MVT_TableInstance<TData>
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>
  selectAllMode?: 'all' | 'page'
  selectDisplayMode?: 'checkbox' | 'radio' | 'switch'
  /**
   * Manage state externally any way you want, then pass it back into MVT.
   */
  state?: Partial<MVT_TableState<TData>>
} & Omit<
  Partial<TableOptions<TData>>,
  | 'columns'
  | 'data'
  | 'defaultColumn'
  | 'enableRowSelection'
  | 'expandRowsFn'
  | 'getRowId'
  | 'globalFilterFn'
  | 'initialState'
  | 'onStateChange'
  | 'state'
>
