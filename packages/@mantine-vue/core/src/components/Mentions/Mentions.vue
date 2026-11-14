<script lang="ts">
import { createVarsResolver } from '../../core'
import inputClasses from '../Input/Input.module.css'
import classes from './Mentions.module.css'

const mergedClasses = { ...inputClasses, ...classes }

const varsResolver = createVarsResolver<any>(() => ({
  highlight: {
    '--mentions-highlight-color': undefined,
    '--mentions-highlight-bg': undefined,
  },
}))

const defaultProps = {
  singleLine: false,
  anchorMode: 'caret',
  suggestionsPlacement: 'below',
  suggestionsDisplay: 'overlay',
  spellcheck: false,
  mode: 'interactive',
  size: 'sm',
  loadingMessage: 'Loading…',
  errorMessage: 'Failed to load suggestions',
  a11ySuggestionsListLabel: 'Suggestions',
} as const

export { mergedClasses, varsResolver, defaultProps }
</script>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  ref,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
  type CSSProperties,
  type VNodeChild,
} from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { extractStyleProps, omitAttrs, useProps, useStyles } from '../../core'
import {
  Combobox,
  ComboboxDropdown,
  ComboboxDropdownTarget,
  ComboboxEmpty,
  ComboboxOption,
  ComboboxOptions,
  useCombobox,
} from '../Combobox'
import { InputBase } from '../InputBase'
import { ScrollAreaAutosize } from '../ScrollArea'
import { detectQuery, isQueryInText, type ActiveMentionQuery } from './detect-query'
import { buildHighlightSegments } from './highlight-segments'
import type {
  MentionsChangeReason,
  MentionsEmits,
  MentionsOwnProps,
  MentionsRenderMentionInput,
} from './Mentions.types'
import { MentionsControl, MentionsHighlighter, MentionsInlineSuggestion } from './mentions-parts'
import { resolveSources } from './resolve-sources'
import { splitWrapperProps } from './split-wrapper-props'
import { createMentionsHistory, type MentionsHistoryChangeType } from './use-mentions-history'
import { normalizeMatchText, useMentionsQuery } from './use-mentions-query'
import { applyChangeToValue } from './utils/apply-change-to-value'
import { toMentionOccurrence } from './utils/find-mention-occurrences'
import { getCaretCoordinates } from './utils/get-caret-coordinates'
import { getInputChangeType } from './utils/get-input-change-type'
import { getIdText, getPlainText } from './utils/get-plain-text'
import { insertMention } from './utils/insert-mention'
import { getMarkupRange, mapMarkupIndex } from './utils/map-plain-text-index'
import { normalizeNewlines } from './utils/normalize-newlines'
import { getSelectionStates } from './utils/selection'
import { walkMentions, type MentionWalk } from './utils/walk-mentions'

defineOptions({ name: 'Mentions', inheritAttrs: false })

const rawProps = withDefaults(defineProps<MentionsOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  singleLine: undefined,
  filter: undefined,
  disabled: false,
  readOnly: false,
  required: false,
  spellcheck: undefined,
  unstyled: false,
})
const emit = defineEmits<MentionsEmits>()
const slots = useSlots() as {
  default?: () => any
  mention?: (input: MentionsRenderMentionInput) => VNodeChild
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  nothingFound?: (input: { query: string }) => VNodeChild
}
const attrs = useAttrs()
const props = useProps('Mentions', defaultProps, rawProps)

const CLIPBOARD_TYPE = 'application/x-mantine-mentions'

const inputId = useId(props.id)
const optionIdPrefix = useId()
const interactive = computed(
  () => props.mode === 'interactive' && !props.disabled && !props.readOnly,
)
const singleLine = computed(() => !!props.singleLine)

/* Mention sources are read from the `Mentions.Mention` nodes of the default slot */
const slotsVersion = ref(0)
onBeforeUpdate(() => {
  slotsVersion.value += 1
})
const sources = computed(() => {
  void slotsVersion.value
  return resolveSources(slots.default?.() ?? [])
})
const configs = computed(() => sources.value.map((source) => source.config))

const getStyles = useStyles({
  name: 'Mentions',
  props,
  classes: mergedClasses,
  attrs,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const controlElement = shallowRef<HTMLTextAreaElement | HTMLInputElement | null>(null)
const highlighterElement = shallowRef<HTMLElement | null>(null)
const inlineSuggestionElement = shallowRef<HTMLElement | null>(null)

/* ---------------- value and history ---------------- */

const [value, setValue] = useUncontrolled<string>({
  value: () =>
    props.modelValue === undefined
      ? undefined
      : normalizeNewlines(props.modelValue, singleLine.value),
  defaultValue:
    props.defaultValue === undefined
      ? undefined
      : normalizeNewlines(props.defaultValue, !!props.singleLine),
  finalValue: '',
})

const walk = computed(() => walkMentions(value.value, configs.value))
let history: ReturnType<typeof createMentionsHistory> | null = null
const getHistory = () => {
  if (!history) history = createMentionsHistory(value.value, walk.value.plainText.length)
  return history
}
let pendingEdit: {
  value: string
  caret: number
  caretBefore: number
  type: MentionsHistoryChangeType
} | null = null

watch(value, (nextValue) => {
  const pending = pendingEdit
  pendingEdit = null
  if (pending && pending.value === nextValue) {
    getHistory().push(nextValue, pending.caret, pending.caretBefore, pending.type)
  } else {
    getHistory().syncExternal(nextValue, walkMentions(nextValue, configs.value).plainText.length)
  }
})

/* ---------------- selection ---------------- */

const selection = ref({ start: 0, end: 0 })
let liveSelection = { start: 0, end: 0 }
let pendingCaret: number | null = null
let composing = false
let notifiedSelection: string | null = null

function notifySelection(start: number, end: number, currentWalk: MentionWalk) {
  const key = `${start}:${end}:${currentWalk.value}`
  if (notifiedSelection === key) return
  notifiedSelection = key
  const states = getSelectionStates(currentWalk.spans, start, end)
  emit(
    'selection-change',
    { start, end },
    currentWalk.spans.filter((span) => states.has(span.markupStart)).map(toMentionOccurrence),
  )
}

function syncControlValue() {
  const control = controlElement.value
  if (control && control.value !== walk.value.plainText) {
    control.value = walk.value.plainText
  }
}

function setCaret(caret: number, currentWalk: MentionWalk) {
  pendingCaret = caret
  liveSelection = { start: caret, end: caret }
  selection.value = { start: caret, end: caret }
  notifySelection(caret, caret, currentWalk)
  nextTick(() => {
    syncControlValue()
    const control = controlElement.value
    if (pendingCaret == null || !control) return
    const nextCaret = pendingCaret
    pendingCaret = null
    if (composing) return
    control.setSelectionRange(nextCaret, nextCaret)
    liveSelection = { start: nextCaret, end: nextCaret }
  })
}

function syncSelection(target: HTMLTextAreaElement | HTMLInputElement) {
  const start = target.selectionStart ?? 0
  const end = target.selectionEnd ?? 0
  liveSelection = { start, end }
  selection.value = { start, end }
  notifySelection(start, end, walk.value)
  return { start, end }
}

function readLiveSelection(target: HTMLTextAreaElement | HTMLInputElement) {
  const start = target.selectionStart ?? 0
  const end = target.selectionEnd ?? 0
  liveSelection = { start, end }
  return { start, end }
}

/* ---------------- query ---------------- */

const proposedQuery = shallowRef<ActiveMentionQuery | null>(null)
const query = computed(() =>
  proposedQuery.value &&
  isQueryInText(proposedQuery.value, walk.value.plainText, sources.value, walk.value.spans)
    ? proposedQuery.value
    : null,
)
const activeSource = computed(() => (query.value ? sources.value[query.value.sourceIndex] : null))

const queryState = useMentionsQuery({
  source: () => activeSource.value,
  query: () => query.value?.query ?? null,
  enabled: () => interactive.value,
  filter: () => props.filter,
})
const suggestions = computed(() => queryState.value.items)
const hasOptions = computed(() => suggestions.value.length > 0)

const shouldOpenDropdown = computed(
  () =>
    interactive.value &&
    props.suggestionsDisplay === 'overlay' &&
    query.value != null &&
    (queryState.value.loading ||
      !!queryState.value.error ||
      hasOptions.value ||
      !!props.nothingFoundMessage ||
      !!slots.nothingFound ||
      !!activeSource.value?.props.renderEmpty),
)

const combobox = useCombobox({
  onDropdownClose: () => combobox.resetSelectedOption(),
})

const selectedOptionId = ref<string | null>(null)
const optionsKey = computed(
  () =>
    `${query.value?.sourceIndex}\u0000${query.value?.query}\u0000${queryState.value.generation}\u0000${suggestions.value.map((item) => item.id).join('\u0000')}`,
)

watch(
  [shouldOpenDropdown, () => combobox.dropdownOpened, hasOptions, optionsKey],
  () => {
    if (!shouldOpenDropdown.value) {
      combobox.closeDropdown()
      selectedOptionId.value = null
      return
    }

    if (!combobox.dropdownOpened) {
      combobox.openDropdown()
      return
    }

    if (hasOptions.value) {
      selectedOptionId.value = combobox.selectFirstOption()
    } else {
      combobox.resetSelectedOption()
      selectedOptionId.value = null
    }
  },
  { flush: 'post' },
)

const activeDescendant = computed(() =>
  combobox.dropdownOpened && hasOptions.value ? (selectedOptionId.value ?? undefined) : undefined,
)

function updateActiveQuery(nextWalk: MentionWalk, caret: number) {
  proposedQuery.value = interactive.value
    ? detectQuery(nextWalk.plainText, caret, sources.value, nextWalk.spans)
    : null
}

function applyEdit(
  newValue: string,
  caret: number,
  caretBefore: number,
  reason: MentionsChangeReason,
  mentionId?: string,
) {
  getHistory()
  const previousValue = value.value
  const nextWalk = walkMentions(normalizeNewlines(newValue, singleLine.value), configs.value)
  pendingEdit =
    reason.type === 'undo' || reason.type === 'redo'
      ? null
      : { value: nextWalk.value, caret, caretBefore, type: reason.type }
  setValue(nextWalk.value)
  emit('update:modelValue', nextWalk.value)
  emit('change', {
    value: nextWalk.value,
    plainTextValue: nextWalk.plainText,
    idValue: getIdText(nextWalk, configs.value),
    mentions: nextWalk.spans.map(toMentionOccurrence),
    mentionId,
    previousValue,
    reason,
  })
  setCaret(caret, nextWalk)
  return nextWalk
}

function commitEdit(
  nextValue: string,
  caret: number,
  caretBefore: number,
  reason: MentionsChangeReason,
) {
  updateActiveQuery(applyEdit(nextValue, caret, caretBefore, reason), caret)
}

function syncSelectionAndQuery(target: HTMLTextAreaElement | HTMLInputElement) {
  const { start, end } = syncSelection(target)
  if (start === end) {
    updateActiveQuery(walk.value, start)
  } else {
    proposedQuery.value = null
  }
}

/* ---------------- handlers ---------------- */

const callAttr = (name: string, event: Event) => {
  const handler = (attrs as any)[name]
  if (Array.isArray(handler)) handler.forEach((item) => item?.(event))
  else handler?.(event)
}

function handleInput(event: Event) {
  callAttr('onInput', event)
  const target = event.currentTarget as HTMLTextAreaElement
  const nextPlainText = normalizeNewlines(target.value, singleLine.value)
  const caretAfter = target.selectionStart ?? nextPlainText.length
  const before = liveSelection

  const result = applyChangeToValue(
    walk.value,
    nextPlainText,
    {
      selectionStartBefore: before.start,
      selectionEndBefore: before.end,
      selectionEndAfter: caretAfter,
    },
    configs.value,
  )

  commitEdit(result.value, result.caretPlainTextIndex, before.end, {
    type: getInputChangeType(event, result.removedMention),
    nativeEvent: event,
  })
}

function handleOptionSubmit(id: string) {
  const item = suggestions.value.find((suggestion) => suggestion.id === id)
  const source = activeSource.value
  const currentQuery = query.value
  if (!source || !currentQuery || !item) {
    return
  }

  const display = item.display ?? item.id
  const insertion = insertMention({
    walk: walk.value,
    config: source.config,
    queryStart: currentQuery.queryStart,
    queryEnd: currentQuery.queryEnd,
    id: item.id,
    display,
    appendSpace: source.props.appendSpaceOnAdd ?? false,
  })

  applyEdit(
    insertion.value,
    insertion.caret,
    currentQuery.queryEnd,
    { type: 'mention-add' },
    item.id,
  )
  proposedQuery.value = null
  source.props.onAdd?.({
    id: item.id,
    display,
    startPos: currentQuery.queryStart,
    endPos: currentQuery.queryEnd,
  })
}

/* inline suggestion */
const dismissedInlineQuery = ref<string | null>(null)
const inlineQueryKey = computed(() =>
  query.value ? `${query.value.sourceIndex}:${query.value.queryStart}:${query.value.query}` : null,
)
const inlineItem = computed(() => {
  const currentQuery = query.value
  if (
    props.suggestionsDisplay !== 'inline' ||
    currentQuery == null ||
    queryState.value.loading ||
    inlineQueryKey.value === dismissedInlineQuery.value ||
    selection.value.start !== selection.value.end ||
    walk.value.plainText.slice(currentQuery.queryEnd).split('\n')[0] !== ''
  ) {
    return undefined
  }

  const ignoreAccents = activeSource.value?.props.ignoreAccents
  const normalizedQuery = normalizeMatchText(currentQuery.query, ignoreAccents)
  const candidate = queryState.value.items.find((item) =>
    normalizeMatchText(item.display ?? item.id, ignoreAccents).startsWith(normalizedQuery),
  )
  const display = candidate ? (candidate.display ?? candidate.id) : ''
  return candidate && display.slice(currentQuery.query.length) ? candidate : undefined
})
const inlineCompletion = computed(() =>
  inlineItem.value && query.value
    ? (inlineItem.value.display ?? inlineItem.value.id).slice(query.value.query.length)
    : '',
)

function handleInlineKeydown(event: KeyboardEvent) {
  const item = inlineItem.value
  if (!item) return

  if (event.key === 'Escape') {
    event.preventDefault()
    dismissedInlineQuery.value = inlineQueryKey.value
    return
  }

  const accept =
    event.key === 'Enter' ||
    (event.key === 'Tab' && !event.shiftKey) ||
    (event.key === 'ArrowRight' && selection.value.start === walk.value.plainText.length)

  if (accept) {
    event.preventDefault()
    handleOptionSubmit(item.id)
  }
}

/* clipboard */
function writeClipboard(event: ClipboardEvent, widenToMentions: boolean) {
  const target = event.currentTarget as HTMLTextAreaElement
  const current = readLiveSelection(target)
  if (current.start === current.end || !event.clipboardData) {
    return null
  }

  const currentWalk = walk.value
  const range = getMarkupRange(currentWalk, current.start, current.end)
  const start = widenToMentions ? mapMarkupIndex(currentWalk, range.markupStart) : current.start
  const end = widenToMentions ? mapMarkupIndex(currentWalk, range.markupEnd) : current.end
  const states = getSelectionStates(currentWalk.spans, start, end)
  const coversMentions = states.size > 0 && [...states.values()].every((state) => state === 'full')
  event.preventDefault()
  event.clipboardData.setData('text/plain', currentWalk.plainText.slice(start, end))
  if (coversMentions) {
    event.clipboardData.setData(
      CLIPBOARD_TYPE,
      currentWalk.value.slice(range.markupStart, range.markupEnd),
    )
  }
  return { ...range, start, end }
}

function handleCopy(event: ClipboardEvent) {
  callAttr('onCopy', event)
  if (!event.defaultPrevented) writeClipboard(event, false)
}

function handleCut(event: ClipboardEvent) {
  callAttr('onCut', event)
  if (event.defaultPrevented || !interactive.value) return
  const range = writeClipboard(event, true)
  if (!range) return
  const newValue =
    walk.value.value.slice(0, range.markupStart) + walk.value.value.slice(range.markupEnd)
  commitEdit(newValue, range.start, range.end, { type: 'cut', nativeEvent: event })
}

function handlePaste(event: ClipboardEvent) {
  callAttr('onPaste', event)
  if (event.defaultPrevented || !interactive.value) return

  const markup = event.clipboardData?.getData(CLIPBOARD_TYPE)
  if (!markup || !event.clipboardData) return

  const inserted = normalizeNewlines(markup, singleLine.value)
  const insertedPlainText = getPlainText(inserted, configs.value)
  const clipboardText = normalizeNewlines(
    event.clipboardData.getData('text/plain'),
    singleLine.value,
  )
  if (insertedPlainText !== clipboardText) return

  const target = event.currentTarget as HTMLTextAreaElement
  const { start, end } = readLiveSelection(target)
  const currentWalk = walk.value
  const range = getMarkupRange(currentWalk, start, end)
  const newValue =
    currentWalk.value.slice(0, range.markupStart) +
    inserted +
    currentWalk.value.slice(range.markupEnd)
  if (target.maxLength >= 0 && getPlainText(newValue, configs.value).length > target.maxLength) {
    return
  }

  event.preventDefault()
  const caret = mapMarkupIndex(currentWalk, range.markupStart) + insertedPlainText.length
  commitEdit(newValue, caret, end, { type: 'paste', nativeEvent: event })
}

/* overlay position */
const caretStyle = ref<CSSProperties | null>(null)

function updateCaretAnchor() {
  const control = controlElement.value
  if (props.anchorMode !== 'caret' || !query.value || !control) return
  const coords = getCaretCoordinates(control, query.value.queryStart)
  caretStyle.value = {
    top: `${singleLine.value ? 0 : coords.top - control.scrollTop}px`,
    left: `${coords.left - control.scrollLeft}px`,
    height: `${singleLine.value ? control.clientHeight : coords.height}px`,
  }
}

function syncOverlayScroll() {
  const control = controlElement.value
  if (!control) return
  for (const overlay of [highlighterElement.value, inlineSuggestionElement.value]) {
    if (overlay) {
      overlay.scrollTop = control.scrollTop
      overlay.scrollLeft = control.scrollLeft
    }
  }
}

onMounted(syncOverlayScroll)
onUpdated(syncOverlayScroll)
watch([query, () => walk.value.value, () => props.anchorMode, singleLine], updateCaretAnchor, {
  flush: 'post',
})

function isComposingEvent(event: KeyboardEvent) {
  return event.isComposing || event.keyCode === 229
}

/** Keyboard handling is not delegated to `Combobox.EventsTarget` because arrows and Enter must keep their textarea behavior while the dropdown is closed */
function handleKeydown(event: KeyboardEvent) {
  callAttr('onKeydown', event)
  const target = event.currentTarget as HTMLTextAreaElement
  readLiveSelection(target)

  if (event.defaultPrevented || !interactive.value || isComposingEvent(event)) {
    return
  }

  if (event.metaKey || event.ctrlKey) {
    const key = event.key.toLowerCase()
    if (key === 'z' || key === 'y') {
      const type = key === 'y' || event.shiftKey ? 'redo' : 'undo'
      const entry = type === 'redo' ? getHistory().redo() : getHistory().undo()
      if (entry) {
        event.preventDefault()
        commitEdit(entry.value, entry.caret, entry.caret, { type })
      }
      return
    }
  }

  if (props.suggestionsDisplay === 'inline') {
    handleInlineKeydown(event)
    return
  }

  if (!combobox.dropdownOpened) {
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    selectedOptionId.value =
      event.key === 'ArrowDown' ? combobox.selectNextOption() : combobox.selectPreviousOption()
  } else if (
    (event.key === 'Enter' || (event.key === 'Tab' && !event.shiftKey)) &&
    combobox.getSelectedOptionIndex() !== -1
  ) {
    event.preventDefault()
    combobox.clickSelectedOption()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    combobox.closeDropdown()
    proposedQuery.value = null
  }
}

function handleSelectionEvent(event: Event) {
  if (event.type === 'select') callAttr('onSelect', event)
  if (pendingCaret == null) {
    syncSelectionAndQuery(event.currentTarget as HTMLTextAreaElement)
  }
}

function handleDocumentSelectionChange() {
  const control = controlElement.value
  if (control && typeof document !== 'undefined' && document.activeElement === control) {
    if (pendingCaret == null) syncSelectionAndQuery(control)
  }
}

onMounted(() => document.addEventListener('selectionchange', handleDocumentSelectionChange))
onBeforeUnmount(() =>
  document.removeEventListener('selectionchange', handleDocumentSelectionChange),
)

function handleBlur(event: FocusEvent) {
  callAttr('onBlur', event)
  proposedQuery.value = null
}

function handleClick(event: MouseEvent) {
  callAttr('onClick', event)
  syncSelectionAndQuery(event.currentTarget as HTMLTextAreaElement)
}

function handleScroll(event: Event) {
  callAttr('onScroll', event)
  syncOverlayScroll()
  updateCaretAnchor()
}

function handleCompositionStart(event: CompositionEvent) {
  composing = true
  callAttr('onCompositionstart', event)
}

function handleCompositionEnd(event: CompositionEvent) {
  composing = false
  callAttr('onCompositionend', event)
}

function handleMentionPress(caret: number) {
  const control = controlElement.value
  if (!control) return
  control.focus()
  control.setSelectionRange(caret, caret)
  syncSelectionAndQuery(control)
}

function handleWrapperMousedown(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    event.preventDefault()
    controlElement.value?.focus()
  }
}

/* ---------------- render helpers ---------------- */

const selectionStates = computed(() =>
  getSelectionStates(walk.value.spans, selection.value.start, selection.value.end),
)
const segments = computed(() =>
  buildHighlightSegments(
    walk.value.plainText,
    walk.value.spans,
    sources.value,
    selectionStates.value,
  ),
)

const renderMention = computed(() =>
  slots.mention
    ? (input: MentionsRenderMentionInput) => slots.mention!(input)
    : props.renderMention,
)

const HANDLED_ATTRS = [
  'onInput',
  'onKeydown',
  'onBlur',
  'onClick',
  'onSelect',
  'onScroll',
  'onCopy',
  'onCut',
  'onPaste',
  'onCompositionstart',
  'onCompositionend',
  'onUpdate:modelValue',
  'onChange',
  'onSelectionChange',
]

const splitAttrs = computed(() => {
  const { styleProps, rest } = extractStyleProps(omitAttrs(attrs, HANDLED_ATTRS) as any)
  const { wrapperProps, controlProps } = splitWrapperProps(rest as Record<string, any>)
  return { styleProps, wrapperProps, controlProps }
})

const stylesApiProps = computed(() => (singleLine.value ? props : { ...props, multiline: true }))

const setControlRef = (node: any) => {
  controlElement.value = node?.$el ?? node ?? null
}
const setHighlighterRef = (node: any) => {
  highlighterElement.value = node?.$el ?? node ?? null
}
const setInlineSuggestionRef = (node: any) => {
  inlineSuggestionElement.value = node?.$el ?? node ?? null
}

const PassThrough = (_: unknown, { slots: passSlots }: any) => passSlots.default?.()

const renderSuggestion = (item: any, index: number) => {
  const optionId = `${optionIdPrefix.value}-${index}`
  const custom = activeSource.value?.props.renderSuggestion?.({
    item,
    query: query.value?.query ?? '',
    highlighted: optionId === selectedOptionId.value,
    index,
  })
  return custom ?? item.display ?? item.id
}

const emptyContent = () => {
  const currentQuery = query.value?.query ?? ''
  if (queryState.value.error) {
    return (
      activeSource.value?.props.renderError?.(currentQuery, queryState.value.error) ??
      props.errorMessage
    )
  }

  if (queryState.value.loading) {
    return props.loadingMessage
  }

  return (
    activeSource.value?.props.renderEmpty?.(currentQuery) ??
    slots.nothingFound?.({ query: currentQuery }) ??
    props.nothingFoundMessage
  )
}

const showEmpty = computed(
  () =>
    !!queryState.value.error ||
    queryState.value.loading ||
    (queryState.value.items.length === 0 &&
      !!(activeSource.value?.props.renderEmpty || slots.nothingFound || props.nothingFoundMessage)),
)

const overlayQuery = computed(() =>
  props.suggestionsDisplay === 'overlay' && query.value ? query.value.query : null,
)

defineExpose({ controlElement })
</script>

<template>
  <Combobox
    :store="combobox"
    __static-selector="Mentions"
    :class-names="props.classNames"
    :styles="props.styles"
    :unstyled="props.unstyled"
    :size="props.size"
    :read-only="props.readOnly"
    :position="props.suggestionsPlacement === 'above' ? 'top-start' : 'bottom-start'"
    :middlewares="{ flip: props.suggestionsPlacement === 'auto', shift: true }"
    :width="props.anchorMode === 'caret' ? 'max-content' : 'target'"
    v-bind="props.comboboxProps"
    @option-submit="handleOptionSubmit"
  >
    <component :is="props.anchorMode === 'caret' ? PassThrough : ComboboxDropdownTarget">
      <InputBase
        component="div"
        multiline
        data-no-overflow
        :with-aria="false"
        __static-selector="Mentions"
        :__styles-api-props="stylesApiProps"
        :class-names="props.classNames"
        :styles="props.styles"
        :unstyled="props.unstyled"
        :size="props.size"
        :id="inputId"
        :disabled="props.disabled"
        :required="props.required"
        v-bind="{ ...splitAttrs.wrapperProps, ...splitAttrs.styleProps }"
        :pointer="splitAttrs.wrapperProps.pointer ?? false"
        @mousedown="handleWrapperMousedown"
      >
        <template v-if="slots.label" #label><slot name="label" /></template>
        <template v-if="slots.description" #description><slot name="description" /></template>
        <template v-if="slots.error" #error><slot name="error" /></template>
        <div
          :class="classes.control"
          :data-single-line="singleLine || undefined"
          :style="{
            '--mentions-min-rows': props.minRows ?? 1,
            '--mentions-max-rows': props.maxRows,
          }"
        >
          <MentionsHighlighter
            :root-ref="setHighlighterRef"
            :get-styles="getStyles"
            :segments="segments"
            :trailing-newline="walk.plainText.endsWith('\n')"
            :render-mention="renderMention"
            :on-mention-press="interactive ? handleMentionPress : undefined"
          />

          <MentionsControl
            :form="props.form"
            :aria-invalid="splitAttrs.wrapperProps.error ? true : undefined"
            :spellcheck="props.spellcheck"
            v-bind="{ ...splitAttrs.controlProps, ...getStyles('field') }"
            :single-line="singleLine"
            :control-ref="setControlRef"
            :value="walk.plainText"
            :disabled="props.disabled"
            :required="props.required"
            :readonly="props.readOnly || props.mode === 'static'"
            :rows="singleLine ? undefined : (props.minRows ?? 1)"
            :interactive="interactive"
            :dropdown-opened="combobox.dropdownOpened"
            :list-id="combobox.listId"
            :active-descendant="activeDescendant"
            :popup-visible="!!inlineItem"
            @input="handleInput"
            @keydown="handleKeydown"
            @select="handleSelectionEvent"
            @keyup="handleSelectionEvent"
            @blur="handleBlur"
            @click="handleClick"
            @scroll="handleScroll"
            @copy="handleCopy"
            @cut="handleCut"
            @paste="handlePaste"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
          />

          <MentionsInlineSuggestion
            v-if="inlineItem && query"
            :root-ref="setInlineSuggestionRef"
            :get-styles="getStyles"
            :prefix="walk.plainText.slice(0, query.queryEnd)"
            :completion="inlineCompletion"
          />

          <ComboboxDropdownTarget v-if="props.anchorMode === 'caret'">
            <div
              :class="classes.caretAnchor"
              :style="caretStyle ?? { top: 0, left: 0 }"
              aria-hidden="true"
            />
          </ComboboxDropdownTarget>
        </div>
      </InputBase>
    </component>

    <input
      v-if="props.name"
      type="hidden"
      :name="props.name"
      :form="props.form"
      :value="walk.value"
      :disabled="props.disabled"
    />

    <ComboboxDropdown>
      <ComboboxOptions :aria-label="props.a11ySuggestionsListLabel">
        <ScrollAreaAutosize
          :mah="props.maxDropdownHeight ?? 220"
          type="scroll"
          scrollbars="y"
          :unstyled="props.unstyled"
        >
          <template v-if="overlayQuery != null">
            <ComboboxEmpty v-if="showEmpty" v-bind="getStyles('nothingFound')">
              <component :is="emptyContent" />
            </ComboboxEmpty>
            <template v-else>
              <ComboboxOption
                v-for="(item, index) in suggestions"
                :id="`${optionIdPrefix}-${index}`"
                :key="item.id"
                :value="item.id"
              >
                <component :is="() => renderSuggestion(item, index)" />
              </ComboboxOption>
            </template>
          </template>
        </ScrollAreaAutosize>
      </ComboboxOptions>
    </ComboboxDropdown>
  </Combobox>
</template>
