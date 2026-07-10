import { isRef, onBeforeUnmount, onMounted, type MaybeRefOrGetter, type Ref } from 'vue'

export function usePageLeave(onPageLeave: MaybeRefOrGetter<() => void>): void {
  const getHandler = () =>
    isRef(onPageLeave) ? (onPageLeave as Ref<() => void>).value : (onPageLeave as () => void)
  const handleMouseLeave = (): void => getHandler()()

  onMounted(() => {
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
  })

  onBeforeUnmount(() => {
    document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
  })
}
