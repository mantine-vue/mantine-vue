import { onUpdated, readonly, ref, type Ref } from 'vue'

export function useIsFirstRender(): Readonly<Ref<boolean>> {
  const isFirst = ref(true) as Ref<boolean>

  onUpdated(() => {
    isFirst.value = false
  })

  return readonly(isFirst) as Readonly<Ref<boolean>>
}
