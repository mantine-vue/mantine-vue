import { nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useRovingIndex } from './use-roving-index'

function getItemTabIndices(result: ReturnType<typeof useRovingIndex>, total: number) {
  return Array.from({ length: total }, (_, index) => result.getItemProps({ index }).tabIndex)
}

describe('@mantine-vue/hooks/use-roving-index', () => {
  it('assigns tabIndex=0 to first item and tabIndex=-1 to others by default', () => {
    const result = useRovingIndex({ total: 5 })
    expect(getItemTabIndices(result, 5)).toEqual([0, -1, -1, -1, -1])
  })

  it('uses initialIndex to set the starting focused item', () => {
    const result = useRovingIndex({ total: 5, initialIndex: 2 })
    expect(getItemTabIndices(result, 5)).toEqual([-1, -1, 0, -1, -1])
  })

  it('skips disabled items for initial focus', () => {
    const result = useRovingIndex({ total: 5, isItemDisabled: (index) => index === 0 })
    expect(getItemTabIndices(result, 5)).toEqual([-1, 0, -1, -1, -1])
  })

  it('updates focusedIndex on click and composes user onClick handler', () => {
    const onFocusChange = vi.fn()
    const onClick = vi.fn()
    const result = useRovingIndex({ total: 5, onFocusChange })

    result.getItemProps({ index: 3, onClick }).onClick(new MouseEvent('click'))
    expect(result.focusedIndex.value).toBe(3)
    expect(onClick).toHaveBeenCalled()
    expect(onFocusChange).toHaveBeenCalledWith(3)
  })

  it('supports controlled focusedIndex', async () => {
    const focusedIndex = ref(1)
    const result = useRovingIndex({ total: 5, focusedIndex })

    expect(getItemTabIndices(result, 5)).toEqual([-1, 0, -1, -1, -1])
    focusedIndex.value = 4
    await nextTick()
    expect(getItemTabIndices(result, 5)).toEqual([-1, -1, -1, -1, 0])
  })

  it('navigates horizontal list with arrow keys and skips disabled items', () => {
    const result = useRovingIndex({
      total: 5,
      orientation: 'horizontal',
      isItemDisabled: (index) => index === 1,
    })

    result.getItemProps({ index: 0 }).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(result.focusedIndex.value).toBe(2)
    result.getItemProps({ index: 2 }).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(result.focusedIndex.value).toBe(0)
  })

  it('navigates grid with arrow keys and Home/End', () => {
    const result = useRovingIndex({ total: 9, columns: 3, initialIndex: 3 })

    result.getItemProps({ index: 3 }).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(result.focusedIndex.value).toBe(4)
    result.getItemProps({ index: 4 }).onKeyDown(new KeyboardEvent('keydown', { key: 'End' }))
    expect(result.focusedIndex.value).toBe(5)
    result.getItemProps({ index: 5 }).onKeyDown(new KeyboardEvent('keydown', { key: 'Home' }))
    expect(result.focusedIndex.value).toBe(3)
  })
})
