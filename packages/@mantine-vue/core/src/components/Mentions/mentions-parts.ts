import { defineComponent, h, type PropType, type VNodeChild } from 'vue'
import { useInputWrapperContext } from '../Input'
import type { HighlightMentionSegment, HighlightSegment } from './highlight-segments'
import type { MentionsRenderMentionInput } from './Mentions.types'

type GetStyles = (selector: string, options?: { className?: any; style?: any }) => any

const INTERACTIVE_SELECTOR =
  'a[href], button, input, select, textarea, label, [tabindex], [contenteditable=""], [contenteditable="true"], [role="button"], [role="link"]'

/**
 * The `textarea` (or `input` in single line mode) that receives user input. Implemented as a
 * component so it can read `id` and `aria-describedby` from the input wrapper context.
 */
export const MentionsControl = defineComponent({
  name: 'MentionsControl',
  inheritAttrs: false,
  props: {
    singleLine: { type: Boolean, required: true },
    controlRef: { type: Function as PropType<(node: any) => void>, required: true },
    interactive: { type: Boolean, required: true },
    dropdownOpened: { type: Boolean, required: true },
    listId: { type: String as PropType<string | null>, default: null },
    activeDescendant: { type: String as PropType<string | undefined>, default: undefined },
    popupVisible: { type: Boolean, required: true },
  },
  setup(props, { attrs }) {
    const ctx = useInputWrapperContext()

    return () =>
      h(props.singleLine ? 'input' : 'textarea', {
        ref: props.controlRef as any,
        id: ctx.inputId,
        'aria-describedby': ctx.describedBy,
        ...attrs,
        role: props.singleLine ? 'combobox' : undefined,
        'aria-autocomplete': props.interactive ? 'list' : undefined,
        'aria-haspopup': props.interactive ? 'listbox' : undefined,
        'aria-expanded': props.singleLine ? props.dropdownOpened : undefined,
        'aria-controls': props.dropdownOpened ? (props.listId ?? undefined) : undefined,
        'aria-activedescendant': props.activeDescendant,
        'data-mantine-stop-propagation': props.dropdownOpened || props.popupVisible || undefined,
      })
  },
})

function handleMentionMouseDown(
  event: MouseEvent,
  segment: HighlightMentionSegment,
  onMentionPress: (caret: number) => void,
) {
  const currentTarget = event.currentTarget as HTMLElement
  const interactiveTarget = (event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)
  if (interactiveTarget && currentTarget.contains(interactiveTarget)) {
    return
  }

  event.preventDefault()
  const rect = currentTarget.getBoundingClientRect()
  onMentionPress(event.clientX < rect.left + rect.width / 2 ? segment.plainStart : segment.plainEnd)
}

/**
 * Overlay rendered behind the transparent control that displays highlighted mentions.
 * Rendered with a render function: whitespace between nodes must be preserved exactly.
 */
export const MentionsHighlighter = defineComponent({
  name: 'MentionsHighlighter',
  props: {
    segments: { type: Array as PropType<HighlightSegment[]>, required: true },
    getStyles: { type: Function as PropType<GetStyles>, required: true },
    trailingNewline: { type: Boolean, required: true },
    renderMention: {
      type: Function as PropType<(input: MentionsRenderMentionInput) => VNodeChild>,
      default: undefined,
    },
    onMentionPress: { type: Function as PropType<(caret: number) => void>, default: undefined },
    rootRef: { type: Function as PropType<(node: any) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          ref: props.rootRef as any,
          ...props.getStyles('highlighter'),
          'data-interactive': (!!props.renderMention && !!props.onMentionPress) || undefined,
          'aria-hidden': 'true',
        },
        [
          ...props.segments.map((segment) => {
            if (segment.type === 'text') {
              return segment.text
            }

            const onMentionPress = props.onMentionPress
            return h(
              'span',
              {
                key: `mention-${segment.key}`,
                ...props.getStyles('highlight', {
                  className: segment.className,
                  style: segment.style,
                }),
                role: 'presentation',
                'data-trigger': segment.trigger,
                'data-mention-selection': segment.selectionState ?? undefined,
                onMousedown:
                  props.renderMention && onMentionPress
                    ? (event: MouseEvent) => handleMentionMouseDown(event, segment, onMentionPress)
                    : undefined,
              },
              props.renderMention
                ? [
                    props.renderMention({
                      id: segment.id,
                      display: segment.display,
                      trigger: segment.trigger,
                      selectionState: segment.selectionState,
                    }) as any,
                  ]
                : segment.text,
            )
          }),
          props.trailingNewline ? ' ' : null,
        ],
      )
  },
})

/** Ghost text displayed after the caret with `suggestionsDisplay="inline"` */
export const MentionsInlineSuggestion = defineComponent({
  name: 'MentionsInlineSuggestion',
  props: {
    getStyles: { type: Function as PropType<GetStyles>, required: true },
    prefix: { type: String, required: true },
    completion: { type: String, required: true },
    rootRef: { type: Function as PropType<(node: any) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { ref: props.rootRef as any, ...props.getStyles('inlineSuggestion'), 'aria-hidden': true },
        [
          h('span', props.getStyles('inlineSuggestionPrefix'), props.prefix),
          h('span', props.getStyles('inlineSuggestionText'), props.completion),
        ],
      )
  },
})
