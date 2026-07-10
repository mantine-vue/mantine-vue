import { ref, type Ref } from 'vue'

export interface UseDisclosureOptions {
  onOpen?: () => void
  onClose?: () => void
}

export interface UseDisclosureHandlers {
  set: (value: boolean) => void
  open: () => void
  close: () => void
  toggle: () => void
}

export type UseDisclosureReturnValue = [Ref<boolean>, UseDisclosureHandlers]

export function useDisclosure(
  initialState = false,
  options: UseDisclosureOptions = {},
): UseDisclosureReturnValue {
  const opened = ref(initialState)

  const set = (value: boolean) => {
    if (value && !opened.value) {
      options.onOpen?.()
    }

    if (!value && opened.value) {
      options.onClose?.()
    }

    opened.value = value
  }

  return [
    opened,
    {
      set,
      open: () => set(true),
      close: () => set(false),
      toggle: () => set(!opened.value),
    },
  ]
}
