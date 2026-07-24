import { defineComponent, h, type PropType } from 'vue'
import { useProps, type MantineColor } from '../../core'
import { Mark } from '../Mark'
import { Text } from '../Text'
import { foldAccents, highlighter } from './highlighter/highlighter'

export interface HighlightTerm {
  text: string
  color?: MantineColor
}

const defaultProps = {
  color: 'yellow',
  wholeWord: false,
  caseInsensitive: true,
  accentInsensitive: true,
} as const

function normalizeKey(value: string, caseInsensitive?: boolean, accentInsensitive?: boolean) {
  let key = value

  if (caseInsensitive) {
    key = key.toLowerCase()
  }

  if (accentInsensitive) {
    key = foldAccents(key)
  }

  return key
}

export const Highlight = defineComponent({
  name: 'Highlight',
  inheritAttrs: false,
  props: {
    highlight: {
      type: [String, Array] as PropType<string | string[] | HighlightTerm[]>,
      required: true,
    },
    color: { type: String as PropType<MantineColor>, default: undefined },
    highlightStyles: {
      type: [Object, Function] as PropType<
        Record<string, any> | ((theme: any) => Record<string, any>)
      >,
      default: undefined,
    },
    wholeWord: { type: Boolean, default: undefined },
    caseInsensitive: { type: Boolean, default: undefined },
    accentInsensitive: { type: Boolean, default: undefined },
    component: { type: String, default: undefined },
    span: { type: Boolean, default: false },
    unstyled: { type: Boolean, default: false },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Highlight', defaultProps, rawProps)

    return () => {
      const text =
        slots
          .default?.()
          .map((node) => String(node.children ?? ''))
          .join('') ?? ''
      const isTermArray = Array.isArray(props.highlight) && typeof props.highlight[0] === 'object'
      const colorMap = new Map<string, string>()
      let highlightStrings: string[]

      if (isTermArray) {
        highlightStrings = (props.highlight as HighlightTerm[]).map((term) => {
          if (term.color) {
            colorMap.set(
              normalizeKey(term.text, props.caseInsensitive, props.accentInsensitive),
              term.color,
            )
          }

          return term.text
        })
      } else if (Array.isArray(props.highlight)) {
        highlightStrings = props.highlight as string[]
      } else {
        highlightStrings = [props.highlight as string]
      }

      const chunks = highlighter(text, highlightStrings, {
        wholeWord: props.wholeWord,
        caseInsensitive: props.caseInsensitive,
        accentInsensitive: props.accentInsensitive,
      })

      return h(
        Text,
        {
          ...attrs,
          component: props.component,
          span: props.span,
          unstyled: props.unstyled,
          classNames: props.classNames,
          styles: props.styles,
          vars: props.vars,
          __staticSelector: 'Highlight',
        },
        () =>
          chunks.map(({ chunk, highlighted }, index) =>
            highlighted
              ? h(
                  Mark,
                  {
                    key: index,
                    unstyled: props.unstyled,
                    color:
                      colorMap.get(
                        normalizeKey(chunk, props.caseInsensitive, props.accentInsensitive),
                      ) || props.color,
                    style: props.highlightStyles,
                    'data-highlight': chunk,
                  },
                  () => chunk,
                )
              : h('span', { key: index }, chunk),
          ),
      )
    }
  },
})
