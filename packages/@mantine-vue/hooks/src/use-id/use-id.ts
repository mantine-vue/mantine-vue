import { getCurrentInstance, ref, useId as useVueId, type Ref } from 'vue'

let idCounter = 0

export function useId(staticId?: string): Ref<string> {
  if (staticId) {
    return ref(staticId)
  }

  const id = getCurrentInstance() ? useVueId() : `fallback-${++idCounter}`

  return ref(`mantine-vue-${id}`)
}
