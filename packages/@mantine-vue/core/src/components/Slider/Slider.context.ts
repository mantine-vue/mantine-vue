import { createSafeContext } from '../../core'
export type SliderStylesNames =
  | 'root'
  | 'label'
  | 'thumb'
  | 'trackContainer'
  | 'track'
  | 'bar'
  | 'markWrapper'
  | 'mark'
  | 'markLabel'
export type SliderCssVariables = {
  root: '--slider-size' | '--slider-color' | '--slider-thumb-size' | '--slider-radius'
}
export const [provideSliderContext, useSliderContext] = createSafeContext<{
  getStyles: (selector: string, options?: any) => any
}>('SliderProvider was not found in tree')
