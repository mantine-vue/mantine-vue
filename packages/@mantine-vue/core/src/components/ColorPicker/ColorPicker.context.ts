import { inject, provide, type InjectionKey } from 'vue'
export interface ColorPickerContextValue {
  getStyles: (selector: string, options?: any) => any
  unstyled?: boolean
}
const ColorPickerContextKey = Symbol('ColorPickerContext') as InjectionKey<ColorPickerContextValue>
export const provideColorPickerContext = (value: ColorPickerContextValue) =>
  provide(ColorPickerContextKey, value)
export const useColorPickerContext = () => inject(ColorPickerContextKey, null)
