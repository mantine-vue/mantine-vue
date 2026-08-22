# @mantine-vue/whatsapp-inbox

Backend-agnostic WhatsApp inbox components for Mantine Vue. The package includes conversation
lists, message history, templates, interactive messages, media previews, and a capability-driven
composer in full-page, modal, and drawer layouts.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is
> not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/whatsapp-inbox @mantine-vue/core @mantine-vue/hooks

# or with npm
npm i @mantine-vue/whatsapp-inbox @mantine-vue/core @mantine-vue/hooks
```

Import the extension styles after the core styles:

```ts
import '@mantine-vue/core/styles.css'
import '@mantine-vue/whatsapp-inbox/styles.css'
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WhatsAppInbox } from '@mantine-vue/whatsapp-inbox'
import type {
  WhatsAppConversationSummary,
  WhatsAppMessageData,
  WhatsAppOutgoingMessage,
} from '@mantine-vue/whatsapp-inbox'

const conversations = ref<WhatsAppConversationSummary[]>([])
const messages = ref<WhatsAppMessageData[]>([])
const selectedConversationId = ref<string | null>(null)

function handleSend(payload: WhatsAppOutgoingMessage) {
  api.send(payload)
}
</script>

<template>
  <WhatsAppInbox
    v-model:selected-conversation-id="selectedConversationId"
    :conversations="conversations"
    :messages="messages"
    style="height: 100dvh"
    @send="handleSend"
  />
</template>
```

`WhatsAppInbox` fills its container, so the container must have an explicit height.

## Integration model

The package provides UI only. It does not call the WhatsApp API, fetch conversations, upload
files, open sockets, or persist data. Your application maps backend data to the exported types,
passes it through props, handles emitted events, and supplies updated props.

Conversation capabilities control which composer actions are available. The backend should report
the messaging-window state; the package does not infer it from timestamps. File selection and
validation happen in the composer, while uploads remain the application's responsibility.

Selection, filters, drafts, and overlay state support Vue `v-model` bindings. Components also
provide uncontrolled `default*` props where applicable. All primitives are exported for custom
layouts, and user-facing labels and date formatters can be configured with
`WhatsAppInboxProvider`.

## Documentation

Full API documentation and examples:
[mantine-vue.dev/whatsapp-inbox/getting-started](https://mantine-vue.dev/whatsapp-inbox/getting-started/)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core` 3.1.0
- `@mantine-vue/hooks` 3.1.0

## License

MIT
