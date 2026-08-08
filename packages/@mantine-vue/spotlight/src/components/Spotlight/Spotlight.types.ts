import type { SpotlightActionProps } from '../SpotlightAction/SpotlightAction.types'
import type { SpotlightActionsListProps } from '../SpotlightActionsList/SpotlightActionsList.types'
import type {
  SpotlightRootEmits,
  SpotlightRootProps,
  SpotlightRootStylesNames,
} from '../SpotlightRoot/SpotlightRoot.types'
import type { SpotlightSearchProps } from '../SpotlightSearch/SpotlightSearch.types'

export type SpotlightFilterFunction = (
  query: string,
  actions: SpotlightActions[],
) => SpotlightActions[]
export interface SpotlightActionData extends SpotlightActionProps {
  id: string
  group?: string
}
export interface SpotlightActionGroupData {
  group: string
  actions: SpotlightActionData[]
}
export type SpotlightActions = SpotlightActionData | SpotlightActionGroupData
export type SpotlightStylesNames = SpotlightRootStylesNames

/** Props accepted by the batteries-included `Spotlight` component. */
export interface SpotlightProps extends SpotlightRootProps {
  /** Props passed down to the `Spotlight.Search`. */
  searchProps?: SpotlightSearchProps
  /** Actions data, passed down to `Spotlight.Action` component. */
  actions: SpotlightActions[]
  /** Function to filter actions data based on search query, by default actions are filtered by title, description and keywords. */
  filter?: SpotlightFilterFunction
  /** Message displayed when none of the actions match given `filter`. */
  nothingFound?: any
  /** Determines whether search query should be highlighted in action label. @default false */
  highlightQuery?: boolean
  /** Maximum number of actions displayed at a time. @default Infinity */
  limit?: number
  /** Props passed down to the `ScrollArea` component. */
  scrollAreaProps?: Partial<SpotlightActionsListProps>
}

/** Events emitted by `Spotlight`. */
export type SpotlightEmits = SpotlightRootEmits
