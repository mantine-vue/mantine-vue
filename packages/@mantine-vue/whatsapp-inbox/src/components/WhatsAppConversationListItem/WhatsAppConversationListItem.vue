<script lang="ts">
const defaultProps = {
  selected: false,
  withUnreadBadge: true,
  withStatus: true,
  withPhoneNumber: true,
  withLabels: true,
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Avatar, Badge, Box, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import { getContactDisplayName, getConversationPreviewText } from '../../utils'
import { WhatsAppMessageStatus } from '../WhatsAppMessageStatus'
import type {
  WhatsAppConversationListItemEmits,
  WhatsAppConversationListItemOwnProps,
  WhatsAppConversationListItemSlots,
} from './WhatsAppConversationListItem.types'
import classes from './WhatsAppConversationListItem.module.css'

defineOptions({
  name: 'WhatsAppConversationListItem',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppConversationListItemOwnProps>(), {
  selected: undefined,
  withUnreadBadge: undefined,
  withStatus: undefined,
  withPhoneNumber: undefined,
  withLabels: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppConversationListItemEmits>()
defineSlots<WhatsAppConversationListItemSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppConversationListItem', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppConversationListItem',
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
  rootSelector: 'conversationItemRoot',
})

const conversation = computed(() => props.conversation)
const slotProps = computed(() => ({
  conversation: conversation.value,
  selected: Boolean(props.selected),
}))

const displayName = computed(() => getContactDisplayName(conversation.value))
const unreadCount = computed(() => conversation.value.unreadCount ?? 0)
const isUnread = computed(() => unreadCount.value > 0)

const timestamp = computed(
  () => conversation.value.lastMessage?.timestamp ?? conversation.value.updatedAt,
)
const timeLabel = computed(() => config.conversationTime(timestamp.value))

const previewText = computed(() =>
  getConversationPreviewText(conversation.value.lastMessage, config.labels),
)

const previewStatus = computed(() =>
  props.withStatus && conversation.value.lastMessage?.direction === 'outbound'
    ? conversation.value.lastMessage.status
    : undefined,
)

/**
 * One accessible name for the whole row. Without it a screen reader would read the name, the
 * time and the preview as three unrelated fragments and never mention the unread count, which
 * is the part that decides whether the row is worth opening.
 */
const accessibleName = computed(() => {
  const parts = [config.labels.conversationItemLabel(displayName.value)]

  if (isUnread.value) {
    parts.push(config.labels.unreadCountLabel(unreadCount.value))
  }

  if (previewText.value) {
    parts.push(previewText.value)
  }

  if (timeLabel.value) {
    parts.push(timeLabel.value)
  }

  return parts.join('. ')
})
</script>

<template>
  <UnstyledButton
    v-bind="{ ...attrs, ...getStyles('conversationItemRoot') }"
    type="button"
    :aria-current="props.selected ? true : undefined"
    :aria-label="accessibleName"
    :data-selected="props.selected ? '' : undefined"
    :data-unread="isUnread ? '' : undefined"
    :data-conversation-id="conversation.id"
    @click="emit('select', conversation)"
  >
    <slot v-if="slots.conversationAvatar" name="conversationAvatar" v-bind="slotProps" />
    <Avatar
      v-else
      v-bind="getStyles('conversationItemAvatar')"
      :src="conversation.contact.avatarUrl"
      :name="displayName"
      color="initials"
      radius="xl"
      size="md"
      aria-hidden="true"
    />

    <Box v-bind="getStyles('conversationItemBody')" aria-hidden="true">
      <Box v-bind="getStyles('conversationItemTopRow')">
        <Box v-bind="getStyles('conversationItemName')">{{ displayName }}</Box>
        <Box v-if="timeLabel" v-bind="getStyles('conversationItemTime')">{{ timeLabel }}</Box>
      </Box>

      <Box
        v-if="
          props.withPhoneNumber && conversation.contact.phoneNumber && conversation.contact.name
        "
        v-bind="getStyles('conversationItemPhone')"
      >
        {{ conversation.contact.phoneNumber }}
      </Box>

      <Box v-bind="getStyles('conversationItemBottomRow')">
        <slot v-if="slots.conversationPreview" name="conversationPreview" v-bind="slotProps" />

        <Box v-else v-bind="getStyles('conversationItemPreview')">
          <WhatsAppMessageStatus
            v-if="previewStatus"
            :status="previewStatus"
            :labels="props.labels"
          />
          <Box v-bind="getStyles('conversationItemPreviewText')">{{ previewText }}</Box>
        </Box>

        <Box
          v-if="conversation.muted || conversation.pinned"
          v-bind="getStyles('conversationItemIndicators')"
        >
          <WhatsAppIcon v-if="conversation.pinned" name="pin" size="14" />
          <WhatsAppIcon v-if="conversation.muted" name="mute" size="14" />
        </Box>

        <Badge
          v-if="props.withUnreadBadge && isUnread"
          v-bind="getStyles('conversationItemUnread')"
          size="sm"
          circle
        >
          {{ unreadCount }}
        </Badge>
      </Box>

      <Box
        v-if="props.withLabels && conversation.labels?.length"
        v-bind="getStyles('conversationItemLabels')"
      >
        <Badge
          v-for="label in conversation.labels"
          :key="label.id"
          size="xs"
          variant="light"
          :color="label.color"
        >
          {{ label.name }}
        </Badge>
      </Box>
    </Box>
  </UnstyledButton>
</template>
