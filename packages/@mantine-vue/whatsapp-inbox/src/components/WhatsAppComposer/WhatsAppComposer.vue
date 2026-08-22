<script lang="ts">
const defaultProps = {
  sendOnEnter: true,
  withEmojiPicker: true,
  minRows: 1,
  maxRows: 6,
  withCharacterCount: true,
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useSlots } from 'vue'
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  FileButton,
  Loader,
  Modal,
  Popover,
  Textarea,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { useResolvedCapabilities, useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import type { WhatsAppEmoji } from '../../emoji'
import type {
  WhatsAppInteractiveContent,
  WhatsAppOutgoingMessage,
  WhatsAppUpload,
} from '../../types'
import { createClientId, getAcceptAttribute, validateFiles } from '../../utils'
import { WhatsAppAttachmentPreview } from '../WhatsAppAttachmentPreview'
import { WhatsAppEmojiPicker } from '../WhatsAppEmojiPicker'
import { WhatsAppInteractiveMessageEditor } from '../WhatsAppInteractiveMessageEditor'
import { WhatsAppMessagingWindowNotice } from '../WhatsAppMessagingWindowNotice'
import { WhatsAppTemplateSelector } from '../WhatsAppTemplateSelector'
import type { WhatsAppTemplateSubmitPayload } from '../WhatsAppTemplateSelector'
import type {
  WhatsAppComposerEmits,
  WhatsAppComposerOwnProps,
  WhatsAppComposerSlots,
} from './WhatsAppComposer.types'
import classes from './WhatsAppComposer.module.css'

defineOptions({
  name: 'WhatsAppComposer',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppComposerOwnProps>(), {
  conversationId: undefined,
  modelValue: undefined,
  defaultValue: undefined,
  capabilities: undefined,
  uploads: undefined,
  templates: undefined,
  templatesLoading: undefined,
  templatesError: undefined,
  templatesOpened: undefined,
  interactiveOpened: undefined,
  sending: undefined,
  disabled: undefined,
  error: undefined,
  replyTo: undefined,
  placeholder: undefined,
  sendOnEnter: undefined,
  minRows: undefined,
  maxRows: undefined,
  autofocus: undefined,
  withAttachments: undefined,
  withTemplates: undefined,
  withEmoji: undefined,
  withEmojiPicker: undefined,
  emojiPickerProps: undefined,
  withInteractive: undefined,
  withCharacterCount: undefined,
  templateModalProps: undefined,
  interactiveModalProps: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppComposerEmits>()
defineSlots<WhatsAppComposerSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppComposer', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const capabilities = useResolvedCapabilities(() => props.capabilities)

const getStyles = useStyles({
  name: 'WhatsAppComposer',
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
  rootSelector: 'composerRoot',
})

const [text, setText] = useUncontrolled<string>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: '',
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('typing', value)
  },
})

const [templatesOpened, setTemplatesOpened] = useUncontrolled<boolean>({
  value: () => props.templatesOpened,
  finalValue: false,
  onChange: (value) => emit('update:templatesOpened', value),
})

const [interactiveOpened, setInteractiveOpened] = useUncontrolled<boolean>({
  value: () => props.interactiveOpened,
  finalValue: false,
  onChange: (value) => emit('update:interactiveOpened', value),
})

const inputElement = ref<HTMLTextAreaElement | null>(null)

/**
 * `Textarea.rootRef` provides the native element needed for caret-aware emoji insertion.
 */
const setInputElement = (node: Element | null) => {
  inputElement.value = node as HTMLTextAreaElement | null
}
const emojiOpened = ref(false)
const validationMessage = ref<string | null>(null)
const interactiveDraft = ref<WhatsAppInteractiveContent | undefined>(undefined)

const uploads = computed<WhatsAppUpload[]>(() => props.uploads ?? [])
const readyAttachments = computed(() =>
  uploads.value
    .filter((upload) => upload.status === 'uploaded' && upload.attachment)
    .map((upload) => upload.attachment!),
)
const uploadsInFlight = computed(() =>
  uploads.value.some((upload) => upload.status === 'pending' || upload.status === 'uploading'),
)

/**
 * Explicit `with*` props win over the capabilities so a single screen can hide a control the
 * backend would otherwise allow; when they are unset the capabilities decide, which is the
 * normal path.
 */
const showAttachments = computed(() => props.withAttachments ?? capabilities.value.canSendMedia)
const showTemplates = computed(() => props.withTemplates ?? capabilities.value.canSendTemplates)
const useCustomPicker = computed(() => Boolean(slots.emojiPicker))
const useBuiltInPicker = computed(() => !useCustomPicker.value && props.withEmojiPicker !== false)

/*
 * The control needs the capability and something to put in the popover. With the built-in picker
 * turned off and no slot supplied there is nothing to show, so the button stays hidden rather
 * than opening an empty popover.
 */
const showEmoji = computed(
  () =>
    (props.withEmoji ?? capabilities.value.canUseEmoji) &&
    (useCustomPicker.value || useBuiltInPicker.value),
)
const showInteractive = computed(
  () =>
    props.withInteractive ??
    (capabilities.value.canSendInteractive && capabilities.value.interactiveTypes.length > 0),
)

const windowClosed = computed(() => capabilities.value.windowClosed)

const inputDisabled = computed(() => Boolean(props.disabled) || !capabilities.value.canSendFreeForm)

const maxTextLength = computed(() => capabilities.value.maxTextLength)
const exceeded = computed(
  () => maxTextLength.value !== undefined && text.value.length > maxTextLength.value,
)

const hasContent = computed(() => text.value.trim().length > 0 || readyAttachments.value.length > 0)

const canSend = computed(
  () =>
    !props.disabled &&
    !props.sending &&
    !uploadsInFlight.value &&
    !exceeded.value &&
    hasContent.value &&
    (capabilities.value.canSendFreeForm || readyAttachments.value.length > 0),
)

const placeholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder
  }

  if (windowClosed.value) {
    return config.labels.windowClosedTitle
  }

  if (inputDisabled.value) {
    return capabilities.value.disabledReason ?? config.labels.composerDisabled
  }

  return config.labels.composerPlaceholder
})

const acceptAttribute = computed(() =>
  getAcceptAttribute(capabilities.value.allowedMediaTypes, capabilities.value.mediaConstraints),
)

function focus() {
  inputElement.value?.focus()
}

/** Inserts at the caret so an emoji lands where the user is typing, not at the end. */
function insert(value: string) {
  const element = inputElement.value

  if (!element) {
    setText(text.value + value)
    return
  }

  const start = element.selectionStart ?? text.value.length
  const end = element.selectionEnd ?? start

  setText(`${text.value.slice(0, start)}${value}${text.value.slice(end)}`)

  void nextTick(() => {
    element.focus()
    const caret = start + value.length
    element.setSelectionRange(caret, caret)
  })
}

function selectEmoji(emoji: WhatsAppEmoji) {
  // Keep the popover open so users can insert multiple emoji.
  insert(emoji.emoji)
}

function openTemplates() {
  setTemplatesOpened(true)
}

function fail(message: string) {
  validationMessage.value = message
  emit('validationError', message)
}

function basePayload() {
  return {
    conversationId: props.conversationId ?? '',
    clientId: createClientId(),
    replyTo: props.replyTo?.id,
  }
}

function clearDraft() {
  validationMessage.value = null
  setText('')
  emit('update:replyTo', null)
}

function send() {
  if (props.disabled || props.sending) {
    return
  }

  if (uploadsInFlight.value) {
    fail(config.labels.uploading)
    return
  }

  if (exceeded.value && maxTextLength.value !== undefined) {
    fail(config.labels.messageTooLong(maxTextLength.value))
    return
  }

  if (!hasContent.value) {
    fail(config.labels.emptyMessage)
    return
  }

  const payload: WhatsAppOutgoingMessage =
    readyAttachments.value.length > 0
      ? {
          ...basePayload(),
          kind: 'media',
          attachments: readyAttachments.value,
          caption: text.value.trim() || undefined,
        }
      : { ...basePayload(), kind: 'text', text: text.value.trim() }

  emit('send', payload)
  clearDraft()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || !props.sendOnEnter) {
    return
  }

  // Shift+Enter is a newline, and IME composition must never be interrupted by a send.
  if (event.shiftKey || event.isComposing) {
    return
  }

  event.preventDefault()
  send()
}

function handleFiles(picked: File | File[] | null) {
  const files = picked === null ? [] : Array.isArray(picked) ? picked : [picked]

  if (files.length === 0) {
    return
  }

  const { accepted, rejected } = validateFiles({
    files,
    allowedMediaTypes: capabilities.value.allowedMediaTypes,
    constraints: capabilities.value.mediaConstraints,
    existingCount: uploads.value.length,
    labels: config.labels,
  })

  if (rejected.length > 0) {
    emit('attachmentsReject', rejected)
    fail(rejected[0].message)
  }

  if (accepted.length > 0) {
    validationMessage.value = rejected.length > 0 ? validationMessage.value : null
    emit('attachmentsAdd', {
      conversationId: props.conversationId,
      files: accepted,
      rejected,
    })
  }
}

function submitTemplate({ template, values }: WhatsAppTemplateSubmitPayload) {
  emit('send', {
    ...basePayload(),
    kind: 'template',
    templateId: template.id,
    name: template.name,
    language: template.language,
    values,
    template,
  })

  setTemplatesOpened(false)
  emit('update:replyTo', null)
}

function submitInteractive(interactive: WhatsAppInteractiveContent) {
  emit('send', { ...basePayload(), kind: 'interactive', interactive })
  setInteractiveOpened(false)
  interactiveDraft.value = undefined
  emit('update:replyTo', null)
}

const errorMessage = computed(() => props.error || validationMessage.value)

defineExpose({ focus, insert, openTemplates })
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('composerRoot') }">
    <WhatsAppMessagingWindowNotice
      v-bind="getStyles('composerNotice')"
      :messaging-window="capabilities.messagingWindow"
      :templates-available="showTemplates"
      :labels="props.labels"
      :class-names="props.classNames as any"
      :styles="props.styles as any"
      :unstyled="props.unstyled"
      @template-action="openTemplates"
    />

    <Alert
      v-if="!windowClosed && capabilities.disabledReason"
      v-bind="getStyles('composerNotice')"
      color="gray"
      variant="light"
    >
      {{ capabilities.disabledReason }}
    </Alert>

    <Box v-if="props.replyTo" v-bind="getStyles('composerReply')">
      <WhatsAppIcon name="reply" size="16" />
      <Box v-bind="getStyles('composerReplyBody')">
        <Box v-bind="getStyles('composerReplyAuthor')">
          {{ props.replyTo.author ?? config.labels.replyingTo }}
        </Box>
        <Box v-bind="getStyles('composerReplyText')">{{ props.replyTo.text }}</Box>
      </Box>
      <ActionIcon
        variant="subtle"
        color="gray"
        size="sm"
        :aria-label="config.labels.cancelReply"
        @click="emit('update:replyTo', null)"
      >
        <WhatsAppIcon name="close" size="16" />
      </ActionIcon>
    </Box>

    <Box
      v-if="uploads.length > 0"
      v-bind="getStyles('composerAttachments')"
      :aria-label="config.labels.attachmentsLabel"
      role="group"
    >
      <template v-for="upload in uploads" :key="upload.id">
        <slot v-if="slots.attachmentPreview" name="attachmentPreview" :upload="upload" />
        <WhatsAppAttachmentPreview
          v-else
          :upload="upload"
          :labels="props.labels"
          :class-names="props.classNames as any"
          :styles="props.styles as any"
          :unstyled="props.unstyled"
          @remove="emit('attachmentRemove', $event)"
          @retry="emit('attachmentRetry', $event)"
          @cancel="emit('attachmentCancel', $event)"
        />
      </template>
    </Box>

    <Alert
      v-if="errorMessage"
      v-bind="getStyles('composerError')"
      color="red"
      variant="light"
      role="alert"
      :with-close-button="!props.error"
      @close="validationMessage = null"
    >
      {{ errorMessage }}
      <Button
        v-if="props.error"
        ml="sm"
        size="compact-xs"
        variant="light"
        color="red"
        @click="emit('retrySend')"
      >
        {{ config.labels.retry }}
      </Button>
    </Alert>

    <Box v-bind="getStyles('composerInputRow')">
      <slot v-if="slots.composerActions" name="composerActions" />

      <template v-else>
        <Box v-bind="getStyles('composerActions')">
          <FileButton
            v-if="showAttachments"
            multiple
            :accept="acceptAttribute"
            :disabled="props.disabled || !capabilities.canSendMedia"
            @change="handleFiles"
          >
            <template #default="fileProps">
              <ActionIcon
                v-bind="{ ...fileProps, ...getStyles('composerAction') }"
                variant="subtle"
                color="gray"
                :disabled="props.disabled || !capabilities.canSendMedia"
                :aria-label="config.labels.attachFile"
              >
                <WhatsAppIcon name="paperclip" size="20" />
              </ActionIcon>
            </template>
          </FileButton>

          <Popover
            v-if="showEmoji"
            v-model:opened="emojiOpened"
            position="top-start"
            trap-focus
            shadow="md"
          >
            <Popover.Target>
              <ActionIcon
                v-bind="getStyles('composerAction')"
                variant="subtle"
                color="gray"
                :disabled="inputDisabled"
                :aria-label="config.labels.emoji"
                :aria-expanded="emojiOpened"
                @click="emojiOpened = !emojiOpened"
              >
                <WhatsAppIcon name="emoji" size="20" />
              </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown p="xs">
              <slot
                v-if="useCustomPicker"
                name="emojiPicker"
                :insert="insert"
                :close="() => (emojiOpened = false)"
              />

              <WhatsAppEmojiPicker
                v-else
                v-bind="props.emojiPickerProps"
                :labels="props.labels"
                :class-names="props.classNames as any"
                :styles="props.styles as any"
                :unstyled="props.unstyled"
                @select="selectEmoji"
              />
            </Popover.Dropdown>
          </Popover>
        </Box>

        <slot name="composerPrefix" />

        <Textarea
          v-bind="getStyles('composerInput')"
          :model-value="text"
          :placeholder="placeholder"
          :aria-label="config.labels.composerLabel"
          :disabled="inputDisabled"
          :maxlength="maxTextLength"
          :autofocus="props.autofocus"
          :min-rows="props.minRows"
          :max-rows="props.maxRows"
          autosize
          :root-ref="setInputElement"
          @update:model-value="setText($event)"
          @keydown="handleKeydown"
        />

        <slot name="composerSuffix" />

        <Box v-bind="getStyles('composerActions')">
          <ActionIcon
            v-if="showTemplates"
            v-bind="getStyles('composerAction')"
            variant="subtle"
            color="gray"
            :disabled="props.disabled || !capabilities.canSendTemplates"
            :aria-label="config.labels.templates"
            @click="openTemplates"
          >
            <WhatsAppIcon name="template" size="20" />
          </ActionIcon>

          <ActionIcon
            v-if="showInteractive"
            v-bind="getStyles('composerAction')"
            variant="subtle"
            color="gray"
            :disabled="props.disabled || !capabilities.canSendInteractive"
            :aria-label="config.labels.interactiveMessage"
            @click="setInteractiveOpened(true)"
          >
            <WhatsAppIcon name="interactive" size="20" />
          </ActionIcon>

          <ActionIcon
            v-bind="getStyles('composerSend')"
            variant="filled"
            radius="xl"
            :disabled="!canSend"
            :aria-label="props.sending ? config.labels.sending : config.labels.send"
            @click="send"
          >
            <Loader v-if="props.sending" size="xs" color="white" />
            <WhatsAppIcon v-else name="send" size="18" />
          </ActionIcon>
        </Box>
      </template>
    </Box>

    <Box
      v-if="props.withCharacterCount && maxTextLength !== undefined"
      v-bind="getStyles('composerFooter')"
    >
      <Box
        component="span"
        v-bind="getStyles('composerCount')"
        :data-exceeded="exceeded ? '' : undefined"
        aria-live="polite"
      >
        {{ config.labels.characterCount(text.length, maxTextLength) }}
      </Box>
    </Box>

    <Modal
      v-bind="props.templateModalProps"
      :opened="templatesOpened"
      :title="config.labels.templateSelectorTitle"
      size="lg"
      @close="setTemplatesOpened(false)"
    >
      <WhatsAppTemplateSelector
        :templates="props.templates"
        :loading="props.templatesLoading"
        :error="props.templatesError"
        :labels="props.labels"
        :class-names="props.classNames as any"
        :styles="props.styles as any"
        :unstyled="props.unstyled"
        @submit="submitTemplate"
        @retry-load="emit('templatesRetryLoad')"
      >
        <template v-if="slots.templatePreview" #templatePreview="previewProps">
          <slot name="templatePreview" v-bind="previewProps" />
        </template>
      </WhatsAppTemplateSelector>
    </Modal>

    <Modal
      v-bind="props.interactiveModalProps"
      :opened="interactiveOpened"
      :title="config.labels.interactiveTitle"
      size="lg"
      @close="setInteractiveOpened(false)"
    >
      <WhatsAppInteractiveMessageEditor
        v-model="interactiveDraft"
        :interactive-types="capabilities.interactiveTypes"
        :labels="props.labels"
        :class-names="props.classNames as any"
        :styles="props.styles as any"
        :unstyled="props.unstyled"
        @submit="submitInteractive"
        @cancel="setInteractiveOpened(false)"
      />
    </Modal>
  </Box>
</template>
