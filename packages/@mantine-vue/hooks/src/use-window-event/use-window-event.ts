import { onBeforeUnmount, onMounted } from 'vue'

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
) {
  onMounted(() => window.addEventListener(type, listener, options))
  onBeforeUnmount(() => window.removeEventListener(type, listener, options))
}
