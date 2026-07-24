import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { provideMVT_Slots } from '../MVT_TableSlots'
import { MVT_EditRowModal } from './MVT_EditRowModal'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('MVT_EditRowModal', () => {
  it('renders editRowModalContent provided by MantineVueTable', async () => {
    const row = {
      id: 'row-1',
      getAllCells: () => [],
      _valuesCache: {},
    }
    const renderEditRowModalContent = vi.fn(() => h('div', 'render option content'))
    const table = {
      getState: () => ({ creatingRow: null, editingRow: row }),
      options: { renderEditRowModalContent },
      setEditingRow: vi.fn(),
    }

    const SlotProvider = defineComponent({
      setup(_, { slots }) {
        provideMVT_Slots(slots)
        return () => h(MVT_EditRowModal, { open: true, table } as any)
      },
    })

    mount(
      defineComponent({
        setup() {
          return () =>
            h(MantineProvider, null, () =>
              h(SlotProvider, null, {
                editRowModalContent: ({ row: slotRow }: any) =>
                  h('div', { 'data-testid': 'edit-row-slot' }, `Editing ${slotRow.id}`),
              }),
            )
        },
      }),
      { attachTo: document.body },
    )
    await nextTick()

    expect(document.querySelector('[data-testid="edit-row-slot"]')?.textContent).toBe(
      'Editing row-1',
    )
    expect(renderEditRowModalContent).not.toHaveBeenCalled()
  })
})
