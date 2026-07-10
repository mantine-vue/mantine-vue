import { nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useSelection } from './use-selection'

describe('@mantine-vue/hooks/use-selection', () => {
  it('correctly returns initial state for an empty data array', () => {
    const [selection, handlers] = useSelection({ data: [] as number[] })

    expect(selection.value).toStrictEqual([])
    expect(handlers.isAllSelected()).toBe(false)
    expect(handlers.isSomeSelected()).toBe(false)
  })

  it('correctly initializes with defaultSelection', () => {
    const defaultSelection = [1, 3]
    const [selection, handlers] = useSelection({ data: [1, 2, 3, 4, 5], defaultSelection })

    expect(selection.value).toEqual(expect.arrayContaining(defaultSelection))
    expect(selection.value).toHaveLength(2)
    expect(handlers.isAllSelected()).toBe(false)
    expect(handlers.isSomeSelected()).toBe(true)
  })

  it('selects, deselects, toggles, and resets items', () => {
    const [selection, handlers] = useSelection({ data: [1, 2, 3] })

    handlers.select(1)
    expect(selection.value).toStrictEqual([1])
    handlers.select(1)
    expect(selection.value).toStrictEqual([1])
    handlers.toggle(1)
    expect(selection.value).toStrictEqual([])
    handlers.select(1)
    handlers.select(2)
    handlers.deselect(1)
    expect(selection.value).toStrictEqual([2])
    handlers.resetSelection()
    expect(selection.value).toStrictEqual([])
  })

  it('calculates selected states and supports setSelection', () => {
    const [selection, handlers] = useSelection({ data: [10, 20, 30] })

    handlers.setSelection([10, 30])
    expect(selection.value).toEqual(expect.arrayContaining([10, 30]))
    expect(handlers.isAllSelected()).toBe(false)
    expect(handlers.isSomeSelected()).toBe(true)
    handlers.setSelection([10, 20, 30])
    expect(handlers.isAllSelected()).toBe(true)
    expect(handlers.isSomeSelected()).toBe(true)
  })

  it('resets selection when data changes and resetSelectionOnDataChange is true', async () => {
    const data = ref([1, 2, 3])
    const [selection, handlers] = useSelection({ data, resetSelectionOnDataChange: true })

    handlers.select(1)
    handlers.select(2)
    expect(selection.value).toEqual(expect.arrayContaining([1, 2]))
    data.value = [1, 2, 3, 4, 5]
    await nextTick()
    expect(selection.value).toStrictEqual([])
  })

  it('handles duplicates in defaultSelection correctly', () => {
    const [selection, handlers] = useSelection({ data: [1, 2, 3], defaultSelection: [1, 1, 2] })

    expect(selection.value).toEqual(expect.arrayContaining([1, 2]))
    expect(selection.value).toHaveLength(2)
    expect(handlers.isSomeSelected()).toBe(true)
  })
})
