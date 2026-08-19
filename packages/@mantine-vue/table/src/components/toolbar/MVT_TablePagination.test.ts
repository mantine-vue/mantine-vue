import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { MantineProvider, Select } from '@mantine-vue/core'
import { MVT_Default_Icons } from '../../icons'
import MVT_TablePagination from './MVT_TablePagination.vue'

describe('MVT_TablePagination', () => {
  it('displays and updates the current page size', async () => {
    const setPageSize = vi.fn()
    const table = {
      getPrePaginationRowModel: () => ({ rows: Array.from({ length: 25 }) }),
      getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }),
      options: {
        icons: MVT_Default_Icons,
        localization: {
          goToFirstPage: 'First page',
          goToLastPage: 'Last page',
          goToNextPage: 'Next page',
          goToPreviousPage: 'Previous page',
          of: 'of',
          rowsPerPage: 'Rows per page',
        },
        paginationDisplayMode: 'default',
      },
      setPageIndex: vi.fn(),
      setPageSize,
    }

    const wrapper = mount(
      defineComponent({
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(MVT_TablePagination, { table: table as any }),
          ),
      }),
    )
    await nextTick()

    const input = wrapper.get('input:not([type="hidden"])')
    expect((input.element as HTMLInputElement).value).toBe('10')

    wrapper.findComponent(Select).vm.$emit('update:modelValue', '20')
    expect(setPageSize).toHaveBeenCalledWith(20)
  })

  it('updates page buttons when the filtered row count changes', async () => {
    const filteredRowCount = ref(50)
    const table = createReactiveTable({ filteredRowCount })
    const wrapper = mountPagination(table)

    expect(pageButtons(wrapper)).toEqual(['1', '2', '3', '4', '5'])

    filteredRowCount.value = 1
    await nextTick()

    expect(pageButtons(wrapper)).toEqual(['1'])
  })

  it('updates page buttons when rows per page changes', async () => {
    const filteredRowCount = ref(50)
    const table = createReactiveTable({ filteredRowCount })
    const wrapper = mountPagination(table)

    expect(pageButtons(wrapper)).toEqual(['1', '2', '3', '4', '5'])

    wrapper.findComponent(Select).vm.$emit('update:modelValue', '25')
    await nextTick()

    expect(pageButtons(wrapper)).toEqual(['1', '2'])
  })
})

const localization = {
  goToFirstPage: 'First page',
  goToLastPage: 'Last page',
  goToNextPage: 'Next page',
  goToPreviousPage: 'Previous page',
  of: 'of',
  rowsPerPage: 'Rows per page',
}

const createReactiveTable = ({ filteredRowCount }: { filteredRowCount: { value: number } }) => {
  const pagination = ref({ pageIndex: 0, pageSize: 10 })
  return {
    getPrePaginationRowModel: () => ({ rows: Array.from({ length: filteredRowCount.value }) }),
    getState: () => ({ pagination: pagination.value, showGlobalFilter: false }),
    options: {
      icons: MVT_Default_Icons,
      localization,
      paginationDisplayMode: 'pages',
    },
    setPageIndex: vi.fn(),
    setPageSize: (pageSize: number) => {
      pagination.value = { ...pagination.value, pageSize }
    },
  }
}

const mountPagination = (table: ReturnType<typeof createReactiveTable>) =>
  mount(
    defineComponent({
      render: () =>
        h(MantineProvider, { env: 'test' }, () => h(MVT_TablePagination, { table: table as any })),
    }),
  )

const pageButtons = (wrapper: ReturnType<typeof mountPagination>) =>
  wrapper
    .findAll('button')
    .map((button) => button.text())
    .filter((text) => /^\d+$/.test(text))
