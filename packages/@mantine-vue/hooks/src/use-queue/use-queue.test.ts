import { describe, expect, it } from 'vitest'
import { useQueue } from './use-queue'

describe('@mantine-vue/hooks/use-queue', () => {
  it('correctly distributes initial values when limit is not reached', () => {
    const queue = useQueue({ initialValues: [1], limit: 2 })

    expect(queue.state.value).toStrictEqual([1])
    expect(queue.queue.value).toStrictEqual([])
  })

  it('correctly distributes initial values when limit is reached', () => {
    const queue = useQueue({ initialValues: [1, 2, 3, 4, 5], limit: 2 })

    expect(queue.state.value).toStrictEqual([1, 2])
    expect(queue.queue.value).toStrictEqual([3, 4, 5])
  })

  it('adds items to state or queue depending on limit', () => {
    const queue = useQueue({ initialValues: [1], limit: 2 })

    queue.add(2)
    expect(queue.state.value).toStrictEqual([1, 2])
    expect(queue.queue.value).toStrictEqual([])
    queue.add(3, 4, 5)
    expect(queue.state.value).toStrictEqual([1, 2])
    expect(queue.queue.value).toStrictEqual([3, 4, 5])
  })

  it('correctly applies given update to state with queue', () => {
    const queue = useQueue({ initialValues: [1, 2, 3, 4, 5, 6, 7, 8], limit: 3 })

    queue.update((state) => state.filter((item) => item % 2))
    expect(queue.state.value).toStrictEqual([1, 3, 5])
    expect(queue.queue.value).toStrictEqual([7])
  })

  it('puts extra items to the queue if state has extra items after update', () => {
    const queue = useQueue<number>({ initialValues: [], limit: 3 })

    queue.update(() => [1, 2, 3, 4, 5, 6, 7, 8])
    expect(queue.state.value).toStrictEqual([1, 2, 3])
    expect(queue.queue.value).toStrictEqual([4, 5, 6, 7, 8])
  })

  it('cleans queue with cleanQueue handler', () => {
    const queue = useQueue({ initialValues: [1, 2, 3, 4], limit: 2 })

    queue.cleanQueue()
    expect(queue.state.value).toStrictEqual([1, 2])
    expect(queue.queue.value).toStrictEqual([])
  })
})
