import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '../../core'
import { MaskInput } from '../MaskInput'
import { Splitter, SplitterPane, type UseSplitterReturnValue } from '../Splitter'
import { Tree, useTree } from '../Tree'
import { Modal } from '../Modal'
import { Drawer } from '../Drawer'

function withProvider(
  component: any,
  props: Record<string, any> = {},
  slots?: Record<string, any>,
) {
  return mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, slots)),
    },
    { global: { stubs: { Transition: false, transition: false } } },
  )
}

describe('newly ported components', () => {
  it('MaskInput applies a mask and emits raw/completed values', async () => {
    const onChangeRaw = vi.fn()
    const onComplete = vi.fn()
    const wrapper = withProvider(MaskInput, { mask: '999-999', onChangeRaw, onComplete })
    const input = wrapper.find('input')

    await input.setValue('12a3456')

    expect((input.element as HTMLInputElement).value).toBe('123-456')
    expect(onChangeRaw).toHaveBeenLastCalledWith('123456', '123-456')
    expect(onComplete).toHaveBeenCalledWith('123-456', '123456')
  })

  it('Splitter renders separators and resets adjacent panes', async () => {
    const splitterRef = ref<UseSplitterReturnValue | null>(null)
    const wrapper = withProvider(
      Splitter,
      { splitterRef },
      {
        default: () => [
          h(SplitterPane, { defaultSize: 20 }, () => 'A'),
          h(SplitterPane, { defaultSize: 30 }, () => 'B'),
          h(SplitterPane, { defaultSize: 50 }, () => 'C'),
        ],
      },
    )
    expect(wrapper.findAll('[role="separator"]')).toHaveLength(2)

    splitterRef.value!.setSizes([10, 20, 70])
    await nextTick()
    await wrapper.findAll('[role="separator"]')[0].trigger('dblclick')
    expect(splitterRef.value!.sizes).toEqual([12, 18, 70])
  })

  it('Tree expands nested nodes and exposes selection state', async () => {
    const controller = useTree()
    const wrapper = withProvider(Tree, {
      tree: controller,
      selectOnClick: true,
      data: [{ value: 'root', label: 'Root', children: [{ value: 'leaf', label: 'Leaf' }] }],
    })

    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(1)
    await wrapper.find('[role="treeitem"] .label, [role="treeitem"] div').trigger('click')
    expect(controller.expandedState.value.root).toBe(true)
    expect(controller.selectedState.value).toEqual(['root'])
    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(2)
  })

  it('Modal renders its compound structure and closes from overlay', async () => {
    const onClose = vi.fn()
    const wrapper = withProvider(
      Modal,
      { opened: true, onClose, withinPortal: false, title: 'Settings' },
      { default: () => 'Content' },
    )

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Settings')
    expect(wrapper.text()).toContain('Content')
    await wrapper.find('.mantine-Modal-overlay').trigger('click')
    expect(onClose).toHaveBeenCalledOnce()
    expect(Modal.Root).toBeDefined()
    expect(Modal.Content).toBeDefined()
  })

  it('Drawer renders on the requested side and closes from its button', async () => {
    const onClose = vi.fn()
    const wrapper = withProvider(
      Drawer,
      { opened: true, onClose, withinPortal: false, title: 'Navigation', position: 'right' },
      { default: () => 'Links' },
    )

    expect(wrapper.find('[data-position="right"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Navigation')
    await wrapper.find('button').trigger('click')
    expect(onClose).toHaveBeenCalledOnce()
    expect(Drawer.Root).toBeDefined()
    expect(Drawer.Overlay).toBeDefined()
  })
})
