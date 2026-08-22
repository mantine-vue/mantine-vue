import { describe, expect, it, vi } from 'vitest'
import { WhatsAppComposer } from '../components/WhatsAppComposer'
import { WhatsAppConversation } from '../components/WhatsAppConversation'
import { WhatsAppConversationList } from '../components/WhatsAppConversationList'
import { WhatsAppInbox } from '../components/WhatsAppInbox'
import { WhatsAppMessage } from '../components/WhatsAppMessage'
import { WhatsAppMessageList } from '../components/WhatsAppMessageList'
import type { WhatsAppConversationData, WhatsAppMessageData } from '../types'
import { isValidPhoneNumber, normalizePhoneNumber } from '../utils'
import {
  createConversation,
  createTextMessage,
  mountReactive,
  mountWithProvider,
  TEST_NOW,
} from './test-utils'

const conversation: WhatsAppConversationData = {
  ...createConversation(),
  capabilities: { canSendFreeForm: true, messagingWindow: { state: 'open' } },
}

describe('message layout', () => {
  it('does not let the message root override the bubble layout', () => {
    // `messageRoot` and `bubbleRoot` land on the same element; a `display` on the former would
    // flatten the flex alignment and push every message to the same side.
    const wrapper = mountWithProvider(WhatsAppMessage, {
      message: createTextMessage({ direction: 'outbound', status: 'read' }),
    })

    const root = wrapper.get('[data-direction="outbound"]')

    expect(root.classes()).toContain('mantine-WhatsAppMessage-messageRoot')
    expect(root.classes()).toContain('mantine-WhatsAppMessageBubble-bubbleRoot')
    expect(root.attributes('data-variant')).toBe('bubble')
  })

  it('marks each direction so alignment can differ', () => {
    const wrapper = mountWithProvider(WhatsAppMessageList, {
      messages: [
        createTextMessage({ id: 'in', direction: 'inbound' }),
        createTextMessage({ id: 'out', direction: 'outbound', status: 'sent' }),
      ],
    })

    expect(wrapper.findAll('[data-direction="inbound"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-direction="outbound"]')).toHaveLength(1)
  })

  it('renders a system message as a full-width, centred row', () => {
    const wrapper = mountWithProvider(WhatsAppMessage, {
      message: {
        id: 'system',
        type: 'system',
        direction: 'inbound',
        timestamp: TEST_NOW.toISOString(),
        text: 'Conversation assigned to Sara',
      } satisfies WhatsAppMessageData,
    })

    const root = wrapper.get('[data-variant="system"]')

    expect(root.classes()).toContain('mantine-WhatsAppMessageBubble-bubbleRoot')
    expect(wrapper.find('.mantine-WhatsAppMessageBubble-systemMessage').exists()).toBe(true)
  })

  it('scopes each day divider to its own group so stickies cannot overlap', () => {
    const wrapper = mountWithProvider(WhatsAppMessageList, {
      messages: [
        createTextMessage({ id: 'a', timestamp: '2026-03-16T10:00:00.000Z' }),
        createTextMessage({ id: 'b', timestamp: '2026-03-17T10:00:00.000Z' }),
        createTextMessage({ id: 'c', timestamp: '2026-03-18T10:00:00.000Z' }),
      ],
    })

    const groups = wrapper.findAll('.mantine-WhatsAppMessageList-messageListGroup')
    expect(groups).toHaveLength(3)

    for (const group of groups) {
      expect(group.findAll('.mantine-WhatsAppMessageList-messageListDayDivider')).toHaveLength(1)
      expect(group.findAll('.mantine-WhatsAppMessageList-messageListGroupItems')).toHaveLength(1)
    }
  })
})

describe('emoji control', () => {
  const capabilities = {
    canSendFreeForm: true,
    canUseEmoji: true,
    messagingWindow: { state: 'open' },
  } as const

  it('shows with nothing but the capability, because a picker ships with the package', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities,
    })

    expect(wrapper.find('button[aria-label="Insert emoji"]').exists()).toBe(true)
  })

  it('stays hidden when there is nothing to put in the popover', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities,
      withEmojiPicker: false,
    })

    expect(wrapper.find('button[aria-label="Insert emoji"]').exists()).toBe(false)
  })
})

describe('starting a new conversation', () => {
  it('renders the control only when asked for', () => {
    const without = mountWithProvider(WhatsAppConversationList, { conversations: [] })
    expect(without.find('button[aria-label="New conversation"]').exists()).toBe(false)

    const withControl = mountWithProvider(WhatsAppConversationList, {
      conversations: [],
      withNewConversation: true,
    })
    expect(withControl.find('button[aria-label="New conversation"]').exists()).toBe(true)
  })

  it('is forwarded by WhatsAppInbox', async () => {
    const onNewConversation = vi.fn()
    const wrapper = mountWithProvider(WhatsAppInbox, {
      conversations: [createConversation()],
      withNewConversation: true,
      onNewConversation,
    })

    const control = wrapper.find('button[aria-label="New conversation"]')

    expect(control.exists()).toBe(true)

    await control.trigger('click')

    expect(
      wrapper.findComponent(WhatsAppInbox).emitted('update:newConversationOpened')?.[0],
    ).toEqual([true])
  })

  it('opens the form and reports the opened state', async () => {
    const wrapper = mountWithProvider(WhatsAppConversationList, {
      conversations: [],
      withNewConversation: true,
    })

    await wrapper.get('button[aria-label="New conversation"]').trigger('click')

    expect(
      wrapper.findComponent(WhatsAppConversationList).emitted('update:newConversationOpened')?.[0],
    ).toEqual([true])
  })

  it('refuses an implausible number and emits a normalized one', async () => {
    const onNewConversation = vi.fn()
    const wrapper = mountWithProvider(
      WhatsAppConversationList,
      {
        conversations: [],
        withNewConversation: true,
        newConversationOpened: true,
        onNewConversation,
      },
      { attachTo: true },
    )

    const form = document.body.querySelector('form')!
    const phone = form.querySelector<HTMLInputElement>('input[type="tel"]')!

    const setValue = (input: HTMLInputElement, value: string) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
      setter.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }

    setValue(phone, '123')
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(onNewConversation).not.toHaveBeenCalled()
    expect(form.textContent).toContain('Enter a valid phone number')

    setValue(phone, '+973 3300 7788')
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(onNewConversation).toHaveBeenCalledTimes(1)
    expect(onNewConversation.mock.calls[0][0]).toEqual({
      phoneNumber: '+973 3300 7788',
      normalizedPhoneNumber: '+97333007788',
      name: undefined,
    })

    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('uses a consumer-supplied validator when one is given', async () => {
    const onNewConversation = vi.fn()
    const wrapper = mountWithProvider(
      WhatsAppConversationList,
      {
        conversations: [],
        withNewConversation: true,
        newConversationOpened: true,
        validatePhoneNumber: () => 'Only Bahraini numbers are supported',
        onNewConversation,
      },
      { attachTo: true },
    )

    const form = document.body.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(onNewConversation).not.toHaveBeenCalled()
    expect(form.textContent).toContain('Only Bahraini numbers are supported')

    wrapper.unmount()
    document.body.innerHTML = ''
  })
})

describe('phone number helpers', () => {
  it('normalizes to digits with a leading plus', () => {
    expect(normalizePhoneNumber('+973 3300 1122')).toBe('+97333001122')
    expect(normalizePhoneNumber('(973) 3300-1122')).toBe('97333001122')
    expect(normalizePhoneNumber('   ')).toBe('')
  })

  it('accepts plausible numbers and rejects the rest', () => {
    expect(isValidPhoneNumber('+973 3300 1122')).toBe(true)
    expect(isValidPhoneNumber('123')).toBe(false)
    expect(isValidPhoneNumber('+1234567890123456789')).toBe(false)
    expect(isValidPhoneNumber('not a number')).toBe(false)
  })
})

describe('unsent drafts', () => {
  const messages = [createTextMessage()]

  it('keeps one draft per conversation and restores it on return', async () => {
    const { wrapper, setProps } = mountReactive(WhatsAppConversation, {
      conversation,
      conversationId: 'amina' as string,
      messages,
      capabilities: conversation.capabilities,
    })

    await wrapper.get('textarea').setValue('half written')
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('half written')

    await setProps({ conversationId: 'yusuf' })
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('')

    await setProps({ conversationId: 'amina' })
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('half written')
  })

  it('drops the draft of the conversation being left when behavior is reset', async () => {
    const { wrapper, setProps } = mountReactive(WhatsAppConversation, {
      conversation,
      conversationId: 'amina' as string,
      messages,
      capabilities: conversation.capabilities,
      draftBehavior: 'reset' as const,
    })

    await wrapper.get('textarea').setValue('half written')
    await setProps({ conversationId: 'yusuf' })
    await setProps({ conversationId: 'amina' })

    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('')
  })

  it('reports the whole map so the consumer can persist it', async () => {
    const onUpdateDrafts = vi.fn()
    const wrapper = mountWithProvider(WhatsAppConversation, {
      conversation,
      conversationId: 'amina',
      messages,
      capabilities: conversation.capabilities,
      'onUpdate:drafts': onUpdateDrafts,
    })

    await wrapper.get('textarea').setValue('hello')

    expect(onUpdateDrafts).toHaveBeenLastCalledWith({ amina: 'hello' })
  })

  it('accepts a controlled draft map', async () => {
    const { wrapper, setProps } = mountReactive(WhatsAppConversation, {
      conversation,
      conversationId: 'amina' as string,
      messages,
      capabilities: conversation.capabilities,
      drafts: { amina: 'from storage' } as Record<string, string>,
    })

    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('from storage')

    await setProps({ drafts: { amina: 'changed outside' } })
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('changed outside')
  })

  it('leaves a controlled single draft alone', async () => {
    const onUpdateDraft = vi.fn()
    const { wrapper } = mountReactive(WhatsAppConversation, {
      conversation,
      conversationId: 'amina' as string,
      messages,
      capabilities: conversation.capabilities,
      draft: 'owned by the consumer',
      'onUpdate:draft': onUpdateDraft,
    })

    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe(
      'owned by the consumer',
    )

    await wrapper.get('textarea').setValue('typed')
    expect(onUpdateDraft).toHaveBeenCalledWith('typed')
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe(
      'owned by the consumer',
    )
  })

  it('clears the draft of the conversation it was sent from', async () => {
    const onUpdateDrafts = vi.fn()
    const wrapper = mountWithProvider(WhatsAppConversation, {
      conversation,
      conversationId: 'amina',
      messages,
      capabilities: conversation.capabilities,
      'onUpdate:drafts': onUpdateDrafts,
    })

    await wrapper.get('textarea').setValue('going out')
    await wrapper.get('button[aria-label="Send"]').trigger('click')

    expect(onUpdateDrafts).toHaveBeenLastCalledWith({})
  })
})
