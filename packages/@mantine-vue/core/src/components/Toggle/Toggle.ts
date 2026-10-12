import { polymorphicFactory } from '../../core'
import ToggleComponent, { varsResolver } from './Toggle.vue'
import type { ToggleFactory } from './Toggle.types'
import classes from './Toggle.module.css'

export const Toggle = polymorphicFactory<ToggleFactory>(ToggleComponent, { classes, varsResolver })
export type * from './Toggle.types'
