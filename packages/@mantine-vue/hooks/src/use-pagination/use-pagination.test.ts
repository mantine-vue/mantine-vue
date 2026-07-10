import { describe, expect, it, vi } from 'vitest'
import { usePagination } from './use-pagination'

describe('@mantine-vue/hooks/use-pagination', () => {
  it('setPage function sets active page', () => {
    const pagination = usePagination({ total: 10 })

    pagination.setPage(5)
    expect(pagination.active.value).toBe(5)
    pagination.setPage(15)
    expect(pagination.active.value).toBe(10)
    pagination.setPage(-1)
    expect(pagination.active.value).toBe(1)
  })

  it('returns correct initial state', () => {
    const pagination = usePagination({ total: 10 })
    expect(pagination.range.value).toStrictEqual([1, 2, 3, 4, 5, 'dots', 10])
    expect(pagination.active.value).toBe(1)
  })

  it('does not change range length between page changes', () => {
    const pagination = usePagination({ total: 10 })

    Array.from({ length: 10 }).forEach(() => {
      expect(pagination.range.value.length).toBe(7)
      pagination.next()
    })
  })

  it('returns correct initial state with custom parameters', () => {
    const pagination = usePagination({
      total: 20,
      siblings: 2,
      boundaries: 2,
      initialPage: 7,
    })

    expect(pagination.range.value).toStrictEqual([1, 2, 'dots', 5, 6, 7, 8, 9, 'dots', 19, 20])
    expect(pagination.active.value).toBe(7)
  })

  it('calls onChange correctly with active page', () => {
    const spy = vi.fn()
    const pagination = usePagination({
      page: 7,
      onChange: spy,
      total: 20,
      siblings: 2,
      boundaries: 2,
    })

    pagination.next()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(8)
  })

  it('does not change range length between page changes with custom parameters', () => {
    const pagination = usePagination({
      total: 20,
      siblings: 2,
      boundaries: 2,
      initialPage: 7,
    })

    Array.from({ length: 20 }).forEach(() => {
      expect(pagination.range.value.length).toBe(11)
      pagination.next()
    })
  })

  it('truncates total value', () => {
    const pagination = usePagination({ total: 45.21 })
    expect(pagination.range.value).toStrictEqual([1, 2, 3, 4, 5, 'dots', 45])
  })

  it('handles negative total value correctly', () => {
    const pagination = usePagination({ total: -5 })
    expect(pagination.range.value).toStrictEqual([1])
  })

  it('handles startValue correctly', () => {
    const pagination = usePagination({ total: 15, startValue: 5 })

    expect(pagination.range.value).toStrictEqual([5, 6, 7, 8, 9, 'dots', 15])
    expect(pagination.active.value).toBe(5)
    pagination.setPage(10)
    expect(pagination.active.value).toBe(10)
    expect(pagination.range.value).toStrictEqual([5, 'dots', 9, 10, 11, 'dots', 15])
    pagination.first()
    expect(pagination.active.value).toBe(5)
    pagination.last()
    expect(pagination.active.value).toBe(15)
    pagination.setPage(3)
    expect(pagination.active.value).toBe(5)
    pagination.setPage(20)
    expect(pagination.active.value).toBe(15)
  })
})
