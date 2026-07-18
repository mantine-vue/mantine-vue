import type { ScheduleResourceData } from '../../types'

export function getGroupToResourceIdMap(
  resources: ScheduleResourceData[],
): Map<string, string | number> {
  return new Map(resources.map((resource) => [String(resource.id), resource.id]))
}
