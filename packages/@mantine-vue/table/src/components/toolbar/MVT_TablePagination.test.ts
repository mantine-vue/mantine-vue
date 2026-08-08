import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { MantineProvider, Select } from '@mantine-vue/core'
import { MVT_Default_Icons } from '../../icons'
import { MVT_TablePagination } from './MVT_TablePagination'

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
})
