import { computed } from 'vue'
import type { UseFormReturnType } from './types'

export interface UseFieldInput<Values extends Record<string, any>> {
  form: UseFormReturnType<Values>
  path: keyof Values | string
}

export function useField<Values extends Record<string, any>>({
  form,
  path,
}: UseFieldInput<Values>) {
  return {
    value: computed({
      get: () => form.getInputProps(path).value,
      set: (value) => form.setFieldValue(path, value),
    }),
    error: computed(() => form.errors.value[String(path)]),
    touched: computed(() => form.isTouched(path)),
    dirty: computed(() => form.isDirty(path)),
    getInputProps: () => form.getInputProps(path),
  }
}
