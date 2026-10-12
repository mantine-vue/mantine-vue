import type { InputWrapperOrderPart } from '../Input/InputWrapper/get-input-offsets/get-input-offsets'

interface GetComboboxLabelIdInput {
  id: string
  label: unknown
  labelProps?: Record<string, any>
  inputWrapperOrder?: InputWrapperOrderPart[]
}

export function getComboboxLabelId({
  id,
  label,
  labelProps,
  inputWrapperOrder,
}: GetComboboxLabelIdInput) {
  if (!label || (inputWrapperOrder && !inputWrapperOrder.includes('label'))) {
    return undefined
  }

  return labelProps?.id || `${id}-label`
}
