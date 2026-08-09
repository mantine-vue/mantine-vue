import SpotlightComponent from './Spotlight.vue'
import { SpotlightAction } from '../SpotlightAction'
import { SpotlightActionsGroup } from '../SpotlightActionsGroup'
import { SpotlightActionsList } from '../SpotlightActionsList'
import { SpotlightEmpty } from '../SpotlightEmpty'
import { SpotlightFooter } from '../SpotlightFooter'
import { SpotlightRoot } from '../SpotlightRoot'
import { SpotlightSearch } from '../SpotlightSearch'
import { spotlight } from '../../spotlight.store'
import classes from '../../Spotlight.module.css'

export const Spotlight = Object.assign(SpotlightComponent, {
  classes,
  Search: SpotlightSearch,
  ActionsList: SpotlightActionsList,
  Action: SpotlightAction,
  Empty: SpotlightEmpty,
  Footer: SpotlightFooter,
  ActionsGroup: SpotlightActionsGroup,
  Root: SpotlightRoot,
  open: spotlight.open,
  close: spotlight.close,
  toggle: spotlight.toggle,
})

export type {
  SpotlightActionData,
  SpotlightActionGroupData,
  SpotlightActions,
  SpotlightEmits,
  SpotlightFilterFunction,
  SpotlightProps,
  SpotlightStylesNames,
} from './Spotlight.types'
