import type {
  WhatsAppConversationCapabilities,
  WhatsAppMediaType,
  WhatsAppMessagingWindow,
  WhatsAppResolvedCapabilities,
} from '../types'

/** Media types offered when `canSendMedia` is set but `allowedMediaTypes` is not. */
export const DEFAULT_ALLOWED_MEDIA_TYPES: WhatsAppMediaType[] = [
  'image',
  'video',
  'audio',
  'document',
]

/** Window state assumed when the backend did not report one. */
export const UNKNOWN_MESSAGING_WINDOW: WhatsAppMessagingWindow = { state: 'unknown' }

/**
 * Fills in every capability default once, so no component repeats them.
 *
 * The only rule the frontend applies is the one it can apply safely: a *closed* window, as
 * reported by the backend, turns free-form messaging off. Whether the window is closed is never
 * derived from timestamps here — `state: 'unknown'` deliberately leaves the composer usable
 * rather than guessing at WhatsApp's 24-hour rule.
 */
export function resolveCapabilities(
  capabilities: WhatsAppConversationCapabilities | undefined,
): WhatsAppResolvedCapabilities {
  const messagingWindow = capabilities?.messagingWindow ?? UNKNOWN_MESSAGING_WINDOW
  const windowClosed = messagingWindow.state === 'closed'

  const canSendMedia = capabilities?.canSendMedia ?? false
  const canSendFreeForm = (capabilities?.canSendFreeForm ?? true) && !windowClosed
  const canSendTemplates = capabilities?.canSendTemplates ?? false
  const canSendInteractive = (capabilities?.canSendInteractive ?? false) && !windowClosed

  return {
    canSendFreeForm,
    canSendTemplates,
    // Media is part of free-form messaging as far as the window is concerned.
    canSendMedia: canSendMedia && !windowClosed,
    canSendInteractive,
    canUseEmoji: capabilities?.canUseEmoji ?? false,
    canReplyToMessage: capabilities?.canReplyToMessage ?? false,
    canRetryFailed: capabilities?.canRetryFailed ?? true,
    allowedMediaTypes: capabilities?.allowedMediaTypes ?? DEFAULT_ALLOWED_MEDIA_TYPES,
    interactiveTypes: capabilities?.interactiveTypes ?? [],
    maxTextLength: capabilities?.maxTextLength,
    mediaConstraints: capabilities?.mediaConstraints ?? {},
    messagingWindow,
    disabledReason: capabilities?.disabledReason,
    windowClosed,
    canSendAnything:
      canSendFreeForm || canSendTemplates || (canSendMedia && !windowClosed) || canSendInteractive,
  }
}
