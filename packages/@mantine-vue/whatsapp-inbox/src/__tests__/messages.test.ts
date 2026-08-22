import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { WhatsAppMessage } from '../components/WhatsAppMessage'
import { WhatsAppMessageList } from '../components/WhatsAppMessageList'
import { WhatsAppMessageStatus } from '../components/WhatsAppMessageStatus'
import type { WhatsAppMessageData } from '../types'
import { createTextMessage, mountReactive, mountWithProvider, TEST_NOW } from './test-utils'

describe('WhatsAppMessage', () => {
  it('distinguishes inbound from outbound', () => {
    const inbound = mountWithProvider(WhatsAppMessage, { message: createTextMessage() })
    const outbound = mountWithProvider(WhatsAppMessage, {
      message: createTextMessage({ id: 'm2', direction: 'outbound', text: 'Sure' }),
    })

    expect(inbound.find('[data-direction="inbound"]').exists()).toBe(true)
    expect(inbound.text()).toContain('Received message')

    expect(outbound.find('[data-direction="outbound"]').exists()).toBe(true)
    expect(outbound.text()).toContain('Sent message')
  })

  it('renders every delivery state with its own glyph and a screen-reader label', () => {
    const states = ['pending', 'sent', 'delivered', 'read', 'failed'] as const
    const expected = ['Sending', 'Sent', 'Delivered', 'Read', 'Failed']

    states.forEach((status, index) => {
      const wrapper = mountWithProvider(WhatsAppMessageStatus, { status })

      expect(wrapper.find(`[data-status="${status}"]`).exists()).toBe(true)
      expect(wrapper.text()).toContain(expected[index].toLowerCase())
      expect(wrapper.find('svg path').exists()).toBe(true)
    })
  })

  it('renders a failed message with its reason and a retry action', async () => {
    const message = createTextMessage({
      id: 'failed-1',
      direction: 'outbound',
      status: 'failed',
      error: { code: '131047', message: 'Re-engagement message' },
    })

    const wrapper = mountWithProvider(WhatsAppMessage, { message })

    expect(wrapper.get('[role="alert"]').text()).toContain('Re-engagement message')
    expect(wrapper.get('[role="alert"]').text()).toContain('131047')

    await wrapper.get('[role="alert"] button').trigger('click')

    expect(wrapper.findComponent(WhatsAppMessage).emitted('retry')?.[0]).toEqual([message])
  })

  it('hides the retry action when the error is not retryable', () => {
    const wrapper = mountWithProvider(WhatsAppMessage, {
      message: createTextMessage({
        direction: 'outbound',
        status: 'failed',
        error: { message: 'Number is not on WhatsApp', retryable: false },
      }),
    })

    expect(wrapper.find('[role="alert"] button').exists()).toBe(false)
  })

  it('hides the retry action when the capabilities forbid it', () => {
    const wrapper = mountWithProvider(WhatsAppMessage, {
      message: createTextMessage({ direction: 'outbound', status: 'failed' }),
      withRetry: false,
    })

    expect(wrapper.find('[role="alert"] button').exists()).toBe(false)
  })

  it('renders media messages through the attachment renderer', () => {
    const message: WhatsAppMessageData = {
      id: 'media-1',
      type: 'image',
      direction: 'inbound',
      timestamp: TEST_NOW.toISOString(),
      caption: 'The receipt',
      attachment: {
        mediaType: 'image',
        url: 'https://cdn.test/receipt.png',
        fileName: 'receipt.png',
      },
    }

    const wrapper = mountWithProvider(WhatsAppMessage, { message })

    expect(wrapper.get('img').attributes('src')).toBe('https://cdn.test/receipt.png')
    expect(wrapper.text()).toContain('The receipt')
  })

  it('renders a document attachment with a download link', () => {
    const message: WhatsAppMessageData = {
      id: 'media-2',
      type: 'document',
      direction: 'inbound',
      timestamp: TEST_NOW.toISOString(),
      attachment: {
        mediaType: 'document',
        url: 'https://cdn.test/quote.pdf',
        fileName: 'quote.pdf',
        size: 51_200,
      },
    }

    const wrapper = mountWithProvider(WhatsAppMessage, { message })

    expect(wrapper.text()).toContain('quote.pdf')
    expect(wrapper.text()).toContain('50 KB')
    expect(wrapper.get('a').attributes('href')).toBe('https://cdn.test/quote.pdf')
    expect(wrapper.get('a').attributes('aria-label')).toContain('quote.pdf')
  })

  it('renders a template message from its resolved values', () => {
    const message: WhatsAppMessageData = {
      id: 'template-message',
      type: 'template',
      direction: 'outbound',
      status: 'delivered',
      timestamp: TEST_NOW.toISOString(),
      template: {
        name: 'appointment_reminder',
        language: 'en_US',
        values: { body: { '1': 'Amina', '2': 'Friday' } },
        template: {
          id: 'template-1',
          name: 'appointment_reminder',
          language: 'en_US',
          components: [{ type: 'body', text: 'Hi {{1}}, your appointment is on {{2}}.' }],
        },
      },
    }

    const wrapper = mountWithProvider(WhatsAppMessage, { message })

    expect(wrapper.text()).toContain('Hi Amina, your appointment is on Friday.')
  })

  it('renders an interactive message with its buttons', () => {
    const message: WhatsAppMessageData = {
      id: 'interactive-1',
      type: 'interactive',
      direction: 'outbound',
      timestamp: TEST_NOW.toISOString(),
      interactive: {
        type: 'button',
        body: 'Did we solve your issue?',
        buttons: [
          { id: 'yes', title: 'Yes' },
          { id: 'no', title: 'No' },
        ],
      },
    }

    const wrapper = mountWithProvider(WhatsAppMessage, { message })

    expect(wrapper.text()).toContain('Did we solve your issue?')
    expect(wrapper.text()).toContain('Yes')
    expect(wrapper.text()).toContain('No')
  })

  it('renders a system message without a bubble', () => {
    const wrapper = mountWithProvider(WhatsAppMessage, {
      message: {
        id: 'system-1',
        type: 'system',
        direction: 'inbound',
        timestamp: TEST_NOW.toISOString(),
        text: 'Conversation assigned to Sara',
      } satisfies WhatsAppMessageData,
    })

    expect(wrapper.find('[data-variant="system"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Conversation assigned to Sara')
  })

  it('keeps unsupported messages visible', () => {
    const wrapper = mountWithProvider(WhatsAppMessage, {
      message: {
        id: 'unknown-1',
        type: 'unsupported',
        direction: 'inbound',
        timestamp: TEST_NOW.toISOString(),
      } satisfies WhatsAppMessageData,
    })

    expect(wrapper.text()).toContain('Unsupported message')
  })

  it('falls back to the built-in renderer when renderMessage returns undefined', () => {
    const renderMessage = vi.fn((message: WhatsAppMessageData) =>
      message.type === 'system' ? h('div', 'custom system') : undefined,
    )

    const custom = mountWithProvider(WhatsAppMessage, {
      message: {
        id: 'system-2',
        type: 'system',
        direction: 'inbound',
        timestamp: TEST_NOW.toISOString(),
        text: 'ignored',
      } satisfies WhatsAppMessageData,
      renderMessage,
    })
    expect(custom.text()).toContain('custom system')

    const standard = mountWithProvider(WhatsAppMessage, {
      message: createTextMessage({ text: 'Standard bubble' }),
      renderMessage,
    })
    expect(standard.text()).toContain('Standard bubble')
  })
})

describe('WhatsAppMessageList', () => {
  it('groups messages under day dividers', () => {
    const wrapper = mountWithProvider(WhatsAppMessageList, {
      messages: [
        createTextMessage({ id: 'a', timestamp: '2026-03-16T10:00:00.000Z', text: 'Monday' }),
        createTextMessage({ id: 'b', timestamp: '2026-03-16T11:00:00.000Z', text: 'Also Monday' }),
        createTextMessage({ id: 'c', timestamp: '2026-03-17T10:00:00.000Z', text: 'Tuesday' }),
      ],
    })

    expect(wrapper.findAll('ol > li')).toHaveLength(5)
    expect(wrapper.get('[role="log"]').attributes('aria-label')).toBe('Message history')
  })

  it('renders the empty, loading and error states of the history', async () => {
    const empty = mountWithProvider(WhatsAppMessageList, { messages: [] })
    expect(empty.text()).toContain('No messages yet')

    const loading = mountWithProvider(WhatsAppMessageList, { messages: [], loading: true })
    expect(loading.text()).toContain('Loading messages')

    const failed = mountWithProvider(WhatsAppMessageList, { messages: [], error: 'Timed out' })
    expect(failed.text()).toContain('Timed out')

    await failed.get('button').trigger('click')
    expect(failed.findComponent(WhatsAppMessageList).emitted('retryLoad')).toHaveLength(1)
  })

  it('offers a load-older control that emits the current cursor', async () => {
    const wrapper = mountWithProvider(WhatsAppMessageList, {
      messages: [createTextMessage()],
      pagination: { hasMore: true, cursor: 'before-message-1' },
    })

    const button = wrapper.findAll('button').find((node) => node.text() === 'Load older messages')
    await button!.trigger('click')

    expect(wrapper.findComponent(WhatsAppMessageList).emitted('loadOlder')?.[0]).toEqual([
      { cursor: 'before-message-1' },
    ])
  })

  it('reacts to messages pushed in from outside, as a realtime feed would', async () => {
    const { wrapper, setProps } = mountReactive(WhatsAppMessageList, {
      messages: [createTextMessage({ id: 'a', text: 'First' })],
    })

    expect(wrapper.text()).toContain('First')

    await setProps({
      messages: [
        createTextMessage({ id: 'a', text: 'First' }),
        createTextMessage({ id: 'b', text: 'Second', direction: 'outbound', status: 'sent' }),
      ],
    })

    expect(wrapper.text()).toContain('Second')
    expect(wrapper.find('[data-status="sent"]').exists()).toBe(true)

    await setProps({
      messages: [
        createTextMessage({ id: 'a', text: 'First' }),
        createTextMessage({ id: 'b', text: 'Second', direction: 'outbound', status: 'read' }),
      ],
    })

    expect(wrapper.find('[data-status="read"]').exists()).toBe(true)
    expect(wrapper.find('[data-status="sent"]').exists()).toBe(false)
  })

  it('lets a slot replace individual messages', () => {
    const wrapper = mountWithProvider(
      WhatsAppMessageList,
      { messages: [createTextMessage({ text: 'Original' })] },
      { slots: { message: ({ message }: any) => `slot:${message.id}` } },
    )

    expect(wrapper.text()).toContain('slot:message-1')
    expect(wrapper.text()).not.toContain('Original')
  })
})
