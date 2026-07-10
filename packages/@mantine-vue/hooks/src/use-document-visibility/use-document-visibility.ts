import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from 'vue'

export function useDocumentVisibility(): Readonly<Ref<DocumentVisibilityState>> {
  const documentVisibility = ref<DocumentVisibilityState>('visible') as Ref<DocumentVisibilityState>

  const listener = () => {
    documentVisibility.value = document.visibilityState
  }

  onMounted(() => {
    documentVisibility.value = document.visibilityState
    document.addEventListener('visibilitychange', listener)
  })

  onBeforeUnmount(() => document.removeEventListener('visibilitychange', listener))

  return readonly(documentVisibility) as Readonly<Ref<DocumentVisibilityState>>
}
