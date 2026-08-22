<script lang="ts">
const defaultProps = {
  withCloseButton: false,
  withHeader: true,
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Anchor, Avatar, Badge, Box, CloseButton, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import type { WhatsAppContactPanelSlots } from '../../component-props'
import type { WhatsAppContactField } from '../../types'
import type {
  WhatsAppContactPanelEmits,
  WhatsAppContactPanelOwnProps,
} from './WhatsAppContactPanel.types'
import classes from './WhatsAppContactPanel.module.css'

defineOptions({
  name: 'WhatsAppContactPanel',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppContactPanelOwnProps>(), {
  contact: undefined,
  conversation: undefined,
  withCloseButton: undefined,
  withHeader: undefined,
  title: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppContactPanelEmits>()
defineSlots<WhatsAppContactPanelSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppContactPanel', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppContactPanel',
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
  rootSelector: 'contactPanelRoot',
})

const contact = computed(() => props.contact ?? props.conversation?.contact)

const displayName = computed(
  () => contact.value?.name || contact.value?.phoneNumber || contact.value?.id || '',
)

/**
 * The built-in rows and the consumer's own `fields`, flattened into one list so the panel does
 * not have to special-case which of them exist.
 */
const fields = computed<WhatsAppContactField[]>(() => {
  const current = contact.value

  if (!current) {
    return []
  }

  const result: WhatsAppContactField[] = []

  if (current.phoneNumber) {
    result.push({
      key: 'phone',
      label: config.labels.contactPhoneNumber,
      value: current.phoneNumber,
      href: `tel:${current.phoneNumber.replace(/\s/g, '')}`,
    })
  }

  if (current.email) {
    result.push({
      key: 'email',
      label: config.labels.contactEmail,
      value: current.email,
      href: `mailto:${current.email}`,
    })
  }

  if (current.about) {
    result.push({ key: 'about', label: config.labels.contactAbout, value: current.about })
  }

  if (props.conversation?.status) {
    result.push({
      key: 'status',
      label: config.labels.contactStatus,
      value: String(props.conversation.status),
    })
  }

  if (props.conversation?.assignee) {
    result.push({
      key: 'assignee',
      label: config.labels.contactAssignee,
      value: props.conversation.assignee.name,
    })
  }

  return [...result, ...(current.fields ?? [])]
})
</script>

<template>
  <Box
    component="aside"
    v-bind="{ ...attrs, ...getStyles('contactPanelRoot') }"
    :aria-label="props.title ?? config.labels.contactPanelTitle"
  >
    <Box v-if="props.withHeader" v-bind="getStyles('contactPanelHeader')">
      <Box v-bind="getStyles('contactPanelTitle')">
        {{ props.title ?? config.labels.contactPanelTitle }}
      </Box>
      <CloseButton
        v-if="props.withCloseButton"
        :aria-label="config.labels.close"
        @click="emit('close')"
      />
    </Box>

    <Box v-if="!contact" v-bind="getStyles('contactPanelEmpty')">
      {{ config.labels.noConversationSelected }}
    </Box>

    <template v-else>
      <slot v-if="slots.contactPanel" name="contactPanel" :contact="contact" />

      <Box v-else v-bind="getStyles('contactPanelBody')">
        <slot name="contactPanelHeader" :contact="contact" />

        <Box v-bind="getStyles('contactPanelIdentity')">
          <Avatar
            :src="contact.avatarUrl"
            :name="displayName"
            color="initials"
            radius="xl"
            size="xl"
            aria-hidden="true"
          />
          <Box v-bind="getStyles('contactPanelName')">{{ displayName }}</Box>
          <Box
            v-if="contact.phoneNumber && contact.phoneNumber !== displayName"
            v-bind="getStyles('contactPanelPhone')"
          >
            {{ contact.phoneNumber }}
          </Box>
        </Box>

        <Box v-if="contact.tags?.length" v-bind="getStyles('contactPanelField')">
          <Box v-bind="getStyles('contactPanelFieldLabel')">{{ config.labels.contactTags }}</Box>
          <Box v-bind="getStyles('contactPanelTags')">
            <Badge v-for="tag in contact.tags" :key="tag" size="sm" variant="light">
              {{ tag }}
            </Badge>
          </Box>
        </Box>

        <Box v-for="field in fields" :key="field.key" v-bind="getStyles('contactPanelField')">
          <Box v-bind="getStyles('contactPanelFieldLabel')">{{ field.label }}</Box>
          <Box v-bind="getStyles('contactPanelFieldValue')">
            <Anchor v-if="field.href" :href="field.href" size="sm">{{ field.value }}</Anchor>
            <template v-else>{{ field.value }}</template>
          </Box>
        </Box>
      </Box>

      <Box v-if="slots.contactPanelFooter" v-bind="getStyles('contactPanelFooter')">
        <slot name="contactPanelFooter" :contact="contact" />
      </Box>
    </template>
  </Box>
</template>
