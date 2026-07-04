import { createSafeContext } from '../../core'

export interface PaginationContextValue {
  total: number
  range: Array<number | 'dots'>
  active: number
  disabled?: boolean
  getItemProps?: (page: number) => Record<string, any>
  getStyles: (selector: string, options?: { className?: any; style?: any; props?: any }) => any
  onChange: (page: number) => void
  onNext: () => void
  onPrevious: () => void
  onFirst: () => void
  onLast: () => void
}

export const [providePaginationContext, usePaginationContext] =
  createSafeContext<PaginationContextValue>('Pagination.Root component was not found in tree')
