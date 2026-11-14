import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { MantineProvider } from '@mantine-vue/core'
import { Diff } from '../Diff'

function render(props: Record<string, any>) {
  return mount(MantineProvider, {
    props: { env: 'test' },
    slots: { default: () => h(Diff, props as any) },
    attachTo: document.body,
  })
}

const count = (wrapper: ReturnType<typeof render>, selector: string) =>
  wrapper.element.parentElement!.querySelectorAll(`.${(Diff.classes as any)[selector]}`).length

function getRowTexts() {
  return Array.from(document.querySelectorAll('tr')).map((row) =>
    Array.from(row.querySelectorAll('td'))
      .map((cell) => cell.textContent)
      .join('|'),
  )
}

describe('@mantine-vue/code-highlight/Diff', () => {
  it('renders added and removed lines', () => {
    const wrapper = render({
      previousValue: 'line1\nold\nline3',
      currentValue: 'line1\nnew\nline3',
    })
    expect(count(wrapper, 'removedLine')).toBeGreaterThan(0)
    expect(count(wrapper, 'addedLine')).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('renders identical strings without added/removed lines', () => {
    const wrapper = render({ previousValue: 'same', currentValue: 'same' })
    expect(count(wrapper, 'removedLine')).toBe(0)
    expect(count(wrapper, 'addedLine')).toBe(0)
    wrapper.unmount()
  })

  it('renders splitDivider only in split mode', () => {
    let wrapper = render({ previousValue: 'old', currentValue: 'new', mode: 'split' })
    expect(count(wrapper, 'splitDivider')).toBeGreaterThan(0)
    expect(document.querySelector('[data-split]')).toBeTruthy()
    wrapper.unmount()
    wrapper = render({ previousValue: 'old', currentValue: 'new' })
    expect(count(wrapper, 'splitDivider')).toBe(0)
    wrapper.unmount()
  })

  it('renders inline highlights depending on diffMethod', () => {
    let wrapper = render({ previousValue: 'the brown fox', currentValue: 'the red fox' })
    expect(count(wrapper, 'addedHighlight')).toBeGreaterThan(0)
    expect(count(wrapper, 'removedHighlight')).toBeGreaterThan(0)
    wrapper.unmount()
    wrapper = render({ previousValue: 'old line', currentValue: 'new line', diffMethod: 'lines' })
    expect(count(wrapper, 'addedHighlight')).toBe(0)
    wrapper.unmount()
  })

  it('toggles line numbers', () => {
    let wrapper = render({ previousValue: 'old', currentValue: 'new' })
    expect(count(wrapper, 'lineNumber')).toBeGreaterThan(0)
    wrapper.unmount()
    wrapper = render({ previousValue: 'old', currentValue: 'new', withLineNumbers: false })
    expect(count(wrapper, 'lineNumber')).toBe(0)
    wrapper.unmount()
  })

  it('collapses unchanged lines and expands them on click', async () => {
    const wrapper = render({
      previousValue: 'line1\nline2\nline3\nline4\nline5\nchanged-old\nline7',
      currentValue: 'line1\nline2\nline3\nline4\nline5\nchanged-new\nline7',
      contextLines: 0,
    })
    const rowsBefore = document.querySelectorAll('tr').length
    const button = document.querySelector<HTMLButtonElement>(
      `.${(Diff.classes as any).expandControl}`,
    )!
    expect(button.textContent).toBe('Show 5 hidden lines')
    button.click()
    await nextTick()
    expect(document.querySelectorAll('tr').length).toBeGreaterThan(rowsBefore)
    expect(document.activeElement?.getAttribute('data-section')).toBe('0')
    wrapper.unmount()
  })

  it('uses singular label for one hidden line', () => {
    const wrapper = render({ previousValue: 'a\nb\nc', currentValue: 'a\nb\nd', contextLines: 0 })
    expect(document.body.textContent).toContain('Show 2 hidden lines')
    wrapper.unmount()
    const single = render({ previousValue: 'a\nc', currentValue: 'a\nd', contextLines: 0 })
    expect(document.body.textContent).toContain('Show 1 hidden line')
    single.unmount()
  })

  it('sets CSS variables for custom colors', () => {
    const wrapper = render({
      previousValue: 'old',
      currentValue: 'new',
      addColor: '#00ff00',
      removeColor: '#ff0000',
    })
    const root = document.querySelector(`.${(Diff.classes as any).root}`) as HTMLElement
    const style = root.getAttribute('style') || ''
    expect(style).toContain('--diff-add-color')
    expect(style).toContain('--diff-remove-color')
    wrapper.unmount()
  })

  it('adds change markers and renders blocks in git order', () => {
    const wrapper = render({ previousValue: 'a\nb\nc', currentValue: 'a\nx\ny\nc' })
    expect(getRowTexts()).toEqual(['1|1|a', '2||- b', '|2|+ x', '|3|+ y', '3|4|c'])
    wrapper.unmount()
  })

  it('pairs removed and added lines positionally in split mode', () => {
    const wrapper = render({ previousValue: 'a\nb\nc', currentValue: 'a\nx\ny\nc', mode: 'split' })
    expect(getRowTexts()).toEqual(['1|a||1|a', '2|- b||2|+ x', '|||3|+ y', '3|c||4|c'])
    wrapper.unmount()
  })

  it('does not render line terminators with CRLF input', () => {
    const wrapper = render({ previousValue: 'a\r\nb\r\n', currentValue: 'a\r\nc\r\n' })
    expect(getRowTexts().join('')).not.toContain('\r')
    wrapper.unmount()
  })
})
