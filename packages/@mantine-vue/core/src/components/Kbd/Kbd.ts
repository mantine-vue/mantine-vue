import { factory } from '../../core'
import KbdComponent, { varsResolver } from './Kbd.vue'
import type { KbdFactory } from './Kbd.types'
import classes from './Kbd.module.css'

export const Kbd = factory<KbdFactory>(KbdComponent, {
  classes,
  varsResolver,
})

export type {
  KbdCssVariables,
  KbdOwnProps,
  KbdProps,
  KbdSlots,
  KbdStylesNames,
  KbdFactory,
} from './Kbd.types'
