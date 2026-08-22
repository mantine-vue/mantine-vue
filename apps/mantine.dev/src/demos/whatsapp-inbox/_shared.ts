import { computed, h, onScopeDispose, ref } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import {
  createClientId,
  getMediaTypeFromMime,
  type WhatsAppAttachmentsAddPayload,
  type WhatsAppConversationSummary,
  type WhatsAppInboxFilters,
  type WhatsAppMessageData,
  type WhatsAppNewConversationPayload,
  type WhatsAppOutgoingMessage,
  type WhatsAppUpload,
} from '@mantine-vue/whatsapp-inbox'
import { demoConversations, demoMessages } from './_data'

/** Delivery states are advanced on a timer so the demos show the full pending → read sequence. */
const SENT_DELAY = 700
const DELIVERED_DELAY = 1500
const READ_DELAY = 2600
const UPLOAD_TICK = 250

export interface UseInboxDemoStateOptions {
  conversationId?: string | null

  conversations?: WhatsAppConversationSummary[]

  markReadOnSelect?: boolean
}

export function useInboxDemoState(options: UseInboxDemoStateOptions = {}) {
  const conversations = ref<WhatsAppConversationSummary[]>(
    (options.conversations ?? demoConversations).map((conversation) => ({ ...conversation })),
  )
  const threads = ref<Record<string, WhatsAppMessageData[]>>(
    Object.fromEntries(Object.entries(demoMessages).map(([id, messages]) => [id, [...messages]])),
  )
  const selectedConversationId = ref<string | null>(options.conversationId ?? null)
  const filters = ref<WhatsAppInboxFilters>({})
  const drafts = ref<Record<string, string>>({})
  const draft = ref('')
  const uploads = ref<WhatsAppUpload[]>([])
  const sending = ref(false)
  const lastEvent = ref<string>('')

  const timers = new Set<ReturnType<typeof setTimeout>>()

  function later(callback: () => void, delay: number) {
    const timer = setTimeout(() => {
      timers.delete(timer)
      callback()
    }, delay)

    timers.add(timer)
  }

  onScopeDispose(() => {
    timers.forEach(clearTimeout)
    timers.clear()
  })

  const messages = computed(() =>
    selectedConversationId.value ? (threads.value[selectedConversationId.value] ?? []) : [],
  )

  /**
   * The list never filters the array it is handed – it reports the change and renders whatever
   * comes back. A real integration would refetch here; the demo filters the fixture in memory.
   */
  const visibleConversations = computed(() => {
    const { query, unreadOnly, status, assigneeId } = filters.value
    const needle = query?.trim().toLowerCase()

    return conversations.value.filter((conversation) => {
      if (needle) {
        const haystack = [
          conversation.contact.name ?? '',
          conversation.contact.phoneNumber ?? '',
          conversation.lastMessage?.text ?? '',
        ]
          .join(' ')
          .toLowerCase()

        if (!haystack.includes(needle)) {
          return false
        }
      }

      if (unreadOnly && !conversation.unreadCount) {
        return false
      }

      if (status && conversation.status !== status) {
        return false
      }

      if (assigneeId === null && conversation.assignee) {
        return false
      }

      if (assigneeId && conversation.assignee?.id !== assigneeId) {
        return false
      }

      return true
    })
  })

  function patchMessage(conversationId: string, id: string, changes: Partial<WhatsAppMessageData>) {
    threads.value = {
      ...threads.value,
      [conversationId]: (threads.value[conversationId] ?? []).map((message) =>
        message.id === id ? ({ ...message, ...changes } as WhatsAppMessageData) : message,
      ),
    }
  }

  function appendMessage(conversationId: string, message: WhatsAppMessageData) {
    threads.value = {
      ...threads.value,
      [conversationId]: [...(threads.value[conversationId] ?? []), message],
    }
  }

  function advanceDelivery(conversationId: string, id: string) {
    later(() => patchMessage(conversationId, id, { status: 'sent' }), SENT_DELAY)
    later(() => patchMessage(conversationId, id, { status: 'delivered' }), DELIVERED_DELAY)
    later(() => patchMessage(conversationId, id, { status: 'read' }), READ_DELAY)
  }

  function toOptimisticMessage(payload: WhatsAppOutgoingMessage): WhatsAppMessageData {
    const base = {
      id: payload.clientId,
      direction: 'outbound',
      status: 'pending',
      timestamp: new Date().toISOString(),
    } as const

    if (payload.kind === 'text') {
      return { ...base, type: 'text', text: payload.text }
    }

    if (payload.kind === 'media') {
      const attachment = payload.attachments[0]

      return {
        ...base,
        type: attachment.mediaType === 'sticker' ? 'image' : attachment.mediaType,
        attachment,
        caption: payload.caption,
      } as WhatsAppMessageData
    }

    if (payload.kind === 'template') {
      return {
        ...base,
        type: 'template',
        template: {
          name: payload.name,
          language: payload.language,
          values: payload.values,
          template: payload.template,
        },
      }
    }

    return { ...base, type: 'interactive', interactive: payload.interactive }
  }

  function handleSend(payload: WhatsAppOutgoingMessage) {
    const conversationId = payload.conversationId || selectedConversationId.value

    if (!conversationId) {
      return
    }

    lastEvent.value = `send · ${payload.kind}`
    sending.value = true
    appendMessage(conversationId, toOptimisticMessage(payload))
    uploads.value = []
    draft.value = ''

    later(() => {
      sending.value = false
      advanceDelivery(conversationId, payload.clientId)
    }, 200)
  }

  function handleRetryMessage(message: WhatsAppMessageData) {
    const conversationId = selectedConversationId.value

    if (!conversationId) {
      return
    }

    lastEvent.value = `retryMessage · ${message.id}`
    patchMessage(conversationId, message.id, { status: 'pending', error: undefined })
    later(() => advanceDelivery(conversationId, message.id), 300)
  }

  function patchUpload(id: string, changes: Partial<WhatsAppUpload>) {
    uploads.value = uploads.value.map((upload) =>
      upload.id === id ? { ...upload, ...changes } : upload,
    )
  }

  function simulateUpload(upload: WhatsAppUpload, file: File) {
    let progress = 0

    const tick = () => {
      progress += 25

      if (progress >= 100) {
        patchUpload(upload.id, {
          status: 'uploaded',
          progress: 100,
          attachment: {
            mediaType: upload.mediaType,
            fileName: file.name,
            mimeType: file.type,
            size: file.size,
            url: upload.previewUrl,
          },
        })
        return
      }

      patchUpload(upload.id, { progress })
      later(tick, UPLOAD_TICK)
    }

    later(tick, UPLOAD_TICK)
  }

  function handleAttachmentsAdd({ files }: WhatsAppAttachmentsAddPayload) {
    lastEvent.value = `attachmentsAdd · ${files.length} file(s)`

    for (const file of files) {
      const mediaType = getMediaTypeFromMime(file.type)
      const upload: WhatsAppUpload = {
        id: createClientId(),
        fileName: file.name,
        mediaType,
        mimeType: file.type,
        size: file.size,
        status: 'uploading',
        progress: 0,
        previewUrl: mediaType === 'image' ? URL.createObjectURL(file) : undefined,
      }

      uploads.value = [...uploads.value, upload]
      simulateUpload(upload, file)
    }
  }

  function handleAttachmentRemove(upload: WhatsAppUpload) {
    lastEvent.value = `attachmentRemove · ${upload.fileName}`
    uploads.value = uploads.value.filter((item) => item.id !== upload.id)
  }

  function handleNewConversation({
    phoneNumber,
    normalizedPhoneNumber,
    name,
  }: WhatsAppNewConversationPayload) {
    lastEvent.value = `newConversation · ${normalizedPhoneNumber}`

    const existing = conversations.value.find(
      (conversation) =>
        conversation.contact.phoneNumber?.replace(/\D/g, '') ===
        normalizedPhoneNumber.replace(/\D/g, ''),
    )

    const id = existing?.id ?? `new-${normalizedPhoneNumber}`

    if (!existing) {
      conversations.value = [
        {
          id,
          contact: { id, name, phoneNumber },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
          status: 'open',
        },
        ...conversations.value,
      ]
      threads.value = { ...threads.value, [id]: [] }
    }

    // Clearing the filters keeps the brand new conversation from being hidden by one of them.
    filters.value = {}
    selectedConversationId.value = id
    newConversationOpened.value = false
  }

  const newConversationOpened = ref(false)

  function handleSelectConversation(conversation: WhatsAppConversationSummary) {
    lastEvent.value = `selectConversation · ${conversation.id}`

    if (options.markReadOnSelect !== false) {
      conversations.value = conversations.value.map((item) =>
        item.id === conversation.id ? { ...item, unreadCount: 0 } : item,
      )
    }
  }

  return {
    conversations,
    visibleConversations,
    filters,
    drafts,
    newConversationOpened,
    handleNewConversation,
    messages,
    threads,
    selectedConversationId,
    draft,
    uploads,
    sending,
    lastEvent,
    handleSend,
    handleRetryMessage,
    handleAttachmentsAdd,
    handleAttachmentRemove,
    handleSelectConversation,
    patchUpload,
  }
}

const DEMO_EMOJI = ['👍', '🎉', '🙏', '😀', '🔥', '✅', '❤️', '📎', '👋', '🙌', '😅', '🚀']

export function renderDemoEmojiPicker({
  insert,
  close,
}: {
  insert: (emoji: string) => void
  close: () => void
}) {
  return h(Group, { gap: 4, style: { maxWidth: '196px' } }, () =>
    DEMO_EMOJI.map((emoji) =>
      h(
        Button,
        {
          key: emoji,
          size: 'compact-sm',
          variant: 'subtle',
          'aria-label': emoji,
          onClick: () => {
            insert(emoji)
            close()
          },
        },
        () => emoji,
      ),
    ),
  )
}

export const INBOX_DEMO_HEIGHT = 560
export const CONVERSATION_DEMO_HEIGHT = 460
