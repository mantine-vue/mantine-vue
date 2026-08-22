<script lang="ts">
const defaultProps = {
  withBack: false,
  withContactToggle: false,
  contactPanelOpened: false,
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { ActionIcon, Avatar, Box, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import { getContactDisplayName } from '../../utils'
import type {
  WhatsAppConversationHeaderEmits,
  WhatsAppConversationHeaderOwnProps,
  WhatsAppConversationHeaderSlots,
} from './WhatsAppConversationHeader.types'
import classes from './WhatsAppConversationHeader.module.css'

defineOptions({
  name: 'WhatsAppConversationHeader',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppConversationHeaderOwnProps>(), {
  conversation: undefined,
  withBack: undefined,
  withContactToggle: undefined,
  contactPanelOpened: undefined,
  subtitle: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppConversationHeaderEmits>()
defineSlots<WhatsAppConversationHeaderSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppConversationHeader', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppConversationHeader',
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
  rootSelector: 'conversationHeaderRoot',
})

const displayName = computed(() =>
  props.conversation ? getContactDisplayName(props.conversation) : '',
)

const subtitle = computed(() => {
  if (props.subtitle !== undefined) {
    return props.subtitle
  }

  const phoneNumber = props.conversation?.contact.phoneNumber

  return phoneNumber && phoneNumber !== displayName.value ? phoneNumber : ''
})

function openContact() {
  if (props.conversation) {
    emit('contactClick', props.conversation)
  }
}
</script>

<template>
  <Box component="header" v-bind="{ ...attrs, ...getStyles('conversationHeaderRoot') }">
    <slot v-if="slots.default" :conversation="props.conversation" />

    <template v-else>
      <ActionIcon
        v-if="props.withBack"
        v-bind="getStyles('conversationHeaderBack')"
        variant="subtle"
        color="gray"
        :aria-label="config.labels.backToConversations"
        @click="emit('back')"
      >
        <WhatsAppIcon name="arrowLeft" size="20" />
      </ActionIcon>

      <Avatar
        v-if="props.conversation"
        v-bind="getStyles('conversationHeaderAvatar')"
        :src="props.conversation.contact.avatarUrl"
        :name="displayName"
        color="initials"
        radius="xl"
        size="md"
        aria-hidden="true"
      />

      <UnstyledButton
        v-bind="getStyles('conversationHeaderBody')"
        type="button"
        :aria-label="displayName"
        @click="openContact"
      >
        <Box v-bind="getStyles('conversationHeaderName')">{{ displayName }}</Box>
        <Box v-if="subtitle" v-bind="getStyles('conversationHeaderSubtitle')">{{ subtitle }}</Box>
      </UnstyledButton>

      <Box v-bind="getStyles('conversationHeaderActions')">
        <slot name="headerActions" :conversation="props.conversation" />

        <ActionIcon
          v-if="props.withContactToggle"
          variant="subtle"
          color="gray"
          :aria-label="config.labels.contactPanelToggle"
          :aria-expanded="props.contactPanelOpened"
          @click="emit('toggleContactPanel', !props.contactPanelOpened)"
        >
          <WhatsAppIcon name="info" size="20" />
        </ActionIcon>
      </Box>
    </template>
  </Box>
</template>
