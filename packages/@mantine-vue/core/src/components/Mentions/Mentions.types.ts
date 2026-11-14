/** A single suggestion item associated with a `Mentions.Mention` data source */
export interface MentionItem {
  /** Unique identifier of the item, stored in the markup value */
  id: string

  /** Text displayed to the user, defaults to `id` when not set */
  display?: string

  /** Any additional data associated with the item */
  [key: string]: any
}

/** Function that transforms the display text of a stored mention */
export type MentionDisplayTransform = (id: string, display: string) => string

/** Custom serializer used to store and parse mentions in formats a template string cannot express */
export interface MentionSerializer {
  /** Unique serializer id, usually the markup template it is built from */
  id: string

  /** Returns the markup string stored in the value for the given item */
  insert: (input: { id: string | number; display: string }) => string

  /** Finds all mentions produced by this serializer in the given value */
  findAll: (
    value: string,
  ) => Array<{ markup: string; index: number; id: string; display?: string | null }>
}

/** Context passed to an async/sync `data` function */
export interface MentionSearchContext {
  /** Aborted automatically when the request becomes stale */
  signal: AbortSignal
}

/** Result returned by a `data` function */
export type MentionResult = MentionItem[] | { items: MentionItem[] }

/** Function based on which suggestions are resolved, can be sync or async */
export type MentionDataFn = (
  query: string,
  ctx: MentionSearchContext,
) => MentionResult | Promise<MentionResult>

/** Mention occurrence extracted from a markup value */
export interface MentionOccurrence {
  /** Mention id stored in the value */
  id: string

  /** Mention display text */
  display: string

  /** Index of the mention in the markup string */
  index: number

  /** Index of the mention in the plain-text string */
  plainTextIndex: number

  /** Trigger of the `Mentions.Mention` that produced the occurrence */
  trigger: string
}

/** Type of the change that produced a new value */
export type MentionsChangeReasonType =
  | 'input'
  | 'paste'
  | 'cut'
  | 'mention-add'
  | 'mention-remove'
  | 'insert-text'
  | 'undo'
  | 'redo'

/** Information about what caused a value change */
export interface MentionsChangeReason {
  /** Type of the change */
  type: MentionsChangeReasonType

  /** Native event that caused the change, not set when the change has no DOM event (mention insertion, keyboard undo/redo) */
  nativeEvent?: Event
}

/** Payload passed to the `Mentions` `onChange` handler */
export interface MentionsChangePayload {
  /** Latest markup value, for example `Hey @[Walter White](walter)` */
  value: string

  /** Text visible to the user, for example `Hey @Walter White` */
  plainTextValue: string

  /** Plain text with each display replaced by its id, for example `Hey @walter` */
  idValue: string

  /** Mentions present in the new value */
  mentions: MentionOccurrence[]

  /** Id of the mention that triggered the change, if any */
  mentionId?: string

  /** Previous markup value */
  previousValue: string

  /** Information about what caused the change */
  reason: MentionsChangeReason
}

/** Caret-aware state of a mention relative to the current selection */
export type MentionSelectionState = 'inside' | 'boundary' | 'partial' | 'full'

/** Input passed to the `Mentions` `renderMention` function */
export interface MentionsRenderMentionInput {
  /** Mention id stored in the value */
  id: string

  /** Mention display text */
  display: string

  /** Trigger of the `Mentions.Mention` that produced the mention */
  trigger: string

  /** Caret-aware state of the mention, `null` when the selection does not touch it */
  selectionState: MentionSelectionState | null
}

/** Input passed to the `Mentions.Mention` `renderSuggestion` function */
export interface MentionRenderSuggestionInput {
  /** Suggestion item */
  item: MentionItem

  /** Current query typed after the trigger */
  query: string

  /** `true` when the option is selected with the keyboard, or is the first option when the dropdown opens */
  highlighted: boolean

  /** Index of the option in the suggestions list */
  index: number
}

/** Function that filters the items of a static `data` array for the current query */
export type MentionsFilter = (input: { query: string; items: MentionItem[] }) => MentionItem[]

/** Lightweight source descriptor accepted by the public `getMentions` helper */
export interface MentionSourceConfig {
  /** Trigger that opens this source's dropdown @default '@' */
  trigger?: string | RegExp

  /** Markup template or serializer @default `${trigger}[__display__](__id__)` */
  markup?: string | MentionSerializer

  /** Customizes the visible text of a stored mention @default (_, display) => display */
  displayTransform?: MentionDisplayTransform

  /** If set, the trigger character is kept as a prefix in the visible text of the mention @default false */
  withTrigger?: boolean
}

/** Styles API selectors of `Mentions` */
export type MentionsStylesNames =
  | 'wrapper'
  | 'input'
  | 'section'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'field'
  | 'highlighter'
  | 'highlight'
  | 'dropdown'
  | 'options'
  | 'option'
  | 'nothingFound'
  | 'inlineSuggestion'
  | 'inlineSuggestionPrefix'
  | 'inlineSuggestionText'

export type MentionsCssVariables = {
  highlight: '--mentions-highlight-color' | '--mentions-highlight-bg'
}

/** Props declared by `Mentions` itself, other props are passed down to the input wrapper or the control */
export interface MentionsOwnProps {
  /** Controlled markup value, `\r\n` line breaks are normalized to `\n` */
  modelValue?: string
  /** Uncontrolled markup value initial state, `\r\n` line breaks are normalized to `\n` */
  defaultValue?: string
  /** If set, renders a single-line `input` instead of a `textarea` @default false */
  singleLine?: boolean
  /** Minimum rows of the underlying control */
  minRows?: number
  /** Maximum rows before the control scrolls */
  maxRows?: number
  /** Anchors the dropdown to the caret position or the input's left edge @default 'caret' */
  anchorMode?: 'caret' | 'left'
  /** Dropdown placement relative to the anchor @default 'below' */
  suggestionsPlacement?: 'auto' | 'above' | 'below'
  /** Displays suggestions as a dropdown list or as inline ghost text @default 'overlay' */
  suggestionsDisplay?: 'overlay' | 'inline'
  /** Local filtering of array data, `false` to disable (server-driven) */
  filter?: false | MentionsFilter
  /** Message shown when a query returns no matches */
  nothingFoundMessage?: any
  /** Message shown while an async `data` function is pending @default 'Loading…' */
  loadingMessage?: any
  /** Message shown when an async `data` function rejects, `renderError` of `Mentions.Mention` takes precedence @default 'Failed to load suggestions' */
  errorMessage?: any
  /** Function to customize how mentions are rendered in the overlay, the `mention` slot can be used instead. The returned content must keep the same text metrics as `display` to stay aligned. */
  renderMention?: (input: MentionsRenderMentionInput) => any
  /** Dropdown `max-height` before scroll @default 220 */
  maxDropdownHeight?: number | string
  /** Props passed down to the underlying `Combobox` */
  comboboxProps?: Record<string, any>
  /** Screen-reader label for the suggestions list @default 'Suggestions' */
  a11ySuggestionsListLabel?: string
  /** `static` disables all interactions @default 'interactive' */
  mode?: 'interactive' | 'static'
  /** Controls input `height`, horizontal `padding` and `font-size` @default 'sm' */
  size?: string
  /** Input id, generated randomly when not set */
  id?: string
  /** If set, the input is disabled @default false */
  disabled?: boolean
  /** If set, the value cannot be changed @default false */
  readOnly?: boolean
  /** Adds required attribute to the control and red asterisk to the label @default false */
  required?: boolean
  /** Name of the hidden input that stores the markup value for uncontrolled forms */
  name?: string
  /** `form` attribute of the control and the hidden input */
  form?: string
  /** Determines whether spell check is enabled @default false */
  spellcheck?: boolean
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
}

export interface MentionsEmits {
  'update:modelValue': [value: string]
  /** Called on every value change with a rich payload */
  change: [payload: MentionsChangePayload]
  /** Called whenever the caret or selection changes (including after edits), with the mentions it overlaps (empty array when none) */
  'selection-change': [selection: { start: number; end: number }, mentions: MentionOccurrence[]]
}
