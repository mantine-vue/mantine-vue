import { toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import { useUncontrolled } from '../use-uncontrolled/use-uncontrolled'

export interface UseRovingIndexInput {
  /** Total number of items in the group */
  total: MaybeRefOrGetter<number>

  /** Which arrow keys navigate, `'horizontal'` by default */
  orientation?: 'horizontal' | 'vertical' | 'both'

  /** Whether navigation wraps at boundaries, `true` by default */
  loop?: boolean

  /** Text direction, `'ltr'` by default */
  dir?: 'rtl' | 'ltr'

  /** Whether to click element when it receives focus via keyboard, `false` by default */
  activateOnFocus?: boolean

  /** Number of columns for grid (2D) navigation. When set, enables grid mode */
  columns?: MaybeRefOrGetter<number | undefined>

  /** Controlled focused index */
  focusedIndex?: MaybeRefOrGetter<number | undefined>

  /** Initial focused index for uncontrolled mode, first non-disabled item by default */
  initialIndex?: number

  /** Called when focused index changes */
  onFocusChange?: (index: number) => void

  /** Function to check if item at given index is disabled, `() => false` by default */
  isItemDisabled?: (index: number) => boolean
}

export interface UseRovingIndexGetItemPropsInput {
  /** Index of the item in the group */
  index: number

  /** Called when item is clicked */
  onClick?: (event: MouseEvent) => void

  /** Called when keydown event fires on item */
  onKeyDown?: (event: KeyboardEvent) => void
}

export interface UseRovingIndexReturnValue {
  /** Get props to spread on each navigable item */
  getItemProps: (options: UseRovingIndexGetItemPropsInput) => {
    tabIndex: 0 | -1
    onKeyDown: (event: KeyboardEvent) => void
    onClick: (event: MouseEvent) => void
    ref: (node: HTMLElement | null) => void
  }

  /** Currently focused index */
  focusedIndex: Ref<number>

  /** Programmatically set focused index */
  setFocusedIndex: (index: number) => void
}

function findNextEnabled(
  current: number,
  total: number,
  isItemDisabled: (index: number) => boolean,
  loop: boolean,
): number {
  for (let i = current + 1; i < total; i += 1) {
    if (!isItemDisabled(i)) {
      return i
    }
  }

  if (loop) {
    for (let i = 0; i < current; i += 1) {
      if (!isItemDisabled(i)) {
        return i
      }
    }
  }

  return current
}

function findPreviousEnabled(
  current: number,
  total: number,
  isItemDisabled: (index: number) => boolean,
  loop: boolean,
): number {
  for (let i = current - 1; i >= 0; i -= 1) {
    if (!isItemDisabled(i)) {
      return i
    }
  }

  if (loop) {
    for (let i = total - 1; i > current; i -= 1) {
      if (!isItemDisabled(i)) {
        return i
      }
    }
  }

  return current
}

function findFirstEnabled(total: number, isItemDisabled: (index: number) => boolean): number {
  for (let i = 0; i < total; i += 1) {
    if (!isItemDisabled(i)) {
      return i
    }
  }

  return 0
}

function findLastEnabled(total: number, isItemDisabled: (index: number) => boolean): number {
  for (let i = total - 1; i >= 0; i -= 1) {
    if (!isItemDisabled(i)) {
      return i
    }
  }

  return 0
}

const defaultIsItemDisabled = () => false

export function useRovingIndex(input: UseRovingIndexInput): UseRovingIndexReturnValue {
  const {
    total,
    orientation = 'horizontal',
    loop = true,
    dir = 'ltr',
    activateOnFocus = false,
    columns,
    focusedIndex,
    initialIndex,
    onFocusChange,
    isItemDisabled = defaultIsItemDisabled,
  } = input

  const itemRefs = new Map<number, HTMLElement>()
  const getColumns = () => toValue(columns)
  const getIsGrid = () => {
    const cols = getColumns()
    return typeof cols === 'number' && cols > 0
  }

  const resolvedInitialIndex =
    initialIndex !== undefined ? initialIndex : findFirstEnabled(toValue(total), isItemDisabled)

  const [activeIndex, setActiveIndex] = useUncontrolled<number>({
    value: focusedIndex,
    defaultValue: resolvedInitialIndex,
    finalValue: 0,
    onChange: onFocusChange,
  })

  watch(
    () => [toValue(total), activeIndex.value] as const,
    ([currentTotal, currentActive]) => {
      if (currentTotal === 0) {
        return
      }

      if (currentActive >= currentTotal) {
        setActiveIndex(findLastEnabled(currentTotal, isItemDisabled))
      } else if (isItemDisabled(currentActive)) {
        setActiveIndex(findFirstEnabled(currentTotal, isItemDisabled))
      }
    },
    { immediate: true },
  )

  const focusItem = (index: number) => {
    setActiveIndex(index)
    const element = itemRefs.get(index)
    if (element) {
      element.focus()
      if (activateOnFocus) {
        element.click()
      }
    }
  }

  const handleGridKeyDown = (event: KeyboardEvent, currentIndex: number) => {
    const cols = getColumns() as number
    const total_ = toValue(total)
    const row = Math.floor(currentIndex / cols)
    const col = currentIndex % cols
    const totalRows = Math.ceil(total_ / cols)
    let nextIndex: number | null = null

    const isRtl = dir === 'rtl'

    switch (event.key) {
      case 'ArrowRight': {
        const targetCol = isRtl ? col - 1 : col + 1
        if (targetCol >= 0 && targetCol < cols && row * cols + targetCol < total_) {
          const candidate = row * cols + targetCol
          if (!isItemDisabled(candidate)) {
            nextIndex = candidate
          }
        }
        break
      }

      case 'ArrowLeft': {
        const targetCol = isRtl ? col + 1 : col - 1
        if (targetCol >= 0 && targetCol < cols && row * cols + targetCol < total_) {
          const candidate = row * cols + targetCol
          if (!isItemDisabled(candidate)) {
            nextIndex = candidate
          }
        }
        break
      }

      case 'ArrowDown': {
        for (let r = row + 1; r < totalRows; r += 1) {
          const candidate = r * cols + col
          if (candidate < total_ && !isItemDisabled(candidate)) {
            nextIndex = candidate
            break
          }
        }
        break
      }

      case 'ArrowUp': {
        for (let r = row - 1; r >= 0; r -= 1) {
          const candidate = r * cols + col
          if (candidate < total_ && !isItemDisabled(candidate)) {
            nextIndex = candidate
            break
          }
        }
        break
      }

      case 'Home': {
        if (event.ctrlKey) {
          nextIndex = findFirstEnabled(total_, isItemDisabled)
        } else {
          const rowStart = row * cols
          for (let i = rowStart; i < rowStart + cols && i < total_; i += 1) {
            if (!isItemDisabled(i)) {
              nextIndex = i
              break
            }
          }
        }
        break
      }

      case 'End': {
        if (event.ctrlKey) {
          nextIndex = findLastEnabled(total_, isItemDisabled)
        } else {
          const rowStart = row * cols
          const rowEnd = Math.min(rowStart + cols, total_) - 1
          for (let i = rowEnd; i >= rowStart; i -= 1) {
            if (!isItemDisabled(i)) {
              nextIndex = i
              break
            }
          }
        }
        break
      }
    }

    if (nextIndex !== null && nextIndex !== currentIndex) {
      event.preventDefault()
      event.stopPropagation()
      focusItem(nextIndex)
    }
  }

  const handleListKeyDown = (event: KeyboardEvent, currentIndex: number) => {
    const total_ = toValue(total)
    const isRtl = dir === 'rtl'
    let nextIndex: number | null = null

    switch (event.key) {
      case 'ArrowRight': {
        if (orientation === 'horizontal' || orientation === 'both') {
          nextIndex = isRtl
            ? findPreviousEnabled(currentIndex, total_, isItemDisabled, loop)
            : findNextEnabled(currentIndex, total_, isItemDisabled, loop)
        }
        break
      }

      case 'ArrowLeft': {
        if (orientation === 'horizontal' || orientation === 'both') {
          nextIndex = isRtl
            ? findNextEnabled(currentIndex, total_, isItemDisabled, loop)
            : findPreviousEnabled(currentIndex, total_, isItemDisabled, loop)
        }
        break
      }

      case 'ArrowDown': {
        if (orientation === 'vertical' || orientation === 'both') {
          nextIndex = findNextEnabled(currentIndex, total_, isItemDisabled, loop)
        }
        break
      }

      case 'ArrowUp': {
        if (orientation === 'vertical' || orientation === 'both') {
          nextIndex = findPreviousEnabled(currentIndex, total_, isItemDisabled, loop)
        }
        break
      }

      case 'Home': {
        nextIndex = findFirstEnabled(total_, isItemDisabled)
        break
      }

      case 'End': {
        nextIndex = findLastEnabled(total_, isItemDisabled)
        break
      }
    }

    if (nextIndex !== null && nextIndex !== currentIndex) {
      event.preventDefault()
      event.stopPropagation()
      focusItem(nextIndex)
    }
  }

  const getItemProps = (options: UseRovingIndexGetItemPropsInput) => {
    const { index, onClick, onKeyDown } = options

    return {
      tabIndex: (index === activeIndex.value ? 0 : -1) as 0 | -1,

      ref: (node: HTMLElement | null) => {
        if (node) {
          itemRefs.set(index, node)
        } else {
          itemRefs.delete(index)
        }
      },

      onKeyDown: (event: KeyboardEvent) => {
        onKeyDown?.(event)

        if (event.defaultPrevented) {
          return
        }

        if (getIsGrid()) {
          handleGridKeyDown(event, index)
        } else {
          handleListKeyDown(event, index)
        }
      },

      onClick: (event: MouseEvent) => {
        onClick?.(event)
        setActiveIndex(index)
      },
    }
  }

  return {
    getItemProps,
    focusedIndex: activeIndex,
    setFocusedIndex: setActiveIndex,
  }
}
