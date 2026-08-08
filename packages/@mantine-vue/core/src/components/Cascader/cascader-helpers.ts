import type { CascaderOption } from './Cascader.types'

export const optionLabelToString = (option: CascaderOption) =>
  typeof option.label === 'string' || typeof option.label === 'number'
    ? String(option.label)
    : option.value

export const pathsEqual = (
  first: string[] | null | undefined,
  second: string[] | null | undefined,
) =>
  !!first &&
  !!second &&
  first.length === second.length &&
  first.every((item, index) => item === second[index])

export const findEnabledIndex = (options: CascaderOption[], from: number, direction: 1 | -1) => {
  let index = from + direction
  while (index >= 0 && index < options.length) {
    if (!options[index].disabled) return index
    index += direction
  }
  return -1
}

export const call = (handler: unknown, event: Event) => {
  if (Array.isArray(handler)) handler.forEach((item) => item?.(event))
  else if (typeof handler === 'function') handler(event)
}
