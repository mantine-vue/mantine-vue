<script lang="ts">
import { createVarsResolver, getRadius } from '@mantine-vue/core'

const defaultProps = {
  variant: 'bubble',
  withTail: true,
  withRetry: true,
  radius: 'lg',
  maxWidth: '75%',
} as const

const varsResolver = createVarsResolver<any>((_, { radius, maxWidth }) => ({
  bubbleRoot: {
    '--wa-bubble-radius': radius === undefined ? undefined : getRadius(radius),
    '--wa-bubble-max-width':
      maxWidth === undefined
        ? undefined
        : typeof maxWidth === 'number'
          ? `${maxWidth}px`
          : maxWidth,
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, Button, useProps, useStyles, VisuallyHidden } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import { WhatsAppMessageStatus } from '../WhatsAppMessageStatus'
import type {
  WhatsAppMessageBubbleEmits,
  WhatsAppMessageBubbleOwnProps,
  WhatsAppMessageBubbleSlots,
} from './WhatsAppMessageBubble.types'
import classes from './WhatsAppMessageBubble.module.css'

defineOptions({
  name: 'WhatsAppMessageBubble',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppMessageBubbleOwnProps>(), {
  variant: undefined,
  status: undefined,
  timestamp: undefined,
  author: undefined,
  replyTo: undefined,
  forwarded: undefined,
  error: undefined,
  withRetry: undefined,
  reactions: undefined,
  withTail: undefined,
  radius: undefined,
  maxWidth: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppMessageBubbleEmits>()
defineSlots<WhatsAppMessageBubbleSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppMessageBubble', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppMessageBubble',
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
  rootSelector: 'bubbleRoot',
})

const isSystem = computed(() => props.variant === 'system')

const time = computed(() =>
  props.timestamp === undefined ? '' : config.messageTime(props.timestamp),
)

const fullTime = computed(() =>
  props.timestamp === undefined ? '' : config.fullTimestamp(props.timestamp),
)

/**
 * A sent/received announcement in front of every bubble. Colour and side carry that information
 * for sighted users; without this a screen reader would read both sides as one flat stream.
 */
const directionLabel = computed(() =>
  props.direction === 'inbound'
    ? config.labels.inboundMessageLabel
    : config.labels.outboundMessageLabel,
)

const failed = computed(() => props.status === 'failed' || props.error !== undefined)

const canRetry = computed(() => failed.value && props.withRetry && (props.error?.retryable ?? true))

const errorText = computed(() => {
  if (!failed.value) {
    return ''
  }

  const message = props.error?.message || config.labels.sendFailed

  return props.error?.code ? `${message} (${props.error.code})` : message
})
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('bubbleRoot') }"
    :data-direction="props.direction"
    :data-variant="props.variant"
    :data-status="props.status"
    :data-with-tail="props.withTail && !isSystem ? '' : undefined"
  >
    <Box v-if="isSystem" v-bind="getStyles('systemMessage')">
      <slot />
    </Box>

    <template v-else>
      <Box v-bind="getStyles('bubble')">
        <VisuallyHidden>{{ directionLabel }}</VisuallyHidden>

        <Box v-if="props.author" v-bind="getStyles('bubbleAuthor')">{{ props.author.name }}</Box>

        <Box v-if="props.forwarded" v-bind="getStyles('bubbleForwarded')">
          <WhatsAppIcon name="reply" size="12" />
          {{ config.labels.forwarded }}
        </Box>

        <template v-if="props.replyTo">
          <slot v-if="slots.quote" name="quote" :reply-to="props.replyTo" />
          <Box v-else v-bind="getStyles('bubbleQuote')">
            <Box v-if="props.replyTo.author" v-bind="getStyles('bubbleQuoteAuthor')">
              {{ props.replyTo.author }}
            </Box>
            <Box v-bind="getStyles('bubbleQuoteText')">{{ props.replyTo.text }}</Box>
          </Box>
        </template>

        <Box v-bind="getStyles('bubbleContent')">
          <slot />
        </Box>

        <slot name="footer" />

        <Box v-if="time || props.status" v-bind="getStyles('bubbleFooter')">
          <Box
            v-if="time"
            component="time"
            v-bind="getStyles('bubbleTime')"
            :title="fullTime"
            :aria-label="fullTime"
          >
            {{ time }}
          </Box>

          <WhatsAppMessageStatus
            v-if="props.status"
            v-bind="getStyles('bubbleStatus')"
            :status="props.status"
            :labels="props.labels"
          />
        </Box>
      </Box>

      <Box v-if="props.reactions?.length" v-bind="getStyles('bubbleReactions')">
        <Box
          v-for="reaction in props.reactions"
          :key="reaction.emoji"
          component="span"
          v-bind="getStyles('bubbleReaction')"
          :data-reacted="reaction.reacted ? '' : undefined"
        >
          <span>{{ reaction.emoji }}</span>
          <span v-if="reaction.count && reaction.count > 1">{{ reaction.count }}</span>
        </Box>
      </Box>

      <Box v-if="failed" v-bind="getStyles('bubbleError')" role="alert">
        <WhatsAppIcon name="alert" size="14" :style="{ color: 'var(--mantine-color-error)' }" />
        <Box component="span" v-bind="getStyles('bubbleErrorText')">{{ errorText }}</Box>

        <Button
          v-if="canRetry"
          v-bind="getStyles('bubbleRetry')"
          variant="subtle"
          size="compact-xs"
          color="red"
          @click="emit('retry')"
        >
          {{ config.labels.retrySend }}
        </Button>
      </Box>
    </template>
  </Box>
</template>
