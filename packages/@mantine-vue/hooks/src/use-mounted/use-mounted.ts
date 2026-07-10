import { onMounted, readonly, ref, type Ref } from 'vue'

export function useMounted(): Readonly<Ref<boolean>> {
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })
  return readonly(mounted) as Readonly<Ref<boolean>>
}
