import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { WhatsAppConversationList } from '../components/WhatsAppConversationList'
import { WhatsAppConversationListItem } from '../components/WhatsAppConversationListItem'
import { createConversation, mountWithProvider } from './test-utils'

describe('WhatsAppConversationList', () => {
  it('renders one item per conversation with contact name and preview', () => {
    const wrapper = mountWithProvider(WhatsAppConversationList, {
      conversations: [
        createConversation(),
        createConversation({
          id: 'conversation-2',
          contact: { id: 'contact-2', name: 'Yusuf Karim', phoneNumber: '+973 3300 9988' },
        }),
      ],
    })

    const items = wrapper.findAll('[data-conversation-id]')

    expect(items).toHaveLength(2)
    expect(wrapper.text()).toContain('Amina Haddad')
    expect(wrapper.text()).toContain('Yusuf Karim')
    expect(wrapper.text()).toContain('Hello there')
  })

  it('emits select and update:selectedConversationId when an item is activated', async () => {
    const conversation = createConversation()
    const wrapper = mountWithProvider(WhatsAppConversationList, {
      conversations: [conversation],
    })

    await wrapper.get('[data-conversation-id="conversation-1"]').trigger('click')

    const list = wrapper.findComponent(WhatsAppConversationList)

    expect(list.emitted('update:selectedConversationId')?.[0]).toEqual(['conversation-1'])
    expect(list.emitted('select')?.[0]).toEqual([conversation])
  })

  it('keeps the selection controlled: the prop wins over the click', async () => {
    const wrapper = mountWithProvider(WhatsAppConversationList, {
      conversations: [createConversation(), createConversation({ id: 'conversation-2' })],
      selectedConversationId: 'conversation-2',
    })

    await wrapper.get('[data-conversation-id="conversation-1"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-conversation-id="conversation-2"]').attributes('data-selected')).toBe(
      '',
    )
    expect(
      wrapper.get('[data-conversation-id="conversation-1"]').attributes('data-selected'),
    ).toBeUndefined()
  })

  it('marks unread conversations and announces the count', () => {
    const wrapper = mountWithProvider(WhatsAppConversationList, {
      conversations: [createConversation({ unreadCount: 3 })],
    })

    const item = wrapper.get('[data-conversation-id="conversation-1"]')

    expect(item.attributes('data-unread')).toBe('')
    expect(item.attributes('aria-label')).toContain('3 unread messages')
    expect(item.text()).toContain('3')
  })

  it('leaves the unread marker off when there is nothing unread', () => {
    const wrapper = mountWithProvider(WhatsAppConversationList, {
      conversations: [createConversation({ unreadCount: 0 })],
    })

    expect(
      wrapper.get('[data-conversation-id="conversation-1"]').attributes('data-unread'),
    ).toBeUndefined()
  })

  it('renders the loading, error and empty states', async () => {
    const loading = mountWithProvider(WhatsAppConversationList, { loading: true })
    expect(loading.text()).toContain('Loading conversations')

    const failed = mountWithProvider(WhatsAppConversationList, { error: 'Network down' })
    expect(failed.text()).toContain('Network down')

    await failed.get('button').trigger('click')
    expect(failed.findComponent(WhatsAppConversationList).emitted('retryLoad')).toHaveLength(1)

    const empty = mountWithProvider(WhatsAppConversationList, { conversations: [] })
    expect(empty.text()).toContain('No conversations yet')
  })

  it('offers a load-more control and emits the cursor it was given', async () => {
    const wrapper = mountWithProvider(WhatsAppConversationList, {
      conversations: [createConversation()],
      pagination: { hasMore: true, cursor: 'cursor-2' },
      withHeader: false,
    })

    const button = wrapper.findAll('button').find((node) => node.text() === 'Load more')
    expect(button).toBeDefined()

    await button!.trigger('click')

    expect(wrapper.findComponent(WhatsAppConversationList).emitted('loadMore')?.[0]).toEqual([
      { cursor: 'cursor-2' },
    ])
  })

  it('hides the assignment and status filters unless options are supplied', () => {
    const withoutOptions = mountWithProvider(WhatsAppConversationList, {
      conversations: [createConversation()],
    })

    expect(withoutOptions.text()).not.toContain('All statuses')

    const withOptions = mountWithProvider(WhatsAppConversationList, {
      conversations: [createConversation()],
      filtersConfig: {
        statuses: [{ value: 'open', label: 'Open' }],
        assignees: [{ id: 'agent-1', name: 'Sara' }],
      },
    })

    expect(withOptions.findAll('input[placeholder="All statuses"]')).toHaveLength(1)
    expect(withOptions.findAll('input[placeholder="Anyone"]')).toHaveLength(1)
  })

  it('emits filter changes instead of filtering the supplied array', async () => {
    const conversations = [createConversation(), createConversation({ id: 'conversation-2' })]
    const wrapper = mountWithProvider(WhatsAppConversationList, { conversations })

    await wrapper.get('input[type="search"]').setValue('nothing matches')

    const list = wrapper.findComponent(WhatsAppConversationList)

    expect(list.emitted('update:filters')?.[0]).toEqual([{ query: 'nothing matches' }])
    expect(wrapper.findAll('[data-conversation-id]')).toHaveLength(2)
  })

  it('orders by latest activity only when asked to', () => {
    const older = createConversation({ id: 'older', updatedAt: '2026-03-01T09:00:00.000Z' })
    const newer = createConversation({ id: 'newer', updatedAt: '2026-03-17T09:00:00.000Z' })

    const untouched = mountWithProvider(WhatsAppConversationList, {
      conversations: [older, newer],
    })
    expect(
      untouched
        .findAll('[data-conversation-id]')
        .map((node) => node.attributes('data-conversation-id')),
    ).toEqual(['older', 'newer'])

    const ordered = mountWithProvider(WhatsAppConversationList, {
      conversations: [older, newer],
      order: 'activity',
    })
    expect(
      ordered
        .findAll('[data-conversation-id]')
        .map((node) => node.attributes('data-conversation-id')),
    ).toEqual(['newer', 'older'])
  })

  it('lets a slot replace the whole item', () => {
    const wrapper = mountWithProvider(
      WhatsAppConversationList,
      { conversations: [createConversation()] },
      {
        slots: {
          conversationItem: ({ conversation }: any) => `custom:${conversation.id}`,
        },
      },
    )

    expect(wrapper.text()).toContain('custom:conversation-1')
    expect(wrapper.find('[data-conversation-id]').exists()).toBe(false)
  })
})

describe('WhatsAppConversationListItem', () => {
  it('emits select with the conversation it was given', async () => {
    const conversation = createConversation()
    const onSelect = vi.fn()
    const wrapper = mountWithProvider(WhatsAppConversationListItem, {
      conversation,
      onSelect,
    })

    await wrapper.get('button').trigger('click')

    expect(onSelect).toHaveBeenCalledWith(conversation)
  })

  it('renders the delivery state of an outbound preview', () => {
    const wrapper = mountWithProvider(WhatsAppConversationListItem, {
      conversation: createConversation({
        lastMessage: {
          id: 'message-9',
          type: 'text',
          direction: 'outbound',
          status: 'read',
          text: 'On my way',
        },
      }),
    })

    expect(wrapper.find('[data-status="read"]').exists()).toBe(true)
  })
})
