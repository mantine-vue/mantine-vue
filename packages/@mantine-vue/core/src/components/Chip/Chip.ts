import { factory } from '../../core'
import { ChipGroup } from './ChipGroup/ChipGroup'
import ChipComponent, { varsResolver } from './Chip.vue'
import type { ChipFactory } from './Chip.types'
import classes from './Chip.module.css'

export const Chip = factory<ChipFactory>(ChipComponent, {
  classes,
  varsResolver,
  Group: ChipGroup,
})

export type {
  ChipCssVariables,
  ChipIconSlotProps,
  ChipOwnProps,
  ChipProps,
  ChipSlots,
  ChipStylesNames,
  ChipVariant,
  ChipFactory,
} from './Chip.types'
