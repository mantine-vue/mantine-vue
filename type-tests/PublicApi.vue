<script setup lang="ts">
import { ref } from 'vue'
import { Autocomplete, Box, Button, Transition } from '@mantine-vue/core'
import { WhatsAppInbox } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppOutgoingMessage } from '@mantine-vue/whatsapp-inbox'

const value = ref('')
const onModelValue = (nextValue: string) => {
  value.value = nextValue
}

const selectedConversationId = ref<string | null>(null)
const onSend = (payload: WhatsAppOutgoingMessage) => payload.conversationId
</script>

<template>
  <Box my="xl" bg="red.5" :mx="{ base: 'xs', md: 24 }">Typed box</Box>

  <Button size="sm" variant="filled" :full-width="true">
    <template #leftSection>Left</template>
    Typed button
    <template #rightSection>Right</template>
  </Button>

  <Autocomplete v-model="value" :data="['Vue']" @update:model-value="onModelValue" />

  <Transition :mounted="true" v-slot="styles">
    <div :style="styles">Typed transition</div>
  </Transition>

  <WhatsAppInbox
    v-model:selected-conversation-id="selectedConversationId"
    :conversations="[]"
    :messages="[]"
    @send="onSend"
  >
    <template #conversationItem="{ conversation, selected }">
      {{ conversation.contact.name }} {{ selected }}
    </template>
    <template #message="{ message }">{{ message.id }}</template>
  </WhatsAppInbox>
</template>
