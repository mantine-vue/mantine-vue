import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Pill, Toggle, Toolbar, TreeSelect } from '../../index'

function withProvider(component: any) {
  return mount(
    defineComponent({ render: () => h(MantineProvider, { env: 'test' }, () => h(component)) }),
  )
}

describe('@mantine-vue/core Toggle', () => {
  it('updates uncontrolled state when clicked', async () => {
    const wrapper = withProvider(defineComponent({ render: () => h(Toggle, null, () => 'Bold') }))
    const button = wrapper.get('button')

    expect(button.attributes('aria-pressed')).toBe('false')
    await button.trigger('click')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('data-active')).toBe('true')
  })

  it('supports v-model:active', async () => {
    const Demo = defineComponent({
      setup() {
        const active = ref(false)
        return () =>
          h(Toggle, { active: active.value, 'onUpdate:active': (value) => (active.value = value) })
      },
    })
    const wrapper = withProvider(Demo)
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
  })
})

describe('@mantine-vue/core Toolbar', () => {
  it('updates single and multiple uncontrolled toggle groups', async () => {
    const Demo = defineComponent({
      render: () =>
        h(Toolbar, null, () => [
          h(Toolbar.ToggleGroup, { type: 'multiple' }, () => [
            h(Toolbar.ToggleItem, { value: 'bold', 'aria-label': 'Bold' }),
            h(Toolbar.ToggleItem, { value: 'italic', 'aria-label': 'Italic' }),
          ]),
          h(Toolbar.ToggleGroup, { type: 'single', defaultValue: 'left' }, () => [
            h(Toolbar.ToggleItem, { value: 'left', 'aria-label': 'Left' }),
            h(Toolbar.ToggleItem, { value: 'right', 'aria-label': 'Right' }),
          ]),
        ]),
    })
    const wrapper = withProvider(Demo)
    const bold = wrapper.get('[aria-label="Bold"]')
    const left = wrapper.get('[aria-label="Left"]')
    const right = wrapper.get('[aria-label="Right"]')

    await bold.trigger('click')
    expect(bold.attributes('aria-pressed')).toBe('true')
    expect(left.attributes('aria-pressed')).toBe('true')
    await right.trigger('click')
    expect(left.attributes('aria-pressed')).toBe('false')
    expect(right.attributes('aria-pressed')).toBe('true')
  })
})

describe('@mantine-vue/core TreeSelect', () => {
  it('supports renderPill functions that return a single vnode', () => {
    const Demo = defineComponent({
      render: () =>
        h(TreeSelect, {
          mode: 'checkbox',
          data: [{ value: 'docs', label: 'Documents' }],
          defaultValue: ['docs'],
          renderPill: ({ node }) => h(Pill, null, () => node.label),
        }),
    })
    const wrapper = withProvider(Demo)
    expect(wrapper.text()).toContain('Documents')
  })
})
