import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Splitter, SplitterPane, type UseSplitterReturnValue } from '../../index'

function render(props: Record<string, any> = {}, panes = [50, 50]) {
  const splitterRef = ref<UseSplitterReturnValue | null>(null)
  const wrapper = mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        h(
          Splitter,
          { splitterRef, ...props },
          {
            default: () =>
              panes.map((size, index) =>
                h(SplitterPane, { defaultSize: size, min: 10 }, () => `Pane ${index + 1}`),
              ),
          },
        ),
      ),
  })
  return { wrapper, splitterRef }
}

describe('@mantine-vue/core Splitter', () => {
  it('renders pane content and one separator between every pair', () => {
    const { wrapper } = render({}, [33, 34, 33])
    expect(wrapper.text()).toContain('Pane 1')
    expect(wrapper.text()).toContain('Pane 3')
    expect(wrapper.findAll('[role="separator"]')).toHaveLength(2)
  })

  it('sets horizontal and vertical accessibility attributes', () => {
    const horizontal = render().wrapper.find('[role="separator"]')
    const vertical = render({ orientation: 'vertical' }).wrapper.find('[role="separator"]')
    expect(horizontal.attributes('aria-orientation')).toBe('horizontal')
    expect(horizontal.attributes('data-orientation')).toBe('horizontal')
    expect(vertical.attributes('aria-orientation')).toBe('vertical')
    expect(vertical.attributes('data-orientation')).toBe('vertical')
  })

  it('resets adjacent panes to their default ratio on double click', async () => {
    const { wrapper, splitterRef } = render({}, [20, 30, 50])
    splitterRef.value!.setSizes([10, 20, 70])
    await nextTick()
    await wrapper.findAll('[role="separator"]')[0].trigger('dblclick')
    expect(splitterRef.value!.sizes).toEqual([12, 18, 70])
  })

  it('does not reset when resetOnDoubleClick is false', async () => {
    const { wrapper, splitterRef } = render({ resetOnDoubleClick: false }, [20, 30, 50])
    splitterRef.value!.setSizes([10, 20, 70])
    await wrapper.findAll('[role="separator"]')[0].trigger('dblclick')
    expect(splitterRef.value!.sizes).toEqual([10, 20, 70])
  })

  it('supports keyboard resizing with regular and shifted steps', async () => {
    const onSizeChange = vi.fn()
    const { wrapper, splitterRef } = render({ step: 2, shiftStep: 8, onSizeChange })
    const separator = wrapper.find('[role="separator"]')
    await separator.trigger('keydown', { key: 'ArrowRight' })
    expect(splitterRef.value!.sizes).toEqual([52, 48])
    await separator.trigger('keydown', { key: 'ArrowLeft', shiftKey: true })
    expect(splitterRef.value!.sizes).toEqual([44, 56])
    expect(onSizeChange).toHaveBeenCalledTimes(2)
  })

  it('collapses and restores collapsible panes through the controller', async () => {
    const splitterRef = ref<UseSplitterReturnValue | null>(null)
    const onCollapseChange = vi.fn()
    mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            Splitter,
            { splitterRef, onCollapseChange },
            {
              default: () => [
                h(SplitterPane, { defaultSize: 40, collapsible: true }, () => 'A'),
                h(SplitterPane, { defaultSize: 60, min: 10 }, () => 'B'),
              ],
            },
          ),
        ),
    })

    splitterRef.value!.collapse(0)
    await nextTick()
    expect(splitterRef.value!.sizes).toEqual([0, 100])
    expect(splitterRef.value!.collapsed).toEqual([true, false])
    splitterRef.value!.expand(0)
    await nextTick()
    expect(splitterRef.value!.sizes).toEqual([40, 60])
    expect(onCollapseChange).toHaveBeenNthCalledWith(1, 0, true)
    expect(onCollapseChange).toHaveBeenNthCalledWith(2, 0, false)
  })
})
