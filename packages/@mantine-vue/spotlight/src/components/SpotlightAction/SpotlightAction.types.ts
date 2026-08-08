import type { VNodeChild } from 'vue'
import type { MantineNode, SectionSlots } from '@mantine-vue/core'

export type SpotlightActionStylesNames =
  | 'action'
  | 'actionLabel'
  | 'actionDescription'
  | 'actionSection'
  | 'actionBody'

export interface SpotlightActionSlots extends SectionSlots {
  default?: () => VNodeChild
}

/** Props accepted by `SpotlightAction`. */
export interface SpotlightActionProps {
  /** Action label, pass string to use in default filter. */
  label?: string
  /** Action description, pass string to use in default filter. */
  description?: string
  /** Section displayed on the left side of the label, for example, icon. */
  leftSection?: MantineNode
  /** Section displayed on the right side of the label, for example, hotkey. */
  rightSection?: MantineNode
  /** Determines whether left and right sections should have dimmed styles. @default true */
  dimmedSections?: boolean
  /** Determines whether search query should be highlighted in action label. @default false */
  highlightQuery?: boolean
  /** Key of `theme.colors` or any valid CSS color that will be used to highlight search query. @default 'yellow' */
  highlightColor?: string
  /** Determines whether the spotlight should be closed when action is triggered, overrides `closeOnActionTrigger` prop set on `Spotlight`. */
  closeSpotlightOnTrigger?: boolean
  /** Keywords that are used for default filtering, not displayed anywhere, can be a string: "react,router,javascript" or an array: ['react', 'router', 'javascript']. */
  keywords?: string | string[]
  /** CSS classes applied to component elements. */
  classNames?: Record<string, any>
  /** Inline styles applied to component elements. */
  styles?: Record<string, any>
  /** CSS variables applied to component elements. */
  vars?: Record<string, any>
  [key: string]: any
}
