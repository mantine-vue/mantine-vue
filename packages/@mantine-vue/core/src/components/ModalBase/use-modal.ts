import { computed, ref } from 'vue'
import { useFocusReturn, useId, useWindowEvent } from '@mantine-vue/hooks'

export function useModal(input: {
  id?: string
  opened: () => boolean
  onClose: () => void
  trapFocus: () => boolean
  closeOnEscape: () => boolean
  returnFocus: () => boolean
}) {
  const id = useId(input.id)
  const titleMounted = ref(false)
  const bodyMounted = ref(false)
  useWindowEvent(
    'keydown',
    (event) => {
      const stopped =
        (event.target as HTMLElement)?.getAttribute?.('data-mantine-stop-propagation') === 'true'
      if (
        event.key === 'Escape' &&
        !event.isComposing &&
        input.opened() &&
        input.closeOnEscape() &&
        !stopped
      )
        input.onClose()
    },
    { capture: true },
  )
  useFocusReturn({
    opened: input.opened,
    shouldReturnFocus: () => input.trapFocus() && input.returnFocus(),
  })
  return { id: computed(() => id.value), titleMounted, bodyMounted }
}
