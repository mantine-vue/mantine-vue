import type { BoxProps } from '@mantine-vue/core'
import type { ToolbarItems } from '../types'
import LightboxToolbar from './LightboxToolbar.vue'
export { LightboxToolbar }
export * from './toolbar-items'
export type LightboxToolbarStylesNames = 'toolbar' | 'toolbarGroup' | 'toolbarButton' | 'counter'
export interface LightboxToolbarProps extends BoxProps {
  toolbarItems?: ToolbarItems
}
