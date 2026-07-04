import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { FloatingWindow, MantineProvider, TableOfContents } from '../../index'
import type { SetFloatingWindowPosition } from '@mantine-vue/hooks'

function withProvider(render: () => any, attach = false) {
  const target = attach ? document.body.appendChild(document.createElement('div')) : undefined
  return mount(defineComponent({ render: () => h(MantineProvider, { env: 'test' }, render) }), {
    attachTo: target,
  })
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('@mantine-vue/core TableOfContents', () => {
  it('renders initial data with depth offsets and custom controls', () => {
    const wrapper = withProvider(() =>
      h(TableOfContents, {
        initialData: [
          { depth: 1, value: 'Introduction', id: 'intro' },
          { depth: 3, value: 'Details', id: 'details' },
        ],
        minDepthToOffset: 1,
        depthOffset: 16,
        getControlProps: ({ data, active }: any) => ({
          children: `${data.value}${active ? ' active' : ''}`,
          'data-heading-id': data.id,
        }),
      }),
    )

    const controls = wrapper.findAll('.mantine-TableOfContents-control')
    expect(controls).toHaveLength(2)
    expect(controls[0].text()).toBe('Introduction')
    expect(controls[1].attributes('data-heading-id')).toBe('details')
    expect(controls[1].attributes('style')).toContain('--depth-offset: 2')
    expect(wrapper.find('.mantine-TableOfContents-root').attributes('style')).toContain(
      '--toc-depth-offset: 1rem',
    )
  })

  it('discovers headings, tracks the closest heading, and exposes reinitialize', async () => {
    const reinitialize = ref<(() => void) | null>(null)
    const getRect = (y: number) =>
      ({ y, top: y, bottom: y + 20, width: 100, height: 20 }) as DOMRect
    const wrapper = withProvider(
      () =>
        h('div', [
          h(
            'h2',
            {
              id: 'first',
              ref: (node: any) =>
                node && vi.spyOn(node, 'getBoundingClientRect').mockReturnValue(getRect(-10)),
            },
            'First',
          ),
          h(
            'h3',
            {
              id: 'second',
              ref: (node: any) =>
                node && vi.spyOn(node, 'getBoundingClientRect').mockReturnValue(getRect(120)),
            },
            'Second',
          ),
          h(TableOfContents, { reinitializeRef: reinitialize, scrollSpyOptions: { offset: 0 } }),
        ]),
      true,
    )
    await nextTick()

    expect(wrapper.findAll('.mantine-TableOfContents-control')).toHaveLength(2)
    expect(wrapper.find('.mantine-TableOfContents-control[data-active]').text()).toBe('First')
    expect(reinitialize.value).toBeTypeOf('function')
  })
})

describe('@mantine-vue/core FloatingWindow', () => {
  it('applies initial position and exposes imperative positioning', async () => {
    const setPosition = ref<SetFloatingWindowPosition | null>(null)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 80,
    } as DOMRect)
    const wrapper = withProvider(() =>
      h(
        FloatingWindow,
        {
          withinPortal: false,
          initialPosition: { left: 20, top: 30 },
          setPositionRef: setPosition,
          zIndex: 450,
        },
        () => 'Floating content',
      ),
    )
    await nextTick()
    const root = wrapper.find('.mantine-FloatingWindow-root')

    expect(root.text()).toBe('Floating content')
    expect(root.attributes('style')).toContain('left: 20px')
    expect(root.attributes('style')).toContain('top: 30px')
    expect(root.attributes('style')).toContain('--floating-window-z-index: 450')

    setPosition.value?.({ left: 70, top: 90 })
    expect(root.attributes('style')).toContain('left: 70px')
    expect(root.attributes('style')).toContain('top: 90px')
  })

  it('drags from the configured handle and respects axis', async () => {
    const onDragStart = vi.fn()
    const onDragEnd = vi.fn()
    const onPositionChange = vi.fn()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
      width: 100,
      height: 80,
    } as DOMRect)
    const wrapper = withProvider(() =>
      h(
        FloatingWindow,
        {
          withinPortal: false,
          constrainToViewport: false,
          dragHandleSelector: '[data-handle]',
          excludeDragHandleSelector: 'button',
          axis: 'x',
          onDragStart,
          onDragEnd,
          onPositionChange,
        },
        () => h('div', { 'data-handle': '' }, [h('span', 'Drag'), h('button', 'Ignore')]),
      ),
    )
    const handle = wrapper.find('[data-handle]')
    await handle.trigger('mousedown', { button: 0, clientX: 20, clientY: 30 })
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 80, clientY: 100, bubbles: true }),
    )
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

    expect(onDragStart).toHaveBeenCalledOnce()
    expect(onPositionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ x: 70, y: expect.any(Number) }),
    )
    expect(onDragEnd).toHaveBeenCalledOnce()

    await wrapper.find('button').trigger('mousedown', { button: 0, clientX: 20, clientY: 30 })
    expect(onDragStart).toHaveBeenCalledOnce()
  })
})
