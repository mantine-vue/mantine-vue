import { describe, expect, it } from 'vitest'
import { defineComponent, h, isReactive, isRef, nextTick, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, useProps } from '../../index'

function captureProps(
  passed: Record<string, any>,
  theme?: Record<string, any>,
  defaults: Record<string, any> | null = { size: 'md', radius: 'sm' },
) {
  let resolved: Record<string, any> = {}
  const Probe = defineComponent({
    props: { size: String, radius: String, color: String, label: String },
    setup(props) {
      resolved = useProps('Probe', defaults, props)
      return () => h('div', resolved.label)
    },
  })
  const wrapper = mount({
    render: () => h(MantineProvider, { env: 'test', theme }, () => h(Probe, passed)),
  })

  return { resolved: () => resolved, wrapper }
}

describe('@mantine-vue/core useProps', () => {
  it('resolves defaultProps < theme defaultProps < passed props', () => {
    const { resolved } = captureProps(
      { color: 'red' },
      { components: { Probe: { defaultProps: { radius: 'xl', color: 'blue' } } } },
    )

    expect(resolved().size).toBe('md')
    expect(resolved().radius).toBe('xl')
    expect(resolved().color).toBe('red')
    expect(resolved().label).toBeUndefined()
  })

  it('supports theme defaultProps functions', () => {
    const { resolved } = captureProps(
      {},
      { components: { Probe: { defaultProps: (theme: any) => ({ color: theme.primaryColor }) } } },
    )

    expect(resolved().color).toBe('blue')
  })

  it('behaves like a plain object for spreading, keys and `in`', () => {
    const { resolved } = captureProps({ color: 'red' }, undefined)

    expect({ ...resolved() }).toEqual({ size: 'md', radius: 'sm', color: 'red' })
    expect(Object.keys(resolved()).sort()).toEqual(['color', 'radius', 'size'])
    expect('color' in resolved()).toBe(true)
    expect('label' in resolved()).toBe(false)
  })

  it('works without component defaults', () => {
    const { resolved } = captureProps({ label: 'x' }, undefined, null)
    expect({ ...resolved() }).toEqual({ label: 'x' })
  })

  it('is not mistaken for a ref or a reactive object', () => {
    const { resolved } = captureProps({}, undefined)

    expect(isRef(resolved())).toBe(false)
    expect(isReactive(resolved())).toBe(false)
  })

  it('reacts to passed prop and theme changes', async () => {
    const label = ref('first')
    const theme = reactive<any>({ components: { Probe: { defaultProps: { color: 'blue' } } } })
    let resolved: Record<string, any> = {}
    const Probe = defineComponent({
      props: { label: String, color: String },
      setup(props) {
        resolved = useProps('Probe', null, props)
        return () => h('div', { id: 'probe' }, `${resolved.label}:${resolved.color}`)
      },
    })
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test', theme }, () => h(Probe, { label: label.value })),
    })
    expect(wrapper.find('#probe').text()).toBe('first:blue')

    label.value = 'second'
    await nextTick()
    expect(wrapper.find('#probe').text()).toBe('second:blue')

    theme.components.Probe.defaultProps = { color: 'green' }
    await nextTick()
    expect(wrapper.find('#probe').text()).toBe('second:green')
  })
})
