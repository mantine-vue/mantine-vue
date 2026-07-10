import {
  createCollapse,
  getElementContentSize,
  type UseCollapseInput,
  type UseCollapseReturnValue,
} from './use-collapse'

export type UseHorizontalCollapseInput = UseCollapseInput
export type UseHorizontalCollapseReturnValue = UseCollapseReturnValue

export function useHorizontalCollapse(input: UseCollapseInput): UseCollapseReturnValue {
  return createCollapse({
    ...input,
    dimension: 'width',
    getElementSize: (element) => getElementContentSize(element, 'width'),
  })
}
