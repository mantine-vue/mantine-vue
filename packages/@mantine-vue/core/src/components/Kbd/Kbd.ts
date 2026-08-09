import { withBoxProps } from '../../core'
import KbdComponent from './Kbd.vue'

export const Kbd = withBoxProps(KbdComponent)

export type { KbdCssVariables, KbdOwnProps, KbdProps, KbdSlots, KbdStylesNames } from './Kbd.types'
