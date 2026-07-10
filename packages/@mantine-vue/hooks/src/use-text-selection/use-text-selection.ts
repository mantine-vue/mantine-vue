import { onBeforeUnmount, onMounted, shallowRef, triggerRef, type Ref } from 'vue'

export function useTextSelection(): Ref<Selection | null> {
  const selection = shallowRef<Selection | null>(null)

  const handleSelectionChange = (): void => {
    selection.value = document.getSelection()
    triggerRef(selection)
  }

  onMounted(() => {
    selection.value = document.getSelection()
    triggerRef(selection)
    document.addEventListener('selectionchange', handleSelectionChange)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('selectionchange', handleSelectionChange)
  })

  return selection
}
