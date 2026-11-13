export { Mentions } from './Mentions'
export type {
  MentionsCssVariables,
  MentionsEmits,
  MentionsOwnProps,
  MentionsProps,
  MentionsStylesNames,
} from './Mentions'

export { Mention, Mention as MentionsMention } from './Mention'
export type { MentionProps, MentionSlots } from './Mention'

export { getMentions } from './get-mentions'
export { createMarkupSerializer, DEFAULT_MENTION_MARKUP } from './utils/create-markup-serializer'
export { makeTriggerRegex } from './utils/make-trigger-regex'
export type { MakeTriggerRegexOptions } from './utils/make-trigger-regex'

export type {
  MentionItem,
  MentionDataFn,
  MentionDisplayTransform,
  MentionOccurrence,
  MentionResult,
  MentionSearchContext,
  MentionSerializer,
  MentionsChangePayload,
  MentionsChangeReason,
  MentionsChangeReasonType,
  MentionSelectionState,
  MentionsRenderMentionInput,
  MentionRenderSuggestionInput,
  MentionsFilter,
  MentionSourceConfig,
} from './Mentions.types'
