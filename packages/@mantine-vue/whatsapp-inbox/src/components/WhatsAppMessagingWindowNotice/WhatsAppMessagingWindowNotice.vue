<script lang="ts">
const defaultProps = {
  withTemplateAction: true,
  templatesAvailable: true,
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, Button, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import type {
  WhatsAppMessagingWindowNoticeEmits,
  WhatsAppMessagingWindowNoticeOwnProps,
  WhatsAppMessagingWindowNoticeSlots,
} from './WhatsAppMessagingWindowNotice.types'
import classes from './WhatsAppMessagingWindowNotice.module.css'

defineOptions({
  name: 'WhatsAppMessagingWindowNotice',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppMessagingWindowNoticeOwnProps>(), {
  messagingWindow: undefined,
  withTemplateAction: undefined,
  templatesAvailable: undefined,
  title: undefined,
  description: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppMessagingWindowNoticeEmits>()
defineSlots<WhatsAppMessagingWindowNoticeSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppMessagingWindowNotice', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppMessagingWindowNotice',
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
  rootSelector: 'windowNoticeRoot',
})

const closed = computed(() => props.messagingWindow?.state === 'closed')

const title = computed(() => props.title ?? config.labels.windowClosedTitle)

/**
 * Backend copy wins over the built-in sentence: the reason a window is closed is a policy
 * decision the server makes, and it is the only side that can explain it accurately.
 */
const description = computed(
  () => props.description ?? props.messagingWindow?.reason ?? config.labels.windowClosedDescription,
)

const showAction = computed(() => props.withTemplateAction && props.templatesAvailable)
</script>

<template>
  <Box
    v-if="closed"
    v-bind="{ ...attrs, ...getStyles('windowNoticeRoot') }"
    role="status"
    :data-reason-code="props.messagingWindow?.reasonCode"
  >
    <slot v-if="slots.default" :messaging-window="props.messagingWindow!" />

    <template v-else>
      <Box v-bind="getStyles('windowNoticeIcon')">
        <WhatsAppIcon name="lock" size="18" />
      </Box>

      <Box v-bind="getStyles('windowNoticeBody')">
        <Box v-bind="getStyles('windowNoticeTitle')">{{ title }}</Box>
        <Box v-bind="getStyles('windowNoticeDescription')">{{ description }}</Box>
      </Box>

      <Box v-if="slots.action || showAction" v-bind="getStyles('windowNoticeAction')">
        <slot v-if="slots.action" name="action" />
        <Button v-else size="xs" variant="light" @click="emit('templateAction')">
          {{ config.labels.sendTemplateInstead }}
        </Button>
      </Box>
    </template>
  </Box>
</template>
