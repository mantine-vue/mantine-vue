import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { WhatsAppInbox } from '../components/WhatsAppInbox'
import { WhatsAppInboxDrawer } from '../components/WhatsAppInboxDrawer'
import { WhatsAppInboxModal } from '../components/WhatsAppInboxModal'
import { WhatsAppInboxProvider } from '../components/WhatsAppInboxProvider'
import { WhatsAppConversationList } from '../components/WhatsAppConversationList'
import type { WhatsAppConversationData } from '../types'
import {
  createConversation,
  createTextMessage,
  mountReactive,
  mountWithProvider,
} from './test-utils'

const conversation: WhatsAppConversationData = {
  ...createConversation(),
  capabilities: { canSendFreeForm: true, messagingWindow: { state: 'open' } },
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('WhatsAppInbox', () => {
  it('renders the list and the conversation side by side', () => {
    const wrapper = mountWithProvider(WhatsAppInbox, {
      conversations: [conversation],
      selectedConversationId: 'conversation-1',
      conversation,
      messages: [createTextMessage()],
    })

    expect(wrapper.find('button[data-conversation-id="conversation-1"]').exists()).toBe(true)
    expect(wrapper.get('[role="log"]').text()).toContain('Hello there')
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('shows the no-selection state until a conversation is picked', async () => {
    const wrapper = mountWithProvider(WhatsAppInbox, {
      conversations: [conversation],
    })

    expect(wrapper.text()).toContain('No conversation selected')

    await wrapper.get('button[data-conversation-id="conversation-1"]').trigger('click')

    expect(
      wrapper.findComponent(WhatsAppInbox).emitted('update:selectedConversationId')?.[0],
    ).toEqual(['conversation-1'])
    expect(wrapper.findComponent(WhatsAppInbox).emitted('selectConversation')).toHaveLength(1)
  })

  it('supports v-model:selectedConversationId', async () => {
    const { wrapper, setProps } = mountReactive(WhatsAppInbox, {
      conversations: [conversation, createConversation({ id: 'conversation-2' })],
      selectedConversationId: null as string | null,
      conversation,
      messages: [createTextMessage()],
    })

    expect(wrapper.text()).toContain('No conversation selected')

    await setProps({ selectedConversationId: 'conversation-1' })

    expect(wrapper.text()).not.toContain('No conversation selected')
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('forwards a send from the composer with the selected conversation id', async () => {
    const onSend = vi.fn()
    const wrapper = mountWithProvider(WhatsAppInbox, {
      conversations: [conversation],
      selectedConversationId: 'conversation-1',
      conversation,
      messages: [],
      onSend,
    })

    await wrapper.get('textarea').setValue('Hi Amina')
    await wrapper.get('button[aria-label="Send"]').trigger('click')

    expect(onSend.mock.calls[0][0]).toMatchObject({
      kind: 'text',
      conversationId: 'conversation-1',
      text: 'Hi Amina',
    })
  })

  it('renders the contact panel only when it is enabled and opened', async () => {
    const closed = mountWithProvider(WhatsAppInbox, {
      conversations: [conversation],
      selectedConversationId: 'conversation-1',
      conversation,
      withContactPanel: true,
    })

    expect(closed.find('aside').exists()).toBe(false)

    const toggle = closed.get('button[aria-label="Toggle contact details"]')
    expect(toggle.attributes('aria-expanded')).toBe('false')

    await toggle.trigger('click')

    expect(closed.findComponent(WhatsAppInbox).emitted('update:contactPanelOpened')?.[0]).toEqual([
      true,
    ])

    const opened = mountWithProvider(WhatsAppInbox, {
      conversations: [conversation],
      selectedConversationId: 'conversation-1',
      conversation,
      withContactPanel: true,
      contactPanelOpened: true,
    })

    expect(opened.get('aside').text()).toContain('+973 3300 1122')
  })

  it('collapses to a single pane when the layout is forced to single', () => {
    const wrapper = mountWithProvider(WhatsAppInbox, {
      conversations: [conversation],
      selectedConversationId: 'conversation-1',
      conversation,
      layout: 'single',
    })

    expect(wrapper.find('[data-narrow]').exists()).toBe(true)
    expect(wrapper.find('button[data-conversation-id="conversation-1"]').exists()).toBe(false)
    expect(wrapper.find('button[aria-label="Back to conversations"]').exists()).toBe(true)
  })

  it('clears the selection when the back control is used in the collapsed layout', async () => {
    const wrapper = mountWithProvider(WhatsAppInbox, {
      conversations: [conversation],
      defaultSelectedConversationId: 'conversation-1',
      conversation,
      layout: 'single',
    })

    await wrapper.get('button[aria-label="Back to conversations"]').trigger('click')

    expect(
      wrapper.findComponent(WhatsAppInbox).emitted('update:selectedConversationId')?.[0],
    ).toEqual([null])
  })

  it('propagates conversation-list state through to the sidebar', () => {
    const wrapper = mountWithProvider(WhatsAppInbox, {
      conversationsLoading: true,
    })

    expect(wrapper.text()).toContain('Loading conversations')
  })
})

describe('WhatsAppInboxProvider', () => {
  it('applies label overrides to every component below it', () => {
    const wrapper = mountWithProvider(
      WhatsAppInboxProvider,
      { labels: { emptyInbox: 'Nada por aqui' } },
      { slots: { default: () => h(WhatsAppConversationList, { conversations: [] }) } },
    )

    expect(wrapper.text()).toContain('Nada por aqui')
  })

  it('lets a component override a single label without losing the rest', () => {
    const wrapper = mountWithProvider(
      WhatsAppInboxProvider,
      { labels: { emptyInbox: 'Nada por aqui', conversationsLabel: 'Chats' } },
      {
        slots: {
          default: () =>
            h(WhatsAppConversationList, {
              conversations: [],
              labels: { emptyInbox: 'Sin conversaciones' },
            }),
        },
      },
    )

    expect(wrapper.text()).toContain('Sin conversaciones')
    expect(wrapper.text()).toContain('Chats')
  })

  it('uses the supplied formatters', () => {
    const wrapper = mountWithProvider(
      WhatsAppInboxProvider,
      { formatters: { conversationTime: () => 'just now' } },
      { slots: { default: () => h(WhatsAppConversationList, { conversations: [conversation] }) } },
    )

    expect(wrapper.text()).toContain('just now')
  })
})

describe('WhatsAppInboxModal', () => {
  it('opens straight into the supplied conversation', () => {
    mountWithProvider(
      WhatsAppInboxModal,
      {
        opened: true,
        conversationId: 'conversation-1',
        conversation,
        messages: [createTextMessage()],
        capabilities: { canSendFreeForm: true, messagingWindow: { state: 'open' } },
      },
      { attachTo: true },
    )

    const dialog = document.body.querySelector('[role="dialog"]')

    expect(dialog).not.toBeNull()
    expect(dialog!.textContent).toContain('Hello there')
    expect(dialog!.querySelector('button[data-conversation-id="conversation-1"]')).toBeNull()
    expect(dialog!.querySelector('textarea')).not.toBeNull()
  })

  it('renders nothing while closed', () => {
    mountWithProvider(
      WhatsAppInboxModal,
      { opened: false, conversationId: 'conversation-1', conversation },
      { attachTo: true },
    )

    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
  })

  it('emits update:opened and close when dismissed', async () => {
    const onUpdateOpened = vi.fn()
    const onClose = vi.fn()

    mountWithProvider(
      WhatsAppInboxModal,
      {
        opened: true,
        conversationId: 'conversation-1',
        conversation,
        'onUpdate:opened': onUpdateOpened,
        onClose,
      },
      { attachTo: true },
    )

    const closeButton = document.body.querySelector<HTMLButtonElement>('.mantine-Modal-close')
    closeButton?.click()

    expect(onUpdateOpened).toHaveBeenCalledWith(false)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keeps the closed-window restriction inside the dialog', () => {
    mountWithProvider(
      WhatsAppInboxModal,
      {
        opened: true,
        conversationId: 'conversation-1',
        conversation,
        capabilities: {
          canSendTemplates: true,
          messagingWindow: { state: 'closed', reason: 'Window closed' },
        },
      },
      { attachTo: true },
    )

    const dialog = document.body.querySelector('[role="dialog"]')!

    expect(dialog.querySelector('textarea')!.hasAttribute('disabled')).toBe(true)
    expect(dialog.textContent).toContain('Window closed')
  })
})

describe('WhatsAppInboxDrawer', () => {
  it('shows one conversation with its composer and no list', () => {
    mountWithProvider(
      WhatsAppInboxDrawer,
      {
        opened: true,
        conversationId: 'conversation-1',
        conversation,
        messages: [createTextMessage()],
        capabilities: { canSendFreeForm: true, messagingWindow: { state: 'open' } },
      },
      { attachTo: true },
    )

    const dialog = document.body.querySelector('[role="dialog"]')

    expect(dialog).not.toBeNull()
    expect(dialog!.textContent).toContain('Hello there')
    expect(dialog!.querySelector('textarea')).not.toBeNull()
    expect(dialog!.querySelector('button[data-conversation-id="conversation-1"]')).toBeNull()
  })

  it('preserves template messaging while the window is closed', () => {
    mountWithProvider(
      WhatsAppInboxDrawer,
      {
        opened: true,
        conversationId: 'conversation-1',
        conversation,
        capabilities: {
          canSendTemplates: true,
          messagingWindow: { state: 'closed' },
        },
      },
      { attachTo: true },
    )

    const dialog = document.body.querySelector('[role="dialog"]')!
    const labels = [...dialog.querySelectorAll('button')].map((node) =>
      node.getAttribute('aria-label'),
    )

    expect(labels).toContain('Send template')
    expect(dialog.textContent).toContain('Free-form messaging is unavailable')
  })

  it('emits close when dismissed', () => {
    const onClose = vi.fn()

    mountWithProvider(
      WhatsAppInboxDrawer,
      { opened: true, conversationId: 'conversation-1', conversation, onClose },
      { attachTo: true },
    )

    const closeButton = document.body.querySelector<HTMLButtonElement>('.mantine-Drawer-close')
    closeButton?.click()

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
