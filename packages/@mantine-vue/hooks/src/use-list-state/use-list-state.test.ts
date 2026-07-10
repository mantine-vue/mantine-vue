import { describe, expect, it } from 'vitest'
import { useListState } from './use-list-state'

const TEST_STATE = [
  { name: 'John', age: 23, skills: ['JavaScript', 'Dart'] },
  { name: 'Amy', age: 21, skills: ['TypeScript'] },
  { name: 'Bill', age: 36, skills: ['Python', 'Django'] },
]

const TEST_ITEM_1 = { name: 'Emily', age: 18, skills: ['Lua', 'Haskell'] }
const TEST_ITEM_2 = { name: 'Bob', age: 44, skills: ['Angular', 'TypeScript'] }

describe('@mantine-vue/hooks/use-list-state', () => {
  it('returns initial state if no modifications were applied', () => {
    const [state] = useListState(TEST_STATE)
    expect(state.value).toStrictEqual(TEST_STATE)
  })

  it('sets state with given value or callback', () => {
    const [withValueState, withValueHandlers] = useListState(TEST_STATE)
    const [withCallbackState, withCallbackHandlers] = useListState(TEST_STATE)

    withValueHandlers.setState([TEST_ITEM_1])
    withCallbackHandlers.setState((current) => [TEST_ITEM_1, ...current, TEST_ITEM_2])

    expect(withValueState.value).toStrictEqual([TEST_ITEM_1])
    expect(withCallbackState.value).toStrictEqual([TEST_ITEM_1, ...TEST_STATE, TEST_ITEM_2])
  })

  it('adds items to the end and start of the list', () => {
    const [appendedState, appendHandlers] = useListState(TEST_STATE)
    const [prependedState, prependHandlers] = useListState(TEST_STATE)

    appendHandlers.append(TEST_ITEM_1, TEST_ITEM_2)
    prependHandlers.prepend(TEST_ITEM_1, TEST_ITEM_2)

    expect(appendedState.value).toStrictEqual([...TEST_STATE, TEST_ITEM_1, TEST_ITEM_2])
    expect(prependedState.value).toStrictEqual([TEST_ITEM_1, TEST_ITEM_2, ...TEST_STATE])
  })

  it('inserts items at given position', () => {
    const [state, handlers] = useListState(TEST_STATE)

    handlers.insert(1, TEST_ITEM_1, TEST_ITEM_2)
    expect(state.value).toStrictEqual([
      TEST_STATE[0],
      TEST_ITEM_1,
      TEST_ITEM_2,
      TEST_STATE[1],
      TEST_STATE[2],
    ])
  })

  it('removes items with given indices', () => {
    const [state, handlers] = useListState(TEST_STATE)

    handlers.remove(0, 1)
    expect(state.value).toStrictEqual([TEST_STATE[2]])
  })

  it('applies transformations to all or selected items', () => {
    const [allState, allHandlers] = useListState(TEST_STATE)
    const [whereState, whereHandlers] = useListState(TEST_STATE)

    allHandlers.apply((item, index) => ({ ...item, age: item.age + index! }))
    whereHandlers.applyWhere(
      (item) => item.age > 30,
      (item) => ({ ...item, experienced: true }),
    )

    expect(allState.value).toStrictEqual([
      TEST_STATE[0],
      { ...TEST_STATE[1], age: TEST_STATE[1].age + 1 },
      { ...TEST_STATE[2], age: TEST_STATE[2].age + 2 },
    ])
    expect(whereState.value).toStrictEqual([
      TEST_STATE[0],
      TEST_STATE[1],
      { ...TEST_STATE[2], experienced: true },
    ])
  })

  it('reorders and swaps items', () => {
    const [reorderedState, reorderHandlers] = useListState(TEST_STATE)
    const [swappedState, swapHandlers] = useListState(TEST_STATE)

    reorderHandlers.reorder({ from: 0, to: 2 })
    swapHandlers.swap({ from: 0, to: 2 })

    expect(reorderedState.value).toStrictEqual([TEST_STATE[1], TEST_STATE[2], TEST_STATE[0]])
    expect(swappedState.value).toStrictEqual([TEST_STATE[2], TEST_STATE[1], TEST_STATE[0]])
  })

  it('sets item and item property at given position', () => {
    const [itemState, itemHandlers] = useListState(TEST_STATE)
    const [propState, propHandlers] = useListState(TEST_STATE)

    itemHandlers.setItem(1, TEST_ITEM_1)
    propHandlers.setItemProp(1, 'age', 90)

    expect(itemState.value).toStrictEqual([TEST_STATE[0], TEST_ITEM_1, TEST_STATE[2]])
    expect(propState.value).toStrictEqual([
      TEST_STATE[0],
      { ...TEST_STATE[1], age: 90 },
      TEST_STATE[2],
    ])
  })

  it('supports primitive values and removal helpers', () => {
    const [state, handlers] = useListState(['test-1', 'test-2', 'test-3'])

    handlers.setItem(1, 'test-4')
    expect(state.value).toStrictEqual(['test-1', 'test-4', 'test-3'])
    handlers.pop()
    expect(state.value).toStrictEqual(['test-1', 'test-4'])
    handlers.shift()
    expect(state.value).toStrictEqual(['test-4'])
  })

  it('filters items with handlers.filter', () => {
    const [state, handlers] = useListState(TEST_STATE)
    const filterFn = (item: (typeof TEST_STATE)[number]) => item.name !== 'Bill'

    handlers.filter(filterFn)
    expect(state.value).toEqual(TEST_STATE.filter(filterFn))
  })
})
