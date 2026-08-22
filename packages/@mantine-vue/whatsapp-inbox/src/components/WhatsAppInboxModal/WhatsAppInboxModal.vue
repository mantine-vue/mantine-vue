<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'

const defaultProps = {
  opened: false,
  height: '70vh',
  focusComposerOnOpen: true,
} as const

/**
 * Props the modal keeps for itself. Everything else is forwarded to the conversation, so the
 * wrapper does not have to re-declare the whole conversation API every time it grows.
 */
const MODAL_OWN_PROPS = new Set([
  'opened',
  'title',
  'height',
  'focusComposerOnOpen',
  'modalProps',
  'classNames',
  'styles',
  'vars',
  'unstyled',
])

const varsResolver = createVarsResolver<any>((_, { height }) => ({
  modalBody: {
    '--wa-modal-height':
      height === undefined ? undefined : typeof height === 'number' ? `${height}px` : height,
  },
}))

export { defaultProps, MODAL_OWN_PROPS, varsResolver }
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useSlots, watch, type CSSProperties } from 'vue'
import { Modal, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import type { WhatsAppConversationSlots } from '../../component-props'
import { getContactDisplayName } from '../../utils'
import { WhatsAppConversation } from '../WhatsAppConversation'
import type { WhatsAppConversationExposed } from '../WhatsAppConversation'
import type { WhatsAppInboxModalOwnProps } from './WhatsAppInboxModal.types'
import classes from './WhatsAppInboxModal.module.css'

defineOptions({
  name: 'WhatsAppInboxModal',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppInboxModalOwnProps>(), {
  opened: undefined,
  title: undefined,
  height: undefined,
  focusComposerOnOpen: undefined,
  modalProps: undefined,
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
  sending: undefined,
  sendError: undefined,
  replyTo: undefined,
  withHeader: undefined,
  withComposer: undefined,
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

/**
 * Only the dialog's own events are declared. Every conversation listener falls through as an
 * attribute and is spread onto `WhatsAppConversation`, which keeps the two APIs in sync without
 * a forwarding line per event. The full event list is still part of the public type through
 * `WhatsAppInboxModalEmits`.
 */
const emit = defineEmits<{
  'update:opened': [opened: boolean]
  close: []
}>()

defineSlots<WhatsAppConversationSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppInboxModal', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppInboxModal',
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
  rootSelector: 'modalRoot',
})

const conversationProps = computed(() => {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    if (!MODAL_OWN_PROPS.has(key)) {
      result[key] = (props as Record<string, unknown>)[key]
    }
  }

  return result
})

const forwardedAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs

  return rest
})

/**
 * `getStyles` returns the class list as an array, which `Modal`'s `classNames` record does not
 * accept; joining it keeps the Styles API working through the dialog.
 */
const bodyClassName = computed(() =>
  (getStyles('modalBody').class as unknown[]).filter(Boolean).join(' '),
)
const bodyStyle = computed(() => getStyles('modalBody').style as CSSProperties)
const contentClassName = computed(() =>
  (getStyles('modalContent').class as unknown[]).filter(Boolean).join(' '),
)

const slotNames = computed(() => Object.keys(slots) as (keyof WhatsAppConversationSlots)[])

const conversationRef = ref<WhatsAppConversationExposed | null>(null)

const title = computed(() => {
  if (props.title !== undefined) {
    return props.title
  }

  return props.conversation
    ? getContactDisplayName(props.conversation)
    : config.labels.conversationsLabel
})

function close() {
  emit('update:opened', false)
  emit('close')
}

// Opening the modal moves focus to the composer.
watch(
  () => props.opened,
  (opened) => {
    if (opened && props.focusComposerOnOpen) {
      void nextTick(() => conversationRef.value?.focusComposer())
    }
  },
)
</script>

<template>
  <Modal
    v-bind="props.modalProps"
    :opened="Boolean(props.opened)"
    :title="title"
    size="lg"
    :class="getStyles('modalRoot').class"
    :style="getStyles('modalRoot').style"
    :class-names="{ content: contentClassName, body: bodyClassName }"
    :styles="{ body: bodyStyle }"
    @close="close"
  >
    <WhatsAppConversation
      ref="conversationRef"
      v-bind="{ ...forwardedAttrs, ...conversationProps }"
      :labels="props.labels"
      :class-names="props.classNames as any"
      :styles="props.styles as any"
      :unstyled="props.unstyled"
      :with-header="props.withHeader ?? false"
    >
      <template v-for="name in slotNames" #[name]="slotProps">
        <slot :name="name" v-bind="(slotProps ?? {}) as any" />
      </template>
    </WhatsAppConversation>
  </Modal>
</template>
