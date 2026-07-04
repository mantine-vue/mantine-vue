import { createSafeContext } from '@mantine-vue/core'

export interface CarouselContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => Record<string, any>
  orientation: 'horizontal' | 'vertical' | undefined
}

export const [provideCarouselContext, useCarouselContext] = createSafeContext<CarouselContextValue>(
  'Carousel component was not found in tree',
)
