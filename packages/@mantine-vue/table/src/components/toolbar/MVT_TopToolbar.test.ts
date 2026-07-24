import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MantineProvider } from '@mantine-vue/core'
import { MVT_TopToolbar } from './MVT_TopToolbar'
import classes from './MVT_TopToolbar.module.css'

describe('MVT_TopToolbar', () => {
  it('applies the stacked alert class when stackAlertBanner changes to true', async () => {
    const state = {
      isFullScreen: false,
      isSaving: false,
      showGlobalFilter: false,
      showProgressBars: false,
    }
    const table = {
      getState: () => state,
      options: {
        enableGlobalFilter: false,
        enablePagination: false,
        enableToolbarInternalActions: false,
        positionToolbarAlertBanner: 'none',
        positionToolbarDropZone: 'none',
        renderTopToolbarCustomActions: undefined as (() => null) | undefined,
      },
      refs: { topToolbarRef: { value: null } },
    }

    const wrapper = mount(
      defineComponent({
        render: () =>
          h(MantineProvider, { env: 'test' }, () => h(MVT_TopToolbar, { table: table as any })),
      }),
    )
    const toolbar = wrapper.findComponent(MVT_TopToolbar)
    const actions = () => wrapper.find(`.${classes['actions-container']}`)

    expect(actions().classes()).not.toContain(classes['actions-container-stack-alert'])

    table.options.renderTopToolbarCustomActions = () => null
    toolbar.vm.$forceUpdate()
    await nextTick()

    expect(actions().classes()).toContain(classes['actions-container-stack-alert'])
  })
})
