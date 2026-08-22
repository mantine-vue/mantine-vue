<script lang="ts">
const defaultProps = {
  draftBehavior: 'preserve',
  withHeader: true,
  withComposer: true,
  withBack: false,
  withContactToggle: false,
  focusComposerOnChange: true,
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useSlots, watch } from 'vue'
import { Box, Text, useProps, useStyles } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import {
  provideWhatsAppConversationContext,
  useWhatsAppInboxConfig,
} from '../../WhatsAppInbox.context'
import type { WhatsAppConversationSlots } from '../../component-props'
import { WhatsAppIcon } from '../../icons'
import type { WhatsAppAttachment, WhatsAppMessageData, WhatsAppOutgoingMessage } from '../../types'
import { resolveCapabilities } from '../../utils'
import { WhatsAppComposer } from '../WhatsAppComposer'
import type { WhatsAppComposerExposed } from '../WhatsAppComposer'
import { WhatsAppConversationHeader } from '../WhatsAppConversationHeader'
import { WhatsAppMessageList } from '../WhatsAppMessageList'
import type { WhatsAppMessageListExposed } from '../WhatsAppMessageList'
import type {
  WhatsAppConversationEmits,
  WhatsAppConversationOwnProps,
} from './WhatsAppConversation.types'
import classes from './WhatsAppConversation.module.css'

defineOptions({
  name: 'WhatsAppConversation',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppConversationOwnProps>(), {
  conversation: undefined,
  conversationId: undefined,
  capabilities: undefined,
  messages: undefined,
  messagesLoading: undefined,
  messagesError: undefined,
  messagesPagination: undefined,
  uploads: undefined,
  templates: undefined,
  templatesLoading: undefined,
  templatesError: undefined,
  draft: undefined,
  drafts: undefined,
  defaultDrafts: undefined,
  draftBehavior: undefined,
  sending: undefined,
  sendError: undefined,
  replyTo: undefined,
  withHeader: undefined,
  withComposer: undefined,
  withBack: undefined,
  withContactToggle: undefined,
  contactPanelOpened: undefined,
  focusComposerOnChange: undefined,
  headerProps: undefined,
  messageListProps: undefined,
  composerProps: undefined,
  labels: undefined,
  renderMessage: undefined,
  renderMessageContent: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppConversationEmits>()
defineSlots<WhatsAppConversationSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppConversation', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppConversation',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  rootSelector: 'conversationRoot',
})

const conversationId = computed(() => props.conversationId ?? props.conversation?.id)

const capabilities = computed(() =>
  resolveCapabilities(props.capabilities ?? props.conversation?.capabilities),
)

/**
 * Publishes the conversation to the primitives below, so a consumer can compose a custom layout
 * out of `WhatsAppMessageList` and `WhatsAppComposer` without threading capabilities through
 * every level. Getters keep the context reactive after a single `provide` in `setup`.
 */
provideWhatsAppConversationContext({
  get conversation() {
    return props.conversation
  },
  get conversationId() {
    return conversationId.value
  },
  get capabilities() {
    return capabilities.value
  },
})

const composerRef = ref<WhatsAppComposerExposed | null>(null)
const messageListRef = ref<WhatsAppMessageListExposed | null>(null)

function focusComposer() {
  composerRef.value?.focus()
}

function scrollToBottom(behavior: ScrollBehavior = 'auto') {
  messageListRef.value?.scrollToBottom(behavior)
}

/**
 * Unsent drafts, one per conversation.
 *
 * Drafts are preserved by default. `draftBehavior: 'reset'` opts out, and a controlled `draft`
 * bypasses the map for single-conversation layouts.
 */
const [draftMap, setDraftMap] = useUncontrolled<Record<string, string>>({
  value: () => props.drafts,
  defaultValue: props.defaultDrafts,
  finalValue: {},
  onChange: (value) => emit('update:drafts', value),
})

const singleDraft = computed(() => props.draft !== undefined)

const composerDraft = computed(() =>
  singleDraft.value ? props.draft : (draftMap.value[conversationId.value ?? ''] ?? ''),
)

/** Drops the draft of the conversation that was just sent from, so the input starts clean. */
function clearDraft(id: string | undefined) {
  if (singleDraft.value || !id || draftMap.value[id] === undefined) {
    return
  }

  const { [id]: _sent, ...rest } = draftMap.value

  setDraftMap(rest)
}

function setComposerDraft(value: string) {
  emit('update:draft', value)

  const id = conversationId.value

  if (singleDraft.value || !id) {
    return
  }

  // An empty draft is dropped rather than stored, so a persisted map never fills up with
  // entries for conversations the user only visited.
  if (value.length === 0) {
    clearDraft(id)
    return
  }

  setDraftMap({ ...draftMap.value, [id]: value })
}

// Focus the composer after switching conversations.
watch(conversationId, (next, previous) => {
  if (props.draftBehavior === 'reset') {
    clearDraft(previous)
  }

  if (next && props.focusComposerOnChange) {
    void nextTick(focusComposer)
  }
})

const hasConversation = computed(() => Boolean(conversationId.value))

// Multi-argument emits need a real handler: a template expression only ever receives `$event`.
function handleMediaDownload(attachment: WhatsAppAttachment, message: WhatsAppMessageData) {
  emit('mediaDownload', attachment, message)
}

function handleMediaPreview(attachment: WhatsAppAttachment, message: WhatsAppMessageData) {
  emit('mediaPreview', attachment, message)
}

function handleSend(payload: WhatsAppOutgoingMessage) {
  // The composer resets its own input on send; the stored draft has to follow.
  clearDraft(conversationId.value)
  emit('send', payload)
}

defineExpose({ focusComposer, scrollToBottom })
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('conversationRoot') }"
    :data-conversation-id="conversationId"
  >
    <Box v-if="!hasConversation" v-bind="getStyles('conversationState')">
      <WhatsAppIcon name="message" size="44" :style="{ color: 'var(--mantine-color-dimmed)' }" />
      <Text size="sm" fw="500">{{ config.labels.noConversationSelected }}</Text>
      <Text size="xs" c="dimmed">{{ config.labels.noConversationSelectedDescription }}</Text>
    </Box>

    <template v-else>
      <slot
        v-if="slots.conversationHeader"
        name="conversationHeader"
        :conversation="props.conversation"
      />

      <WhatsAppConversationHeader
        v-else-if="props.withHeader"
        v-bind="props.headerProps"
        :conversation="props.conversation"
        :with-back="props.withBack"
        :with-contact-toggle="props.withContactToggle"
        :contact-panel-opened="props.contactPanelOpened"
        :labels="props.labels"
        :class-names="props.classNames as any"
        :styles="props.styles as any"
        :unstyled="props.unstyled"
        @back="emit('back')"
        @toggle-contact-panel="emit('toggleContactPanel', $event)"
        @contact-click="props.conversation && emit('contactClick', props.conversation)"
      >
        <template v-if="slots.headerActions" #headerActions="headerActionsProps">
          <slot name="headerActions" v-bind="headerActionsProps" />
        </template>
      </WhatsAppConversationHeader>

      <WhatsAppMessageList
        ref="messageListRef"
        v-bind="props.messageListProps"
        :messages="props.messages"
        :conversation-id="conversationId"
        :loading="props.messagesLoading"
        :error="props.messagesError"
        :pagination="props.messagesPagination"
        :labels="props.labels"
        :render-message="props.renderMessage"
        :render-message-content="props.renderMessageContent"
        :class-names="props.classNames as any"
        :styles="props.styles as any"
        :unstyled="props.unstyled"
        @load-older="emit('loadOlderMessages', $event)"
        @retry-load="emit('retryLoadMessages')"
        @retry-message="emit('retryMessage', $event)"
        @media-download="handleMediaDownload"
        @media-preview="handleMediaPreview"
        @at-bottom-change="emit('atBottomChange', $event)"
      >
        <template v-if="slots.message" #message="messageProps">
          <slot name="message" v-bind="messageProps" />
        </template>
        <template v-if="slots.messageContent" #messageContent="messageContentProps">
          <slot name="messageContent" v-bind="messageContentProps" />
        </template>
        <template v-if="slots.messageFooter" #messageFooter="messageFooterProps">
          <slot name="messageFooter" v-bind="messageFooterProps" />
        </template>
        <template v-if="slots.mediaAttachment" #mediaAttachment="mediaProps">
          <slot name="mediaAttachment" v-bind="mediaProps" />
        </template>
        <template v-if="slots.emptyConversation" #emptyConversation>
          <slot name="emptyConversation" />
        </template>
        <template v-if="slots.loadingMessages" #loadingMessages>
          <slot name="loadingMessages" />
        </template>
        <template v-if="slots.errorMessages" #errorMessages="errorProps">
          <slot name="errorMessages" v-bind="errorProps" />
        </template>
      </WhatsAppMessageList>

      <WhatsAppComposer
        v-if="props.withComposer"
        ref="composerRef"
        v-bind="props.composerProps"
        :conversation-id="conversationId"
        :model-value="composerDraft"
        :capabilities="props.capabilities ?? props.conversation?.capabilities"
        :uploads="props.uploads"
        :templates="props.templates"
        :templates-loading="props.templatesLoading"
        :templates-error="props.templatesError"
        :sending="props.sending"
        :error="props.sendError"
        :reply-to="props.replyTo"
        :labels="props.labels"
        :class-names="props.classNames as any"
        :styles="props.styles as any"
        :unstyled="props.unstyled"
        @update:model-value="setComposerDraft($event)"
        @update:reply-to="emit('update:replyTo', $event)"
        @typing="emit('typing', $event)"
        @send="handleSend"
        @attachments-add="emit('attachmentsAdd', $event)"
        @attachments-reject="emit('attachmentsReject', $event)"
        @attachment-remove="emit('attachmentRemove', $event)"
        @attachment-retry="emit('attachmentRetry', $event)"
        @attachment-cancel="emit('attachmentCancel', $event)"
        @validation-error="emit('validationError', $event)"
        @retry-send="emit('retrySend')"
        @templates-retry-load="emit('templatesRetryLoad')"
      >
        <template v-if="slots.composerPrefix" #composerPrefix>
          <slot name="composerPrefix" />
        </template>
        <template v-if="slots.composerSuffix" #composerSuffix>
          <slot name="composerSuffix" />
        </template>
        <template v-if="slots.composerActions" #composerActions>
          <slot name="composerActions" />
        </template>
        <template v-if="slots.emojiPicker" #emojiPicker="emojiProps">
          <slot name="emojiPicker" v-bind="emojiProps" />
        </template>
        <template v-if="slots.attachmentPreview" #attachmentPreview="attachmentProps">
          <slot name="attachmentPreview" v-bind="attachmentProps" />
        </template>
        <template v-if="slots.templatePreview" #templatePreview="templateProps">
          <slot name="templatePreview" v-bind="templateProps" />
        </template>
      </WhatsAppComposer>
    </template>
  </Box>
</template>
