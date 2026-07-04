import { createSafeContext } from '../../core'
import type { ComboboxOptionProps } from './Combobox'
import type { ComboboxStore } from './use-combobox/use-combobox'
export interface ComboboxContextValue {
  getStyles: any
  store: ComboboxStore
  onOptionSubmit?: (value: string, props: ComboboxOptionProps) => void
  size: string
  resetSelectionOnOptionHover?: boolean
  readOnly?: boolean
  floatingHeight?: 'viewport'
}
export const [provideComboboxContext, useComboboxContext] = createSafeContext<ComboboxContextValue>(
  'Combobox component was not found in tree',
)
