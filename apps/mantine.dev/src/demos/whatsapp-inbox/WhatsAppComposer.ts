import { defineComponent, h, ref } from 'vue'
import { Button, Code, Group, Paper, SimpleGrid, Stack, Switch, Text } from '@mantine-vue/core'
import { WhatsAppComposer, WhatsAppEmojiPicker } from '@mantine-vue/whatsapp-inbox'
import type {
  WhatsAppConversationCapabilities,
  WhatsAppEmoji,
  WhatsAppMessageReference,
  WhatsAppOutgoingMessage,
} from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import { demoTemplates, openWindowCapabilities } from './_data'
import { renderDemoEmojiPicker, useInboxDemoState } from './_shared'

const capabilitiesCode = `
<script setup lang="ts">
import { WhatsAppComposer } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppConversationCapabilities } from '@mantine-vue/whatsapp-inbox'

// Every action is driven by the capabilities you supply per conversation.
// Nothing about a specific provider's feature set is hard-coded in the composer.
const capabilities: WhatsAppConversationCapabilities = {
  canSendFreeForm: true,
  canSendMedia: true,
  canSendTemplates: true,
  canUseEmoji: true,
  canSendInteractive: true,
  interactiveTypes: ['button', 'cta_url'],
  messagingWindow: { state: 'open' },
}
</script>

<template>
  <WhatsAppComposer
    v-model="draft"
    conversation-id="conversation-1"
    :capabilities="capabilities"
    :templates="templates"
    @send="handleSend"
  />
</template>
`

const Capabilities = defineComponent({
  name: 'WhatsAppComposerCapabilitiesDemo',
  setup() {
    const canSendMedia = ref(true)
    const canSendTemplates = ref(true)
    const canUseEmoji = ref(true)
    const canSendInteractive = ref(true)
    const draft = ref('')

    const capabilities = (): WhatsAppConversationCapabilities => ({
      canSendFreeForm: true,
      canSendMedia: canSendMedia.value,
      canSendTemplates: canSendTemplates.value,
      canUseEmoji: canUseEmoji.value,
      canSendInteractive: canSendInteractive.value,
      interactiveTypes: ['button', 'cta_url', 'list'],
      messagingWindow: { state: 'open' },
    })

    const toggle = (label: string, model: { value: boolean }) =>
      h(Switch, {
        size: 'xs',
        label,
        checked: model.value,
        modelValue: model.value,
        'onUpdate:modelValue': (value: boolean) => {
          model.value = value
        },
      })

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(SimpleGrid, { cols: { base: 2, sm: 4 }, spacing: 'xs' }, () => [
          toggle('canSendMedia', canSendMedia),
          toggle('canSendTemplates', canSendTemplates),
          toggle('canUseEmoji', canUseEmoji),
          toggle('canSendInteractive', canSendInteractive),
        ]),
        h(Paper, { withBorder: true, radius: 'md' }, () =>
          h(
            WhatsAppComposer,
            {
              conversationId: 'conversation-1',
              capabilities: capabilities(),
              templates: demoTemplates,
              modelValue: draft.value,
              'onUpdate:modelValue': (value: string) => {
                draft.value = value
              },
            },
            { emojiPicker: renderDemoEmojiPicker },
          ),
        ),
      ])
  },
})

export const capabilities: MantineDemo = {
  type: 'code',
  component: Capabilities,
  code: capabilitiesCode,
  maxWidth: '100%',
}

const sendingCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { WhatsAppComposer } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppOutgoingMessage } from '@mantine-vue/whatsapp-inbox'

const draft = ref('')

// The payload is a discriminated union on \`kind\`, so this switch is exhaustive.
function handleSend(payload: WhatsAppOutgoingMessage) {
  switch (payload.kind) {
    case 'text':
      return api.sendText(payload)
    case 'media':
      return api.sendMedia(payload)
    case 'template':
      return api.sendTemplate(payload)
    case 'interactive':
      return api.sendInteractive(payload)
  }
}
</script>

<template>
  <WhatsAppComposer
    v-model="draft"
    conversation-id="conversation-1"
    :capabilities="capabilities"
    :sending="sending"
    :error="sendError"
    @send="handleSend"
    @retry-send="retry"
  />
</template>
`

const Sending = defineComponent({
  name: 'WhatsAppComposerSendingDemo',
  setup() {
    const draft = ref('')
    const payloads = ref<WhatsAppOutgoingMessage[]>([])

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Paper, { withBorder: true, radius: 'md' }, () =>
          h(WhatsAppComposer, {
            conversationId: 'conversation-1',
            capabilities: openWindowCapabilities,
            templates: demoTemplates,
            modelValue: draft.value,
            'onUpdate:modelValue': (value: string) => {
              draft.value = value
            },
            onSend: (payload: WhatsAppOutgoingMessage) => {
              payloads.value = [payload, ...payloads.value].slice(0, 3)
            },
          }),
        ),
        h(Text, { size: 'xs', c: 'dimmed' }, () => 'Emitted payloads:'),
        payloads.value.length === 0
          ? h(Text, { size: 'xs', c: 'dimmed', fs: 'italic' }, () => 'Nothing sent yet')
          : h(Code, { block: true }, () => JSON.stringify(payloads.value, null, 2)),
      ])
  },
})

export const sending: MantineDemo = {
  type: 'code',
  component: Sending,
  code: sendingCode,
  maxWidth: '100%',
}

const validationCode = `
<template>
  <!--
    Validation is a UI concern, so the composer owns it: an empty draft and a draft
    over \`maxTextLength\` are refused before anything is emitted, and the reason is
    both shown and emitted through \`validationError\`.
  -->
  <WhatsAppComposer
    conversation-id="conversation-1"
    :capabilities="{ canSendFreeForm: true, maxTextLength: 40 }"
    @validation-error="notify"
  />
</template>
`

const Validation = defineComponent({
  name: 'WhatsAppComposerValidationDemo',
  setup() {
    const draft = ref('')
    const errors = ref<string[]>([])

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Paper, { withBorder: true, radius: 'md' }, () =>
          h(WhatsAppComposer, {
            conversationId: 'conversation-1',
            capabilities: { canSendFreeForm: true, maxTextLength: 40 },
            modelValue: draft.value,
            'onUpdate:modelValue': (value: string) => {
              draft.value = value
            },
            onValidationError: (message: string) => {
              errors.value = [message, ...errors.value].slice(0, 3)
            },
          }),
        ),
        errors.value.length > 0 &&
          h(Text, { size: 'xs', c: 'dimmed' }, () => `validationError: ${errors.value[0]}`),
      ])
  },
})

export const validation: MantineDemo = {
  type: 'code',
  component: Validation,
  code: validationCode,
  maxWidth: '100%',
}

const emojiCode = `
<script setup lang="ts">
import { WhatsAppComposer } from '@mantine-vue/whatsapp-inbox'
</script>

<template>
  <!--
    \`canUseEmoji\` is all it takes: the composer renders the built-in
    WhatsAppEmojiPicker, with search, categories, keyboard navigation and a
    recently-used row.
  -->
  <WhatsAppComposer
    conversation-id="conversation-1"
    :capabilities="{ canSendFreeForm: true, canUseEmoji: true }"
  />
</template>
`

const Emoji = defineComponent({
  name: 'WhatsAppComposerEmojiDemo',
  setup() {
    const draft = ref('')

    return () =>
      h(Paper, { withBorder: true, radius: 'md' }, () =>
        h(WhatsAppComposer, {
          conversationId: 'conversation-1',
          capabilities: { canSendFreeForm: true, canUseEmoji: true },
          modelValue: draft.value,
          'onUpdate:modelValue': (value: string) => {
            draft.value = value
          },
        }),
      )
  },
})

export const emoji: MantineDemo = {
  type: 'code',
  component: Emoji,
  code: emojiCode,
  maxWidth: '100%',
}

const emojiFilteringCode = `
<template>
  <!--
    Both directions are supported: keep a few categories with an allow-list, or start
    from everything and remove with a block-list. \`filter\` has the final say.
  -->
  <WhatsAppComposer
    conversation-id="conversation-1"
    :capabilities="{ canSendFreeForm: true, canUseEmoji: true }"
    :emoji-picker-props="{
      groups: ['smileys', 'people', 'food'],
      excludeEmojis: ['🖕', '🚬'],
      columns: 9,
    }"
  />

  <!-- Or an explicit allow-list, for a fixed reaction set -->
  <WhatsAppComposer
    :emoji-picker-props="{
      emojis: ['👍', '❤️', '😂', '😮', '😢', '🙏'],
      withSearch: false,
      withTabs: false,
    }"
  />
</template>
`

const EmojiFiltering = defineComponent({
  name: 'WhatsAppComposerEmojiFilteringDemo',
  setup() {
    const mode = ref<'groups' | 'block' | 'allow'>('groups')
    const options = ['groups', 'block', 'allow'] as const

    const pickerProps = () => {
      if (mode.value === 'groups') {
        // Allow-list of categories.
        return { groups: ['smileys', 'people', 'food'] as const, columns: 9 }
      }

      if (mode.value === 'block') {
        // Everything except the categories and characters listed.
        return { excludeGroups: ['flags', 'symbols'] as const, excludeEmojis: ['🚬', '🔫'] }
      }

      // A fixed reaction set: no search, no tabs.
      return {
        emojis: ['👍', '❤️', '😂', '😮', '😢', '🙏'],
        withSearch: false,
        withTabs: false,
        withPreview: false,
        columns: 6,
      }
    }

    const labels: Record<(typeof options)[number], string> = {
      groups: 'groups allow-list',
      block: 'excludeGroups + excludeEmojis',
      allow: 'emojis allow-list',
    }

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Group, { gap: 'xs' }, () =>
          options.map((value) =>
            h(
              Button,
              {
                key: value,
                size: 'xs',
                variant: mode.value === value ? 'filled' : 'default',
                onClick: () => {
                  mode.value = value
                },
              },
              () => labels[value],
            ),
          ),
        ),
        h(Code, { block: true }, () => JSON.stringify(pickerProps(), null, 2)),
        h(Paper, { withBorder: true, radius: 'md' }, () =>
          h(WhatsAppComposer, {
            key: mode.value,
            conversationId: 'conversation-1',
            capabilities: { canSendFreeForm: true, canUseEmoji: true },
            emojiPickerProps: pickerProps() as any,
          }),
        ),
      ])
  },
})

export const emojiFiltering: MantineDemo = {
  type: 'code',
  component: EmojiFiltering,
  code: emojiFilteringCode,
  maxWidth: '100%',
}

const emojiCustomCode = `
<template>
  <!--
    Turn the built-in picker off and supply your own. Supplying the slot is enough –
    it takes precedence – but \`with-emoji-picker="false"\` makes the intent explicit
    and guarantees the built-in one is never bundled into the popover.
  -->
  <WhatsAppComposer
    conversation-id="conversation-1"
    :capabilities="{ canSendFreeForm: true, canUseEmoji: true }"
    :with-emoji-picker="false"
  >
    <template #emojiPicker="{ insert, close }">
      <MyEmojiPicker @select="(emoji) => { insert(emoji); close() }" />
    </template>
  </WhatsAppComposer>
</template>
`

const EmojiCustom = defineComponent({
  name: 'WhatsAppComposerEmojiCustomDemo',
  setup() {
    const draft = ref('')

    return () =>
      h(Paper, { withBorder: true, radius: 'md' }, () =>
        h(
          WhatsAppComposer,
          {
            conversationId: 'conversation-1',
            capabilities: { canSendFreeForm: true, canUseEmoji: true },
            withEmojiPicker: false,
            modelValue: draft.value,
            'onUpdate:modelValue': (value: string) => {
              draft.value = value
            },
          },
          { emojiPicker: renderDemoEmojiPicker },
        ),
      )
  },
})

export const emojiCustom: MantineDemo = {
  type: 'code',
  component: EmojiCustom,
  code: emojiCustomCode,
  maxWidth: '100%',
}

const emojiStandaloneCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { WhatsAppEmojiPicker } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppEmoji } from '@mantine-vue/whatsapp-inbox'

const picked = ref<string[]>([])

function handleSelect(emoji: WhatsAppEmoji) {
  picked.value = [emoji.emoji, ...picked.value].slice(0, 12)
}
</script>

<template>
  <!-- The picker is exported on its own, for reaction bars, status editors, anywhere -->
  <WhatsAppEmojiPicker :columns="9" height="240px" width="100%" @select="handleSelect" />
</template>
`

const EmojiStandalone = defineComponent({
  name: 'WhatsAppComposerEmojiStandaloneDemo',
  setup() {
    const picked = ref<string[]>([])

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Paper, { withBorder: true, radius: 'md', p: 'xs' }, () =>
          h(WhatsAppEmojiPicker, {
            columns: 9,
            height: '240px',
            width: '100%',
            onSelect: (emoji: WhatsAppEmoji) => {
              picked.value = [emoji.emoji, ...picked.value].slice(0, 12)
            },
          }),
        ),
        h(Text, { size: 'xs', c: 'dimmed' }, () =>
          picked.value.length > 0 ? `Picked: ${picked.value.join(' ')}` : 'Nothing picked yet',
        ),
      ])
  },
})

export const emojiStandalone: MantineDemo = {
  type: 'code',
  component: EmojiStandalone,
  code: emojiStandaloneCode,
  maxWidth: 420,
}

const replyCode = `
<script setup lang="ts">
import { ref } from 'vue'
import type { WhatsAppMessageReference } from '@mantine-vue/whatsapp-inbox'

const replyTo = ref<WhatsAppMessageReference | null>(null)
</script>

<template>
  <WhatsAppComposer
    v-model:reply-to="replyTo"
    conversation-id="conversation-1"
    :capabilities="{ canSendFreeForm: true, canReplyToMessage: true }"
  />
</template>
`

const Reply = defineComponent({
  name: 'WhatsAppComposerReplyDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })
    const replyTo = ref<WhatsAppMessageReference | null>({
      id: 'amina-4',
      text: 'Here is your receipt.',
      author: 'Sara Nasser',
    })

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        !replyTo.value &&
          h(
            Button,
            {
              size: 'xs',
              variant: 'default',
              onClick: () => {
                replyTo.value = {
                  id: 'amina-4',
                  text: 'Here is your receipt.',
                  author: 'Sara Nasser',
                }
              },
            },
            () => 'Reply to a message',
          ),
        h(Paper, { withBorder: true, radius: 'md' }, () =>
          h(WhatsAppComposer, {
            conversationId: 'amina',
            capabilities: { canSendFreeForm: true, canReplyToMessage: true },
            replyTo: replyTo.value,
            'onUpdate:replyTo': (value: WhatsAppMessageReference | null) => {
              replyTo.value = value
            },
            modelValue: state.draft.value,
            'onUpdate:modelValue': (value: string) => {
              state.draft.value = value
            },
            onSend: state.handleSend,
          }),
        ),
      ])
  },
})

export const reply: MantineDemo = {
  type: 'code',
  component: Reply,
  code: replyCode,
  maxWidth: '100%',
}
