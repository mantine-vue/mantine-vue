import { withBoxProps } from '../../core'
import PillComponent, { varsResolver } from './Pill.vue'
import { PillGroup } from './PillGroup/PillGroup'
import classes from './Pill.module.css'

export const Pill = withBoxProps(PillComponent)
Object.assign(Pill, { classes, varsResolver, Group: PillGroup })

export type { PillOwnProps, PillProps, PillSlots, PillStylesNames, PillVariant } from './Pill.types'
