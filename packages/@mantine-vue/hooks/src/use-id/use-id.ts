import { onMounted, ref, type Ref } from 'vue'

let idCounter = 0

export function useId(staticId?: string): Ref<string> {
  const id = ref(staticId || '')

  onMounted(() => {
    if (!id.value) {
      id.value = `mantine-vue-${++idCounter}`
    }
  })

  if (staticId) {
    id.value = staticId
  }

  return id
}
