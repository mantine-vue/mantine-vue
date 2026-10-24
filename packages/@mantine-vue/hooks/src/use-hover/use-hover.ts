import { ref, watch, type Ref } from 'vue'

export interface UseHoverReturnValue<T extends HTMLElement = HTMLElement> {
  ref: Ref<T | null>
  hovered: Ref<boolean>
}

export function useHover<T extends HTMLElement = HTMLElement>(): UseHoverReturnValue<T> {
  const refTarget = ref<T | null>(null) as Ref<T | null>
  const hovered = ref(false)

  watch(
    refTarget,
    (node, _, onCleanup) => {
      hovered.value = false

      if (!node) return

      const onEnter = () => {
        hovered.value = true
      }

      const onLeave = () => {
        hovered.value = false
      }

      node.addEventListener('mouseenter', onEnter)
      node.addEventListener('mouseleave', onLeave)

      onCleanup(() => {
        node.removeEventListener('mouseenter', onEnter)
        node.removeEventListener('mouseleave', onLeave)
      })
    },
    { immediate: true, flush: 'sync' },
  )

  return { ref: refTarget, hovered }
}
