import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import {
  Autocomplete,
  Combobox,
  Drawer,
  HoverCard,
  MantineProvider,
  MaskInput,
  Menu,
  Modal,
  Popover,
  Select,
  Splitter,
  SplitterPane,
  Tooltip,
  Tree,
} from '../../index'

describe('@mantine-vue/core overlay, tree, and input SSR', () => {
  it('renders newly ported component families without browser globals', async () => {
    const app = createSSRApp({
      render: () =>
        h(MantineProvider, null, () => [
          h(
            Modal,
            { opened: true, onClose: () => {}, withinPortal: false, title: 'SSR modal' },
            () => 'Modal body',
          ),
          h(
            Drawer,
            { opened: true, onClose: () => {}, withinPortal: false, title: 'SSR drawer' },
            () => 'Drawer body',
          ),
          h(Splitter, null, () => [
            h(SplitterPane, { defaultSize: 50 }, () => 'SSR pane one'),
            h(SplitterPane, { defaultSize: 50 }, () => 'SSR pane two'),
          ]),
          h(Tree, { data: [{ label: 'SSR tree node', value: 'node' }] }),
          h(MaskInput, { mask: '999', defaultValue: '123', label: 'SSR mask input' }),
          h(Popover, { defaultOpened: true, withinPortal: false }, () => [
            h(Popover.Target, null, () => h('button', 'SSR popover target')),
            h(Popover.Dropdown, null, () => 'SSR popover dropdown'),
          ]),
          h(Tooltip, { label: 'SSR tooltip', opened: true, withinPortal: false }, () =>
            h('button', 'SSR tooltip target'),
          ),
          h(HoverCard, { initiallyOpened: true, withinPortal: false }, () => [
            h(HoverCard.Target, null, () => h('button', 'SSR hover target')),
            h(HoverCard.Dropdown, null, () => 'SSR hover dropdown'),
          ]),
          h(Menu, { defaultOpened: true, withinPortal: false }, () => [
            h(Menu.Target, null, () => h('button', 'SSR menu target')),
            h(Menu.Dropdown, null, () => h(Menu.Item, null, () => 'SSR menu item')),
          ]),
          h(Combobox, { withinPortal: false }, () => [
            h(Combobox.Target, null, () => h('input', { 'aria-label': 'SSR combobox target' })),
            h(Combobox.Dropdown, null, () =>
              h(Combobox.Options, null, () =>
                h(Combobox.Option, { value: 'ssr' }, () => 'SSR combobox option'),
              ),
            ),
          ]),
          h(Select, {
            data: ['SSR select option'],
            defaultValue: 'SSR select option',
            label: 'SSR select',
            withinPortal: false,
          }),
          h(Autocomplete, {
            data: ['SSR autocomplete option'],
            defaultValue: 'SSR autocomplete',
            label: 'SSR autocomplete label',
            withinPortal: false,
          }),
        ]),
    })

    const html = await renderToString(app)
    expect(html).toContain('SSR modal')
    expect(html).toContain('SSR drawer')
    expect(html).toContain('SSR pane one')
    expect(html).toContain('SSR tree node')
    expect(html).toContain('SSR mask input')
    expect(html).toContain('SSR popover dropdown')
    expect(html).toContain('SSR tooltip')
    expect(html).toContain('SSR hover dropdown')
    expect(html).toContain('SSR menu item')
    expect(html).toContain('SSR combobox option')
    expect(html).toContain('SSR select option')
    expect(html).toContain('SSR autocomplete label')
  })
})
