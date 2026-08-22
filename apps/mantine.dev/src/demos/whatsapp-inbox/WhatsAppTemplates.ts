import { defineComponent, h, ref } from 'vue'
import { Button, Code, Paper, SimpleGrid, Stack, Text } from '@mantine-vue/core'
import { WhatsAppTemplatePreview, WhatsAppTemplateSelector } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppAttachment, WhatsAppTemplateValues } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppTemplateSubmitPayload } from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import { demoTemplates } from './_data'

const selectorCode = `
<script setup lang="ts">
import { WhatsAppTemplateSelector } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppTemplateSubmitPayload } from '@mantine-vue/whatsapp-inbox'

// Required parameters are validated before anything is emitted. The extension
// never calls the WhatsApp API – it hands you the completed template.
function handleSubmit({ template, values }: WhatsAppTemplateSubmitPayload) {
  api.sendTemplate({ name: template.name, language: template.language, values })
}
</script>

<template>
  <WhatsAppTemplateSelector
    :templates="templates"
    :loading="templatesQuery.isLoading.value"
    :error="templatesQuery.error.value?.message ?? null"
    @submit="handleSubmit"
    @retry-load="templatesQuery.refetch"
  />
</template>
`

const Selector = defineComponent({
  name: 'WhatsAppTemplateSelectorDemo',
  setup() {
    const submitted = ref<WhatsAppTemplateSubmitPayload | null>(null)

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Paper, { withBorder: true, radius: 'md', p: 'sm' }, () =>
          h(WhatsAppTemplateSelector, {
            templates: demoTemplates,
            listMaxHeight: 300,
            onSubmit: (payload: WhatsAppTemplateSubmitPayload) => {
              submitted.value = payload
            },
          }),
        ),
        submitted.value &&
          h(Code, { block: true }, () =>
            JSON.stringify(
              {
                name: submitted.value!.template.name,
                language: submitted.value!.template.language,
                values: submitted.value!.values,
              },
              null,
              2,
            ),
          ),
      ])
  },
})

export const selector: MantineDemo = {
  type: 'code',
  component: Selector,
  code: selectorCode,
  maxWidth: 560,
}

const previewCode = `
<script setup lang="ts">
import { WhatsAppTemplatePreview } from '@mantine-vue/whatsapp-inbox'
</script>

<template>
  <!-- Placeholders without a value stay visible, so the user sees what is still empty -->
  <WhatsAppTemplatePreview
    :template="template"
    :values="{ body: { '1': 'Amina' } }"
    with-meta
  />
</template>
`

const Preview = defineComponent({
  name: 'WhatsAppTemplatePreviewDemo',
  setup() {
    const values: WhatsAppTemplateValues = {
      body: { '1': 'Amina', '2': 'Tuesday' },
    }

    return () =>
      h(SimpleGrid, { cols: { base: 1, sm: 2 }, spacing: 'md' }, () => [
        h(Stack, { gap: 4 }, () => [
          h(Text, { size: 'xs', c: 'dimmed', fw: 600 }, () => 'PARTIALLY FILLED'),
          h(Paper, { withBorder: true, radius: 'md', p: 'sm' }, () =>
            h(WhatsAppTemplatePreview, {
              template: demoTemplates[0],
              values: { body: { '1': 'Amina' } },
              withMeta: true,
            }),
          ),
        ]),
        h(Stack, { gap: 4 }, () => [
          h(Text, { size: 'xs', c: 'dimmed', fw: 600 }, () => 'FULLY FILLED'),
          h(Paper, { withBorder: true, radius: 'md', p: 'sm' }, () =>
            h(WhatsAppTemplatePreview, {
              template: demoTemplates[0],
              values: { body: { ...values.body, '3': '14:00' } },
              withMeta: true,
            }),
          ),
        ]),
      ])
  },
})

export const preview: MantineDemo = {
  type: 'code',
  component: Preview,
  code: previewCode,
  maxWidth: '100%',
}

const headerMediaCode = `
<template>
  <!--
    A template whose header expects an image, video or document needs media that
    the extension cannot produce: it never uploads. Supply the picker in the slot
    and hand back a ready \`WhatsAppAttachment\`.
  -->
  <WhatsAppTemplateSelector :templates="templates" @submit="handleSubmit">
    <template #headerMedia="{ value, setValue, error }">
      <MyUploader :value="value" :error="error" @uploaded="setValue" />
    </template>
  </WhatsAppTemplateSelector>
</template>
`

const HeaderMedia = defineComponent({
  name: 'WhatsAppTemplateHeaderMediaDemo',
  setup() {
    return () =>
      h(Paper, { withBorder: true, radius: 'md', p: 'sm' }, () =>
        h(
          WhatsAppTemplateSelector,
          {
            templates: [demoTemplates[2]],
            defaultSelectedTemplateId: 'invoice_receipt',
            listMaxHeight: 320,
          },
          {
            headerMedia: ({
              value,
              setValue,
              error,
            }: {
              value: WhatsAppAttachment | null
              setValue: (attachment: WhatsAppAttachment | null) => void
              error: string | undefined
            }) =>
              h(Stack, { gap: 4 }, () => [
                value
                  ? h(
                      Button,
                      { size: 'xs', variant: 'default', onClick: () => setValue(null) },
                      () => `${value.fileName} · remove`,
                    )
                  : h(
                      Button,
                      {
                        size: 'xs',
                        variant: 'light',
                        onClick: () =>
                          setValue({
                            mediaType: 'document',
                            fileName: 'invoice-4821.pdf',
                            url: 'https://mantine-vue.dev/invoice.pdf',
                          }),
                      },
                      () => 'Attach a document (your uploader)',
                    ),
                error && h(Text, { size: 'xs', c: 'red' }, () => error),
              ]),
          },
        ),
      )
  },
})

export const headerMedia: MantineDemo = {
  type: 'code',
  component: HeaderMedia,
  code: headerMediaCode,
  maxWidth: 560,
}
