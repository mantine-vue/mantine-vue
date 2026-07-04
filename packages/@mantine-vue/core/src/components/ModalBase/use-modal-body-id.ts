import { onBeforeUnmount, onMounted } from 'vue'
import { useModalBaseContext } from './ModalBase.context'
export function useModalBodyId() {
  const ctx = useModalBaseContext()
  onMounted(() => ctx.setBodyMounted(true))
  onBeforeUnmount(() => ctx.setBodyMounted(false))
  return ctx.getBodyId
}
