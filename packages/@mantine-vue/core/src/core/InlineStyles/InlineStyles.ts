import { computed, defineComponent, h, type PropType } from 'vue'
import { cssVariablesObjectToString } from '../MantineProvider'

function stylesToString(styles: Record<string, string | number | undefined>) {
  return cssVariablesObjectToString(
    Object.entries(styles).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value)
      }

      return acc
    }, {}),
  )
}

export const InlineStyles = defineComponent({
  name: 'InlineStyles',
  props: {
    selector: { type: String, required: true },
    styles: {
      type: Object as PropType<Record<string, string | number | undefined>>,
      default: undefined,
    },
    media: {
      type: Object as PropType<Record<string, Record<string, string | number | undefined>>>,
      default: undefined,
    },
    container: {
      type: Object as PropType<Record<string, Record<string, string | number | undefined>>>,
      default: undefined,
    },
    // Kept for public compatibility. Vue cannot safely hoist and share these
    // nodes without a provider-scoped SSR/hydration registry and stable cascade
    // ordering, so this flag deliberately does not claim deduplication in the DOM.
    deduplicate: { type: Boolean, default: false },
  },
  setup(props) {
    const css = computed(() => {
      const blocks: string[] = []

      if (props.styles && Object.keys(props.styles).length > 0) {
        blocks.push(`${props.selector}{${stylesToString(props.styles)}}`)
      }

      Object.entries(props.media ?? {}).forEach(([query, styles]) => {
        blocks.push(`@media ${query}{${props.selector}{${stylesToString(styles)}}}`)
      })

      Object.entries(props.container ?? {}).forEach(([query, styles]) => {
        blocks.push(`@container ${query}{${props.selector}{${stylesToString(styles)}}}`)
      })

      return blocks.join('\n')
    })

    return () =>
      h('style', {
        'data-mantine-inline-styles': true,
        innerHTML: css.value,
      })
  },
})
