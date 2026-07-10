import { onBeforeUnmount, onMounted } from 'vue'

export function usePageLeave(onPageLeave: () => void): void {
  const handleMouseLeave = (): void => onPageLeave()

  onMounted(() => {
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
  })

  onBeforeUnmount(() => {
    document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
  })
}
