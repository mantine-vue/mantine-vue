import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MantineProvider } from '@mantine-vue/core'
import MantineVueTable from './MantineVueTable.vue'
import { useMantineVueTable } from '../hooks/useMantineVueTable'
import type { MVT_ColumnDef } from '../types'

interface Person {
  age: number
  name: string
}

const nameColumn = { accessorKey: 'name', header: 'Name' } as MVT_ColumnDef<Person>

const mountTable = (options: Record<string, any> = {}, slots?: Record<string, any>) => {
  const data = ref<Person[]>([{ age: 30, name: 'Zoe' }])
  let table: any

  const wrapper = mount(
    defineComponent({
      setup() {
        table = useMantineVueTable<Person>({
          columns: [nameColumn],
          get data() {
            return data.value
          },
          ...options,
        } as any)
        return () =>
          h(MantineProvider, { env: 'test' }, () => h(MantineVueTable, { table } as any, slots))
      },
    }),
    { attachTo: document.body },
  )

  return { data, table: () => table, wrapper }
}

describe('MantineVueTable', () => {
  it('renders the paper, head and body', () => {
    const { wrapper } = mountTable()
    expect(wrapper.find('.mvt-table-paper').exists()).toBe(true)
    expect(wrapper.findAll('thead tr').length).toBeGreaterThan(0)
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.html()).toContain('Zoe')
  })

  it('renders the empty-rows fallback', () => {
    const { wrapper } = mountTable({ data: [] })
    expect(wrapper.html()).toContain('No records to display')
  })
})

/**
 * `renderX` options and scoped slots produce vnodes that the templates hand to
 * `MVT_RenderNode`. Passing them as a prop is what makes Vue re-render them —
 * a prop-less dynamic component would mount once and then go stale.
 */
describe('MantineVueTable render props', () => {
  it('updates a column Cell renderer', async () => {
    const { data, wrapper } = mountTable({
      columns: [
        {
          ...nameColumn,
          Cell: ({ row }: any) => h('span', { class: 'cell' }, `N=${row.original.name}`),
        },
      ],
    })
    expect(wrapper.find('.cell').text()).toBe('N=Zoe')

    data.value = [{ age: 30, name: 'Ada' }]
    await nextTick()
    await nextTick()
    expect(wrapper.find('.cell').text()).toBe('N=Ada')
  })

  it('updates a column Footer renderer', async () => {
    const { data, wrapper } = mountTable({
      enableTableFooter: true,
      columns: [
        {
          ...nameColumn,
          Footer: ({ table }: any) =>
            h('span', { class: 'footer' }, `n=${table.getRowModel().rows.length}`),
        },
      ],
    })
    expect(wrapper.find('.footer').text()).toBe('n=1')

    data.value = [
      { age: 1, name: 'a' },
      { age: 2, name: 'b' },
    ]
    await nextTick()
    await nextTick()
    expect(wrapper.find('.footer').text()).toBe('n=2')
  })

  it('renders and updates a detail panel', async () => {
    const { data, table, wrapper } = mountTable({
      renderDetailPanel: ({ row }: any) => h('div', { class: 'panel' }, `age:${row.original.age}`),
    })
    table().getRowModel().rows[0].toggleExpanded(true)
    await nextTick()
    await nextTick()
    expect(wrapper.find('.panel').text()).toBe('age:30')

    data.value = [{ age: 99, name: 'Zoe' }]
    await nextTick()
    await nextTick()
    expect(wrapper.find('.panel').text()).toBe('age:99')
  })

  it('renders a detail panel supplied as a slot', async () => {
    const { table, wrapper } = mountTable(
      {},
      { detailPanel: ({ row }: any) => h('div', { class: 'panel' }, `age:${row.original.age}`) },
    )
    table().getRowModel().rows[0].toggleExpanded(true)
    await nextTick()
    await nextTick()
    expect(wrapper.find('.panel').text()).toBe('age:30')
  })

  it('updates top toolbar custom actions', async () => {
    const { table, wrapper } = mountTable({
      renderTopToolbarCustomActions: ({ table: instance }: any) =>
        h('div', { class: 'actions' }, `d=${instance.getState().density}`),
    })
    expect(wrapper.find('.actions').text()).toBe('d=md')

    table().setDensity('xs')
    await nextTick()
    await nextTick()
    expect(wrapper.find('.actions').text()).toBe('d=xs')
  })
})
