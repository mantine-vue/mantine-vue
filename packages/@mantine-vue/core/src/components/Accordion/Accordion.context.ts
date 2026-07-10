import { createSafeContext } from '../../core'

export type AccordionChevronPosition = 'left' | 'right'
export type AccordionHeadingOrder = 2 | 3 | 4 | 5 | 6
export type AccordionValue<Multiple extends boolean = false> = Multiple extends true
  ? string[]
  : string | null

export interface AccordionContextValue {
  loop?: boolean
  transitionDuration?: number
  disableChevronRotation?: boolean
  chevronPosition?: AccordionChevronPosition
  order?: AccordionHeadingOrder
  chevron: any
  onChange: (value: string) => void
  isItemActive: (value: string) => boolean
  getControlId: (value: string) => string
  getRegionId: (value: string) => string
  getStyles: (
    selector: string,
    options?: {
      className?: any
      style?: any
      classNames?: any
      styles?: any
      props?: any
      variant?: string
    },
  ) => any
  variant?: string
  unstyled?: boolean
  keepMounted?: boolean
}

export const [provideAccordionContext, useAccordionContext] =
  createSafeContext<AccordionContextValue>('Accordion component was not found in the tree')
