import type { VNodeChild } from 'vue'
import type { BoxProps } from '@mantine-vue/core'
import LightboxCloseButton from './LightboxCloseButton.vue'
export { LightboxCloseButton }
export type LightboxCloseButtonStylesNames = 'closeButton'
export type LightboxCloseButtonProps = BoxProps
export interface LightboxCloseButtonSlots {
  default?: () => VNodeChild
}
