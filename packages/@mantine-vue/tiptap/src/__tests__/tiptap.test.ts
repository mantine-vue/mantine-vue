import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { MantineProvider } from '@mantine-vue/core'
import { getTaskListExtension, Link, RichTextEditor } from '../index'

describe('@mantine-vue/tiptap', () => {
  it('exposes the complete compound component API', () => {
    for (const key of [
      'Content',
      'Control',
      'Toolbar',
      'ControlsGroup',
      'Bold',
      'Italic',
      'Strikethrough',
      'Underline',
      'ClearFormatting',
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'BulletList',
      'OrderedList',
      'Link',
      'Unlink',
      'Blockquote',
      'AlignLeft',
      'AlignRight',
      'AlignCenter',
      'AlignJustify',
      'Superscript',
      'Subscript',
      'Code',
      'CodeBlock',
      'ColorPicker',
      'Color',
      'Highlight',
      'Hr',
      'UnsetColor',
      'Undo',
      'Redo',
      'TaskList',
      'TaskListSink',
      'TaskListLift',
      'SourceCode',
      'TableInsert',
      'TableColumnBefore',
      'TableColumnAfter',
      'TableColumnDelete',
      'TableRowBefore',
      'TableRowAfter',
      'TableRowDelete',
      'TableMergeCells',
      'TableSplitCell',
      'TableToggleHeaderColumn',
      'TableToggleHeaderRow',
      'TableDelete',
      'Details',
      'InvisibleCharacters',
    ] as const) {
      expect(RichTextEditor[key]).toBeTruthy()
    }
  })

  it('merges root styles and forwards HTML attributes', () => {
    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () =>
          h(RichTextEditor, {
            editor: null,
            class: 'custom-root',
            style: { color: 'rgb(1, 2, 3)' },
            'data-testid': 'editor',
          }),
      },
    })

    const root = wrapper.get('[data-testid="editor"]')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('color: rgb(1, 2, 3)')
  })

  it('supports icon slots while preserving the icon prop fallback', () => {
    const LegacyIcon = () => h('span', { 'data-testid': 'legacy-icon' })
    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () =>
          h(RichTextEditor, { editor: null }, () =>
            h(RichTextEditor.Toolbar, null, () =>
              h(RichTextEditor.ControlsGroup, null, () => [
                h(
                  RichTextEditor.Bold,
                  { icon: LegacyIcon },
                  {
                    icon: () => h('span', { 'data-testid': 'bold-slot-icon' }),
                  },
                ),
                h(RichTextEditor.Italic, { icon: LegacyIcon }),
                h(RichTextEditor.Link, null, {
                  icon: () => h('span', { 'data-testid': 'link-slot-icon' }),
                }),
              ]),
            ),
          ),
      },
    })

    expect(wrapper.find('[data-testid="bold-slot-icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-slot-icon"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="legacy-icon"]')).toHaveLength(1)
  })

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

  it('does not enter source mode without an editor instance', async () => {
    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () => h(RichTextEditor, { editor: null }, () => h(RichTextEditor.SourceCode)),
      },
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.get('button').attributes('data-active')).toBeUndefined()
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
