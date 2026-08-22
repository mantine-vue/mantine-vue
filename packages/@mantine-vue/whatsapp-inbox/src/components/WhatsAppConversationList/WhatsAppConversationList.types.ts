import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppConversationListSlots } from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type {
  WhatsAppConversationSummary,
  WhatsAppInboxFilters,
  WhatsAppInboxFiltersConfig,
  WhatsAppLoadMorePayload,
  WhatsAppNewConversationPayload,
  WhatsAppPaginationState,
} from '../../types'
import type { WhatsAppConversationListItemStylesNames } from '../WhatsAppConversationListItem'

export type WhatsAppConversationListStylesNames =
  | 'conversationListRoot'
  | 'conversationListHeader'
  | 'conversationListTitleRow'
  | 'conversationListTitle'
  | 'conversationListNewButton'
  | 'newConversationForm'
  | 'newConversationActions'
  | 'conversationListSearch'
  | 'conversationListFilters'
  | 'conversationListScrollArea'
  | 'conversationListItems'
  | 'conversationListItemWrapper'
  | 'conversationListState'
  | 'conversationListLoadMore'
  | 'conversationListFooter'
  | WhatsAppConversationListItemStylesNames

/**
 * Order the list renders conversations in.
 *
 * `none` keeps the array exactly as supplied, which is the default: a backend that already
 * sorted by relevance, priority or a custom queue must not be silently reordered by the UI.
 */
export type WhatsAppConversationOrder = 'none' | 'activity'

export interface WhatsAppConversationListOwnProps extends StylesApiProps<WhatsAppConversationListFactory> {
  /** Conversations to render. */
  conversations?: WhatsAppConversationSummary[]

  /** Controlled id of the selected conversation. */
  selectedConversationId?: string | null

  /** Uncontrolled initial selection. */
  defaultSelectedConversationId?: string | null

  /** Controlled filter state. */
  filters?: WhatsAppInboxFilters

  /** Uncontrolled initial filter state. */
  defaultFilters?: WhatsAppInboxFilters

  /**
   * Which filter controls are rendered. Controls whose options are not supplied stay hidden, so
   * a backend that cannot answer a filter never shows it.
   */
  filtersConfig?: WhatsAppInboxFiltersConfig

  /** Whether the initial load is in flight. */
  loading?: boolean

  /** Failure of the last load. Renders the error state with a retry action. */
  error?: string | null

  /** Cursor state of the pagination. */
  pagination?: WhatsAppPaginationState

  /**
   * Display order of the supplied array.
   * @default 'none'
   */
  order?: WhatsAppConversationOrder

  /**
   * Renders the title and the filter controls.
   * @default true
   */
  withHeader?: boolean

  /**
   * Emits `loadMore` when the user scrolls near the end of the list. Turn it off to rely on the
   * explicit load-more control alone.
   * @default true
   */
  withInfiniteScroll?: boolean

  /**
   * Distance in pixels from the end at which `loadMore` is emitted.
   * @default 160
   */
  loadMoreThreshold?: number

  /** Title rendered above the search field. Falls back to the label. */
  title?: string

  /**
   * Renders the control that starts a conversation with a number that is not in the list yet.
   * @default false
   */
  withNewConversation?: boolean

  /** Controlled opened state of the new-conversation form. */
  newConversationOpened?: boolean

  /** Whether the consumer is still creating or looking up the conversation. */
  newConversationCreating?: boolean

  /**
   * Failure of the last attempt, rendered inside the form. Use it for backend rules the
   * frontend cannot check, such as an opt-in that is missing.
   */
  newConversationError?: string | null

  /**
   * Validates the phone number before `newConversation` is emitted. Return an error message to
   * reject it, or `null` to accept.
   *
   * Defaults to a permissive digit-count check: the authoritative rules belong to the provider,
   * and a frontend that guessed at national formats would reject numbers the backend accepts.
   */
  validatePhoneNumber?: (phoneNumber: string) => string | null

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppConversationListProps
  extends
    Omit<BoxProps, keyof WhatsAppConversationListOwnProps>,
    WhatsAppConversationListOwnProps {}

export interface WhatsAppConversationListEmits {
  /** Emitted when the selected conversation changes. */
  'update:selectedConversationId': [conversationId: string | null]

  /** Emitted when any filter changes. */
  'update:filters': [filters: WhatsAppInboxFilters]

  /** Emitted when a conversation is picked, with the full record. */
  select: [conversation: WhatsAppConversationSummary]

  /** Emitted when the next page should be fetched. */
  loadMore: [payload: WhatsAppLoadMorePayload]

  /** Emitted when the retry action of the error state is used. */
  retryLoad: []

  /** Emitted when the opened state of the new-conversation form changes. */
  'update:newConversationOpened': [opened: boolean]

  /**
   * Emitted when the user submits a phone number to start a conversation with. Create or look up
   * the conversation, then select it by updating `selectedConversationId`.
   */
  newConversation: [payload: WhatsAppNewConversationPayload]
}

export type WhatsAppConversationListFactory = Factory<{
  props: Omit<WhatsAppConversationListProps, 'rootRef'>
  slots: WhatsAppConversationListSlots
  emits: WhatsAppConversationListEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppConversationListStylesNames
}>
