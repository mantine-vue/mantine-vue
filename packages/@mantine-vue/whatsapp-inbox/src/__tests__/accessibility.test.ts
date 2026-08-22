import { describe, expect, it, vi } from 'vitest'
import { WhatsAppComposer } from '../components/WhatsAppComposer'
import { WhatsAppContactPanel } from '../components/WhatsAppContactPanel'
import { WhatsAppConversationHeader } from '../components/WhatsAppConversationHeader'
import { WhatsAppConversationList } from '../components/WhatsAppConversationList'
import { WhatsAppMessageBubble } from '../components/WhatsAppMessageBubble'
import { WhatsAppMessageList } from '../components/WhatsAppMessageList'
import { createConversation, createTextMessage, mountWithProvider } from './test-utils'

describe('accessible structure', () => {
  it('gives the conversation list a labelled list and reachable items', () => {
    const wrapper = mountWithProvider(WhatsAppConversationList, {
      conversations: [createConversation()],
    })

    expect(wrapper.get('ul').attributes('aria-label')).toBe('Conversations')
    expect(wrapper.get('ul > li > button').attributes('type')).toBe('button')
    expect(wrapper.get('input[type="search"]').attributes('aria-label')).toBe(
      'Search conversations',
    )
  })

  it('marks the selected conversation with aria-current', () => {
    const wrapper = mountWithProvider(WhatsAppConversationList, {
      conversations: [createConversation(), createConversation({ id: 'conversation-2' })],
      selectedConversationId: 'conversation-1',
    })

    expect(
      wrapper.get('button[data-conversation-id="conversation-1"]').attributes('aria-current'),
    ).toBe('true')
    expect(
      wrapper.get('button[data-conversation-id="conversation-2"]').attributes('aria-current'),
    ).toBeUndefined()
  })

  it('announces the message history as a log', () => {
    const wrapper = mountWithProvider(WhatsAppMessageList, {
      messages: [createTextMessage()],
    })

    const log = wrapper.get('[role="log"]')

    expect(log.attributes('aria-label')).toBe('Message history')
    expect(log.attributes('aria-relevant')).toBe('additions text')
  })

  it('gives every timestamp a full accessible date', () => {
    const wrapper = mountWithProvider(WhatsAppMessageBubble, {
      direction: 'outbound',
      status: 'delivered',
      timestamp: '2026-03-18T09:30:00.000Z',
    })

    const time = wrapper.get('time')

    expect(time.attributes('aria-label')).toBeTruthy()
    expect(time.attributes('title')).toBe(time.attributes('aria-label'))
  })

  it('describes the delivery state in words, not only in colour', () => {
    const wrapper = mountWithProvider(WhatsAppMessageBubble, {
      direction: 'outbound',
      status: 'read',
      timestamp: '2026-03-18T09:30:00.000Z',
    })

    expect(wrapper.text()).toContain('Message read')
  })

  it('labels the composer input and every action', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: {
        canSendFreeForm: true,
        canSendMedia: true,
        canSendTemplates: true,
        canUseEmoji: true,
        messagingWindow: { state: 'open' },
      },
    })

    expect(wrapper.get('textarea').attributes('aria-label')).toBe('Message')

    const labelled = wrapper
      .findAll('button')
      .every((node) => Boolean(node.attributes('aria-label')?.length))

    expect(labelled).toBe(true)
  })

  it('announces the closed window as a status region', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: { messagingWindow: { state: 'closed' } },
    })

    expect(wrapper.get('[role="status"]').exists()).toBe(true)
  })

  it('announces a send error as an alert', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      error: 'Provider unavailable',
    })

    expect(wrapper.get('[role="alert"]').text()).toContain('Provider unavailable')
  })

  it('exposes the contact panel as a labelled landmark', () => {
    const wrapper = mountWithProvider(WhatsAppContactPanel, {
      conversation: createConversation(),
      withCloseButton: true,
    })

    const panel = wrapper.get('aside')

    expect(panel.attributes('aria-label')).toBe('Contact details')
    expect(wrapper.get('button[aria-label="Close"]').exists()).toBe(true)
  })

  it('renders contact details as labelled fields with actionable links', () => {
    const wrapper = mountWithProvider(WhatsAppContactPanel, {
      conversation: createConversation({
        status: 'open',
        assignee: { id: 'agent-1', name: 'Sara' },
        contact: {
          id: 'contact-1',
          name: 'Amina Haddad',
          phoneNumber: '+973 3300 1122',
          email: 'amina@example.test',
          tags: ['vip'],
          fields: [{ key: 'crm', label: 'CRM id', value: 'CU-9931' }],
        },
      }),
    })

    expect(wrapper.text()).toContain('Phone number')
    expect(wrapper.text()).toContain('CRM id')
    expect(wrapper.text()).toContain('CU-9931')
    expect(wrapper.text()).toContain('vip')
    expect(wrapper.text()).toContain('Sara')
    expect(wrapper.get('a[href^="mailto:"]').attributes('href')).toBe('mailto:amina@example.test')
  })

  it('renders the header back and contact controls with labels and state', async () => {
    const onBack = vi.fn()
    const onToggleContactPanel = vi.fn()

    const wrapper = mountWithProvider(WhatsAppConversationHeader, {
      conversation: createConversation(),
      withBack: true,
      withContactToggle: true,
      contactPanelOpened: true,
      onBack,
      onToggleContactPanel,
    })

    const back = wrapper.get('button[aria-label="Back to conversations"]')
    const toggle = wrapper.get('button[aria-label="Toggle contact details"]')

    expect(toggle.attributes('aria-expanded')).toBe('true')

    await back.trigger('click')
    await toggle.trigger('click')

    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onToggleContactPanel).toHaveBeenCalledWith(false)
  })
})

describe('styles API', () => {
  it('applies classNames to the documented selectors', () => {
    const wrapper = mountWithProvider(WhatsAppMessageBubble, {
      direction: 'inbound',
      timestamp: '2026-03-18T09:30:00.000Z',
      classNames: { bubbleRoot: 'my-root', bubble: 'my-bubble' },
    })

    expect(wrapper.find('.my-root').exists()).toBe(true)
    expect(wrapper.find('.my-bubble').exists()).toBe(true)
  })

  it('applies inline styles and CSS variables per selector', () => {
    const wrapper = mountWithProvider(WhatsAppMessageBubble, {
      direction: 'inbound',
      timestamp: '2026-03-18T09:30:00.000Z',
      maxWidth: 420,
      styles: { bubble: { color: 'rgb(1, 2, 3)' } },
    })

    expect(wrapper.get('[data-direction="inbound"]').attributes('style')).toContain(
      '--wa-bubble-max-width: 420px',
    )
    expect(wrapper.find('[style*="rgb(1, 2, 3)"]').exists()).toBe(true)
  })

  it('drops the built-in classes when unstyled is set', () => {
    const wrapper = mountWithProvider(WhatsAppMessageBubble, {
      direction: 'inbound',
      timestamp: '2026-03-18T09:30:00.000Z',
      unstyled: true,
    })

    const root = wrapper.get('[data-direction="inbound"]')

    // Static Mantine classes stay so consumers can still target elements.
    expect(root.classes().some((name) => name.startsWith('_bubbleRoot_'))).toBe(false)
    expect(root.classes()).toContain('mantine-WhatsAppMessageBubble-bubbleRoot')
  })
})
