import { onBeforeUnmount, onMounted, ref, watch, type MaybeRefOrGetter } from 'vue'
export function useResizing(input: {
  transitionDuration: MaybeRefOrGetter<number>
  disabled: MaybeRefOrGetter<boolean>
  resizeKey?: MaybeRefOrGetter<string | undefined>
}) {
  const resizing = ref(true)
  let timer: ReturnType<typeof setTimeout>
  const stop = (delay: number) => {
    clearTimeout(timer)
    resizing.value = true
    timer = setTimeout(() => (resizing.value = false), delay)
  }
  const resize = () => stop(200)
  onMounted(() => {
    window.addEventListener('resize', resize)
    stop(0)
  })
  watch(
    [
      () =>
        typeof input.transitionDuration === 'function'
          ? input.transitionDuration()
          : input.transitionDuration,
      () => (typeof input.disabled === 'function' ? input.disabled() : input.disabled),
      () => (typeof input.resizeKey === 'function' ? input.resizeKey() : input.resizeKey),
    ],
    () =>
      stop(
        Number(
          typeof input.transitionDuration === 'function'
            ? input.transitionDuration()
            : input.transitionDuration,
        ) || 0,
      ),
  )
  onBeforeUnmount(() => {
    clearTimeout(timer)
    window.removeEventListener('resize', resize)
  })
  return resizing
}
