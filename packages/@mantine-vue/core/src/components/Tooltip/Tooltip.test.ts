import { afterEach, describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { MantineProvider, Tooltip } from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []

function render(component: () => any) {
  const wrapper = mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => component()),
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

describe('@mantine-vue/core/Tooltip', () => {
  it('does not reopen after disabled is reset', async () => {
    const disabled = ref(false)
    const wrapper = render(() =>
      h(
        Tooltip,
        {
          label: 'Label',
          disabled: disabled.value,
          withinPortal: false,
          transitionProps: { duration: 0 },
        },
        () => h('button', { class: 'target' }, 'Target'),
      ),
    )

    await wrapper.find('.target').trigger('mouseenter')
    await flushPromises()
    expect(wrapper.text()).toContain('Label')

    disabled.value = true
    await flushPromises()
    expect(wrapper.text()).not.toContain('Label')

    disabled.value = false
    await flushPromises()
    expect(wrapper.text()).not.toContain('Label')
  })

  it('ignores hover while disabled', async () => {
    const wrapper = render(() =>
      h(
        Tooltip,
        { label: 'Label', disabled: true, withinPortal: false, transitionProps: { duration: 0 } },
        () => h('button', { class: 'target' }, 'Target'),
      ),
    )

    await wrapper.find('.target').trigger('mouseenter')
    await flushPromises()
    expect(wrapper.text()).not.toContain('Label')
  })
})
