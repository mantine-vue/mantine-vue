import { defineComponent, h, nextTick, shallowRef, triggerRef } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MantineProvider } from '@mantine-vue/core'
import MantineVueTable from './MantineVueTable.vue'
import { useMantineVueTable } from '../hooks/useMantineVueTable'
import type { MVT_ColumnDef } from '../types'

const virtualizerState = vi.hoisted(() => ({
  columnItems: [] as Array<{ end: number; index: number; size: number; start: number }>,
  columnRef: undefined as any,
  rowItems: [] as Array<{ end: number; index: number; size: number; start: number }>,
  rowRef: undefined as any,
}))

vi.mock('../hooks/useMVT_RowVirtualizer', () => ({
  useMVT_RowVirtualizer: (table: any) => {
    if (!table.options.enableRowVirtualization) return undefined

    const virtualizer = {
      getTotalSize: () => 55,
      getVirtualItems: () => virtualizerState.rowItems,
      measureElement: vi.fn(),
      get virtualRows() {
        return virtualizerState.rowItems
      },
    }
    virtualizerState.rowRef = shallowRef(virtualizer)
    return virtualizerState.rowRef
  },
}))

vi.mock('../hooks/useMVT_ColumnVirtualizer', () => ({
  useMVT_ColumnVirtualizer: (table: any) => {
    if (!table.options.enableColumnVirtualization) return undefined

    const virtualizer = {
      getTotalSize: () => 180,
      getVirtualItems: () => virtualizerState.columnItems,
      measureElement: vi.fn(),
      get virtualColumns() {
        return virtualizerState.columnItems
      },
      get virtualPaddingLeft() {
        return undefined
      },
      get virtualPaddingRight() {
        return undefined
      },
    }
    virtualizerState.columnRef = shallowRef(virtualizer)
    return virtualizerState.columnRef
  },
}))

interface Person {
  name: string
}

const mountTable = (options: Record<string, any>) =>
  mount(
    defineComponent({
      setup() {
        const table = useMantineVueTable<Person>({
          columns: [{ accessorKey: 'name', header: 'Name' } as MVT_ColumnDef<Person>],
          data: [{ name: 'Zoe' }],
          ...options,
        } as any)
        return () => h(MantineProvider, { env: 'test' }, () => h(MantineVueTable, { table }))
      },
    }),
    { attachTo: document.body },
  )

beforeEach(() => {
  virtualizerState.columnItems = []
  virtualizerState.columnRef = undefined
  virtualizerState.rowItems = []
  virtualizerState.rowRef = undefined
})

describe('MantineVueTable virtualization', () => {
  it('renders rows when the row virtualizer triggers with the same instance', async () => {
    const wrapper = mountTable({ enableRowVirtualization: true })
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)

    virtualizerState.rowItems = [{ end: 55, index: 0, size: 55, start: 0 }]
    triggerRef(virtualizerState.rowRef)
    await nextTick()

    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.html()).toContain('Zoe')
  })

  it('renders columns when the column virtualizer triggers with the same instance', async () => {
    const wrapper = mountTable({ enableColumnVirtualization: true })
    expect(wrapper.findAll('tbody td')).toHaveLength(0)

    virtualizerState.columnItems = [{ end: 180, index: 0, size: 180, start: 0 }]
    triggerRef(virtualizerState.columnRef)
    await nextTick()

    expect(wrapper.findAll('tbody td')).toHaveLength(1)
    expect(wrapper.html()).toContain('Zoe')
  })
})
