import {
  computed,
  defineComponent,
  h,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  watch,
  type PropType,
} from 'vue'
import { cssVariablesObjectToString } from '../MantineProvider'
import { useInlineStylesRegistry } from './inline-styles-registry'

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
    deduplicate: { type: Boolean, default: undefined },
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

    const registry = useInlineStylesRegistry()
    const shouldDeduplicate = computed(
      () => props.deduplicate !== false && registry?.enabled.value === true,
    )

    if (registry) {
      const token = Symbol('InlineStyles')
      let registered: string | null = null

      const register = () => {
        if (!shouldDeduplicate.value) {
          unregister()
          return
        }

        if (registered !== css.value) {
          unregister()
          registered = css.value
          registry.acquire(registered, token)
        }
      }

      const unregister = () => {
        if (registered !== null) {
          registry.release(registered, token)
          registered = null
        }
      }

      // Sync so ownership is settled before this instance (and any instance that takes
      // over a rule it just released) renders.
      watch([css, shouldDeduplicate], register, { immediate: true, flush: 'sync' })
      // Deactivated KeepAlive subtrees are detached from the document, so they must not
      // hold rules other mounted instances depend on.
      onActivated(register)
      onDeactivated(unregister)
      onBeforeUnmount(unregister)

      return () =>
        !shouldDeduplicate.value || registry.isOwner(css.value, token)
          ? h('style', { 'data-mantine-inline-styles': true, innerHTML: css.value })
          : null
    }

    return () =>
      h('style', {
        'data-mantine-inline-styles': true,
        innerHTML: css.value,
      })
  },
})
