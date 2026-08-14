import { factory } from '../../core'
import SpoilerComponent, { varsResolver } from './Spoiler.vue'
import type { SpoilerFactory } from './Spoiler.types'
import classes from './Spoiler.module.css'

export const Spoiler = factory<SpoilerFactory>(SpoilerComponent, {
  classes,
  varsResolver,
})

export type {
  SpoilerCssVariables,
  SpoilerEmits,
  SpoilerFactory,
  SpoilerOwnProps,
  SpoilerProps,
  SpoilerSlots,
  SpoilerStylesNames,
} from './Spoiler.types'
