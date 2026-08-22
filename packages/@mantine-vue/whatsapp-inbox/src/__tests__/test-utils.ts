import { defineComponent, h, nextTick, reactive, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import type {
  WhatsAppConversationSummary,
  WhatsAppMessageData,
  WhatsAppTemplate,
  WhatsAppUpload,
} from '../types'

/** Fixed instant every fixture is anchored to, so timestamp assertions stay stable. */
export const TEST_NOW = new Date('2026-03-18T12:00:00.000Z')

export function createContact(overrides: Partial<WhatsAppConversationSummary['contact']> = {}) {
  return {
    id: 'contact-1',
    name: 'Amina Haddad',
    phoneNumber: '+973 3300 1122',
    ...overrides,
  }
}

export function createConversation(
  overrides: Partial<WhatsAppConversationSummary> = {},
): WhatsAppConversationSummary {
  return {
    id: 'conversation-1',
    contact: createContact(),
    unreadCount: 0,
    updatedAt: TEST_NOW.toISOString(),
    lastMessage: {
      id: 'message-1',
      type: 'text',
      direction: 'inbound',
      text: 'Hello there',
      timestamp: TEST_NOW.toISOString(),
    },
    ...overrides,
  }
}

export function createTextMessage(
  overrides: Partial<Extract<WhatsAppMessageData, { type: 'text' }>> = {},
): WhatsAppMessageData {
  return {
    id: 'message-1',
    type: 'text',
    direction: 'inbound',
    text: 'Hello there',
    timestamp: TEST_NOW.toISOString(),
    ...overrides,
  }
}

export function createUpload(overrides: Partial<WhatsAppUpload> = {}): WhatsAppUpload {
  return {
    id: 'upload-1',
    fileName: 'invoice.pdf',
    mediaType: 'document',
    status: 'uploaded',
    size: 2048,
    attachment: {
      mediaType: 'document',
      url: 'https://cdn.test/invoice.pdf',
      fileName: 'invoice.pdf',
    },
    ...overrides,
  }
}

export function createTemplate(overrides: Partial<WhatsAppTemplate> = {}): WhatsAppTemplate {
  return {
    id: 'template-1',
    name: 'appointment_reminder',
    language: 'en_US',
    category: 'utility',
    status: 'approved',
    components: [
      { type: 'body', text: 'Hi {{1}}, your appointment is on {{2}}.' },
      { type: 'footer', text: 'Reply STOP to opt out' },
    ],
    ...overrides,
  }
}

export function mountWithProvider(
  component: Component,
  props: Record<string, unknown> = {},
  options: { attachTo?: boolean; slots?: Record<string, any> } = {},
) {
  return mount(
    defineComponent({
      setup: () => () =>
        h(MantineProvider, { env: 'test' }, () => h(component, props, options.slots)),
    }),
    options.attachTo ? { attachTo: document.body } : {},
  )
}

/**
 * Mounts a component whose props can be changed afterwards.
 *
 * `setProps` only works on the root wrapper, and every Mantine component has to sit inside a
 * provider, so the props live in a `reactive` object the test mutates directly. This is how the
 * real-time cases are exercised: the consumer pushes new data in, and the component has to react.
 */
export function mountReactive<Props extends Record<string, any>>(
  component: Component,
  initialProps: Props,
  options: { attachTo?: boolean; slots?: Record<string, any> } = {},
) {
  const props = reactive({ ...initialProps }) as Props

  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h(MantineProvider, { env: 'test' }, () => h(component, props, options.slots)),
    }),
    options.attachTo ? { attachTo: document.body } : {},
  )

  return {
    wrapper,
    props,
    async setProps(patch: Partial<Props>) {
      Object.assign(props, patch)
      await nextTick()
      await nextTick()
    },
  }
}
