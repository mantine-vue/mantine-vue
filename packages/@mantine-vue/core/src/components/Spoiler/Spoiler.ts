import { withBoxProps } from '../../core'
import SpoilerComponent, { varsResolver } from './Spoiler.vue'
import classes from './Spoiler.module.css'

export const Spoiler = withBoxProps(SpoilerComponent)

// Static properties kept from the previous implementation: theme extensions and
// the styles API validator read them off the component.
Object.assign(Spoiler, { classes, varsResolver })

export type {
  SpoilerCssVariables,
  SpoilerEmits,
  SpoilerOwnProps,
  SpoilerProps,
  SpoilerSlots,
  SpoilerStylesNames,
} from './Spoiler.types'
