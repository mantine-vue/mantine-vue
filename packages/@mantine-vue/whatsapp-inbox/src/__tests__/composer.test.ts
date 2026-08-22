import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { WhatsAppComposer } from '../components/WhatsAppComposer'
import type { WhatsAppConversationCapabilities, WhatsAppOutgoingMessage } from '../types'
import { createUpload, mountReactive, mountWithProvider } from './test-utils'

const OPEN_WINDOW: WhatsAppConversationCapabilities = {
  canSendFreeForm: true,
  messagingWindow: { state: 'open' },
}

function actionLabels(wrapper: ReturnType<typeof mountWithProvider>) {
  return wrapper.findAll('button').map((node) => node.attributes('aria-label'))
}

describe('WhatsAppComposer capabilities', () => {
  it('renders only the actions the capabilities allow', () => {
    const minimal = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: OPEN_WINDOW,
    })

    const minimalLabels = actionLabels(minimal)
    expect(minimalLabels).toContain('Send')
    expect(minimalLabels).not.toContain('Attach file')
    expect(minimalLabels).not.toContain('Send template')
    expect(minimalLabels).not.toContain('Interactive message')
    expect(minimalLabels).not.toContain('Insert emoji')

    const full = mountWithProvider(
      WhatsAppComposer,
      {
        conversationId: 'conversation-1',
        capabilities: {
          ...OPEN_WINDOW,
          canSendMedia: true,
          canSendTemplates: true,
          canUseEmoji: true,
          canSendInteractive: true,
          interactiveTypes: ['button'],
        },
      },
      { slots: { emojiPicker: () => 'picker' } },
    )

    const fullLabels = actionLabels(full)
    expect(fullLabels).toContain('Attach file')
    expect(fullLabels).toContain('Send template')
    expect(fullLabels).toContain('Interactive message')
    expect(fullLabels).toContain('Insert emoji')
  })

  it('hides the interactive action when the provider supports no interactive type', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: { ...OPEN_WINDOW, canSendInteractive: true, interactiveTypes: [] },
    })

    expect(actionLabels(wrapper)).not.toContain('Interactive message')
  })

  it('lets an explicit with* prop override the capabilities', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: { ...OPEN_WINDOW, canSendMedia: true },
      withAttachments: false,
    })

    expect(actionLabels(wrapper)).not.toContain('Attach file')
  })
})

describe('WhatsAppComposer messaging window', () => {
  it('disables free-form messaging and explains why when the window is closed', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: {
        canSendFreeForm: true,
        canSendTemplates: true,
        messagingWindow: {
          state: 'closed',
          reasonCode: 'window_expired',
          reason: 'The 24 hour window closed at 09:00.',
        },
      },
    })

    expect(wrapper.get('textarea').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[role="status"]').text()).toContain('The 24 hour window closed at 09:00.')
    expect(wrapper.get('[role="status"]').attributes('data-reason-code')).toBe('window_expired')
  })

  it('keeps templates reachable from the closed-window notice', async () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: {
        canSendTemplates: true,
        messagingWindow: { state: 'closed' },
      },
    })

    const action = wrapper.findAll('button').find((node) => node.text() === 'Send a template')
    expect(action).toBeDefined()

    await action!.trigger('click')

    expect(wrapper.findComponent(WhatsAppComposer).emitted('update:templatesOpened')?.[0]).toEqual([
      true,
    ])
  })

  it('does not offer templates it is not allowed to send', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: { canSendTemplates: false, messagingWindow: { state: 'closed' } },
    })

    expect(wrapper.findAll('button').map((node) => node.text())).not.toContain('Send a template')
  })

  it('leaves the composer usable when the window state is unknown', () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: { messagingWindow: { state: 'unknown' } },
    })

    expect(wrapper.get('textarea').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('reacts when the backend reports the window closing', async () => {
    const { wrapper, setProps } = mountReactive(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: OPEN_WINDOW as WhatsAppConversationCapabilities,
    })

    expect(wrapper.get('textarea').attributes('disabled')).toBeUndefined()

    await setProps({
      capabilities: { canSendFreeForm: true, messagingWindow: { state: 'closed' } },
    })

    expect(wrapper.get('textarea').attributes('disabled')).toBeDefined()
  })
})

describe('WhatsAppComposer sending', () => {
  it('emits a typed text payload and clears the draft', async () => {
    const onSend = vi.fn()
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: OPEN_WINDOW,
      onSend,
    })

    await wrapper.get('textarea').setValue('Good morning')
    await wrapper.get('button[aria-label="Send"]').trigger('click')

    expect(onSend).toHaveBeenCalledTimes(1)

    const payload = onSend.mock.calls[0][0] as WhatsAppOutgoingMessage

    expect(payload.kind).toBe('text')
    expect(payload).toMatchObject({ conversationId: 'conversation-1', text: 'Good morning' })
    expect(typeof payload.clientId).toBe('string')
    expect(payload.clientId.length).toBeGreaterThan(0)
  })

  it('sends on Enter and inserts a newline on Shift+Enter', async () => {
    const onSend = vi.fn()
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: OPEN_WINDOW,
      onSend,
    })

    const textarea = wrapper.get('textarea')
    await textarea.setValue('Line one')

    await textarea.trigger('keydown', { key: 'Enter', shiftKey: true })
    expect(onSend).not.toHaveBeenCalled()

    await textarea.trigger('keydown', { key: 'Enter' })
    expect(onSend).toHaveBeenCalledTimes(1)
  })

  it('never sends mid-composition, so IME input is not cut off', async () => {
    const onSend = vi.fn()
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: OPEN_WINDOW,
      onSend,
    })

    await wrapper.get('textarea').setValue('こんに')
    await wrapper.get('textarea').trigger('keydown', { key: 'Enter', isComposing: true })

    expect(onSend).not.toHaveBeenCalled()
  })

  it('refuses an empty draft and reports the reason', async () => {
    const onSend = vi.fn()
    const onValidationError = vi.fn()
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: OPEN_WINDOW,
      onSend,
      onValidationError,
    })

    await wrapper.get('textarea').trigger('keydown', { key: 'Enter' })

    expect(onSend).not.toHaveBeenCalled()
    expect(onValidationError).toHaveBeenCalledWith('Enter a message before sending')
    expect(wrapper.get('[role="alert"]').text()).toContain('Enter a message before sending')
  })

  it('enforces the maximum length from the capabilities', async () => {
    const onSend = vi.fn()
    const onValidationError = vi.fn()
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: { ...OPEN_WINDOW, maxTextLength: 5 },
      onSend,
      onValidationError,
    })

    await wrapper.get('textarea').setValue('far too long')
    await wrapper.get('textarea').trigger('keydown', { key: 'Enter' })

    expect(onSend).not.toHaveBeenCalled()
    expect(onValidationError).toHaveBeenCalledWith('Message must be 5 characters or fewer')
    expect(wrapper.text()).toContain('12 / 5')
  })

  it('sends uploaded attachments as a media payload with the draft as caption', async () => {
    const onSend = vi.fn()
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: { ...OPEN_WINDOW, canSendMedia: true },
      uploads: [createUpload()],
      onSend,
    })

    await wrapper.get('textarea').setValue('Here it is')
    await wrapper.get('button[aria-label="Send"]').trigger('click')

    const payload = onSend.mock.calls[0][0] as WhatsAppOutgoingMessage

    expect(payload.kind).toBe('media')
    expect(payload).toMatchObject({
      caption: 'Here it is',
      attachments: [{ mediaType: 'document', fileName: 'invoice.pdf' }],
    })
  })

  it('blocks sending while an upload is still running', async () => {
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: { ...OPEN_WINDOW, canSendMedia: true },
      uploads: [createUpload({ status: 'uploading', progress: 42 })],
    })

    await wrapper.get('textarea').setValue('Wait for it')

    expect(wrapper.get('button[aria-label="Send"]').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Uploading 42%')
  })

  it('renders a failed upload with retry and remove actions', async () => {
    const onAttachmentRetry = vi.fn()
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: { ...OPEN_WINDOW, canSendMedia: true },
      uploads: [createUpload({ status: 'failed', error: 'Storage unavailable' })],
      onAttachmentRetry,
    })

    expect(wrapper.get('[data-status="failed"]').text()).toContain('Storage unavailable')

    await wrapper.get('button[aria-label="Retry upload: invoice.pdf"]').trigger('click')

    expect(onAttachmentRetry).toHaveBeenCalledTimes(1)
  })

  it('shows a send error with a retry action', async () => {
    const onRetrySend = vi.fn()
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: OPEN_WINDOW,
      error: 'Provider rejected the message',
      onRetrySend,
    })

    expect(wrapper.get('[role="alert"]').text()).toContain('Provider rejected the message')

    await wrapper.get('[role="alert"] button').trigger('click')

    expect(onRetrySend).toHaveBeenCalledTimes(1)
  })

  it('supports v-model on the draft', async () => {
    const onUpdate = vi.fn()
    const { wrapper, setProps } = mountReactive(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: OPEN_WINDOW as WhatsAppConversationCapabilities,
      modelValue: 'from the consumer',
      'onUpdate:modelValue': onUpdate,
    })

    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('from the consumer')

    await wrapper.get('textarea').setValue('typed by the user')
    expect(onUpdate).toHaveBeenCalledWith('typed by the user')

    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('from the consumer')

    await setProps({ modelValue: 'typed by the user' })
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('typed by the user')
  })

  it('renders the reply quote and clears it on demand', async () => {
    const onUpdateReplyTo = vi.fn()
    const wrapper = mountWithProvider(WhatsAppComposer, {
      conversationId: 'conversation-1',
      capabilities: OPEN_WINDOW,
      replyTo: { id: 'message-1', text: 'Original message', author: 'Amina' },
      'onUpdate:replyTo': onUpdateReplyTo,
    })

    expect(wrapper.text()).toContain('Original message')

    await wrapper.get('button[aria-label="Cancel reply"]').trigger('click')

    expect(onUpdateReplyTo).toHaveBeenCalledWith(null)
  })
})

describe('WhatsAppComposer emoji integration', () => {
  it('renders the consumer picker in the popover and inserts what it returns', async () => {
    const onUpdate = vi.fn()

    const wrapper = mountWithProvider(
      WhatsAppComposer,
      {
        conversationId: 'conversation-1',
        capabilities: { ...OPEN_WINDOW, canUseEmoji: true },
        'onUpdate:modelValue': onUpdate,
      },
      {
        slots: {
          emojiPicker: ({ insert }: any) =>
            h('button', { type: 'button', onClick: () => insert('🎉') }, 'pick'),
        },
        attachTo: true,
      },
    )

    await wrapper.get('button[aria-label="Insert emoji"]').trigger('click')

    const picker = [...document.body.querySelectorAll('button')].find(
      (node) => node.textContent === 'pick',
    )

    expect(picker).toBeDefined()

    picker!.click()
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith('🎉')

    wrapper.unmount()
    document.body.innerHTML = ''
  })
})
