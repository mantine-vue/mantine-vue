import type { ScheduleResourceData, ScheduleResourceGroup } from '../../types'

export interface GroupRange {
  group: ScheduleResourceGroup
  startIndex: number
  count: number
}

export interface ResourceGroupInfo {
  group: ScheduleResourceGroup
  position: 'first' | 'middle' | 'last' | 'only'
  count: number
}

export interface OrderedResourcesResult {
  orderedResources: ScheduleResourceData[]
  groupRanges: GroupRange[]
  resourceGroupMap: Array<ResourceGroupInfo | null>
}

export function getOrderedResources(
  resources: ScheduleResourceData[],
  groups: ScheduleResourceGroup[] | undefined,
): OrderedResourcesResult {
  if (!groups?.length) {
    return { orderedResources: resources, groupRanges: [], resourceGroupMap: [] }
  }

  const resourceMap = new Map(resources.map((resource) => [resource.id, resource]))
  const usedIds = new Set<string | number>()
  const orderedResources: ScheduleResourceData[] = []
  const groupRanges: GroupRange[] = []

  groups.forEach((group) => {
    const startIndex = orderedResources.length
    group.resourceIds.forEach((id) => {
      const resource = resourceMap.get(id)
      if (resource && !usedIds.has(id)) {
        orderedResources.push(resource)
        usedIds.add(id)
      }
    })
    const count = orderedResources.length - startIndex
    if (count) groupRanges.push({ group, startIndex, count })
  })

  resources.forEach((resource) => {
    if (!usedIds.has(resource.id)) orderedResources.push(resource)
  })

  const resourceGroupMap: Array<ResourceGroupInfo | null> = Array(orderedResources.length).fill(
    null,
  )
  groupRanges.forEach(({ group, startIndex, count }) => {
    for (let index = 0; index < count; index += 1) {
      const position: ResourceGroupInfo['position'] =
        count === 1 ? 'only' : index === 0 ? 'first' : index === count - 1 ? 'last' : 'middle'
      resourceGroupMap[startIndex + index] = { group, position, count }
    }
  })

  return { orderedResources, groupRanges, resourceGroupMap }
}
