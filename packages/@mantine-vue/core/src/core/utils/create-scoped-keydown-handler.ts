function getParent(element: HTMLElement, selector: string): HTMLElement | null {
  return element.closest<HTMLElement>(selector)
}

function isOnSameLevel(target: HTMLElement, sibling: HTMLElement, parentSelector: string): boolean {
  return getParent(target, parentSelector) === getParent(sibling, parentSelector)
}

function getPreviousIndex(current: number, elements: HTMLButtonElement[], loop: boolean): number {
  for (let index = current - 1; index >= 0; index -= 1) {
    if (!elements[index].disabled) return index
  }

  if (loop) {
    for (let index = elements.length - 1; index >= 0; index -= 1) {
      if (!elements[index].disabled) return index
    }
  }

  return current
}

function getNextIndex(current: number, elements: HTMLButtonElement[], loop: boolean): number {
  for (let index = current + 1; index < elements.length; index += 1) {
    if (!elements[index].disabled) return index
  }

  if (loop) {
    for (let index = 0; index < elements.length; index += 1) {
      if (!elements[index].disabled) return index
    }
  }

  return current
}

export interface CreateScopedKeydownHandlerInput {
  parentSelector: string
  siblingSelector: string
  loop?: boolean
  orientation: 'vertical' | 'horizontal'
  dir?: 'rtl' | 'ltr'
  activateOnFocus?: boolean
  onKeydown?: (event: KeyboardEvent) => void
}

export function createScopedKeydownHandler({
  parentSelector,
  siblingSelector,
  onKeydown,
  loop = true,
  activateOnFocus = false,
  dir = 'rtl',
  orientation,
}: CreateScopedKeydownHandlerInput): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    onKeydown?.(event)

    const target = event.currentTarget as HTMLButtonElement
    const elements = Array.from(
      getParent(target, parentSelector)?.querySelectorAll<HTMLButtonElement>(siblingSelector) ?? [],
    ).filter((element) => isOnSameLevel(target, element, parentSelector))
    const current = elements.indexOf(target)

    if (current === -1 || elements.length === 0) return

    const next = getNextIndex(current, elements, loop)
    const previous = getPreviousIndex(current, elements, loop)
    const horizontalNext = dir === 'rtl' ? previous : next
    const horizontalPrevious = dir === 'rtl' ? next : previous
    let index: number | undefined

    if (orientation === 'horizontal' && event.key === 'ArrowRight') index = horizontalNext
    else if (orientation === 'horizontal' && event.key === 'ArrowLeft') index = horizontalPrevious
    else if (orientation === 'vertical' && event.key === 'ArrowUp') index = previous
    else if (orientation === 'vertical' && event.key === 'ArrowDown') index = next
    else if (event.key === 'Home') index = 0
    else if (event.key === 'End') index = elements.length - 1

    if (index === undefined || elements[index].disabled) return

    event.stopPropagation()
    event.preventDefault()
    elements[index].focus()
    if (activateOnFocus) elements[index].click()
  }
}
