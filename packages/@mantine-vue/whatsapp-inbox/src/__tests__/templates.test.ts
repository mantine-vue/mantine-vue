import { describe, expect, it, vi } from 'vitest'
import { WhatsAppInteractiveMessageEditor } from '../components/WhatsAppInteractiveMessageEditor'
import { WhatsAppTemplatePreview } from '../components/WhatsAppTemplatePreview'
import { WhatsAppTemplateSelector } from '../components/WhatsAppTemplateSelector'
import type { WhatsAppTemplateSubmitPayload } from '../components/WhatsAppTemplateSelector'
import { createTemplate, mountWithProvider } from './test-utils'

describe('WhatsAppTemplateSelector', () => {
  it('lists the supplied templates with category and language', () => {
    const wrapper = mountWithProvider(WhatsAppTemplateSelector, {
      templates: [createTemplate()],
    })

    expect(wrapper.text()).toContain('appointment_reminder')
    expect(wrapper.text()).toContain('utility')
    expect(wrapper.text()).toContain('en_US')
  })

  it('filters the list by the search query', async () => {
    const wrapper = mountWithProvider(WhatsAppTemplateSelector, {
      templates: [
        createTemplate(),
        createTemplate({ id: 'template-2', name: 'order_shipped', components: [] }),
      ],
    })

    await wrapper.get('input[placeholder="Search templates"]').setValue('shipped')

    expect(wrapper.text()).toContain('order_shipped')
    expect(wrapper.text()).not.toContain('appointment_reminder')
  })

  it('marks templates that are not approved as unavailable', () => {
    const wrapper = mountWithProvider(WhatsAppTemplateSelector, {
      templates: [createTemplate({ status: 'pending' })],
    })

    const button = wrapper.get('ul button')

    expect(button.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('pending')
  })

  it('shows the parameter form after a template is picked', async () => {
    const wrapper = mountWithProvider(WhatsAppTemplateSelector, {
      templates: [createTemplate()],
    })

    await wrapper.get('ul button').trigger('click')

    expect(wrapper.findComponent(WhatsAppTemplateSelector).emitted('select')).toHaveLength(1)
    expect(wrapper.text()).toContain('Body')
    expect(wrapper.findAll('textarea')).toHaveLength(2)
  })

  it('blocks submission until every required parameter is filled', async () => {
    const onSubmit = vi.fn()
    const wrapper = mountWithProvider(WhatsAppTemplateSelector, {
      templates: [createTemplate()],
      onSubmit,
    })

    await wrapper.get('ul button').trigger('click')

    const submit = wrapper.findAll('button').find((node) => node.text() === 'Send template')
    await submit!.trigger('click')

    expect(onSubmit).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('This value is required')

    const inputs = wrapper.findAll('textarea')
    await inputs[0].setValue('Amina')
    await inputs[1].setValue('Friday')
    await submit!.trigger('click')

    expect(onSubmit).toHaveBeenCalledTimes(1)

    const payload = onSubmit.mock.calls[0][0] as WhatsAppTemplateSubmitPayload

    expect(payload.template.name).toBe('appointment_reminder')
    expect(payload.values.body).toEqual({ '1': 'Amina', '2': 'Friday' })
  })

  it('previews the template with the entered values substituted', async () => {
    const wrapper = mountWithProvider(WhatsAppTemplateSelector, {
      templates: [createTemplate()],
    })

    await wrapper.get('ul button').trigger('click')
    await wrapper.findAll('textarea')[0].setValue('Amina')

    expect(wrapper.text()).toContain('Hi Amina, your appointment is on {{2}}.')
  })

  it('requires media for a media header and defers the picker to the consumer', async () => {
    const wrapper = mountWithProvider(
      WhatsAppTemplateSelector,
      {
        templates: [
          createTemplate({
            id: 'template-media',
            name: 'receipt',
            components: [
              { type: 'header', format: 'image' },
              { type: 'body', text: 'Your receipt is attached.' },
            ],
          }),
        ],
      },
      { slots: { headerMedia: () => 'consumer picker' } },
    )

    await wrapper.get('ul button').trigger('click')

    expect(wrapper.text()).toContain('consumer picker')

    const submit = wrapper.findAll('button').find((node) => node.text() === 'Send template')
    await submit!.trigger('click')

    expect(wrapper.findComponent(WhatsAppTemplateSelector).emitted('submit')).toBeUndefined()
  })

  it('renders the loading, error and empty states', async () => {
    const loading = mountWithProvider(WhatsAppTemplateSelector, { loading: true })
    expect(loading.text()).toContain('Loading templates')

    const failed = mountWithProvider(WhatsAppTemplateSelector, { error: 'No access' })
    expect(failed.text()).toContain('No access')
    await failed.get('button').trigger('click')
    expect(failed.findComponent(WhatsAppTemplateSelector).emitted('retryLoad')).toHaveLength(1)

    const empty = mountWithProvider(WhatsAppTemplateSelector, { templates: [] })
    expect(empty.text()).toContain('No templates match your search')
  })
})

describe('WhatsAppTemplatePreview', () => {
  it('keeps unfilled placeholders visible', () => {
    const wrapper = mountWithProvider(WhatsAppTemplatePreview, {
      template: createTemplate(),
      values: { body: { '1': 'Amina' } },
    })

    expect(wrapper.text()).toContain('Hi Amina, your appointment is on {{2}}.')
    expect(wrapper.text()).toContain('Reply STOP to opt out')
  })

  it('falls back to plain text when the definition is gone', () => {
    const wrapper = mountWithProvider(WhatsAppTemplatePreview, {
      fallbackText: 'Your appointment is confirmed.',
    })

    expect(wrapper.text()).toContain('Your appointment is confirmed.')
  })
})

describe('WhatsAppInteractiveMessageEditor', () => {
  it('offers only the interactive types the provider supports', () => {
    const single = mountWithProvider(WhatsAppInteractiveMessageEditor, {
      interactiveTypes: ['button'],
    })
    expect(single.text()).not.toContain('Call to action')

    const several = mountWithProvider(WhatsAppInteractiveMessageEditor, {
      interactiveTypes: ['button', 'cta_url', 'list'],
    })
    expect(several.text()).toContain('Call to action')
    expect(several.text()).toContain('List')
  })

  it('validates the draft before emitting submit', async () => {
    const onSubmit = vi.fn()
    const wrapper = mountWithProvider(WhatsAppInteractiveMessageEditor, {
      interactiveTypes: ['button'],
      onSubmit,
    })

    const submit = wrapper
      .findAll('button')
      .find((node) => node.text() === 'Send interactive message')

    await submit!.trigger('click')

    expect(onSubmit).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Body text is required')
    expect(wrapper.text()).toContain('Add at least one button')

    await wrapper.get('textarea').setValue('Did we solve your issue?')
    await wrapper.get('input[aria-label="Button text 1"]').setValue('Yes')
    await submit!.trigger('click')

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      type: 'button',
      body: 'Did we solve your issue?',
      buttons: [{ title: 'Yes' }],
    })
  })

  it('validates the URL of a call-to-action message', async () => {
    const onSubmit = vi.fn()
    const wrapper = mountWithProvider(WhatsAppInteractiveMessageEditor, {
      interactiveTypes: ['cta_url'],
      onSubmit,
    })

    await wrapper.get('textarea').setValue('See your invoice')

    // Rendered inputs, in order: header, footer, display text, URL.
    const inputs = wrapper.findAll('input')
    await inputs[2].setValue('Open invoice')
    await inputs[3].setValue('not-a-url')

    const submit = wrapper
      .findAll('button')
      .find((node) => node.text() === 'Send interactive message')
    await submit!.trigger('click')

    expect(onSubmit).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('A valid URL is required')

    await inputs[3].setValue('https://example.test/invoice/1')
    await submit!.trigger('click')

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
