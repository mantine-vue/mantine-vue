import { getCurrentInstance, onBeforeUnmount, onMounted, onUpdated, type Ref } from 'vue'
import { assignRef, type VueRefTarget } from '@mantine-vue/hooks'

/**
 * Vue has no built-in equivalent of React's `forwardRef`: a `ref` attached to
 * a component (e.g. `<Button ref="x" />`) always resolves to the component's
 * public instance proxy, never to the DOM node it renders.
 *
 * This helper reads the `ref` the *parent* attached to the current component
 * instance and keeps it in sync with `elementRef` -- the component's own ref
 * to its rendered root element -- so the parent's ref ends up pointing at the
 * real DOM node instead, matching React Mantine's `factory()` behavior.
 *
 * It relies on a documented-but-internal detail of Vue 3: whenever a `ref`
 * prop is a string, a `Ref`, or a function, Vue normalizes `vnode.ref` into
 * an `{ i, r, k, f }` descriptor before the component ever sees it, where `r`
 * is the original value the parent passed (see `normalizeRef` in
 * `@vue/runtime-core`'s `vnode.ts`). This shape has been stable across Vue
 * 3.x, but it isn't public API, so treat this as a best-effort forwarder --
 * if a future Vue version changes it, this degrades to a no-op (the ref
 * simply won't forward), not a crash.
 *
 * Usage inside a component's `setup()`, once `elementRef` is bound to the
 * component's real root element:
 *
 * ```ts
 * setup(props, { attrs }) {
 *   const elementRef = ref<HTMLDivElement | null>(null)
 *   useForwardedRef(elementRef)
 *   return () => h('div', { ...attrs, ref: elementRef })
 * }
 * ```
 *
 * For multi-layer components (e.g. `Button` renders `UnstyledButton`, which
 * renders `Box`, which renders the native element), every layer needs to
 * call `useForwardedRef` and attach its own `elementRef` to whatever it
 * renders -- each layer intercepts the ref passed by its parent and
 * re-targets it one level down, the same way React's `forwardRef` calls are
 * threaded explicitly through each wrapper.
 */
export function useForwardedRef<T extends Element>(elementRef: Ref<T | null>): void {
  const instance = getCurrentInstance()

  const sync = () => {
    const externalRef = getExternalRef<T>(instance?.vnode.ref)
    if (externalRef) {
      assignRef(externalRef, elementRef.value)
    }
  }

  // `onUpdated` (not `onBeforeUpdate`) so `elementRef.value` already reflects
  // the DOM node for the just-applied render before we propagate it outward.
  onMounted(sync)
  onUpdated(sync)

  // Match React's `ref.current = null` cleanup: clear the external ref when
  // this component unmounts, so consumers relying on the ref becoming null
  // (e.g. to detach observers) still see that transition.
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
