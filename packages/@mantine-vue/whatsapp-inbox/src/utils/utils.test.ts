import { describe, expect, it } from 'vitest'
import { DEFAULT_WHATSAPP_INBOX_LABELS } from '../labels'
import type { WhatsAppMessageData, WhatsAppTemplate } from '../types'
import { resolveCapabilities } from './capabilities'
import { formatDayLabel, formatDuration, formatFileSize, isSameDay, toDate } from './format'
import { getAcceptAttribute, getMediaTypeFromMime, matchesAccept, validateFiles } from './media'
import {
  createClientId,
  getMessagePreviewText,
  groupMessagesByDay,
  sortConversationsByActivity,
} from './messages'
import {
  createEmptyTemplateValues,
  extractPlaceholders,
  filterTemplates,
  getTemplateParameters,
  isTemplateSendable,
  renderTemplateText,
  validateTemplateValues,
} from './templates'

const labels = DEFAULT_WHATSAPP_INBOX_LABELS

function createFile(name: string, type: string, size: number): File {
  const file = new File(['x'], name, { type })

  Object.defineProperty(file, 'size', { value: size })

  return file
}

describe('format', () => {
  it('parses every accepted timestamp shape and rejects garbage', () => {
    expect(toDate('2026-03-18T12:00:00.000Z')?.getUTCFullYear()).toBe(2026)
    expect(toDate(new Date('2026-03-18T12:00:00.000Z'))?.getUTCMonth()).toBe(2)
    expect(toDate(1_774_000_000_000)).toBeInstanceOf(Date)
    expect(toDate('not a date')).toBeNull()
    expect(toDate(undefined)).toBeNull()
    expect(toDate('')).toBeNull()
  })

  it('labels today and yesterday relative to the supplied instant', () => {
    const now = new Date(2026, 2, 18, 12)

    expect(formatDayLabel(new Date(2026, 2, 18, 9), 'en-US', labels, now)).toBe('Today')
    expect(formatDayLabel(new Date(2026, 2, 17, 9), 'en-US', labels, now)).toBe('Yesterday')
    expect(formatDayLabel(new Date(2026, 2, 15, 9), 'en-US', labels, now)).toBe('Sunday')
    expect(formatDayLabel(new Date(2025, 0, 4, 9), 'en-US', labels, now)).toContain('2025')
  })

  it('formats file sizes and durations', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(51_200)).toBe('50 KB')
    expect(formatFileSize(5_242_880)).toBe('5 MB')
    expect(formatFileSize(undefined)).toBe('')

    expect(formatDuration(9)).toBe('0:09')
    expect(formatDuration(75)).toBe('1:15')
    expect(formatDuration(3675)).toBe('1:01:15')
    expect(formatDuration(undefined)).toBe('')
  })

  it('compares calendar days', () => {
    expect(isSameDay(new Date(2026, 2, 18, 1), new Date(2026, 2, 18, 23))).toBe(true)
    expect(isSameDay(new Date(2026, 2, 18), new Date(2026, 2, 19))).toBe(false)
  })
})

describe('resolveCapabilities', () => {
  it('fills in the defaults', () => {
    const resolved = resolveCapabilities(undefined)

    expect(resolved.canSendFreeForm).toBe(true)
    expect(resolved.canSendTemplates).toBe(false)
    expect(resolved.canSendMedia).toBe(false)
    expect(resolved.canRetryFailed).toBe(true)
    expect(resolved.messagingWindow.state).toBe('unknown')
    expect(resolved.windowClosed).toBe(false)
  })

  it('turns free-form messaging off when the backend reports a closed window', () => {
    const resolved = resolveCapabilities({
      canSendFreeForm: true,
      canSendMedia: true,
      canSendInteractive: true,
      canSendTemplates: true,
      messagingWindow: { state: 'closed' },
    })

    expect(resolved.canSendFreeForm).toBe(false)
    expect(resolved.canSendMedia).toBe(false)
    expect(resolved.canSendInteractive).toBe(false)
    expect(resolved.canSendTemplates).toBe(true)
    expect(resolved.windowClosed).toBe(true)
    expect(resolved.canSendAnything).toBe(true)
  })

  it('never infers a closed window from an unknown state', () => {
    const resolved = resolveCapabilities({ messagingWindow: { state: 'unknown' } })

    expect(resolved.canSendFreeForm).toBe(true)
    expect(resolved.windowClosed).toBe(false)
  })

  it('reports when nothing at all can be sent', () => {
    const resolved = resolveCapabilities({
      canSendFreeForm: false,
      canSendTemplates: false,
      disabledReason: 'Read-only access',
    })

    expect(resolved.canSendAnything).toBe(false)
    expect(resolved.disabledReason).toBe('Read-only access')
  })
})

describe('messages', () => {
  it('groups by calendar day while preserving the supplied order', () => {
    const messages: WhatsAppMessageData[] = [
      { id: 'a', type: 'text', direction: 'inbound', text: '1', timestamp: '2026-03-16T22:00:00Z' },
      { id: 'b', type: 'text', direction: 'inbound', text: '2', timestamp: '2026-03-16T23:00:00Z' },
      { id: 'c', type: 'text', direction: 'inbound', text: '3', timestamp: '2026-03-18T01:00:00Z' },
    ]

    const groups = groupMessagesByDay(messages)

    expect(groups).toHaveLength(2)
    expect(groups[0].messages.map((message) => message.id)).toEqual(['a', 'b'])
    expect(groups[1].messages.map((message) => message.id)).toEqual(['c'])
  })

  it('keeps messages without a usable timestamp in their own group', () => {
    const groups = groupMessagesByDay([
      { id: 'a', type: 'text', direction: 'inbound', text: '1', timestamp: 'nonsense' },
    ])

    expect(groups).toHaveLength(1)
    expect(groups[0].date).toBeNull()
  })

  it('derives a preview for every message type', () => {
    expect(
      getMessagePreviewText(
        { id: '1', type: 'text', direction: 'inbound', text: 'Hi', timestamp: 0 },
        labels,
      ),
    ).toBe('Hi')

    expect(
      getMessagePreviewText(
        {
          id: '2',
          type: 'image',
          direction: 'inbound',
          timestamp: 0,
          attachment: { mediaType: 'image' },
        },
        labels,
      ),
    ).toBe('Photo')

    expect(
      getMessagePreviewText(
        {
          id: '3',
          type: 'template',
          direction: 'outbound',
          timestamp: 0,
          template: { name: 'reminder' },
        },
        labels,
      ),
    ).toBe('Template: reminder')

    expect(
      getMessagePreviewText(
        {
          id: '4',
          type: 'location',
          direction: 'inbound',
          timestamp: 0,
          location: { latitude: 1, longitude: 2, name: 'Clinic' },
        },
        labels,
      ),
    ).toBe('Clinic')
  })

  it('sorts by latest activity with pinned conversations first', () => {
    const sorted = sortConversationsByActivity([
      { id: 'a', contact: { id: 'c1' }, updatedAt: '2026-03-01T00:00:00Z' },
      { id: 'b', contact: { id: 'c2' }, updatedAt: '2026-03-18T00:00:00Z' },
      { id: 'c', contact: { id: 'c3' }, updatedAt: '2026-02-01T00:00:00Z', pinned: true },
    ])

    expect(sorted.map((conversation) => conversation.id)).toEqual(['c', 'b', 'a'])
  })

  it('generates unique client ids', () => {
    const ids = new Set(Array.from({ length: 50 }, () => createClientId()))

    expect(ids.size).toBe(50)
  })
})

describe('templates', () => {
  const template: WhatsAppTemplate = {
    id: 'template-1',
    name: 'order_update',
    language: 'en_US',
    status: 'approved',
    components: [
      { type: 'header', format: 'text', text: 'Order {{1}}' },
      { type: 'body', text: 'Hi {{name}}, your order ships on {{date}}.' },
      {
        type: 'buttons',
        buttons: [
          { type: 'quick_reply', text: 'Thanks' },
          { type: 'url', text: 'Track', url: 'https://track.test/{{1}}' },
        ],
      },
    ],
  }

  it('extracts placeholders in order and without duplicates', () => {
    expect(extractPlaceholders('Hi {{1}}, see {{2}} and {{1}} again')).toEqual(['1', '2'])
    expect(extractPlaceholders(undefined)).toEqual([])
  })

  it('derives parameters when the backend does not declare them', () => {
    const parameters = getTemplateParameters(template)

    expect(parameters.header.map((parameter) => parameter.key)).toEqual(['1'])
    expect(parameters.body.map((parameter) => parameter.key)).toEqual(['name', 'date'])
    expect(parameters.buttons).toHaveLength(1)
    expect(parameters.buttons[0].index).toBe(1)
    expect(parameters.hasParameters).toBe(true)
  })

  it('marks a media header as requiring an attachment rather than text', () => {
    const parameters = getTemplateParameters({
      ...template,
      components: [
        { type: 'header', format: 'image' },
        { type: 'body', text: 'Static body' },
      ],
    })

    expect(parameters.requiresHeaderMedia).toBe(true)
    expect(parameters.header).toEqual([])
    expect(parameters.hasParameters).toBe(true)
  })

  it('seeds an empty value object matching the template shape', () => {
    expect(createEmptyTemplateValues(template)).toEqual({
      header: { '1': '' },
      body: { name: '', date: '' },
      buttons: { '1': { '1': '' } },
      headerMedia: null,
    })
  })

  it('reports every missing required value', () => {
    const validation = validateTemplateValues(
      template,
      { header: { '1': 'A-1' }, body: { name: 'Amina', date: '' }, buttons: {} },
      labels,
    )

    expect(validation.valid).toBe(false)
    expect(validation.errors.body.date).toBe('This value is required')
    expect(validation.errors.buttons['1']['1']).toBe('This value is required')
    expect(validation.errors.body.name).toBeUndefined()
  })

  it('passes once everything required is present', () => {
    const validation = validateTemplateValues(
      template,
      {
        header: { '1': 'A-1' },
        body: { name: 'Amina', date: 'Friday' },
        buttons: { '1': { '1': 'A-1' } },
      },
      labels,
    )

    expect(validation.valid).toBe(true)
  })

  it('requires header media when the header expects it', () => {
    const mediaTemplate: WhatsAppTemplate = {
      ...template,
      components: [
        { type: 'header', format: 'document' },
        { type: 'body', text: 'Static' },
      ],
    }

    expect(validateTemplateValues(mediaTemplate, {}, labels).errors.headerMedia).toBe(
      'Header media is required',
    )
    expect(
      validateTemplateValues(
        mediaTemplate,
        { headerMedia: { mediaType: 'document', url: 'https://cdn.test/a.pdf' } },
        labels,
      ).valid,
    ).toBe(true)
  })

  it('substitutes values and leaves unfilled placeholders visible', () => {
    expect(renderTemplateText('Hi {{name}}, on {{date}}', { name: 'Amina' })).toBe(
      'Hi Amina, on {{date}}',
    )
  })

  it('treats a template without a status as sendable and a rejected one as not', () => {
    expect(isTemplateSendable({ ...template, status: undefined })).toBe(true)
    expect(isTemplateSendable({ ...template, status: 'approved' })).toBe(true)
    expect(isTemplateSendable({ ...template, status: 'rejected' })).toBe(false)
  })

  it('filters across name, category and body text', () => {
    const other: WhatsAppTemplate = {
      id: 'template-2',
      name: 'welcome',
      language: 'en_US',
      category: 'marketing',
      components: [{ type: 'body', text: 'Welcome aboard' }],
    }

    expect(filterTemplates([template, other], 'ships').map((item) => item.id)).toEqual([
      'template-1',
    ])
    expect(filterTemplates([template, other], 'marketing').map((item) => item.id)).toEqual([
      'template-2',
    ])
    expect(filterTemplates([template, other], '')).toHaveLength(2)
  })
})

describe('media', () => {
  it('maps MIME types onto media types', () => {
    expect(getMediaTypeFromMime('image/png')).toBe('image')
    expect(getMediaTypeFromMime('video/mp4')).toBe('video')
    expect(getMediaTypeFromMime('audio/ogg')).toBe('audio')
    expect(getMediaTypeFromMime('application/pdf')).toBe('document')
    expect(getMediaTypeFromMime(undefined)).toBe('document')
  })

  it('matches accept entries by wildcard, exact type and extension', () => {
    const png = createFile('a.png', 'image/png', 10)

    expect(matchesAccept(png, ['image/*'])).toBe(true)
    expect(matchesAccept(png, ['image/png'])).toBe(true)
    expect(matchesAccept(png, ['.png'])).toBe(true)
    expect(matchesAccept(png, ['application/pdf'])).toBe(false)
    expect(matchesAccept(png, [])).toBe(true)
  })

  it('builds the accept attribute from the allowed media types', () => {
    expect(getAcceptAttribute(['image'])).toBe('image/*')
    expect(getAcceptAttribute(['image', 'video'])).toBe('image/*,video/*')
    expect(getAcceptAttribute(['image'], { image: { accept: ['image/png'] } })).toBe('image/png')
  })

  it('rejects files whose type is not allowed', () => {
    const result = validateFiles({
      files: [createFile('clip.mp4', 'video/mp4', 10)],
      allowedMediaTypes: ['image'],
      labels,
    })

    expect(result.accepted).toHaveLength(0)
    expect(result.rejected[0].code).toBe('file-invalid-type')
    expect(result.rejected[0].message).toContain('clip.mp4')
  })

  it('rejects files over the configured size', () => {
    const result = validateFiles({
      files: [createFile('big.png', 'image/png', 6_000_000)],
      allowedMediaTypes: ['image'],
      constraints: { image: { maxFileSize: 5_242_880 } },
      labels,
    })

    expect(result.rejected[0].code).toBe('file-too-large')
    expect(result.rejected[0].message).toContain('5 MB')
  })

  it('counts already staged attachments against maxFiles', () => {
    const result = validateFiles({
      files: [createFile('a.png', 'image/png', 10), createFile('b.png', 'image/png', 10)],
      allowedMediaTypes: ['image'],
      constraints: { image: { maxFiles: 2 } },
      existingCount: 1,
      labels,
    })

    expect(result.accepted).toHaveLength(1)
    expect(result.rejected[0].code).toBe('too-many-files')
  })

  it('accepts a file that satisfies every constraint', () => {
    const result = validateFiles({
      files: [createFile('ok.png', 'image/png', 1024)],
      allowedMediaTypes: ['image'],
      constraints: { image: { maxFileSize: 5000, accept: ['image/*'], maxFiles: 5 } },
      labels,
    })

    expect(result.accepted).toHaveLength(1)
    expect(result.rejected).toHaveLength(0)
  })
})
