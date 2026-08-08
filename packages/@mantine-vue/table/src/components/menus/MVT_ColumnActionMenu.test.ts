import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MantineProvider } from '@mantine-vue/core'
import { MVT_Default_Icons } from '../../icons'
import { MVT_ColumnActionMenu } from './MVT_ColumnActionMenu'

describe('MVT_ColumnActionMenu', () => {
  it('opens when the action button is clicked', async () => {
    const opened = ref(false)
    const column = {
      columnDef: { header: 'Name' },
    }
    const table = {
      getState: () => ({ columnSizing: {}, columnVisibility: {} }),
      options: {
        enableColumnFilters: false,
        enableColumnPinning: false,
        enableColumnResizing: false,
        enableGrouping: false,
        enableHiding: false,
        enableSorting: false,
        icons: MVT_Default_Icons,
        localization: { columnActions: 'Column actions' },
      },
    }

    const wrapper = mount(
      defineComponent({
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(MVT_ColumnActionMenu, {
              header: { column } as any,
              onChange: (value: boolean) => (opened.value = value),
              opened: opened.value,
              table: table as any,
            }),
          ),
      }),
      { attachTo: document.body },
    )

    await wrapper.get('button[aria-label="Column actions"]').trigger('click')
    await nextTick()

    expect(opened.value).toBe(true)
    expect(document.body.querySelector('[data-menu-dropdown]')).not.toBeNull()

    wrapper.unmount()
  })
})
