import { defineComponent, type CSSProperties, type PropType, type VNodeChild } from 'vue'
import type {
  MentionDataFn,
  MentionDisplayTransform,
  MentionItem,
  MentionRenderSuggestionInput,
  MentionSerializer,
} from './Mentions.types'

export interface MentionProps {
  /** Character(s) or pattern that opens this source's dropdown. A `RegExp` with fewer than two capture groups matches the trigger itself (for example `/[@#]/`) and the query is everything after it up to a whitespace. A `RegExp` with two or more capture groups is used as is: it must be anchored to the end of the text (`$`), group 1 must capture the trigger and the query, group 2 the query @default '@' */
  trigger?: string | RegExp

  /** Static array of suggestions or a sync/async function that returns matches */
  data?: MentionItem[] | MentionDataFn

  /** Template controlling how this mention is stored in the value, or a full serializer @default `${trigger}[__display__](__id__)` */
  markup?: string | MentionSerializer

  /** Customizes the visible text of a stored mention @default (_, display) => display */
  displayTransform?: MentionDisplayTransform

  /** If set, the trigger character is kept as a prefix in the visible text of the mention @default false */
  withTrigger?: boolean

  /** Custom function to render a suggestion row, the `suggestion` slot can be used instead */
  renderSuggestion?: (input: MentionRenderSuggestionInput) => VNodeChild

  /** Custom empty state for this source, the `empty` slot can be used instead */
  renderEmpty?: (query: string) => VNodeChild

  /** Custom error state when an async `data` function rejects, the `error` slot can be used instead */
  renderError?: (query: string, error: unknown) => VNodeChild

  /** Called when a suggestion from this source is inserted, `startPos` and `endPos` are plain-text indices of the replaced trigger and query */
  onAdd?: (item: { id: string; display: string; startPos: number; endPos: number }) => void

  /** If set, a space is appended after inserting a mention @default false */
  appendSpaceOnAdd?: boolean

  /** Debounce async `data` calls, in milliseconds @default 0 */
  debounceMs?: number

  /** Maximum number of suggestions rendered from array results */
  maxSuggestions?: number

  /** If set, the query is allowed to contain whitespace @default false */
  allowSpaceInQuery?: boolean

  /** If set, accents are ignored when the query is matched against array data @default false */
  ignoreAccents?: boolean

  /** Class name applied to this source's mentions in the overlay */
  className?: string

  /** Styles applied to this source's mentions in the overlay */
  style?: CSSProperties | string
}

export interface MentionSlots {
  /** Custom suggestion row */
  suggestion?: (input: MentionRenderSuggestionInput) => VNodeChild
  /** Custom empty state */
  empty?: (input: { query: string }) => VNodeChild
  /** Custom error state */
  error?: (input: { query: string; error: unknown }) => VNodeChild
}

/**
 * Configuration component that declares a single mention data source. It renders nothing – the parent
 * `Mentions` component reads its props and slots to configure a trigger, its data and how its mentions
 * are serialized. Theme `defaultProps` and Styles API do not apply to it.
 */
export const Mention = defineComponent({
  name: 'MentionsMention',
  props: {
    trigger: { type: [String, RegExp] as PropType<MentionProps['trigger']>, default: undefined },
    data: { type: [Array, Function] as PropType<MentionProps['data']>, default: undefined },
    markup: { type: [String, Object] as PropType<MentionProps['markup']>, default: undefined },
    displayTransform: Function as PropType<MentionProps['displayTransform']>,
    withTrigger: { type: Boolean, default: undefined },
    renderSuggestion: Function as PropType<MentionProps['renderSuggestion']>,
    renderEmpty: Function as PropType<MentionProps['renderEmpty']>,
    renderError: Function as PropType<MentionProps['renderError']>,
    onAdd: Function as PropType<MentionProps['onAdd']>,
    appendSpaceOnAdd: { type: Boolean, default: undefined },
    debounceMs: Number,
    maxSuggestions: Number,
    allowSpaceInQuery: { type: Boolean, default: undefined },
    ignoreAccents: { type: Boolean, default: undefined },
    className: String,
  },
  setup() {
    return () => null
  },
})
