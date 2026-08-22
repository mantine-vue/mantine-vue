import { describe, expect, it, vi } from 'vitest'
import { WhatsAppComposer } from '../components/WhatsAppComposer'
import { WhatsAppEmojiPicker } from '../components/WhatsAppEmojiPicker'
import {
  filterEmojis,
  searchEmojis,
  WHATSAPP_EMOJI_GROUP_ORDER,
  WHATSAPP_EMOJIS,
  WHATSAPP_EMOJIS_BY_CHAR,
} from '../emoji'
import { mountWithProvider } from './test-utils'

const EMOJI_CAPABILITIES = {
  canSendFreeForm: true,
  canUseEmoji: true,
  messagingWindow: { state: 'open' },
} as const

function emojiButtons(wrapper: ReturnType<typeof mountWithProvider>) {
  return wrapper.findAll('[data-emoji-index]')
}

describe('emoji dataset', () => {
  it('covers every category and has no duplicate characters', () => {
    const chars = WHATSAPP_EMOJIS.map((entry) => entry.emoji)

    expect(WHATSAPP_EMOJIS.length).toBeGreaterThan(400)
    expect(new Set(chars).size).toBe(chars.length)

    for (const group of WHATSAPP_EMOJI_GROUP_ORDER) {
      expect(WHATSAPP_EMOJIS.some((entry) => entry.group === group)).toBe(true)
    }
  })

  it('indexes entries by character', () => {
    expect(WHATSAPP_EMOJIS_BY_CHAR.get('😀')?.name).toBe('grinning face')
    expect(WHATSAPP_EMOJIS_BY_CHAR.get('not an emoji')).toBeUndefined()
  })
})

describe('filterEmojis', () => {
  it('returns everything by default', () => {
    expect(filterEmojis()).toHaveLength(WHATSAPP_EMOJIS.length)
  })

  it('keeps only the allowed categories', () => {
    const result = filterEmojis({ groups: ['food'] })

    expect(result.length).toBeGreaterThan(0)
    expect(result.every((entry) => entry.group === 'food')).toBe(true)
  })

  it('drops excluded categories', () => {
    const result = filterEmojis({ excludeGroups: ['flags', 'symbols'] })

    expect(result.some((entry) => entry.group === 'flags')).toBe(false)
    expect(result.some((entry) => entry.group === 'symbols')).toBe(false)
    expect(result.some((entry) => entry.group === 'smileys')).toBe(true)
  })

  it('supports an explicit allow-list of characters', () => {
    const result = filterEmojis({ emojis: ['👍', '❤️'] })

    expect(result).toHaveLength(2)
    expect(result.map((entry) => entry.emoji).sort()).toEqual(['❤️', '👍'].sort())
  })

  it('supports a block-list of characters', () => {
    const result = filterEmojis({ excludeEmojis: ['😀'] })

    expect(result.some((entry) => entry.emoji === '😀')).toBe(false)
    expect(result.some((entry) => entry.emoji === '😃')).toBe(true)
  })

  it('gives the predicate the final say', () => {
    const result = filterEmojis({
      groups: ['food'],
      filter: (entry) => entry.name.includes('pizza'),
    })

    expect(result).toHaveLength(1)
    expect(result[0].emoji).toBe('🍕')
  })

  it('accepts a replacement dataset', () => {
    const result = filterEmojis({
      emojiData: [{ emoji: '🦄', name: 'unicorn', keywords: [], group: 'animals' }],
    })

    expect(result).toHaveLength(1)
  })
})

describe('searchEmojis', () => {
  it('returns everything for an empty query', () => {
    expect(searchEmojis(WHATSAPP_EMOJIS, '   ')).toHaveLength(WHATSAPP_EMOJIS.length)
  })

  it('matches names and keywords, ranking prefixes first', () => {
    const results = searchEmojis(WHATSAPP_EMOJIS, 'pizza')
    expect(results[0].emoji).toBe('🍕')

    // `thumbs up` is found through its keywords, not its name.
    expect(searchEmojis(WHATSAPP_EMOJIS, 'like').some((entry) => entry.emoji === '👍')).toBe(true)
  })

  it('returns nothing for a query that matches nothing', () => {
    expect(searchEmojis(WHATSAPP_EMOJIS, 'zzzzz-not-an-emoji')).toHaveLength(0)
  })
})

describe('WhatsAppEmojiPicker', () => {
  it('renders categories, tabs and a search field', () => {
    const wrapper = mountWithProvider(WhatsAppEmojiPicker, {})

    expect(wrapper.find('input[type="search"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="tab"]').length).toBeGreaterThan(5)
    expect(emojiButtons(wrapper).length).toBe(WHATSAPP_EMOJIS.length)
  })

  it('emits the picked entry and records it as recently used', async () => {
    const onSelect = vi.fn()
    const onUpdateRecent = vi.fn()
    const wrapper = mountWithProvider(WhatsAppEmojiPicker, {
      emojis: ['😀', '🍕'],
      onSelect,
      'onUpdate:recentEmojis': onUpdateRecent,
    })

    await emojiButtons(wrapper)[0].trigger('click')

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][0]).toMatchObject({ emoji: '😀', name: 'grinning face' })
    expect(onUpdateRecent).toHaveBeenCalledWith(['😀'])
  })

  it('keeps the recently used list unique and capped', async () => {
    const onUpdateRecent = vi.fn()
    const wrapper = mountWithProvider(WhatsAppEmojiPicker, {
      emojis: ['😀', '🍕'],
      recentEmojis: ['🍕'],
      recentLimit: 1,
      'onUpdate:recentEmojis': onUpdateRecent,
    })

    const buttons = emojiButtons(wrapper)
    // The recent row renders first, so the grid contains the recent 🍕 and then both entries.
    await buttons[buttons.length - 1].trigger('click')

    expect(onUpdateRecent).toHaveBeenCalledWith(['🍕'])
  })

  it('narrows the grid as the search runs', async () => {
    const wrapper = mountWithProvider(WhatsAppEmojiPicker, {})

    await wrapper.get('input[type="search"]').setValue('pizza')

    const remaining = emojiButtons(wrapper)
    expect(remaining).toHaveLength(1)
    expect(remaining[0].text()).toBe('🍕')
  })

  it('shows an empty state when nothing matches', async () => {
    const wrapper = mountWithProvider(WhatsAppEmojiPicker, {})

    await wrapper.get('input[type="search"]').setValue('zzzzz-not-an-emoji')

    expect(emojiButtons(wrapper)).toHaveLength(0)
    expect(wrapper.text()).toContain('No emoji found')
  })

  it('applies the filter props', () => {
    const allowList = mountWithProvider(WhatsAppEmojiPicker, {
      emojis: ['👍', '❤️', '😂'],
      withSearch: false,
      withTabs: false,
    })

    expect(emojiButtons(allowList)).toHaveLength(3)
    expect(allowList.find('input[type="search"]').exists()).toBe(false)
    expect(allowList.findAll('[role="tab"]')).toHaveLength(0)

    const blockList = mountWithProvider(WhatsAppEmojiPicker, { excludeGroups: ['flags'] })

    expect(blockList.text()).not.toContain('Flags')
  })

  it('hides the tab of a category that filtered down to nothing', () => {
    const wrapper = mountWithProvider(WhatsAppEmojiPicker, { groups: ['food'] })

    const tabLabels = wrapper.findAll('[role="tab"]').map((tab) => tab.attributes('aria-label'))

    expect(tabLabels).not.toContain('Flags')
  })

  it('is one keyboard stop, with arrows moving between emoji', async () => {
    const wrapper = mountWithProvider(
      WhatsAppEmojiPicker,
      { emojis: ['😀', '😃', '😄'], withSearch: false, withTabs: false, columns: 2 },
      { attachTo: true },
    )

    const buttons = emojiButtons(wrapper)

    expect(buttons.filter((button) => button.attributes('tabindex') === '0')).toHaveLength(1)
    expect(buttons[0].attributes('tabindex')).toBe('0')

    await buttons[0].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.findAll('[data-emoji-index]')[1].attributes('tabindex')).toBe('0')

    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('names every emoji for assistive technology', () => {
    const wrapper = mountWithProvider(WhatsAppEmojiPicker, { emojis: ['🍕'] })

    const button = emojiButtons(wrapper)[0]

    expect(button.attributes('aria-label')).toBe('pizza')
    expect(button.attributes('title')).toBe('pizza')
  })
})

describe('composer emoji integration', () => {
  it('renders the built-in picker without any slot', async () => {
    const wrapper = mountWithProvider(
      WhatsAppComposer,
      { conversationId: 'conversation-1', capabilities: EMOJI_CAPABILITIES },
      { attachTo: true },
    )

    await wrapper.get('button[aria-label="Insert emoji"]').trigger('click')

    expect(document.body.querySelectorAll('[data-emoji-index]').length).toBeGreaterThan(100)

    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('inserts the picked character into the draft', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountWithProvider(
      WhatsAppComposer,
      {
        conversationId: 'conversation-1',
        capabilities: EMOJI_CAPABILITIES,
        emojiPickerProps: { emojis: ['🎉'] },
        'onUpdate:modelValue': onUpdate,
      },
      { attachTo: true },
    )

    await wrapper.get('button[aria-label="Insert emoji"]').trigger('click')

    const first = document.body.querySelector<HTMLButtonElement>('[data-emoji-index]')!
    first.click()

    expect(onUpdate).toHaveBeenCalledWith('🎉')

    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('forwards the filter props to the picker', async () => {
    const wrapper = mountWithProvider(
      WhatsAppComposer,
      {
        conversationId: 'conversation-1',
        capabilities: EMOJI_CAPABILITIES,
        emojiPickerProps: { emojis: ['👍', '❤️'] },
      },
      { attachTo: true },
    )

    await wrapper.get('button[aria-label="Insert emoji"]').trigger('click')

    expect(document.body.querySelectorAll('[data-emoji-index]')).toHaveLength(2)

    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('lets a slot replace the built-in picker', async () => {
    const wrapper = mountWithProvider(
      WhatsAppComposer,
      { conversationId: 'conversation-1', capabilities: EMOJI_CAPABILITIES },
      { attachTo: true, slots: { emojiPicker: () => 'my own picker' } },
    )

    await wrapper.get('button[aria-label="Insert emoji"]').trigger('click')

    expect(document.body.textContent).toContain('my own picker')
    expect(document.body.querySelectorAll('[data-emoji-index]')).toHaveLength(0)

    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('hides the control when the built-in picker is off and no slot is supplied', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: EMOJI_CAPABILITIES,
      withEmojiPicker: false,
    })

    expect(wrapper.find('button[aria-label="Insert emoji"]').exists()).toBe(false)
  })

  it('keeps the control when the picker is off but a slot is supplied', () => {
    const wrapper = mountWithProvider(
      WhatsAppComposer,
      {
        conversationId: 'conversation-1',
        capabilities: EMOJI_CAPABILITIES,
        withEmojiPicker: false,
      },
      { slots: { emojiPicker: () => 'custom' } },
    )

    expect(wrapper.find('button[aria-label="Insert emoji"]').exists()).toBe(true)
  })
})
