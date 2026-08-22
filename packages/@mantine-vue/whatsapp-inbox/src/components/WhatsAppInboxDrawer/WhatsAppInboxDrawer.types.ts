import type { BoxProps, DrawerProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { ForwardedProps, WhatsAppConversationSlots } from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type {
  WhatsAppConversationEmits,
  WhatsAppConversationOwnProps,
  WhatsAppConversationStylesNames,
} from '../WhatsAppConversation'

export type WhatsAppInboxDrawerStylesNames =
  | 'drawerRoot'
  | 'drawerContent'
  | 'drawerBody'
  | WhatsAppConversationStylesNames

/** Conversation props the drawer forwards. */
export type WhatsAppInboxDrawerConversationProps = Omit<
  WhatsAppConversationOwnProps,
  'classNames' | 'styles' | 'vars' | 'unstyled' | 'labels'
>

export interface WhatsAppInboxDrawerOwnProps
  extends StylesApiProps<WhatsAppInboxDrawerFactory>, WhatsAppInboxDrawerConversationProps {
  /** Whether the drawer is open. Bind it with `v-model:opened`. */
  opened?: boolean

  /**
   * Side the drawer slides in from.
   * @default 'right'
   */
  position?: DrawerProps['position']

  /**
   * Width of the drawer.
   * @default 'md'
   */
  size?: DrawerProps['size']

  /**
   * Title of the drawer. Falls back to the contact name, so the drawer always has an accessible
   * name even when nothing is passed.
   */
  title?: string

  /**
   * Moves focus to the composer when the drawer opens.
   * @default true
   */
  focusComposerOnOpen?: boolean

  /** Props passed to the underlying `Drawer`. */
  drawerProps?: ForwardedProps<DrawerProps>

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppInboxDrawerProps
  extends Omit<BoxProps, keyof WhatsAppInboxDrawerOwnProps>, WhatsAppInboxDrawerOwnProps {}

export interface WhatsAppInboxDrawerEmits extends WhatsAppConversationEmits {
  /** Emitted when the opened state changes. */
  'update:opened': [opened: boolean]

  /** Emitted when the drawer is dismissed. */
  close: []
}

export type WhatsAppInboxDrawerFactory = Factory<{
  props: Omit<WhatsAppInboxDrawerProps, 'rootRef'>
  slots: WhatsAppConversationSlots
  emits: WhatsAppInboxDrawerEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppInboxDrawerStylesNames
}>
