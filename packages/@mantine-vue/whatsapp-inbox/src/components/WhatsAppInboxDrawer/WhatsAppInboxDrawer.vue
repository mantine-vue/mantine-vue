<script lang="ts">
const defaultProps = {
  opened: false,
  position: 'right',
  size: 'md',
  focusComposerOnOpen: true,
} as const

const DRAWER_OWN_PROPS = new Set([
  'opened',
  'position',
  'size',
  'title',
  'focusComposerOnOpen',
  'drawerProps',
  'classNames',
  'styles',
  'vars',
  'unstyled',
])

export { defaultProps, DRAWER_OWN_PROPS }
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useSlots, watch, type CSSProperties } from 'vue'
import { Drawer, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import type { WhatsAppConversationSlots } from '../../component-props'
import { getContactDisplayName } from '../../utils'
import { WhatsAppConversation } from '../WhatsAppConversation'
import type { WhatsAppConversationExposed } from '../WhatsAppConversation'
import type { WhatsAppInboxDrawerOwnProps } from './WhatsAppInboxDrawer.types'
import classes from './WhatsAppInboxDrawer.module.css'

defineOptions({
  name: 'WhatsAppInboxDrawer',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppInboxDrawerOwnProps>(), {
  opened: undefined,
  position: undefined,
  size: undefined,
  title: undefined,
  focusComposerOnOpen: undefined,
  drawerProps: undefined,
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
  withBack: undefined,
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
 * Only the drawer's own events are declared; conversation listeners fall through as attributes
 * and are spread onto `WhatsAppConversation`. The full list stays part of the public type
 * through `WhatsAppInboxDrawerEmits`.
 */
const emit = defineEmits<{
  'update:opened': [opened: boolean]
  close: []
}>()

defineSlots<WhatsAppConversationSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppInboxDrawer', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppInboxDrawer',
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
  rootSelector: 'drawerRoot',
})

const conversationProps = computed(() => {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    if (!DRAWER_OWN_PROPS.has(key)) {
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
 * `getStyles` returns the class list as an array, which `Drawer`'s `classNames` record does not
 * accept; joining it keeps the Styles API working through the drawer.
 */
const bodyClassName = computed(() =>
  (getStyles('drawerBody').class as unknown[]).filter(Boolean).join(' '),
)
const bodyStyle = computed(() => getStyles('drawerBody').style as CSSProperties)
const contentClassName = computed(() =>
  (getStyles('drawerContent').class as unknown[]).filter(Boolean).join(' '),
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
  <Drawer
    v-bind="props.drawerProps"
    :opened="Boolean(props.opened)"
    :position="props.position"
    :size="props.size"
    :title="title"
    :class="getStyles('drawerRoot').class"
    :style="getStyles('drawerRoot').style"
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
  </Drawer>
</template>
