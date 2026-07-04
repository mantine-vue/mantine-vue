import { onBeforeUnmount, onMounted } from 'vue'
import { useModalBaseContext } from './ModalBase.context'
export function useModalTitle() {
  const ctx = useModalBaseContext()
  onMounted(() => ctx.setTitleMounted(true))
  onBeforeUnmount(() => ctx.setTitleMounted(false))
  return ctx.getTitleId
}
