import type { InjectionKey } from 'vue'
import type { HoverCardGroupContextValue } from './HoverCardGroup.types'

export const HoverCardGroupKey: InjectionKey<HoverCardGroupContextValue> = Symbol('HoverCardGroup')
