import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import { describe, expect, it, vi } from 'vitest'
import {
  Dropzone,
  DropzoneAccept,
  DropzoneFullScreen,
  DropzoneIdle,
  DropzoneReject,
} from '../index'

function mountWithProvider(node: () => any) {
  return mount(MantineProvider, {
    props: { env: 'test' },
    slots: { default: node },
    attachTo: document.body,
  })
}

describe('@mantine-vue/dropzone components', () => {
  it('renders idle content and exposes the file picker', () => {
    const openRef = { value: undefined as undefined | (() => void) }
    const wrapper = mountWithProvider(() =>
      h(Dropzone, { onDrop: vi.fn(), openRef }, () => [
        h(DropzoneIdle, null, () => h('strong', 'Idle')),
        h(DropzoneAccept, null, () => 'Accept'),
        h(DropzoneReject, null, () => 'Reject'),
      ]),
    )

    expect(wrapper.text()).toContain('Idle')
    expect(wrapper.text()).not.toContain('Accept')
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    expect(openRef.value).toBeTypeOf('function')
  })

  it('shows and hides the full-screen target for file drags', async () => {
    const wrapper = mountWithProvider(() =>
      h(DropzoneFullScreen, { onDrop: vi.fn(), withinPortal: false }, () => 'Drop files'),
    )
    const target = wrapper.find('[class*="fullScreen"]')
    expect(target.attributes('style')).toContain('opacity: 0')

    const event = new Event('dragenter') as DragEvent
    Object.defineProperty(event, 'dataTransfer', { value: { types: ['Files'] } })
    document.dispatchEvent(event)
    await nextTick()
    expect(target.attributes('style')).toContain('opacity: 1')

    document.dispatchEvent(new Event('dragleave'))
    await nextTick()
    expect(target.attributes('style')).toContain('opacity: 0')
  })
})
