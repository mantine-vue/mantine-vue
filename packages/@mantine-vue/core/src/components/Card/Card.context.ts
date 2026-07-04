import { createSafeContext } from '../../core'

export interface CardContextValue {
  getStyles: (selector: string, options?: { className?: any; style?: any }) => any
}

export const [provideCardContext, useCardContext] = createSafeContext<CardContextValue>(
  'Card component was not found in tree',
)
