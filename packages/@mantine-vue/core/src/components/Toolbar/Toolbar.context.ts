import { createSafeContext } from '../../core'
export interface ToolbarContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => any
  orientation: 'horizontal' | 'vertical'
}
export const [provideToolbarContext, useToolbarContext] = createSafeContext<ToolbarContextValue>(
  'Toolbar component was not found in tree',
)

export interface ToolbarToggleGroupContextValue {
  value: string | string[] | null
  type: 'single' | 'multiple'
  disabled: boolean
  onChange: (value: string) => void
}
export const [provideToolbarToggleGroupContext, useToolbarToggleGroupContext] =
  createSafeContext<ToolbarToggleGroupContextValue>('Toolbar.ToggleGroup was not found in tree')
