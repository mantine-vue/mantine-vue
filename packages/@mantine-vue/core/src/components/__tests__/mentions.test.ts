import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MantineProvider } from '../../core'
import { Mentions, getMentions, Mention } from '../Mentions'

const users = [
  { id: 'walter', display: 'Walter White' },
  { id: 'jesse', display: 'Jesse Pinkman' },
  { id: 'saul', display: 'Saul Goodman' },
]

const wrappers: VueWrapper[] = []

function render(
  props: Record<string, any> = {},
  mentions: Record<string, any>[] = [{ data: users }],
) {
  const wrapper = mount(MantineProvider, {
    props: { env: 'test' },
    slots: {
      default: () =>
        h(Mentions, { label: 'Message', ...props }, () =>
          mentions.map((mention) => h(Mention, mention)),
        ),
    },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
})

const flush = async () => {
  for (let index = 0; index < 4; index += 1) {
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

const control = () =>
  document.querySelector<HTMLTextAreaElement>('textarea, input:not([type="hidden"])')!

async function type(text: string) {
  const element = control()
  element.focus()
  const start = element.selectionStart ?? element.value.length
  const end = element.selectionEnd ?? element.value.length
  element.value = element.value.slice(0, start) + text + element.value.slice(end)
  const caret = start + text.length
  element.setSelectionRange(caret, caret)
  element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }))
  await flush()
}

async function press(key: string, options: KeyboardEventInit = {}) {
  control().dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options }),
  )
  await flush()
}

const options = () => Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'))

describe('@mantine-vue/core/Mentions', () => {
  it('renders textarea by default and input with singleLine', () => {
    render()
    expect(document.querySelector('textarea')).toBeTruthy()
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
    render({ singleLine: true })
    expect(document.querySelector('textarea')).toBeNull()
    expect(control().getAttribute('role')).toBe('combobox')
  })

  it('associates label with the control', () => {
    render()
    const label = document.querySelector('label')!
    expect(label.getAttribute('for')).toBe(control().id)
  })

  it('opens suggestions after the trigger and filters them by the query', async () => {
    render()
    await type('Hi @je')
    const items = options()
    expect(items).toHaveLength(1)
    expect(items[0].textContent).toBe('Jesse Pinkman')
  })

  it('inserts mention markup with Enter and emits change payload', async () => {
    const onChange = vi.fn()
    const onUpdate = vi.fn()
    render({ onChange, 'onUpdate:modelValue': onUpdate })
    await type('Hi @wal')
    await press('Enter')
    const payload = onChange.mock.calls.at(-1)![0]
    expect(payload.value).toBe('Hi @[Walter White](walter)')
    expect(payload.plainTextValue).toBe('Hi Walter White')
    expect(payload.idValue).toBe('Hi walter')
    expect(payload.mentionId).toBe('walter')
    expect(payload.reason.type).toBe('mention-add')
    expect(payload.mentions).toEqual([
      expect.objectContaining({ id: 'walter', display: 'Walter White', trigger: '@' }),
    ])
    expect(onUpdate).toHaveBeenLastCalledWith('Hi @[Walter White](walter)')
    expect(control().value).toBe('Hi Walter White')
  })

  it('renders mentions from defaultValue in the highlighter', () => {
    render({ defaultValue: 'Hello @[Jesse Pinkman](jesse)!' })
    expect(control().value).toBe('Hello Jesse Pinkman!')
    const highlight = document.querySelector('[data-trigger="@"]')!
    expect(highlight.textContent).toBe('Jesse Pinkman')
  })

  it('selects options with arrow keys', async () => {
    const onChange = vi.fn()
    render({ onChange })
    await type('@')
    expect(options()).toHaveLength(3)
    await press('ArrowDown')
    await press('Enter')
    expect(onChange.mock.calls.at(-1)![0].value).toBe('@[Jesse Pinkman](jesse)')
  })

  it('closes suggestions with Escape', async () => {
    const onChange = vi.fn()
    render({ onChange })
    await type('@wa')
    await press('Escape')
    await press('Enter')
    expect(onChange.mock.calls.every(([payload]) => payload.reason.type === 'input')).toBe(true)
  })

  it('appends space and calls onAdd', async () => {
    const onAdd = vi.fn()
    const onChange = vi.fn()
    render({ onChange }, [{ data: users, appendSpaceOnAdd: true, onAdd }])
    await type('@sa')
    await press('Enter')
    expect(onChange.mock.calls.at(-1)![0].value).toBe('@[Saul Goodman](saul) ')
    expect(onAdd).toHaveBeenCalledWith({
      id: 'saul',
      display: 'Saul Goodman',
      startPos: 0,
      endPos: 3,
    })
  })

  it('supports multiple triggers and custom markup', async () => {
    const onChange = vi.fn()
    render({ onChange }, [
      { trigger: '@', data: users },
      { trigger: '#', data: [{ id: 'bug', display: 'bug' }], markup: '#[__display__](tag:__id__)' },
    ])
    await type('#b')
    expect(options()[0].textContent).toBe('bug')
    await press('Enter')
    expect(onChange.mock.calls.at(-1)![0].value).toBe('#[bug](tag:bug)')
  })

  it('shows nothing found message', async () => {
    render({ nothingFoundMessage: 'Nobody found' })
    await type('@zzz')
    expect(document.body.textContent).toContain('Nobody found')
  })

  it('resolves async data', async () => {
    const data = vi.fn(async (query: string) =>
      users.filter((user) => user.display.toLowerCase().includes(query.toLowerCase())),
    )
    render({}, [{ data }])
    await type('@sau')
    expect(data).toHaveBeenCalledWith('sau', expect.objectContaining({ signal: expect.anything() }))
    expect(options().map((option) => option.textContent)).toEqual(['Saul Goodman'])
  })

  it('shows error message when async data rejects', async () => {
    render({}, [{ data: () => Promise.reject(new Error('boom')) }])
    await type('@a')
    expect(document.body.textContent).toContain('Failed to load suggestions')
  })

  it('writes markup value to the hidden input', () => {
    render({ name: 'message', defaultValue: 'Hi @[Walter White](walter)' })
    expect(document.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe(
      'Hi @[Walter White](walter)',
    )
  })

  it('renders custom mentions with renderMention', () => {
    render({
      defaultValue: '@[Walter White](walter)',
      renderMention: ({ id, display }: any) => h('b', { 'data-id': id }, display),
    })
    expect(document.querySelector('b[data-id="walter"]')!.textContent).toBe('Walter White')
  })

  it('removes a mention as a whole when one of its characters is deleted', async () => {
    const onChange = vi.fn()
    render({ onChange, defaultValue: 'Hi @[Walter White](walter)' })
    const element = control()
    element.focus()
    element.setSelectionRange(15, 15)
    element.dispatchEvent(new Event('select', { bubbles: true }))
    element.value = 'Hi Walter Whit'
    element.setSelectionRange(14, 14)
    element.dispatchEvent(
      new InputEvent('input', { bubbles: true, inputType: 'deleteContentBackward' }),
    )
    await flush()
    const payload = onChange.mock.calls.at(-1)![0]
    expect(payload.value).toBe('Hi ')
    expect(payload.reason.type).toBe('mention-remove')
  })

  it('undoes and redoes changes with keyboard shortcuts', async () => {
    const onChange = vi.fn()
    render({ onChange })
    await type('@wal')
    await press('Enter')
    await press('z', { ctrlKey: true })
    expect(onChange.mock.calls.at(-1)![0]).toEqual(
      expect.objectContaining({ value: '@wal', reason: { type: 'undo' } }),
    )
    await press('y', { ctrlKey: true })
    expect(onChange.mock.calls.at(-1)![0].value).toBe('@[Walter White](walter)')
  })

  it('does not open suggestions when readOnly', async () => {
    render({ readOnly: true })
    control().dispatchEvent(new InputEvent('input', { bubbles: true }))
    await flush()
    expect(options()).toHaveLength(0)
  })

  it('accepts inline suggestion with Tab', async () => {
    const onChange = vi.fn()
    render({ onChange, suggestionsDisplay: 'inline' })
    await type('@sa')
    expect(document.body.textContent).toContain('ul Goodman')
    await press('Tab')
    expect(onChange.mock.calls.at(-1)![0].value).toBe('@[Saul Goodman](saul)')
  })

  it('getMentions parses markup values', () => {
    expect(getMentions('Hi @[Walter White](walter) and @[Jesse](jesse)')).toEqual([
      expect.objectContaining({ id: 'walter', display: 'Walter White', index: 3 }),
      expect.objectContaining({ id: 'jesse', display: 'Jesse' }),
    ])
  })

  it('exposes Mention as a static component', () => {
    expect(Mentions.Mention).toBe(Mention)
  })
})
