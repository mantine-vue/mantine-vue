import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { MantineProvider } from '@mantine-vue/core'
import {
  CodeHighlight,
  CodeHighlightAdapterProvider,
  CodeHighlightTabs,
  createHighlightJsAdapter,
  stripShikiCodeBlocks,
} from '../index'

function mountWithProvider(node: () => any) {
  return mount(MantineProvider, {
    props: { env: 'test' },
    slots: { default: node },
    attachTo: document.body,
  })
}

describe('@mantine-vue/code-highlight', () => {
  it('renders plain text code and line numbers', () => {
    const wrapper = mountWithProvider(() =>
      h(CodeHighlight, {
        code: 'const a = 1;\nconst b = 2;',
        language: 'tsx',
        withLineNumbers: true,
        withCopyButton: false,
      }),
    )

    expect(wrapper.get('code').text()).toBe('const a = 1;\nconst b = 2;')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
  })

  it('uses custom highlight.js adapter', () => {
    const adapter = createHighlightJsAdapter({
      getLanguage: (language: string) => language === 'ts',
      highlight: vi.fn(() => ({ value: '<span class="hljs-keyword">const</span>' })),
    })

    const wrapper = mountWithProvider(() =>
      h(CodeHighlightAdapterProvider, { adapter }, () =>
        h(CodeHighlight, {
          code: 'const a = 1;',
          language: 'ts',
          withCopyButton: false,
        }),
      ),
    )

    expect(wrapper.get('code').html()).toContain('hljs-keyword')
    expect(wrapper.get('code').classes()).toContain('hljs')
    expect(wrapper.get('code').classes()).toContain('ts')
  })

  it('controls expanded state', async () => {
    const onExpandedChange = vi.fn()
    const wrapper = mountWithProvider(() =>
      h(CodeHighlight, {
        code: 'console.log(1);',
        expanded: false,
        onExpandedChange,
        withExpandButton: true,
        withCopyButton: false,
      }),
    )

    expect(wrapper.get('[data-collapsed]').exists()).toBe(true)
    await wrapper.get('button[aria-label="Expand code"]').trigger('click')
    expect(onExpandedChange).toHaveBeenCalledWith(true)
  })

  it('renders tabs and changes active code', async () => {
    const wrapper = mountWithProvider(() =>
      h(CodeHighlightTabs, {
        code: [
          { fileName: 'one.ts', language: 'ts', code: 'const one = 1;' },
          { fileName: 'two.ts', language: 'ts', code: 'const two = 2;' },
        ],
        withCopyButton: false,
      }),
    )

    expect(wrapper.get('code').text()).toBe('const one = 1;')
    await wrapper
      .findAll('button')
      .find((item) => item.text().includes('two.ts'))!
      .trigger('click')
    await nextTick()
    expect(wrapper.get('code').text()).toBe('const two = 2;')
  })

  it('strips shiki pre and code wrappers', () => {
    expect(stripShikiCodeBlocks('<pre class="x"><code>let a = 1;</code></pre>')).toBe('let a = 1;')
  })
})
