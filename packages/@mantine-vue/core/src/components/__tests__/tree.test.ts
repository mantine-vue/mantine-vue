import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import {
  MantineProvider,
  Tree,
  filterTreeData,
  flattenTreeData,
  getTreeExpandedState,
  mergeAsyncChildren,
  moveTreeNode,
  useTree,
  type TreeNodeData,
} from '../../index'

const data: TreeNodeData[] = [
  {
    label: 'Node 1',
    value: 'node-1',
    children: [
      { label: 'Node 1.1', value: 'node-1-1' },
      { label: 'Node 1.2', value: 'node-1-2' },
    ],
  },
  {
    label: 'Node 2',
    value: 'node-2',
    children: [{ label: 'Node 2.1', value: 'node-2-1' }],
  },
  { label: 'Node 3', value: 'node-3' },
]

const mounted: Array<ReturnType<typeof mount>> = []

function render(props: Record<string, any> = {}) {
  const wrapper = mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => h(Tree, { data, ...props })),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return wrapper
}

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
})

describe('@mantine-vue/core Tree', () => {
  it('navigates visible nodes with arrow keys', async () => {
    const wrapper = render()
    const nodes = wrapper.findAll('[role="treeitem"]')
    ;(nodes[0].element as HTMLElement).focus()
    await nodes[0].trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' })
    expect(document.activeElement).toBe(nodes[1].element)
    await nodes[1].trigger('keydown', { key: 'ArrowUp', code: 'ArrowUp' })
    expect(document.activeElement).toBe(nodes[0].element)
  })

  it('expands on click and Space', async () => {
    const controller = useTree()
    const wrapper = render({ tree: controller })
    await wrapper.find('[data-value="node-1"] .mantine-Tree-label').trigger('click')
    expect(controller.expandedState.value['node-1']).toBe(true)
    expect(wrapper.text()).toContain('Node 1.1')

    await wrapper.find('[data-value="node-1"]').trigger('keydown', { key: ' ', code: 'Space' })
    expect(controller.expandedState.value['node-1']).toBe(false)
  })

  it('selects nodes and clears selection on outside mousedown', async () => {
    const controller = useTree()
    const wrapper = mount(
      {
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h('div', [
              h('button', { class: 'outside' }, 'Outside'),
              h(Tree, {
                data,
                tree: controller,
                selectOnClick: true,
                clearSelectionOnOutsideClick: true,
              }),
            ]),
          ),
      },
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    await wrapper.find('.mantine-Tree-label').trigger('click')
    expect(controller.selectedState.value).toEqual(['node-1'])
    expect(wrapper.find('[data-value="node-1"]').attributes('aria-selected')).toBe('true')
    await wrapper.find('.outside').trigger('mousedown')
    expect(controller.selectedState.value).toEqual([])
  })

  it('checks descendants on Space', async () => {
    const controller = useTree()
    const wrapper = render({ tree: controller, checkOnSpace: true })
    await wrapper.find('[data-value="node-1"]').trigger('keydown', { key: ' ', code: 'Space' })
    expect(controller.checkedState.value).toEqual(expect.arrayContaining(['node-1-1', 'node-1-2']))
  })

  it('passes Mantine-equivalent payload to renderNode', () => {
    const renderNode = vi.fn((payload: any) =>
      h('button', payload.elementProps, payload.node.label),
    )
    render({ renderNode })
    expect(renderNode).toHaveBeenCalledWith(
      expect.objectContaining({
        node: expect.objectContaining({ value: 'node-1' }),
        level: 1,
        expanded: false,
        hasChildren: true,
        selected: false,
        tree: expect.any(Object),
        elementProps: expect.any(Object),
      }),
    )
  })

  it('keeps collapsed descendants mounted but skips them in keyboard navigation', async () => {
    const wrapper = render({ keepMounted: true })
    const all = wrapper.findAll('[role="treeitem"]')
    expect(all.length).toBeGreaterThan(3)
    ;(all[0].element as HTMLElement).focus()
    await all[0].trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' })
    expect((document.activeElement as HTMLElement).dataset.value).toBe('node-2')
  })
})

describe('@mantine-vue/core useTree', () => {
  it('initializes and controls expanded state', () => {
    const onNodeExpand = vi.fn()
    const onNodeCollapse = vi.fn()
    const tree = useTree({ onNodeExpand, onNodeCollapse })
    tree.initialize(data)
    expect(Object.keys(tree.expandedState.value)).toEqual(
      expect.arrayContaining(['node-1', 'node-1-1', 'node-3']),
    )
    tree.expand('node-1')
    tree.collapse('node-1')
    expect(onNodeExpand).toHaveBeenCalledWith('node-1')
    expect(onNodeCollapse).toHaveBeenCalledWith('node-1')
  })

  it('supports single and multiple selection', () => {
    const single = useTree()
    single.select('node-1')
    single.select('node-2')
    expect(single.selectedState.value).toEqual(['node-2'])

    const multiple = useTree({ multiple: true })
    multiple.select('node-1')
    multiple.select('node-2')
    expect(multiple.selectedState.value).toEqual(['node-1', 'node-2'])
    multiple.toggleSelected('node-1')
    expect(multiple.selectedState.value).toEqual(['node-2'])
  })

  it('loads asynchronous children once until invalidated', async () => {
    const onLoadChildren = vi.fn().mockResolvedValue(undefined)
    const tree = useTree({ onLoadChildren })
    tree.initialize([{ label: 'Async', value: 'async', hasChildren: true }])
    tree.expand('async')
    await nextTick()
    await tree.loadNode('async')
    expect(onLoadChildren).toHaveBeenCalledTimes(1)
    tree.invalidateNode('async')
    await tree.loadNode('async')
    expect(onLoadChildren).toHaveBeenCalledTimes(2)
  })
})

describe('@mantine-vue/core Tree utilities', () => {
  it('builds expanded state for selected values and wildcard', () => {
    expect(getTreeExpandedState(data, '*')['node-2-1']).toBe(true)
    const selected = getTreeExpandedState(data, ['node-1'])
    expect(selected['node-1']).toBe(true)
    expect(selected['node-2']).toBe(false)
  })

  it('flattens and filters tree data without losing hierarchy', () => {
    const flattened = flattenTreeData(data, getTreeExpandedState(data, '*'))
    expect(flattened.map(({ node }) => node.value)).toEqual([
      'node-1',
      'node-1-1',
      'node-1-2',
      'node-2',
      'node-2-1',
      'node-3',
    ])
    const filtered = filterTreeData(data, '1.2')
    expect(filtered).toHaveLength(1)
    expect(filtered[0].children?.[0].value).toBe('node-1-2')
  })

  it('merges asynchronous children and moves nodes immutably', () => {
    const merged = mergeAsyncChildren(data, 'node-3', [{ label: 'Child', value: 'node-3-1' }])
    expect(merged[2].children?.[0].value).toBe('node-3-1')
    expect(data[2].children).toBeUndefined()

    const moved = moveTreeNode(data, {
      draggedNode: 'node-3',
      targetNode: 'node-1',
      position: 'inside',
    })
    expect(moved[0].children?.some((node) => node.value === 'node-3')).toBe(true)
  })
})
