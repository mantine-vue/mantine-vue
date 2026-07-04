import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  MantineProvider,
  Table,
  TableCaption,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTfoot,
  TableTh,
  TableThead,
  TableTr,
} from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

describe('@mantine-vue/core Table', () => {
  it('renders table data and variables', () => {
    const wrapper = withProvider(() =>
      h(Table, {
        withTableBorder: true,
        horizontalSpacing: 'md',
        verticalSpacing: 'sm',
        data: {
          head: ['Name'],
          body: [['Ada']],
          foot: ['Total'],
          caption: 'People',
        },
      }),
    )

    const table = wrapper.find('table')
    expect(table.attributes('data-with-table-border')).toBe('true')
    expect(table.attributes('style')).toContain(
      '--table-horizontal-spacing: var(--mantine-spacing-md)',
    )
    expect(table.attributes('style')).toContain(
      '--table-vertical-spacing: var(--mantine-spacing-sm)',
    )
    expect(wrapper.find('caption').text()).toBe('People')
    expect(wrapper.find('thead th').text()).toBe('Name')
    expect(wrapper.find('tbody td').text()).toBe('Ada')
    expect(wrapper.find('tfoot th').text()).toBe('Total')
  })

  it('provides compound element attributes from table context', () => {
    const wrapper = withProvider(() =>
      h(
        Table,
        {
          withColumnBorders: true,
          striped: 'even',
          highlightOnHover: true,
          stickyHeader: true,
          captionSide: 'top',
        },
        () => [
          h(TableCaption, null, () => 'Caption'),
          h(TableThead, null, () => h(TableTr, null, () => h(TableTh, null, () => 'Head'))),
          h(TableTbody, null, () => h(TableTr, null, () => h(TableTd, null, () => 'Cell'))),
        ],
      ),
    )

    expect(wrapper.find('caption').attributes('data-side')).toBe('top')
    expect(wrapper.find('thead').attributes('data-sticky')).toBe('true')
    expect(wrapper.find('tbody tr').attributes('data-striped')).toBe('even')
    expect(wrapper.find('tbody tr').attributes('data-hover')).toBe('true')
    expect(wrapper.find('td').attributes('data-with-column-border')).toBe('true')
  })

  it('updates striped and highlightOnHover row attributes when props change', async () => {
    const striped = ref<boolean | 'odd' | 'even'>(false)
    const highlightOnHover = ref(false)
    const wrapper = withProvider(() =>
      h(
        Table,
        {
          striped: striped.value,
          highlightOnHover: highlightOnHover.value,
        },
        () => h(TableTbody, null, () => h(TableTr, null, () => h(TableTd, null, () => 'Cell'))),
      ),
    )

    expect(wrapper.find('tbody tr').attributes('data-striped')).toBeUndefined()
    expect(wrapper.find('tbody tr').attributes('data-hover')).toBeUndefined()

    striped.value = true
    highlightOnHover.value = true
    await nextTick()

    expect(wrapper.find('tbody tr').attributes('data-striped')).toBe('odd')
    expect(wrapper.find('tbody tr').attributes('data-hover')).toBe('true')

    striped.value = 'even'
    await nextTick()

    expect(wrapper.find('tbody tr').attributes('data-striped')).toBe('even')
  })

  it('renders scroll container with ScrollArea by default and native mode on request', () => {
    const wrapper = withProvider(() =>
      h(TableScrollContainer, { minWidth: 500 }, () => h(Table, { data: { body: [['A']] } })),
    )

    expect(wrapper.find('.mantine-ScrollArea-root').exists()).toBe(true)
    expect(
      wrapper.find('.mantine-TableScrollContainer-scrollContainer').attributes('style'),
    ).toContain('--table-min-width: 31.25rem')

    const native = withProvider(() =>
      h(TableScrollContainer, { minWidth: 320, type: 'native' }, () =>
        h(Table, { data: { body: [['B']] } }),
      ),
    )

    expect(native.find('.mantine-ScrollArea-root').exists()).toBe(false)
    expect(
      native.find('.mantine-TableScrollContainer-scrollContainer').attributes('style'),
    ).toContain('--table-overflow: auto')
  })

  it('exposes static components', () => {
    expect(Table.Thead).toBe(TableThead)
    expect(Table.Tbody).toBe(TableTbody)
    expect(Table.Tfoot).toBe(TableTfoot)
    expect(Table.Td).toBe(TableTd)
    expect(Table.Th).toBe(TableTh)
    expect(Table.Tr).toBe(TableTr)
    expect(Table.Caption).toBe(TableCaption)
    expect(Table.ScrollContainer).toBe(TableScrollContainer)
  })
})
