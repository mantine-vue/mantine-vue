import { getCurrentInstance, onBeforeUnmount, onMounted, onUpdated, type Ref } from 'vue'
import { assignRef, type VueRefTarget } from '@mantine-vue/hooks'

/**
 * Re-targets the `ref` a parent attached to this component so it points at the rendered DOM node
 * instead of the component instance.
 *
 * @deprecated Reads `vnode.ref`'s normalized `{ i, r, k, f }` shape, which is a Vue internal --
 * best-effort, and degrades to a no-op rather than crashing if Vue changes it. Use the factory's
 * `rootRef` prop or the exposed `rootElement` instead. Kept only for components not yet migrated
 * to a factory payload.
 */
export function useForwardedRef<T extends Element>(elementRef: Ref<T | null>): void {
  const instance = getCurrentInstance()

  const sync = () => {
    const externalRef = getExternalRef<T>(instance?.vnode.ref)
    if (externalRef) {
      assignRef(externalRef, elementRef.value)
    }
  }

  // `onUpdated`, not `onBeforeUpdate`, so `elementRef.value` already reflects the applied render.
  onMounted(sync)
  onUpdated(sync)

  // Clear on unmount, so consumers watching for the ref becoming null still see that transition.
  onBeforeUnmount(() => {
    const externalRef = getExternalRef<T>(instance?.vnode.ref)
    if (externalRef) {
      assignRef(externalRef, null)
    }
  })
}

function getExternalRef<T>(vnodeRef: unknown): VueRefTarget<T> | null {
  if (!vnodeRef) {
    return null
  }

  const raw =
    typeof vnodeRef === 'object' && vnodeRef !== null && 'r' in vnodeRef
      ? (vnodeRef as { r: unknown }).r
      : vnodeRef

  if (typeof raw === 'function' || (raw !== null && typeof raw === 'object' && 'value' in raw)) {
    return raw as VueRefTarget<T>
  }

  return null
}
