import type { MVT_RowData } from '../types'
import type {
  MVT_ServerGroupingContext,
  MVT_ServerGroupingProvider,
  MVT_ServerGroupRequest,
  MVT_ServerRecordRequest,
} from './serverGrouping.types'

/**
 * Config for {@link createServerGroupingProvider}. Accepts concise property
 * names (`groups`, `groupId`, `records`, …) in addition to the explicit
 * adapter names of {@link MVT_ServerGroupingProvider} (`getGroups`,
 * `getGroupId`, `getRecords`, …). Explicit names win when both are given.
 */
export interface MVT_CreateServerGroupingProviderOptions<
  TData extends MVT_RowData = MVT_RowData,
  TGroup = unknown,
  TGroupResponse = unknown,
  TRecordResponse = unknown,
> extends Partial<
  Omit<
    MVT_ServerGroupingProvider<TData, TGroup, TGroupResponse, TRecordResponse>,
    'loadGroups' | 'loadRecords'
  >
> {
  loadGroups: (request: MVT_ServerGroupRequest<TGroup>) => Promise<TGroupResponse>
  loadRecords: (request: MVT_ServerRecordRequest<TGroup>) => Promise<TRecordResponse>

  groups?: (response: TGroupResponse) => TGroup[]
  groupRowCount?: (response: TGroupResponse) => number
  groupId?: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => string
  groupLabel?: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => string
  groupValue?: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => unknown
  groupCount?: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => number | undefined
  groupMeta?: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => Record<string, unknown>
  hasChildren?: (group: TGroup, context: MVT_ServerGroupingContext<TGroup>) => boolean
  records?: (response: TRecordResponse) => TData[]
  recordRowCount?: (response: TRecordResponse) => number
  rowId?: (row: TData) => string
  cacheKey?: (
    request: MVT_ServerGroupRequest<TGroup> | MVT_ServerRecordRequest<TGroup>,
  ) => unknown[]
}

const asString = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value)

/**
 * Build a {@link MVT_ServerGroupingProvider} with sensible defaults for common
 * response formats:
 *
 * - `groups`/`records` default to the response itself when it is an array.
 * - `groupRowCount`/`recordRowCount` default to the mapped array length.
 * - `groupId`/`groupLabel` default to stringifying `groupValue` (or the group
 *   itself when it is a primitive).
 * - `groupValue` defaults to the group object itself.
 * - `groupMeta` defaults to `{}`; `groupCount` and aggregates stay optional.
 * - `hasChildren` defaults to `true` (every level up to and including the last
 *   grouping level is expandable).
 * - `rowId` falls back to the table's existing `getRowId` logic.
 */
export const createServerGroupingProvider = <
  TData extends MVT_RowData = MVT_RowData,
  TGroup = unknown,
  TGroupResponse = unknown,
  TRecordResponse = unknown,
>(
  options: MVT_CreateServerGroupingProviderOptions<TData, TGroup, TGroupResponse, TRecordResponse>,
): MVT_ServerGroupingProvider<TData, TGroup, TGroupResponse, TRecordResponse> => {
  const getGroups =
    options.getGroups ??
    options.groups ??
    ((response: TGroupResponse) => (Array.isArray(response) ? (response as TGroup[]) : []))
  const getRecords =
    options.getRecords ??
    options.records ??
    ((response: TRecordResponse) => (Array.isArray(response) ? (response as TData[]) : []))

  const getGroupValue =
    options.getGroupValue ?? options.groupValue ?? ((group: TGroup) => group as unknown)

  const getGroupId =
    options.getGroupId ??
    options.groupId ??
    ((group: TGroup, context: MVT_ServerGroupingContext<TGroup>) =>
      asString(getGroupValue(group, context)))

  const getGroupLabel =
    options.getGroupLabel ??
    options.groupLabel ??
    ((group: TGroup, context: MVT_ServerGroupingContext<TGroup>) =>
      asString(getGroupValue(group, context)))

  return {
    getGroupId,
    getGroupLabel,
    getGroupValue,
    getGroupCount: options.getGroupCount ?? options.groupCount,
    getGroupMeta: options.getGroupMeta ?? options.groupMeta ?? (() => ({})),
    hasGroupChildren: options.hasGroupChildren ?? options.hasChildren,
    loadGroups: options.loadGroups,
    getGroups,
    getGroupRowCount:
      options.getGroupRowCount ??
      options.groupRowCount ??
      ((response: TGroupResponse) => getGroups(response).length),
    loadRecords: options.loadRecords,
    getRecords,
    getRecordRowCount:
      options.getRecordRowCount ??
      options.recordRowCount ??
      ((response: TRecordResponse) => getRecords(response).length),
    getRowId: options.getRowId ?? options.rowId,
    getCacheKey: options.getCacheKey ?? options.cacheKey,
  }
}
