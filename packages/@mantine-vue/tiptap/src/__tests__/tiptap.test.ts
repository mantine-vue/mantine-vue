import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { MantineProvider } from '@mantine-vue/core'
import { getTaskListExtension, Link, RichTextEditor } from '../index'

describe('@mantine-vue/tiptap', () => {
  it('renders built-in controls disabled when editor is not available', () => {
    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () =>
          h(RichTextEditor, { editor: null }, () =>
            h(RichTextEditor.Toolbar, null, () =>
              h(RichTextEditor.ControlsGroup, null, () => h(RichTextEditor.Bold)),
            ),
          ),
      },
    })

    const control = wrapper.get('button[aria-label="Bold"]')
    expect(control.attributes('disabled')).toBeDefined()
    expect(control.attributes('data-disabled')).toBeDefined()
  })

  it('updates controls when editor instance is provided after mount', async () => {
    const chainRun = vi.fn()
    const editor = {
      isDestroyed: false,
      on: vi.fn(),
      off: vi.fn(),
      isActive: vi.fn(() => true),
      can: vi.fn(),
      chain: vi.fn(() => ({
        focus: () => ({
          toggleBold: () => ({ run: chainRun }),
        }),
      })),
    }

    const Component = defineComponent({
      setup() {
        const currentEditor = ref<any>(null)
        return { currentEditor }
      },
      render() {
        return h(MantineProvider, { env: 'test' }, () =>
          h(RichTextEditor, { editor: this.currentEditor }, () => h(RichTextEditor.Bold)),
        )
      },
    })

    const wrapper = mount(Component)
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()

    ;(wrapper.vm as any).currentEditor = editor
    await nextTick()

    const control = wrapper.get('button')
    expect(control.attributes('data-active')).toBeDefined()
    expect(control.attributes('disabled')).toBeUndefined()
    expect(editor.on).toHaveBeenCalledWith('transaction', expect.any(Function))
  })

  it('exports Mantine Link extension with Mod-k edit-link shortcut', () => {
    const listener = vi.fn()
    window.addEventListener('edit-link', listener)

    const shortcuts = (Link as any).config.addKeyboardShortcuts()
    expect(shortcuts['Mod-k']()).toBe(true)
    expect(listener).toHaveBeenCalledTimes(1)

    window.removeEventListener('edit-link', listener)
  })

  it('configures task list extension class names and shortcuts', () => {
    const configure = vi.fn((config) => config)
    const extend = vi.fn((extension) => ({ configure, extension }))
    const extension = getTaskListExtension({ extend })

    expect(extension).toEqual(
      expect.objectContaining({
        HTMLAttributes: expect.objectContaining({
          class: expect.stringContaining('mantine-RichTextEditor-taskList'),
        }),
      }),
    )
    expect(extend).toHaveBeenCalledWith(
      expect.objectContaining({ addKeyboardShortcuts: expect.any(Function) }),
    )
  })
})
