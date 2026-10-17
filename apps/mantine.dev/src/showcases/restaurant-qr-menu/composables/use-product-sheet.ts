import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * The product sheet is driven by the `?item=` query parameter, so dishes can be
 * deep-linked/shared and the phone's back button closes the sheet.
 */
export function useProductSheet() {
  const route = useRoute()
  const router = useRouter()

  const productId = computed(() => (typeof route.query.item === 'string' ? route.query.item : null))
  const lineId = computed(() => (typeof route.query.line === 'string' ? route.query.line : null))

  const open = (id: string, editLineId?: string) =>
    router.push({ query: { ...route.query, item: id, line: editLineId } })

  const close = () => {
    const { item: _item, line: _line, ...rest } = route.query
    const back = typeof window !== 'undefined' ? window.history.state?.back : null
    const previous = typeof back === 'string' ? router.resolve(back) : null

    if (previous && previous.path === route.path && !previous.query.item) {
      router.back()
    } else {
      router.replace({ query: rest })
    }
  }

  return { productId, lineId, open, close }
}
