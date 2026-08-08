import { onBeforeUpdate, ref, type Ref } from 'vue'

/**
 *
 * Some components cannot render their default slot with a plain `<slot />` the
 * children need to be walked, cloned or wrapped first so the work happens in a
 * function rendered through `<component :is="renderChildren" />`. That function runs
 * inside its own render effect, which Vue only re-runs when something reactive it read
 * has changed.
 *
 * Reading the returned ref inside such a function subscribes that render effect to it,
 * and the ref is bumped whenever the owning component is about to re-render
 */
export function useSlotRevision(): Ref<number> {
  const slotRevision = ref(0)

  onBeforeUpdate(() => {
    slotRevision.value += 1
  })

  return slotRevision
}
