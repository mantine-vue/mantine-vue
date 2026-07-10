import { onBeforeUnmount, ref, type Ref } from 'vue'

export interface UseClipboardInput {
  timeout?: number
}

export interface UseClipboardReturnValue {
  copy: (value: string) => Promise<void>
  copied: Ref<boolean>
  reset: () => void
  error: Ref<Error | null>
}

export function useClipboard({ timeout = 2000 }: UseClipboardInput = {}): UseClipboardReturnValue {
  const copied = ref(false)
  const error = ref<Error | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  const reset = () => {
    copied.value = false
    error.value = null
    clearTimeout(timer)
  }

  const copy = async (value: string) => {
    // Matches the pre-refactor behavior this hook has always had: when the
    // Clipboard API isn't available (e.g. jsdom in tests, insecure
    // contexts), `copy()` still resolves as a no-op "success" rather than
    // silently doing nothing. Only an actual `writeText` rejection is
    // treated as a real failure.
    let succeeded = true

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(value)
        error.value = null
      } catch (err) {
        error.value = err as Error
        succeeded = false
      }
    }

    if (succeeded) {
      copied.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
      }, timeout)
    }
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { copy, copied, reset, error }
}
