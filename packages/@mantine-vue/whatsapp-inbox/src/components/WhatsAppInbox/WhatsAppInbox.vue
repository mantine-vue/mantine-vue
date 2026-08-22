<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'

const defaultProps = {
  layout: 'auto',
  narrowBreakpoint: 720,
  order: 'none',
  withContactPanel: false,
} as const

function toCssWidth(value: string | number | undefined) {
  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? `${value}px` : value
}

const varsResolver = createVarsResolver<any>((_, { sidebarWidth, contactPanelWidth }) => ({
  inboxRoot: {
    '--wa-sidebar-width': toCssWidth(sidebarWidth),
    '--wa-panel-width': toCssWidth(contactPanelWidth),
  },
}))

export { defaultProps, toCssWidth, varsResolver }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { useResizeObserver, useUncontrolled } from '@mantine-vue/hooks'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import type {
  WhatsAppAttachment,
  WhatsAppConversationSummary,
  WhatsAppMessageData,
} from '../../types'
import { WhatsAppContactPanel } from '../WhatsAppContactPanel'
import { WhatsAppConversation } from '../WhatsAppConversation'
import type { WhatsAppConversationExposed } from '../WhatsAppConversation'
import { WhatsAppConversationList } from '../WhatsAppConversationList'
import type {
  WhatsAppInboxEmits,
  WhatsAppInboxOwnProps,
  WhatsAppInboxSlots,
} from './WhatsAppInbox.types'
import classes from './WhatsAppInbox.module.css'

defineOptions({
  name: 'WhatsAppInbox',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppInboxOwnProps>(), {
  conversations: undefined,
  selectedConversationId: undefined,
  defaultSelectedConversationId: undefined,
  conversation: undefined,
  filters: undefined,
  defaultFilters: undefined,
  filtersConfig: undefined,
  conversationsLoading: undefined,
  conversationsError: undefined,
  conversationsPagination: undefined,
  order: undefined,
  layout: undefined,
  narrowBreakpoint: undefined,
  sidebarWidth: undefined,
  contactPanelWidth: undefined,
  withContactPanel: undefined,
  contactPanelOpened: undefined,
  defaultContactPanelOpened: undefined,
  conversationListProps: undefined,
  contactPanelProps: undefined,
  withNewConversation: undefined,
  newConversationOpened: undefined,
  newConversationCreating: undefined,
  newConversationError: undefined,
  validatePhoneNumber: undefined,
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

const emit = defineEmits<WhatsAppInboxEmits>()
defineSlots<WhatsAppInboxSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppInbox', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppInbox',
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
  varsResolver,
  rootSelector: 'inboxRoot',
})

const [selectedId, setSelectedId] = useUncontrolled<string | null>({
  value: () => props.selectedConversationId,
  defaultValue: props.defaultSelectedConversationId,
  finalValue: null,
  onChange: (value) => emit('update:selectedConversationId', value),
})

const [contactPanelOpened, setContactPanelOpened] = useUncontrolled<boolean>({
  value: () => props.contactPanelOpened,
  defaultValue: props.defaultContactPanelOpened,
  finalValue: false,
  onChange: (value) => emit('update:contactPanelOpened', value),
})

const { ref: rootElement, rect } = useResizeObserver<HTMLElement>()

const setRootElement = (node: Element | null) => {
  rootElement.value = node as HTMLElement | null
}

/**
 * The component measures itself rather than the viewport, so an inbox rendered inside a narrow
 * column collapses even on a wide screen.
 *
 * A width of `0` means nothing has been measured yet (first paint, or an environment without
 * `ResizeObserver`); the split layout is the safer assumption there, since collapsing and then
 * expanding would flash the wrong pane.
 */
const narrow = computed(() => {
  if (props.layout === 'split') {
    return false
  }

  if (props.layout === 'single') {
    return true
  }

  const width = rect.value.width

  return width > 0 && width < (props.narrowBreakpoint ?? defaultProps.narrowBreakpoint)
})

/**
 * The selection is the single source of truth for which conversation is open. `conversation` is
 * only the detail record for it, so passing one does not open it on its own -- otherwise the
 * inbox could not represent "nothing selected" while a previous conversation is still loaded.
 */
const activeConversationId = computed(() => selectedId.value ?? undefined)

const activeConversation = computed(() => {
  if (!activeConversationId.value) {
    return undefined
  }

  if (props.conversation?.id === activeConversationId.value) {
    return props.conversation
  }

  return props.conversations?.find((conversation) => conversation.id === activeConversationId.value)
})

const showSidebar = computed(() => !narrow.value || !activeConversationId.value)
const showConversation = computed(() => !narrow.value || Boolean(activeConversationId.value))
const showContactPanel = computed(
  () => props.withContactPanel && contactPanelOpened.value && !narrow.value,
)

const conversationRef = ref<WhatsAppConversationExposed | null>(null)

function focusComposer() {
  conversationRef.value?.focusComposer()
}

function scrollToBottom(behavior: ScrollBehavior = 'auto') {
  conversationRef.value?.scrollToBottom(behavior)
}

function selectConversation(conversation: WhatsAppConversationSummary) {
  setSelectedId(conversation.id)
  emit('selectConversation', conversation)
}

function goBack() {
  setSelectedId(null)
  emit('back')
}

function handleMediaDownload(attachment: WhatsAppAttachment, message: WhatsAppMessageData) {
  emit('mediaDownload', attachment, message)
}

function handleMediaPreview(attachment: WhatsAppAttachment, message: WhatsAppMessageData) {
  emit('mediaPreview', attachment, message)
}

defineExpose({ focusComposer, scrollToBottom })
</script>

<template>
  <Box
    :root-ref="setRootElement"
    v-bind="{ ...attrs, ...getStyles('inboxRoot') }"
    :data-narrow="narrow ? '' : undefined"
    :data-with-panel="showContactPanel ? '' : undefined"
    :aria-label="config.labels.conversationsLabel"
  >
    <WhatsAppConversationList
      v-if="showSidebar"
      v-bind="{ ...props.conversationListProps, ...getStyles('inboxSidebar') }"
      :conversations="props.conversations"
      :selected-conversation-id="selectedId"
      :filters="props.filters"
      :default-filters="props.defaultFilters"
      :filters-config="props.filtersConfig"
      :loading="props.conversationsLoading"
      :error="props.conversationsError"
      :pagination="props.conversationsPagination"
      :order="props.order"
      :with-new-conversation="props.withNewConversation"
      :new-conversation-opened="props.newConversationOpened"
      :new-conversation-creating="props.newConversationCreating"
      :new-conversation-error="props.newConversationError"
      :validate-phone-number="props.validatePhoneNumber"
      :labels="props.labels"
      :class-names="props.classNames as any"
      :styles="props.styles as any"
      :unstyled="props.unstyled"
      @update:selected-conversation-id="setSelectedId($event)"
      @update:filters="emit('update:filters', $event)"
      @select="selectConversation"
      @load-more="emit('loadMoreConversations', $event)"
      @retry-load="emit('retryLoadConversations')"
      @update:new-conversation-opened="emit('update:newConversationOpened', $event)"
      @new-conversation="emit('newConversation', $event)"
    >
      <template v-if="slots.listHeader" #listHeader><slot name="listHeader" /></template>
      <template v-if="slots.listFooter" #listFooter><slot name="listFooter" /></template>
      <template v-if="slots.filters" #filters><slot name="filters" /></template>
      <template v-if="slots.conversationItem" #conversationItem="itemProps">
        <slot name="conversationItem" v-bind="itemProps" />
      </template>
      <template v-if="slots.conversationAvatar" #conversationAvatar="avatarProps">
        <slot name="conversationAvatar" v-bind="avatarProps" />
      </template>
      <template v-if="slots.conversationPreview" #conversationPreview="previewProps">
        <slot name="conversationPreview" v-bind="previewProps" />
      </template>
      <template v-if="slots.emptyInbox" #emptyInbox><slot name="emptyInbox" /></template>
      <template v-if="slots.loadingInbox" #loadingInbox><slot name="loadingInbox" /></template>
      <template v-if="slots.errorInbox" #errorInbox="errorProps">
        <slot name="errorInbox" v-bind="errorProps" />
      </template>
    </WhatsAppConversationList>

    <Box v-if="showConversation" v-bind="getStyles('inboxMain')">
      <WhatsAppConversation
        ref="conversationRef"
        :conversation="activeConversation"
        :conversation-id="activeConversationId"
        :capabilities="props.capabilities"
        :messages="props.messages"
        :messages-loading="props.messagesLoading"
        :messages-error="props.messagesError"
        :messages-pagination="props.messagesPagination"
        :uploads="props.uploads"
        :templates="props.templates"
        :templates-loading="props.templatesLoading"
        :templates-error="props.templatesError"
        :draft="props.draft"
        :drafts="props.drafts"
        :default-drafts="props.defaultDrafts"
        :draft-behavior="props.draftBehavior"
        :sending="props.sending"
        :send-error="props.sendError"
        :reply-to="props.replyTo"
        :with-header="props.withHeader"
        :with-composer="props.withComposer"
        :with-back="narrow"
        :with-contact-toggle="props.withContactPanel && !narrow"
        :contact-panel-opened="contactPanelOpened"
        :focus-composer-on-change="props.focusComposerOnChange"
        :header-props="props.headerProps"
        :message-list-props="props.messageListProps"
        :composer-props="props.composerProps"
        :labels="props.labels"
        :render-message="props.renderMessage"
        :render-message-content="props.renderMessageContent"
        :class-names="props.classNames as any"
        :styles="props.styles as any"
        :unstyled="props.unstyled"
        @update:draft="emit('update:draft', $event)"
        @update:drafts="emit('update:drafts', $event)"
        @update:reply-to="emit('update:replyTo', $event)"
        @typing="emit('typing', $event)"
        @send="emit('send', $event)"
        @attachments-add="emit('attachmentsAdd', $event)"
        @attachments-reject="emit('attachmentsReject', $event)"
        @attachment-remove="emit('attachmentRemove', $event)"
        @attachment-retry="emit('attachmentRetry', $event)"
        @attachment-cancel="emit('attachmentCancel', $event)"
        @validation-error="emit('validationError', $event)"
        @retry-send="emit('retrySend')"
        @templates-retry-load="emit('templatesRetryLoad')"
        @load-older-messages="emit('loadOlderMessages', $event)"
        @retry-load-messages="emit('retryLoadMessages')"
        @retry-message="emit('retryMessage', $event)"
        @media-download="handleMediaDownload"
        @media-preview="handleMediaPreview"
        @at-bottom-change="emit('atBottomChange', $event)"
        @contact-click="emit('contactClick', $event)"
        @toggle-contact-panel="setContactPanelOpened($event)"
        @back="goBack"
      >
        <template v-if="slots.conversationHeader" #conversationHeader="headerSlotProps">
          <slot name="conversationHeader" v-bind="headerSlotProps" />
        </template>
        <template v-if="slots.headerActions" #headerActions="headerActionsProps">
          <slot name="headerActions" v-bind="headerActionsProps" />
        </template>
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
      </WhatsAppConversation>
    </Box>

    <WhatsAppContactPanel
      v-if="showContactPanel"
      v-bind="{ ...props.contactPanelProps, ...getStyles('inboxPanel') }"
      :conversation="activeConversation"
      :contact="activeConversation?.contact"
      with-close-button
      :labels="props.labels"
      :class-names="props.classNames as any"
      :styles="props.styles as any"
      :unstyled="props.unstyled"
      @close="setContactPanelOpened(false)"
    >
      <template v-if="slots.contactPanel" #contactPanel="panelProps">
        <slot name="contactPanel" v-bind="panelProps" />
      </template>
      <template v-if="slots.contactPanelHeader" #contactPanelHeader="panelHeaderProps">
        <slot name="contactPanelHeader" v-bind="panelHeaderProps" />
      </template>
      <template v-if="slots.contactPanelFooter" #contactPanelFooter="panelFooterProps">
        <slot name="contactPanelFooter" v-bind="panelFooterProps" />
      </template>
    </WhatsAppContactPanel>
  </Box>
</template>
