import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MantineProvider, rem } from '@mantine-vue/core'
import { EmojiPicker, EmojiPickerInput, EmojiPickerPopover, type EmojiPickerData } from '../index'

const mockScrollToIndex = vi.fn()

vi.mock('@tanstack/vue-virtual', async () => {
  const { computed, unref } = await import('vue')
  return {
    useVirtualizer: (options: any) =>
      computed(() => {
        const { count, estimateSize } = unref(options)
        return {
          getTotalSize: () => count * 36,
          getVirtualItems: () =>
            Array.from({ length: count }, (_, index) => ({
              index,
              start: index * estimateSize(index),
              size: estimateSize(index),
              key: index,
            })),
          scrollToIndex: (...args: any[]) => mockScrollToIndex(...args),
          measure: () => {},
        }
      }),
  }
})

const data: EmojiPickerData = {
  categories: [
    { id: 'people', label: 'Smileys & People', emojis: ['grinning', 'wave'] },
    { id: 'nature', label: 'Animals & Nature', emojis: ['dog', 'cat'] },
  ],
  emojis: {
    grinning: { id: 'grinning', name: 'Grinning Face', keywords: ['happy', 'smile'], emoji: '😀' },
    wave: {
      id: 'wave',
      name: 'Waving Hand',
      keywords: ['hello', 'bye'],
      emoji: '👋',
      skins: ['👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿'],
    },
    dog: { id: 'dog', name: 'Dog Face', keywords: ['animal', 'pet'], emoji: '🐶' },
    cat: { id: 'cat', name: 'Cat Face', keywords: ['animal', 'pet'], emoji: '🐱' },
  },
}

const wrappers: VueWrapper[] = []

function render(component: any, props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const wrapper = mount(MantineProvider, {
    props: { env: 'test' },
    slots: { default: () => h(component, { data, ...props }, slots) },
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
  for (let index = 0; index < 3; index += 1) {
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

const emojiButtons = () => Array.from(document.querySelectorAll<HTMLElement>('[role="gridcell"]'))
const search = () => document.querySelector<HTMLInputElement>('input[role="searchbox"]')!

async function typeSearch(value: string) {
  search().value = value
  search().dispatchEvent(new Event('input', { bubbles: true }))
  await flush()
}

describe('@mantine-vue/emoji/EmojiPicker', () => {
  it('renders search, category navigation, emojis and preview', async () => {
    render(EmojiPicker)
    await flush()
    expect(search()).toBeTruthy()
    expect(document.querySelectorAll('[data-category-nav-button]')).toHaveLength(2)
    expect(emojiButtons().map((button) => button.textContent)).toEqual(['😀', '👋', '🐶', '🐱'])
    expect(document.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe(
      'Emoji preview',
    )
  })

  it('hides optional parts', async () => {
    render(EmojiPicker, {
      withSearch: false,
      withCategoryNav: false,
      withPreview: false,
      withSkinToneSelector: false,
    })
    await flush()
    expect(document.querySelector('input[role="searchbox"]')).toBeNull()
    expect(document.querySelector('[data-category-nav]')).toBeNull()
    expect(document.querySelector('[role="group"]')).toBeNull()
  })

  it('emits emojiSelect when an emoji is clicked', async () => {
    const onEmojiSelect = vi.fn()
    render(EmojiPicker, { onEmojiSelect })
    await flush()
    emojiButtons()[2].click()
    expect(onEmojiSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'dog', emoji: '🐶' }))
  })

  it('filters emojis with search and shows empty content', async () => {
    const onSearchChange = vi.fn()
    render(EmojiPicker, { onSearchChange })
    await flush()
    await typeSearch('pet')
    expect(onSearchChange).toHaveBeenLastCalledWith('pet')
    expect(emojiButtons().map((button) => button.textContent)).toEqual(['🐶', '🐱'])
    await typeSearch('zzz')
    expect(emojiButtons()).toHaveLength(0)
    expect(document.body.textContent).toContain('No emojis found')
  })

  it('applies skin tone to selected emoji', async () => {
    const onEmojiSelect = vi.fn()
    render(EmojiPicker, { onEmojiSelect, skinTone: 2 })
    await flush()
    expect(emojiButtons()[1].textContent).toBe('👋🏼')
    emojiButtons()[1].click()
    expect(onEmojiSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'wave', emoji: '👋🏼' }))
  })

  it('selects skin tone from the selector', async () => {
    const onSkinToneChange = vi.fn()
    render(EmojiPicker, { onSkinToneChange })
    await flush()
    document.querySelector<HTMLButtonElement>('button[aria-label="Skin tone"]')!.click()
    await flush()
    document.querySelector<HTMLButtonElement>('button[aria-label="Dark skin tone"]')!.click()
    await flush()
    expect(onSkinToneChange).toHaveBeenCalledWith(5)
    expect(emojiButtons()[1].textContent).toBe('👋🏿')
  })

  it('navigates emojis with keyboard and selects with Enter', async () => {
    const onEmojiSelect = vi.fn()
    render(EmojiPicker, { onEmojiSelect })
    await flush()
    const grid = document.querySelector<HTMLElement>('[role="grid"]')!
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await flush()
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await flush()
    expect(emojiButtons()[1].hasAttribute('data-focused')).toBe(true)
    expect(grid.getAttribute('aria-activedescendant')).toBe(emojiButtons()[1].id)
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(onEmojiSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'wave' }))
  })

  it('scrolls to category when category navigation button is clicked', async () => {
    render(EmojiPicker)
    await flush()
    mockScrollToIndex.mockClear()
    document.querySelectorAll<HTMLButtonElement>('[data-category-nav-button]')[1].click()
    expect(mockScrollToIndex).toHaveBeenCalledWith(2, { align: 'start' })
  })

  it('supports custom labels and category labels', async () => {
    render(EmojiPicker, {
      labels: { search: 'Find emoji' },
      categoryLabels: { people: 'People' },
    })
    await flush()
    expect(search().getAttribute('aria-label')).toBe('Find emoji')
    expect(document.querySelector('[data-category="people"]')?.textContent).toBe('People')
  })

  it('sets CSS variables based on columns and size', async () => {
    render(EmojiPicker, { columns: 5, emojiSize: 40 })
    await flush()
    const root = document.querySelector<HTMLElement>('[style*="--ep-columns"]')!
    expect(root.style.getPropertyValue('--ep-columns')).toBe('5')
    expect(root.style.getPropertyValue('--ep-emoji-size')).toBe(rem(40))
  })
})

describe('@mantine-vue/emoji/EmojiPickerPopover', () => {
  it('opens picker on target click and closes after selection', async () => {
    const onEmojiSelect = vi.fn()
    render(
      EmojiPickerPopover,
      { onEmojiSelect },
      { default: () => h('button', { 'data-target': true }, 'Open') },
    )
    expect(emojiButtons()).toHaveLength(0)
    document.querySelector<HTMLButtonElement>('[data-target]')!.click()
    await flush()
    expect(emojiButtons().length).toBeGreaterThan(0)
    emojiButtons()[0].click()
    await flush()
    expect(onEmojiSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'grinning' }))
  })
})

describe('@mantine-vue/emoji/EmojiPickerInput', () => {
  it('displays placeholder and selected emoji', async () => {
    const onChange = vi.fn()
    render(EmojiPickerInput, { label: 'Emoji', placeholder: 'Pick emoji', onChange })
    expect(document.body.textContent).toContain('Pick emoji')
    document.querySelector<HTMLButtonElement>('button[aria-expanded]')!.click()
    await flush()
    emojiButtons()[3].click()
    await flush()
    expect(onChange).toHaveBeenCalledWith('cat')
    expect(document.body.textContent).toContain('Cat Face')
  })

  it('clears value with clear button', async () => {
    const onChange = vi.fn()
    render(EmojiPickerInput, { defaultValue: 'dog', clearable: true, onChange })
    expect(document.body.textContent).toContain('Dog Face')
    document.querySelector<HTMLButtonElement>('[data-clear]')!.click()
    await flush()
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
