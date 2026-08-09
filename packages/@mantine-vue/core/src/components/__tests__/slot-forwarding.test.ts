import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref, type PropType } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Accordion,
  Breadcrumbs,
  Card,
  Group,
  MantineProvider,
  Popover,
  PopoverContextMenu,
  PopoverTarget,
  Timeline,
  Tooltip,
  TooltipFloating,
} from '../../index'

const Probe = defineComponent({
  props: {
    text: { type: String, required: true },
    wrapper: { type: Object as PropType<any>, required: true },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  },
  setup(props) {
    return () => {
      const node = h('button', { type: 'button' }, props.text)
      return h(props.wrapper, props.wrapperProps, () => node)
    }
  },
})

const mounted: Array<ReturnType<typeof mount>> = []
afterEach(() => mounted.splice(0).forEach((wrapper) => wrapper.unmount()))

async function follows(wrapper: any, wrapperProps: Record<string, any> = {}, inPopover = false) {
  const text = ref('one')
  const probe = () => h(Probe, { text: text.value, wrapper, wrapperProps })
  const mountedWrapper = mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        inPopover ? h(Popover, { opened: false }, () => probe()) : probe(),
      ),
  })
  mounted.push(mountedWrapper)

  const read = () => mountedWrapper.findAll('button').map((button) => button.text())
  expect(read()).toContain('one')

  text.value = 'two'
  await nextTick()
  await nextTick()

  return read()
}

describe('@mantine-vue/core slot forwarding', () => {
  it('containers follow children built by the parent', async () => {
    expect(await follows(Group)).toContain('two')
    expect(await follows(Card)).toContain('two')
    expect(await follows(Breadcrumbs)).toContain('two')
    expect(await follows(Timeline)).toContain('two')
    expect(await follows(Accordion)).toContain('two')
  })

  it('cloning targets follow children built by the parent', async () => {
    expect(await follows(Tooltip, { label: 'tip' })).toContain('two')
    expect(await follows(TooltipFloating, { label: 'tip' })).toContain('two')
    expect(await follows(PopoverTarget, {}, true)).toContain('two')
    expect(await follows(PopoverContextMenu, {}, true)).toContain('two')
  })

  it('does not leak the forwarded slot onto the DOM', async () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () => h(Group, null, () => [h('span', 'a')])),
    })
    mounted.push(wrapper)

    expect(wrapper.find('.mantine-Group-root').attributes('nodes')).toBeUndefined()
  })
})
