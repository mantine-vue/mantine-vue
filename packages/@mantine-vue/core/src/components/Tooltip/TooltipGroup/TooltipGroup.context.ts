import type { InjectionKey } from 'vue'
import type { TooltipGroupContextValue } from './TooltipGroup.types'

export const TooltipGroupKey: InjectionKey<TooltipGroupContextValue> = Symbol('TooltipGroup')
