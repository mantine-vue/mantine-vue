import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { DirectionProvider, MantineProvider, Tree, useTree } from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []

function render(component: () => any, dir: 'ltr' | 'rtl' = 'ltr') {
  const wrapper = mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(DirectionProvider, { initialDirection: dir }, () => component()),
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return wrapper
}

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
})

describe('@mantine-vue/core/Tree', () => {
  const data = [{ value: 'parent', label: 'Parent', children: [{ value: 'c', label: 'Child' }] }]

  it('mirrors expand and collapse keys in Tree', async () => {
    let tree!: any
    const wrapper = render(
      () =>
        h({
          setup() {
            tree = useTree()
            return () => h(Tree, { data, tree })
          },
        }),
      'rtl',
    )
    await nextTick()
    const item = wrapper.find('[role="treeitem"]')

    await item.trigger('keydown', { code: 'ArrowRight' })
    expect(tree.expandedState.value.parent).toBeFalsy()

    await item.trigger('keydown', { code: 'ArrowLeft' })
    expect(tree.expandedState.value.parent).toBe(true)

    await item.trigger('keydown', { code: 'ArrowRight' })
    expect(tree.expandedState.value.parent).toBe(false)
  })
})
