import { ref, type Ref } from 'vue'

export function useForceUpdate(): [Ref<number>, () => void] {
  const key = ref(0)
  return [key, () => key.value++]
}
