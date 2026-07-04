import { createSafeContext } from '../../core'

export interface RatingContextValue {
  getStyles: (selector: string, options?: { className?: any; style?: any; props?: any }) => any
}

export const [provideRatingContext, useRatingContext] = createSafeContext<RatingContextValue>(
  'Rating was not found in tree',
)
