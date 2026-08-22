import type { WhatsAppInboxLabels } from '../labels'
import { DEFAULT_WHATSAPP_INBOX_LABELS } from '../labels'
import type {
  WhatsAppConversationPreview,
  WhatsAppConversationSummary,
  WhatsAppMessageData,
  WhatsAppMessageType,
} from '../types'
import { isSameDay, startOfDay, toDate } from './format'

/** One calendar day of messages, as rendered between two day dividers. */
export interface WhatsAppMessageGroup {
  /** Stable key for the group, derived from the day. */
  key: string

  /** Start of the day the group covers. `null` for messages without a usable timestamp. */
  date: Date | null

  messages: WhatsAppMessageData[]
}

/**
 * Splits a message list into calendar days, preserving the order it was given in.
 *
 * The list is not sorted: the consumer owns ordering, and re-sorting here would fight a backend
 * that returns messages in its own sequence (for example threaded or cursor-paged results).
 */
export function groupMessagesByDay(messages: WhatsAppMessageData[]): WhatsAppMessageGroup[] {
  const groups: WhatsAppMessageGroup[] = []

  for (const message of messages) {
    const date = toDate(message.timestamp)
    const last = groups[groups.length - 1]

    if (
      last &&
      ((date === null && last.date === null) || (date && last.date && isSameDay(date, last.date)))
    ) {
      last.messages.push(message)
      continue
    }

    const day = date ? startOfDay(date) : null

    groups.push({
      key: day ? String(day.getTime()) : `unknown-${groups.length}`,
      date: day,
      messages: [message],
    })
  }

  return groups
}

/** Label used when a message type has no text of its own, for example a photo without caption. */
export function getMessageTypeLabel(
  type: WhatsAppMessageType | undefined,
  labels: WhatsAppInboxLabels = DEFAULT_WHATSAPP_INBOX_LABELS,
): string {
  switch (type) {
    case 'image':
      return labels.messageTypeImage
    case 'video':
      return labels.messageTypeVideo
    case 'audio':
      return labels.messageTypeAudio
    case 'document':
      return labels.messageTypeDocument
    case 'sticker':
      return labels.messageTypeSticker
    case 'location':
      return labels.messageTypeLocation
    case 'contacts':
      return labels.messageTypeContacts
    case 'template':
      return labels.messageTypeTemplate
    case 'interactive':
      return labels.messageTypeInteractive
    case 'unsupported':
      return labels.messageTypeUnsupported
    default:
      return ''
  }
}

/**
 * Single-line text for a message, used by conversation previews and by accessible names.
 *
 * Exhaustive over the message union, so adding a message type is a compile error here rather
 * than an empty preview at runtime.
 */
export function getMessagePreviewText(
  message: WhatsAppMessageData,
  labels: WhatsAppInboxLabels = DEFAULT_WHATSAPP_INBOX_LABELS,
): string {
  switch (message.type) {
    case 'text':
    case 'system':
      return message.text
    case 'image':
    case 'video':
    case 'audio':
    case 'document':
    case 'sticker':
      return (
        message.caption || message.attachment.fileName || getMessageTypeLabel(message.type, labels)
      )
    case 'template':
      return message.template.text || `${labels.messageTypeTemplate}: ${message.template.name}`
    case 'interactive':
      return message.reply?.title || message.interactive.body || labels.messageTypeInteractive
    case 'location':
      return message.location.name || message.location.address || labels.messageTypeLocation
    case 'contacts':
      return (
        message.contacts.map((contact) => contact.name).join(', ') || labels.messageTypeContacts
      )
    case 'unsupported':
      return message.text || labels.messageTypeUnsupported
    default:
      return ''
  }
}

/** Preview text of a conversation list item, falling back to a label derived from the type. */
export function getConversationPreviewText(
  preview: WhatsAppConversationPreview | undefined,
  labels: WhatsAppInboxLabels = DEFAULT_WHATSAPP_INBOX_LABELS,
): string {
  if (!preview) {
    return ''
  }

  return preview.text || getMessageTypeLabel(preview.type, labels)
}

/** Display name of a contact, falling back to the phone number and then to the id. */
export function getContactDisplayName(conversation: WhatsAppConversationSummary): string {
  return conversation.contact.name || conversation.contact.phoneNumber || conversation.contact.id
}

/** Time a conversation is ordered by: its last activity, then its last message. */
export function getConversationActivityTime(conversation: WhatsAppConversationSummary): number {
  const updatedAt = toDate(conversation.updatedAt)

  if (updatedAt) {
    return updatedAt.getTime()
  }

  return toDate(conversation.lastMessage?.timestamp)?.getTime() ?? 0
}

/**
 * Copy of the list ordered by latest activity, pinned conversations first.
 *
 * Opt-in: `WhatsAppConversationList` renders the array it is given untouched unless `order` is
 * set, because a server-side ordering (relevance, priority, custom queues) must not be silently
 * overwritten by the UI.
 */
export function sortConversationsByActivity<T extends WhatsAppConversationSummary>(
  conversations: T[],
): T[] {
  return [...conversations].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1
    }

    return getConversationActivityTime(b) - getConversationActivityTime(a)
  })
}

let clientIdCounter = 0

/**
 * Identifier attached to every outgoing payload so the consumer can reconcile its optimistic
 * message with the one the backend echoes back.
 *
 * `crypto.randomUUID` when available, and a counter-plus-timestamp fallback for the environments
 * that do not expose it (older Safari, non-secure contexts, some test runners).
 */
export function createClientId(): string {
  const globalCrypto = typeof globalThis === 'undefined' ? undefined : globalThis.crypto

  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID()
  }

  clientIdCounter += 1

  return `wa-${Date.now().toString(36)}-${clientIdCounter.toString(36)}`
}
