import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  ForwardedProps,
  MessageRenderers,
  WhatsAppContactPanelSlots,
  WhatsAppConversationListSlots,
  WhatsAppConversationSlots,
} from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type {
  WhatsAppConversationData,
  WhatsAppConversationSummary,
  WhatsAppInboxFilters,
  WhatsAppInboxFiltersConfig,
  WhatsAppLoadMorePayload,
  WhatsAppNewConversationPayload,
  WhatsAppPaginationState,
} from '../../types'
import type {
  WhatsAppContactPanelProps,
  WhatsAppContactPanelStylesNames,
} from '../WhatsAppContactPanel'
import type {
  WhatsAppConversationEmits,
  WhatsAppConversationOwnProps,
  WhatsAppConversationStylesNames,
} from '../WhatsAppConversation'
import type {
  WhatsAppConversationListProps,
  WhatsAppConversationListStylesNames,
  WhatsAppConversationOrder,
} from '../WhatsAppConversationList'

export type WhatsAppInboxStylesNames =
  | 'inboxRoot'
  | 'inboxSidebar'
  | 'inboxMain'
  | 'inboxPanel'
  | WhatsAppConversationListStylesNames
  | WhatsAppConversationStylesNames
  | WhatsAppContactPanelStylesNames

/**
 * How the three panes are arranged.
 *
 * `auto` measures the component itself rather than the viewport, so an inbox embedded in a
 * narrow column collapses to a single pane even on a wide screen.
 */
export type WhatsAppInboxLayout = 'auto' | 'split' | 'single'

export interface WhatsAppInboxSlots
  extends WhatsAppConversationListSlots, WhatsAppConversationSlots, WhatsAppContactPanelSlots {}

/**
 * Props of the conversation pane that `WhatsAppInbox` forwards.
 *
 * The list-related props are declared by the inbox itself, so the conversation props it accepts
 * are everything except the ones it owns.
 */
export type WhatsAppInboxConversationProps = Omit<
  WhatsAppConversationOwnProps,
  | 'conversation'
  | 'conversationId'
  | 'withBack'
  | 'withContactToggle'
  | 'contactPanelOpened'
  | 'labels'
  | 'classNames'
  | 'styles'
  | 'vars'
  | 'unstyled'
>

export interface WhatsAppInboxOwnProps
  extends StylesApiProps<WhatsAppInboxFactory>, WhatsAppInboxConversationProps, MessageRenderers {
  /** Conversations shown in the sidebar. */
  conversations?: WhatsAppConversationSummary[]

  /** Controlled id of the selected conversation. */
  selectedConversationId?: string | null

  /** Uncontrolled initial selection. */
  defaultSelectedConversationId?: string | null

  /**
   * The opened conversation, with its capabilities. Falls back to the matching entry of
   * `conversations`, which is enough when the summary already carries everything.
   */
  conversation?: WhatsAppConversationData

  /** Controlled filter state. */
  filters?: WhatsAppInboxFilters

  /** Uncontrolled initial filter state. */
  defaultFilters?: WhatsAppInboxFilters

  /** Which filter controls the sidebar renders. */
  filtersConfig?: WhatsAppInboxFiltersConfig

  /** Whether the initial conversation list load is in flight. */
  conversationsLoading?: boolean

  /** Failure of the last conversation list load. */
  conversationsError?: string | null

  /** Cursor state of the conversation list pagination. */
  conversationsPagination?: WhatsAppPaginationState

  /**
   * Display order of the supplied conversations.
   * @default 'none'
   */
  order?: WhatsAppConversationOrder

  /**
   * Pane arrangement.
   * @default 'auto'
   */
  layout?: WhatsAppInboxLayout

  /**
   * Width below which `layout: 'auto'` collapses to a single pane, in pixels.
   * @default 720
   */
  narrowBreakpoint?: number

  /** Width of the conversation list pane, any valid CSS length. */
  sidebarWidth?: string | number

  /** Width of the contact panel, any valid CSS length. */
  contactPanelWidth?: string | number

  /**
   * Renders the contact panel and the header control that toggles it.
   * @default false
   */
  withContactPanel?: boolean

  /** Controlled opened state of the contact panel. */
  contactPanelOpened?: boolean

  /** Uncontrolled initial opened state of the contact panel. */
  defaultContactPanelOpened?: boolean

  /** Props passed to the underlying `WhatsAppConversationList`. */
  conversationListProps?: ForwardedProps<WhatsAppConversationListProps>

  /** Props passed to the underlying `WhatsAppContactPanel`. */
  contactPanelProps?: ForwardedProps<WhatsAppContactPanelProps>

  /**
   * Renders the control that starts a conversation with a number that is not in the list yet.
   * @default false
   */
  withNewConversation?: boolean

  /** Controlled opened state of the new-conversation form. */
  newConversationOpened?: boolean

  /** Whether the consumer is still creating or looking up the conversation. */
  newConversationCreating?: boolean

  /** Failure of the last new-conversation attempt, rendered inside the form. */
  newConversationError?: string | null

  /** Validates the phone number before `newConversation` is emitted. */
  validatePhoneNumber?: (phoneNumber: string) => string | null

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppInboxProps
  extends Omit<BoxProps, keyof WhatsAppInboxOwnProps>, WhatsAppInboxOwnProps {}

export interface WhatsAppInboxEmits extends WhatsAppConversationEmits {
  /** Emitted when the selected conversation changes. */
  'update:selectedConversationId': [conversationId: string | null]

  /** Emitted when any filter changes. */
  'update:filters': [filters: WhatsAppInboxFilters]

  /** Emitted when the contact panel is opened or closed. */
  'update:contactPanelOpened': [opened: boolean]

  /** Emitted when a conversation is picked, with the full record. */
  selectConversation: [conversation: WhatsAppConversationSummary]

  /** Emitted when the next page of conversations should be fetched. */
  loadMoreConversations: [payload: WhatsAppLoadMorePayload]

  /** Emitted when the retry action of the conversation list error state is used. */
  retryLoadConversations: []

  /** Emitted when the opened state of the new-conversation form changes. */
  'update:newConversationOpened': [opened: boolean]

  /**
   * Emitted when the user submits a phone number to start a conversation with. Create or look up
   * the conversation, then select it by updating `selectedConversationId`.
   */
  newConversation: [payload: WhatsAppNewConversationPayload]
}

export interface WhatsAppInboxExposed {
  /** Moves focus to the composer input. */
  focusComposer: () => void

  /** Scrolls the history to the newest message. */
  scrollToBottom: (behavior?: ScrollBehavior) => void
}

export type WhatsAppInboxFactory = Factory<{
  props: Omit<WhatsAppInboxProps, 'rootRef'>
  slots: WhatsAppInboxSlots
  emits: WhatsAppInboxEmits
  exposed: WhatsAppInboxExposed
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppInboxStylesNames
}>
