export {
  spotlight,
  createSpotlight,
  createSpotlightStore,
  useSpotlight,
  openSpotlight,
  closeSpotlight,
  toggleSpotlight,
} from './spotlight.store'
export type { SpotlightState, SpotlightStore } from './spotlight.store'

export { isActionsGroup } from './is-actions-group'

export { Spotlight } from './components/Spotlight'
export { SpotlightRoot } from './components/SpotlightRoot'
export { SpotlightAction } from './components/SpotlightAction'
export { SpotlightActionsGroup } from './components/SpotlightActionsGroup'
export { SpotlightActionsList } from './components/SpotlightActionsList'
export { SpotlightEmpty } from './components/SpotlightEmpty'
export { SpotlightFooter } from './components/SpotlightFooter'
export { SpotlightSearch } from './components/SpotlightSearch'

export type {
  SpotlightActionData,
  SpotlightActionGroupData,
  SpotlightActions,
  SpotlightEmits,
  SpotlightFilterFunction,
  SpotlightProps,
  SpotlightStylesNames,
} from './components/Spotlight'
export type { SpotlightActionProps, SpotlightActionStylesNames } from './components/SpotlightAction'
export type {
  SpotlightActionsGroupProps,
  SpotlightActionsGroupStylesNames,
} from './components/SpotlightActionsGroup'
export type {
  SpotlightActionsListProps,
  SpotlightActionsListStylesNames,
} from './components/SpotlightActionsList'
export type { SpotlightEmptyProps, SpotlightEmptyStylesNames } from './components/SpotlightEmpty'
export type { SpotlightFooterProps, SpotlightFooterStylesNames } from './components/SpotlightFooter'
export type {
  SpotlightRootEmits,
  SpotlightRootProps,
  SpotlightRootStylesNames,
} from './components/SpotlightRoot'
export type {
  SpotlightSearchEmits,
  SpotlightSearchProps,
  SpotlightSearchStylesNames,
} from './components/SpotlightSearch'
