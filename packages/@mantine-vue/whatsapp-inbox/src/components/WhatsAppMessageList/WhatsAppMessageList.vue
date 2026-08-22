<script lang="ts">
const defaultProps = {
  withDayDividers: true,
  autoScroll: true,
  autoScrollThreshold: 80,
  loadOlderThreshold: 120,
} as const

/**
 * Marks the `ScrollArea` viewport so the list can find it again without depending on Mantine
 * static classes, which a consumer can turn off.
 */
const VIEWPORT_ATTRIBUTE = 'data-whatsapp-message-viewport'

export { defaultProps, VIEWPORT_ATTRIBUTE }
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useAttrs, useSlots, watch } from 'vue'
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Center,
  Loader,
  ScrollArea,
  Text,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useResolvedCapabilities, useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { resolveMessageRenderers } from '../../component-props'
import { WhatsAppIcon } from '../../icons'
import type { WhatsAppMessageData } from '../../types'
import { groupMessagesByDay } from '../../utils'
import { WhatsAppMessage } from '../WhatsAppMessage'
import type {
  WhatsAppMessageListEmits,
  WhatsAppMessageListOwnProps,
  WhatsAppMessageListSlots,
} from './WhatsAppMessageList.types'
import classes from './WhatsAppMessageList.module.css'

defineOptions({
  name: 'WhatsAppMessageList',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppMessageListOwnProps>(), {
  messages: undefined,
  conversationId: undefined,
  loading: undefined,
  error: undefined,
  pagination: undefined,
  withRetry: undefined,
  withDayDividers: undefined,
  autoScroll: undefined,
  autoScrollThreshold: undefined,
  loadOlderThreshold: undefined,
  bubbleMaxWidth: undefined,
  viewportProps: undefined,
  labels: undefined,
  renderMessage: undefined,
  renderMessageContent: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppMessageListEmits>()
defineSlots<WhatsAppMessageListSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppMessageList', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)
const capabilities = useResolvedCapabilities(
  () => undefined,
  () => false,
)

const getStyles = useStyles({
  name: 'WhatsAppMessageList',
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
  rootSelector: 'messageListRoot',
})

const messages = computed(() => props.messages ?? [])
const groups = computed(() => groupMessagesByDay(messages.value))
const messageRenderers = computed(() => resolveMessageRenderers(props, slots))

const withRetry = computed(() => props.withRetry ?? capabilities.value.canRetryFailed)

const hasMessages = computed(() => messages.value.length > 0)
const showLoading = computed(() => Boolean(props.loading) && !hasMessages.value)
const showError = computed(() => Boolean(props.error) && !hasMessages.value)
const showEmpty = computed(() => !showLoading.value && !showError.value && !hasMessages.value)

const canLoadOlder = computed(
  () => Boolean(props.pagination?.hasMore) && !props.pagination?.loadingMore,
)

const contentElement = ref<HTMLDivElement | null>(null)
const atBottom = ref(true)
const pendingCount = ref(0)

const viewportProps = computed(() => ({
  ...props.viewportProps,
  [VIEWPORT_ATTRIBUTE]: '',
}))

function getViewport(): HTMLElement | null {
  return contentElement.value?.closest<HTMLElement>(`[${VIEWPORT_ATTRIBUTE}]`) ?? null
}

function scrollToBottom(behavior: ScrollBehavior = 'auto') {
  const viewport = getViewport()

  if (!viewport) {
    return
  }

  // `scrollTo` is missing in jsdom and in a few older engines; the assignment is the fallback
  // that always works, at the cost of the smooth animation.
  if (typeof viewport.scrollTo === 'function') {
    viewport.scrollTo({ top: viewport.scrollHeight, behavior })
  } else {
    viewport.scrollTop = viewport.scrollHeight
  }

  pendingCount.value = 0
  atBottom.value = true
}

function updateAtBottom() {
  const viewport = getViewport()

  if (!viewport) {
    return
  }

  const distance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
  const next = distance <= (props.autoScrollThreshold ?? defaultProps.autoScrollThreshold)

  if (next !== atBottom.value) {
    atBottom.value = next
    emit('atBottomChange', next)
  }

  if (next) {
    pendingCount.value = 0
  }
}

function requestOlder() {
  if (!canLoadOlder.value) {
    return
  }

  emit('loadOlder', { cursor: props.pagination?.cursor })
}

function handleScroll() {
  updateAtBottom()

  const viewport = getViewport()

  if (
    viewport &&
    viewport.scrollTop <= (props.loadOlderThreshold ?? defaultProps.loadOlderThreshold)
  ) {
    requestOlder()
  }
}

function getEdges(list: WhatsAppMessageData[]) {
  return {
    length: list.length,
    first: list[0]?.id,
    last: list[list.length - 1]?.id,
  }
}

let previousEdges = getEdges([])

/**
 * Distance from the bottom of the content, captured before Vue patches the DOM.
 *
 * Restoring this value after prepending messages preserves the reading position even though the
 * absolute scroll offset changes.
 */
let preservedBottomOffset: number | null = null

watch(
  () => props.messages,
  (next) => {
    const edges = getEdges(next ?? [])
    const previous = previousEdges
    previousEdges = edges

    if (edges.length === 0 || previous.length === 0) {
      preservedBottomOffset = null
      return
    }

    const prepended = edges.first !== previous.first && edges.length > previous.length
    const appended = edges.last !== previous.last

    if (prepended) {
      const viewport = getViewport()
      preservedBottomOffset = viewport ? viewport.scrollHeight - viewport.scrollTop : null
      return
    }

    if (appended && !atBottom.value) {
      pendingCount.value += edges.length - previous.length
    }
  },
  { flush: 'pre' },
)

watch(
  () => props.messages,
  () => {
    void nextTick(() => {
      const viewport = getViewport()

      if (!viewport) {
        return
      }

      if (preservedBottomOffset !== null) {
        viewport.scrollTop = viewport.scrollHeight - preservedBottomOffset
        preservedBottomOffset = null
        return
      }

      if (props.autoScroll && atBottom.value) {
        scrollToBottom()
      }
    })
  },
  { flush: 'post' },
)

// Switching conversations starts a different history: jump to its newest message immediately
// rather than inheriting the previous conversation's offset.
watch(
  () => props.conversationId,
  () => {
    previousEdges = getEdges(messages.value)
    preservedBottomOffset = null
    pendingCount.value = 0
    atBottom.value = true
    void nextTick(() => scrollToBottom())
  },
)

onMounted(() => {
  previousEdges = getEdges(messages.value)
  scrollToBottom()
})

defineExpose({ scrollToBottom, getViewport })
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('messageListRoot') }">
    <ScrollArea
      v-bind="getStyles('messageListScrollArea')"
      type="auto"
      scrollbars="y"
      :viewport-props="viewportProps"
      @scroll-position-change="handleScroll"
    >
      <div ref="contentElement" v-bind="getStyles('messageListContent')">
        <Center v-if="showLoading" v-bind="getStyles('messageListState')">
          <slot v-if="slots.loadingMessages" name="loadingMessages" />
          <template v-else>
            <Loader size="sm" />
            <Text size="sm" c="dimmed">{{ config.labels.loadingMessages }}</Text>
          </template>
        </Center>

        <Box v-else-if="showError" v-bind="getStyles('messageListState')">
          <slot v-if="slots.errorMessages" name="errorMessages" :error="props.error ?? ''" />
          <Alert v-else color="red" variant="light" :title="config.labels.messagesError">
            <Text size="sm">{{ props.error }}</Text>
            <Button mt="sm" size="xs" variant="light" color="red" @click="emit('retryLoad')">
              {{ config.labels.retry }}
            </Button>
          </Alert>
        </Box>

        <Box v-else-if="showEmpty" v-bind="getStyles('messageListState')">
          <slot v-if="slots.emptyConversation" name="emptyConversation" />
          <template v-else>
            <WhatsAppIcon
              name="message"
              size="40"
              :style="{ color: 'var(--mantine-color-dimmed)' }"
            />
            <Text size="sm" fw="500">{{ config.labels.emptyConversation }}</Text>
            <Text size="xs" c="dimmed">{{ config.labels.emptyConversationDescription }}</Text>
          </template>
        </Box>

        <template v-else>
          <Box
            v-if="canLoadOlder || props.pagination?.loadingMore"
            v-bind="getStyles('messageListLoadOlder')"
          >
            <Loader v-if="props.pagination?.loadingMore" size="xs" />
            <Button v-else size="compact-xs" variant="subtle" @click="requestOlder">
              {{ config.labels.loadOlderMessages }}
            </Button>
          </Box>

          <Box
            component="ol"
            v-bind="getStyles('messageListItems')"
            role="log"
            :aria-label="config.labels.messageHistoryLabel"
            aria-relevant="additions text"
          >
            <Box
              v-for="group in groups"
              :key="group.key"
              component="li"
              v-bind="getStyles('messageListGroup')"
            >
              <Box
                v-if="props.withDayDividers && group.date"
                v-bind="getStyles('messageListDayDivider')"
              >
                <Box component="span" v-bind="getStyles('messageListDayLabel')">
                  {{ config.dayLabel(group.date) }}
                </Box>
              </Box>

              <Box component="ol" v-bind="getStyles('messageListGroupItems')">
                <Box
                  v-for="(message, index) in group.messages"
                  :key="message.id"
                  component="li"
                  v-bind="getStyles('messageListItem')"
                  :data-first-of-run="
                    index === 0 || group.messages[index - 1].direction !== message.direction
                      ? ''
                      : undefined
                  "
                >
                  <slot v-if="slots.message" name="message" :message="message" />

                  <WhatsAppMessage
                    v-else
                    :message="message"
                    :with-retry="withRetry"
                    :with-tail="
                      index === 0 || group.messages[index - 1].direction !== message.direction
                    "
                    :max-width="props.bubbleMaxWidth"
                    :labels="props.labels"
                    :render-message="messageRenderers.renderMessage"
                    :render-message-content="messageRenderers.renderMessageContent"
                    :class-names="props.classNames as any"
                    :styles="props.styles as any"
                    :unstyled="props.unstyled"
                    @retry="emit('retryMessage', $event)"
                    @media-download="emit('mediaDownload', $event, message)"
                    @media-preview="emit('mediaPreview', $event, message)"
                  >
                    <template v-if="slots.messageFooter" #messageFooter="footerProps">
                      <slot name="messageFooter" v-bind="footerProps" />
                    </template>
                    <template v-if="slots.mediaAttachment" #mediaAttachment="mediaProps">
                      <slot name="mediaAttachment" v-bind="mediaProps" />
                    </template>
                  </WhatsAppMessage>
                </Box>
              </Box>
            </Box>
          </Box>
        </template>
      </div>
    </ScrollArea>

    <ActionIcon
      v-if="!atBottom && hasMessages"
      v-bind="getStyles('messageListScrollToBottom')"
      variant="default"
      radius="xl"
      size="lg"
      :aria-label="
        pendingCount > 0 ? config.labels.newMessages(pendingCount) : config.labels.scrollToBottom
      "
      @click="scrollToBottom('smooth')"
    >
      <WhatsAppIcon name="chevronDown" size="18" />
    </ActionIcon>
  </Box>
</template>
