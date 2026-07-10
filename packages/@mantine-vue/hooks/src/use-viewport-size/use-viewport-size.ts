import { onMounted, ref, type Ref } from 'vue'
import { useWindowEvent } from '../use-window-event/use-window-event'

const eventListenerOptions: AddEventListenerOptions = {
  passive: true,
}

export interface UseViewportSizeReturnValue {
  width: Ref<number>
  height: Ref<number>
}

export function useViewportSize(): UseViewportSizeReturnValue {
  const width = ref(0)
  const height = ref(0)

  const setSize = () => {
    width.value = window.innerWidth || 0
    height.value = window.innerHeight || 0
  }

  useWindowEvent('resize', setSize, eventListenerOptions)
  useWindowEvent('orientationchange', setSize, eventListenerOptions)
  onMounted(setSize)

  return { width, height }
}
