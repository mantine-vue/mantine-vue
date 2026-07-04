import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { DirectionProvider, MantineProvider, Tabs, TabsList, TabsPanel, TabsTab } from '../../index'

function renderTabs(props: Record<string, any> = {}, tabProps: Record<string, any> = {}) {
  return mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Tabs, props, () => [
            h(TabsList, { 'aria-label': 'test-tabs' }, () => [
              h(TabsTab, { value: 'tab-1' }, () => 'tab-1'),
              h(TabsTab, { value: 'tab-2', ...tabProps }, () => 'tab-2'),
              h(TabsTab, { value: 'tab-3' }, () => 'tab-3'),
            ]),
            h(TabsPanel, { value: 'tab-1' }, () => 'tab-1 panel'),
            h(TabsPanel, { value: 'tab-2' }, () => 'tab-2 panel'),
            h(TabsPanel, { value: 'tab-3' }, () => 'tab-3 panel'),
          ]),
        ),
    },
    {
      attachTo: document.body,
    },
  )
}

function getTabs(wrapper: any) {
  return wrapper.findAll('[role="tab"]')
}

function activePanel(wrapper: any) {
  return wrapper
    .findAll('[role="tabpanel"]')
    .find((panel: any) => panel.attributes('style') !== 'display: none;')
}

describe('@mantine-vue/core Tabs', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('supports uncontrolled state', async () => {
    const onChange = vi.fn()
    const wrapper = renderTabs({ defaultValue: 'tab-1', onChange })

    expect(activePanel(wrapper)?.text()).toBe('tab-1 panel')

    await getTabs(wrapper)[1].trigger('click')

    expect(onChange).toHaveBeenCalledWith('tab-2')
    expect(activePanel(wrapper)?.text()).toBe('tab-2 panel')
    expect(getTabs(wrapper)[1].attributes('aria-selected')).toBe('true')
  })

  it('supports controlled state', async () => {
    const onChange = vi.fn()
    const wrapper = renderTabs({ value: 'tab-1', onChange })

    await getTabs(wrapper)[1].trigger('click')

    expect(onChange).toHaveBeenCalledWith('tab-2')
    expect(activePanel(wrapper)?.text()).toBe('tab-1 panel')
  })

  it('allows tab deactivation', async () => {
    const wrapper = renderTabs({ defaultValue: 'tab-1', allowTabDeactivation: true })

    await getTabs(wrapper)[0].trigger('click')

    expect(activePanel(wrapper)).toBeUndefined()
  })

  it('handles horizontal keyboard navigation and skips disabled tabs', async () => {
    const wrapper = renderTabs({ defaultValue: 'tab-1' }, { disabled: true })
    const tabs = getTabs(wrapper)

    await tabs[0].trigger('keydown', { key: 'ArrowRight' })

    expect(activePanel(wrapper)?.text()).toBe('tab-3 panel')
    expect(getTabs(wrapper)[2].element).toBe(document.activeElement)
  })

  it('handles vertical keyboard navigation without looping', async () => {
    const wrapper = renderTabs({ defaultValue: 'tab-3', orientation: 'vertical', loop: false })

    await getTabs(wrapper)[2].trigger('keydown', { key: 'ArrowDown' })
    expect(activePanel(wrapper)?.text()).toBe('tab-3 panel')

    await getTabs(wrapper)[2].trigger('keydown', { key: 'ArrowUp' })
    expect(activePanel(wrapper)?.text()).toBe('tab-2 panel')
  })

  it('handles RTL horizontal navigation', async () => {
    const wrapper = mount(
      {
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(DirectionProvider, { initialDirection: 'rtl' }, () =>
              h(Tabs, { defaultValue: 'tab-2', loop: false }, () => [
                h(TabsList, null, () => [
                  h(TabsTab, { value: 'tab-1' }, () => 'tab-1'),
                  h(TabsTab, { value: 'tab-2' }, () => 'tab-2'),
                ]),
                h(TabsPanel, { value: 'tab-1' }, () => 'tab-1 panel'),
                h(TabsPanel, { value: 'tab-2' }, () => 'tab-2 panel'),
              ]),
            ),
          ),
      },
      {
        attachTo: document.body,
      },
    )

    await getTabs(wrapper)[1].trigger('keydown', { key: 'ArrowRight' })

    expect(activePanel(wrapper)?.text()).toBe('tab-1 panel')
  })

  it('unmounts inactive panel content when keepMounted is false', () => {
    const wrapper = renderTabs({ defaultValue: 'tab-1', keepMounted: false })
    const panels = wrapper.findAll('[role="tabpanel"]')

    expect(panels[0].text()).toBe('tab-1 panel')
    expect(panels[1].text()).toBe('')
  })

  it('exposes static compound components', () => {
    expect(Tabs.Tab).toBe(TabsTab)
    expect(Tabs.List).toBe(TabsList)
    expect(Tabs.Panel).toBe(TabsPanel)
  })
})
