import { computed, inject, provide, type InjectionKey } from 'vue'
import {
  DEFAULT_WHATSAPP_INBOX_LABELS,
  mergeWhatsAppLabels,
  type WhatsAppInboxLabels,
  type WhatsAppInboxLabelsOverride,
} from './labels'
import type {
  WhatsAppConversationData,
  WhatsAppResolvedCapabilities,
  WhatsAppTimestamp,
} from './types'
import {
  formatConversationTime,
  formatDayLabel,
  formatFileSize,
  formatFullTimestamp,
  formatMessageTime,
  resolveCapabilities,
} from './utils'

/**
 * Date, time and size formatting used across the inbox.
 *
 * Every formatter is replaceable for applications that use another date library or timezone.
 */
export interface WhatsAppInboxFormatters {
  /** Time shown under a message bubble. */
  messageTime: (value: WhatsAppTimestamp, locale: string | undefined) => string

  /** Full date and time, used for tooltips and screen-reader text. */
  fullTimestamp: (value: WhatsAppTimestamp, locale: string | undefined) => string

  /** Day divider label in the message list. */
  dayLabel: (
    value: WhatsAppTimestamp,
    locale: string | undefined,
    labels: WhatsAppInboxLabels,
  ) => string

  /** Timestamp column of a conversation list item. */
  conversationTime: (
    value: WhatsAppTimestamp | undefined,
    locale: string | undefined,
    labels: WhatsAppInboxLabels,
  ) => string

  /** Human readable file size. */
  fileSize: (bytes: number | undefined) => string
}

/** Built-in `Intl` based formatters. */
export const DEFAULT_WHATSAPP_INBOX_FORMATTERS: WhatsAppInboxFormatters = {
  messageTime: (value, locale) => formatMessageTime(value, locale),
  fullTimestamp: (value, locale) => formatFullTimestamp(value, locale),
  dayLabel: (value, locale, labels) => formatDayLabel(value, locale, labels),
  conversationTime: (value, locale, labels) => formatConversationTime(value, locale, labels),
  fileSize: (bytes) => formatFileSize(bytes),
}

/** Shared configuration published by `WhatsAppInboxProvider`. */
export interface WhatsAppInboxConfigSource {
  readonly labels: WhatsAppInboxLabelsOverride | undefined
  readonly locale: string | undefined
  readonly formatters: Partial<WhatsAppInboxFormatters> | undefined
}

/**
 * Resolved configuration, as every component consumes it.
 *
 * `labels` is already merged, and each formatter is bound to the resolved locale and labels, so
 * a component calls `config.messageTime(value)` without threading either through.
 */
export interface WhatsAppInboxConfig {
  readonly labels: WhatsAppInboxLabels
  readonly locale: string | undefined
  messageTime: (value: WhatsAppTimestamp) => string
  fullTimestamp: (value: WhatsAppTimestamp) => string
  dayLabel: (value: WhatsAppTimestamp) => string
  conversationTime: (value: WhatsAppTimestamp | undefined) => string
  fileSize: (bytes: number | undefined) => string
}

const WhatsAppInboxConfigKey: InjectionKey<WhatsAppInboxConfigSource> = Symbol(
  'mantine-whatsapp-inbox-config',
)

/** Publishes shared inbox configuration to every component below. */
export function provideWhatsAppInboxConfig(value: WhatsAppInboxConfigSource) {
  provide(WhatsAppInboxConfigKey, value)
}

/**
 * Reads the inbox configuration, merging a component's own `labels` and `locale` over it.
 *
 * Components outside a `WhatsAppInboxProvider` use the English defaults.
 */
export function useWhatsAppInboxConfig(
  labelsOverride?: () => WhatsAppInboxLabelsOverride | undefined,
  localeOverride?: () => string | undefined,
): WhatsAppInboxConfig {
  const source = inject(WhatsAppInboxConfigKey, undefined)

  const labels = computed(() => {
    const own = labelsOverride?.()
    const inherited = source?.labels

    if (!own && !inherited) {
      return DEFAULT_WHATSAPP_INBOX_LABELS
    }

    return mergeWhatsAppLabels(inherited, own)
  })

  const locale = computed(() => localeOverride?.() ?? source?.locale)

  const formatters = computed<WhatsAppInboxFormatters>(() =>
    source?.formatters
      ? { ...DEFAULT_WHATSAPP_INBOX_FORMATTERS, ...source.formatters }
      : DEFAULT_WHATSAPP_INBOX_FORMATTERS,
  )

  return {
    get labels() {
      return labels.value
    },
    get locale() {
      return locale.value
    },
    messageTime: (value) => formatters.value.messageTime(value, locale.value),
    fullTimestamp: (value) => formatters.value.fullTimestamp(value, locale.value),
    dayLabel: (value) => formatters.value.dayLabel(value, locale.value, labels.value),
    conversationTime: (value) =>
      value === undefined
        ? ''
        : formatters.value.conversationTime(value, locale.value, labels.value),
    fileSize: (bytes) => formatters.value.fileSize(bytes),
  }
}

/**
 * The conversation the surrounding `WhatsAppConversation` is showing.
 *
 * Lets a consumer build a custom layout out of the primitives without re-passing the
 * conversation and its capabilities to each one. Every consumer of this context still accepts
 * the same values as props, and props always win.
 */
export interface WhatsAppConversationContextValue {
  readonly conversation: WhatsAppConversationData | undefined
  readonly conversationId: string | undefined
  readonly capabilities: WhatsAppResolvedCapabilities
}

const WhatsAppConversationKey: InjectionKey<WhatsAppConversationContextValue> = Symbol(
  'mantine-whatsapp-conversation',
)

export function provideWhatsAppConversationContext(value: WhatsAppConversationContextValue) {
  provide(WhatsAppConversationKey, value)
}

/** Reads the surrounding conversation, or `undefined` outside a `WhatsAppConversation`. */
export function useWhatsAppConversationContext(): WhatsAppConversationContextValue | undefined {
  return inject(WhatsAppConversationKey, undefined)
}

/**
 * Resolves the capabilities a component should apply: its own prop when set, the surrounding
 * conversation's otherwise.
 */
export function useResolvedCapabilities(
  ownCapabilities: () => WhatsAppConversationData['capabilities'] | undefined,
  hasOwnCapabilities: () => boolean = () => ownCapabilities() !== undefined,
) {
  const context = useWhatsAppConversationContext()

  return computed<WhatsAppResolvedCapabilities>(() =>
    hasOwnCapabilities() || !context
      ? resolveCapabilities(ownCapabilities())
      : context.capabilities,
  )
}
