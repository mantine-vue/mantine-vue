import type { SpotlightActionData, SpotlightActionGroupData } from './Spotlight'

export function isActionsGroup(
  item: SpotlightActionData | SpotlightActionGroupData,
): item is SpotlightActionGroupData {
  const group = item as SpotlightActionGroupData
  return group.group !== undefined && Array.isArray(group.actions)
}
