import TooltipComponent, { varsResolver } from './Tooltip.vue'
import { TooltipFloating } from './TooltipFloating/TooltipFloating'
import { TooltipGroup } from './TooltipGroup/TooltipGroup'
import classes from './Tooltip.module.css'

export const Tooltip = Object.assign(TooltipComponent, {
  classes,
  varsResolver,
  Floating: TooltipFloating,
  Group: TooltipGroup,
})

export type { TooltipProps, TooltipSlots, TooltipStylesNames } from './Tooltip.types'
