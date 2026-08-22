export {
  formatConversationTime,
  formatDayLabel,
  formatDuration,
  formatFileSize,
  formatFullTimestamp,
  formatMessageTime,
  isSameDay,
  startOfDay,
  toDate,
} from './format'

export {
  DEFAULT_ALLOWED_MEDIA_TYPES,
  UNKNOWN_MESSAGING_WINDOW,
  resolveCapabilities,
} from './capabilities'

export {
  createClientId,
  getContactDisplayName,
  getConversationActivityTime,
  getConversationPreviewText,
  getMessagePreviewText,
  getMessageTypeLabel,
  groupMessagesByDay,
  sortConversationsByActivity,
} from './messages'
export type { WhatsAppMessageGroup } from './messages'

export {
  createEmptyTemplateValues,
  extractPlaceholders,
  filterTemplates,
  getTemplateBody,
  getTemplateButtons,
  getTemplateFooter,
  getTemplateHeader,
  getTemplateParameters,
  isTemplateSendable,
  renderTemplateText,
  validateTemplateValues,
} from './templates'
export type {
  WhatsAppTemplateButtonParameters,
  WhatsAppTemplateErrors,
  WhatsAppTemplateParameters,
  WhatsAppTemplateValidation,
} from './templates'

export {
  MAX_PHONE_NUMBER_DIGITS,
  MIN_PHONE_NUMBER_DIGITS,
  isValidPhoneNumber,
  normalizePhoneNumber,
} from './phone'

export {
  DEFAULT_MEDIA_ACCEPT,
  getAcceptAttribute,
  getMediaTypeFromMime,
  matchesAccept,
  validateFiles,
} from './media'
export type { ValidateFilesInput, ValidateFilesResult } from './media'
