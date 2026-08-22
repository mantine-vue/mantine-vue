<script lang="ts">
const defaultProps = {
  withRetry: true,
  withTail: true,
} as const

const MEDIA_TYPES = ['image', 'video', 'audio', 'document', 'sticker'] as const

export { defaultProps, MEDIA_TYPES }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots, type VNodeChild } from 'vue'
import { Anchor, Box, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import type { WhatsAppMessageSlots } from '../../component-props'
import type { WhatsAppAttachment, WhatsAppMediaMessage } from '../../types'
import { WhatsAppMediaAttachment } from '../WhatsAppMediaAttachment'
import { WhatsAppMessageBubble } from '../WhatsAppMessageBubble'
import { WhatsAppTemplatePreview } from '../WhatsAppTemplatePreview'
import type { WhatsAppMessageEmits, WhatsAppMessageOwnProps } from './WhatsAppMessage.types'
import classes from './WhatsAppMessage.module.css'

defineOptions({
  name: 'WhatsAppMessage',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppMessageOwnProps>(), {
  withRetry: undefined,
  withTail: undefined,
  maxWidth: undefined,
  labels: undefined,
  renderMessage: undefined,
  renderMessageContent: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppMessageEmits>()
defineSlots<WhatsAppMessageSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppMessage', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppMessage',
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
  rootSelector: 'messageRoot',
})

const message = computed(() => props.message)

/**
 * The union is narrowed here rather than in the template: a `v-if` chain whose branches test
 * different expressions gives `vue-tsc` nothing to narrow on, so each variant is resolved once
 * into a typed computed and the template only reads the one that matches.
 */
const mediaMessage = computed(() =>
  (MEDIA_TYPES as readonly string[]).includes(message.value.type)
    ? (message.value as WhatsAppMediaMessage)
    : undefined,
)

const textContent = computed(() =>
  message.value.type === 'text' || message.value.type === 'system' ? message.value.text : undefined,
)

const templateInstance = computed(() =>
  message.value.type === 'template' ? message.value.template : undefined,
)

const interactiveMessage = computed(() =>
  message.value.type === 'interactive' ? message.value : undefined,
)

const locationMessage = computed(() =>
  message.value.type === 'location' ? message.value : undefined,
)

const contactCards = computed(() =>
  message.value.type === 'contacts' ? message.value.contacts : undefined,
)

const unsupportedText = computed(() =>
  message.value.type === 'unsupported'
    ? message.value.text || config.labels.messageTypeUnsupported
    : config.labels.messageTypeUnsupported,
)

/**
 * Returning `undefined` from `renderMessage` uses the built-in renderer.
 */
const customMessage = computed<VNodeChild>(() => props.renderMessage?.(message.value) ?? null)
const renderCustomMessage = () => customMessage.value

const customContent = computed<VNodeChild>(
  () => props.renderMessageContent?.(message.value) ?? null,
)
const renderCustomContent = () => customContent.value

const hasCustomFooter = computed(() => Boolean(slots.messageFooter))

function handleMediaDownload(attachment: WhatsAppAttachment) {
  emit('mediaDownload', attachment, message.value)
}

function handleMediaPreview(attachment: WhatsAppAttachment) {
  emit('mediaPreview', attachment, message.value)
}

const locationHref = computed(() => {
  const location = locationMessage.value?.location

  if (!location) {
    return undefined
  }

  return (
    location.url ??
    `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}`
  )
})
</script>

<template>
  <component :is="renderCustomMessage" v-if="customMessage" />

  <WhatsAppMessageBubble
    v-else
    v-bind="{ ...attrs, ...getStyles('messageRoot') }"
    :direction="message.direction"
    :variant="message.type === 'system' ? 'system' : 'bubble'"
    :status="message.type === 'system' ? undefined : message.status"
    :timestamp="message.timestamp"
    :author="message.author"
    :reply-to="message.replyTo"
    :forwarded="message.forwarded"
    :error="message.error"
    :with-retry="props.withRetry"
    :reactions="message.reactions"
    :with-tail="props.withTail"
    :max-width="props.maxWidth"
    :labels="props.labels"
    :class-names="props.classNames as any"
    :styles="props.styles as any"
    :unstyled="props.unstyled"
    :data-message-id="message.id"
    :data-message-type="message.type"
    @retry="emit('retry', message)"
  >
    <slot v-if="slots.messageContent" name="messageContent" :message="message" />

    <component :is="renderCustomContent" v-else-if="customContent" />

    <template v-else-if="textContent !== undefined">{{ textContent }}</template>

    <template v-else-if="mediaMessage">
      <slot
        v-if="slots.mediaAttachment"
        name="mediaAttachment"
        :attachment="mediaMessage.attachment"
        :message="message"
      />
      <WhatsAppMediaAttachment
        v-else
        :attachment="mediaMessage.attachment"
        :direction="message.direction"
        :labels="props.labels"
        :class-names="props.classNames as any"
        :styles="props.styles as any"
        :unstyled="props.unstyled"
        @download="handleMediaDownload"
        @preview="handleMediaPreview"
      />

      <Box v-if="mediaMessage.caption" v-bind="getStyles('messageCaption')">
        {{ mediaMessage.caption }}
      </Box>
    </template>

    <WhatsAppTemplatePreview
      v-else-if="templateInstance"
      :template="templateInstance.template"
      :values="templateInstance.values"
      :fallback-text="templateInstance.text ?? templateInstance.name"
      :labels="props.labels"
      :class-names="props.classNames as any"
      :styles="props.styles as any"
      :unstyled="props.unstyled"
    />

    <Box v-else-if="interactiveMessage" v-bind="getStyles('messageInteractive')">
      <Box v-if="interactiveMessage.reply" v-bind="getStyles('messageInteractiveReply')">
        {{ interactiveMessage.reply.title ?? interactiveMessage.reply.id }}
      </Box>

      <Box v-bind="getStyles('messageInteractiveBody')">
        {{ interactiveMessage.interactive.body }}
      </Box>

      <Box
        v-if="interactiveMessage.interactive.footer"
        v-bind="getStyles('messageInteractiveFooter')"
      >
        {{ interactiveMessage.interactive.footer }}
      </Box>

      <Box
        v-if="interactiveMessage.interactive.type === 'button'"
        v-bind="getStyles('messageInteractiveButtons')"
      >
        <Box
          v-for="button in interactiveMessage.interactive.buttons"
          :key="button.id"
          v-bind="getStyles('messageInteractiveButton')"
        >
          <WhatsAppIcon name="reply" size="14" />
          {{ button.title }}
        </Box>
      </Box>

      <Box
        v-else-if="interactiveMessage.interactive.type === 'cta_url'"
        v-bind="getStyles('messageInteractiveButtons')"
      >
        <Anchor
          v-bind="getStyles('messageInteractiveButton')"
          :href="interactiveMessage.interactive.action.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon name="externalLink" size="14" />
          {{ interactiveMessage.interactive.action.displayText }}
        </Anchor>
      </Box>

      <Box
        v-else-if="interactiveMessage.interactive.type === 'list'"
        v-bind="getStyles('messageInteractiveButtons')"
      >
        <Box v-bind="getStyles('messageInteractiveButton')">
          <WhatsAppIcon name="interactive" size="14" />
          {{ interactiveMessage.interactive.button }}
        </Box>
      </Box>
    </Box>

    <Box v-else-if="locationMessage" v-bind="getStyles('messageLocation')">
      <WhatsAppIcon name="mapPin" size="18" />
      <Box>
        <Box v-if="locationMessage.location.name" v-bind="getStyles('messageLocationName')">
          {{ locationMessage.location.name }}
        </Box>
        <Box v-if="locationMessage.location.address" v-bind="getStyles('messageLocationAddress')">
          {{ locationMessage.location.address }}
        </Box>
        <Anchor :href="locationHref" target="_blank" rel="noopener noreferrer" size="xs">
          {{ config.labels.openInNewTab }}
        </Anchor>
      </Box>
    </Box>

    <template v-else-if="contactCards">
      <Box
        v-for="(contact, index) in contactCards"
        :key="`${contact.name}-${index}`"
        v-bind="getStyles('messageContactCard')"
      >
        <WhatsAppIcon name="user" size="18" />
        <Box>
          <Box v-bind="getStyles('messageContactName')">{{ contact.name }}</Box>
          <Box
            v-for="phoneNumber in contact.phoneNumbers ?? []"
            :key="phoneNumber"
            v-bind="getStyles('messageContactDetail')"
          >
            {{ phoneNumber }}
          </Box>
        </Box>
      </Box>
    </template>

    <Box v-else v-bind="getStyles('messageUnsupported')">{{ unsupportedText }}</Box>

    <template v-if="hasCustomFooter" #footer>
      <slot name="messageFooter" :message="message" />
    </template>
  </WhatsAppMessageBubble>
</template>
