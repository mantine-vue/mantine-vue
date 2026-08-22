<script lang="ts">
const defaultProps = {
  order: 'none',
  withHeader: true,
  withInfiniteScroll: true,
  withNewConversation: false,
  loadMoreThreshold: 160,
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Select,
  Switch,
  Text,
  TextInput,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import type { WhatsAppConversationListSlots } from '../../component-props'
import { WhatsAppIcon } from '../../icons'
import type { WhatsAppConversationSummary, WhatsAppInboxFilters } from '../../types'
import { isValidPhoneNumber, normalizePhoneNumber, sortConversationsByActivity } from '../../utils'
import { WhatsAppConversationListItem } from '../WhatsAppConversationListItem'
import type {
  WhatsAppConversationListEmits,
  WhatsAppConversationListOwnProps,
} from './WhatsAppConversationList.types'
import classes from './WhatsAppConversationList.module.css'

defineOptions({
  name: 'WhatsAppConversationList',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppConversationListOwnProps>(), {
  conversations: undefined,
  selectedConversationId: undefined,
  defaultSelectedConversationId: undefined,
  filters: undefined,
  defaultFilters: undefined,
  filtersConfig: undefined,
  loading: undefined,
  error: undefined,
  pagination: undefined,
  order: undefined,
  withHeader: undefined,
  withInfiniteScroll: undefined,
  loadMoreThreshold: undefined,
  title: undefined,
  withNewConversation: undefined,
  newConversationOpened: undefined,
  newConversationCreating: undefined,
  newConversationError: undefined,
  validatePhoneNumber: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppConversationListEmits>()
defineSlots<WhatsAppConversationListSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppConversationList', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppConversationList',
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
  rootSelector: 'conversationListRoot',
})

const [selectedId, setSelectedId] = useUncontrolled<string | null>({
  value: () => props.selectedConversationId,
  defaultValue: props.defaultSelectedConversationId,
  finalValue: null,
  onChange: (value) => emit('update:selectedConversationId', value),
})

const [filters, setFilters] = useUncontrolled<WhatsAppInboxFilters>({
  value: () => props.filters,
  defaultValue: props.defaultFilters,
  finalValue: {},
  onChange: (value) => emit('update:filters', value),
})

function patchFilters(partial: WhatsAppInboxFilters) {
  setFilters({ ...filters.value, ...partial })
}

const filtersConfig = computed(() => props.filtersConfig ?? {})
const withSearch = computed(() => filtersConfig.value.search ?? true)
const withUnread = computed(() => filtersConfig.value.unread ?? true)
const assigneeOptions = computed(() =>
  filtersConfig.value.assignees
    ? [
        { value: '', label: config.labels.unassigned },
        ...filtersConfig.value.assignees.map((assignee) => ({
          value: assignee.id,
          label: assignee.name,
        })),
      ]
    : undefined,
)
const statusOptions = computed(() => filtersConfig.value.statuses)

const conversations = computed(() => {
  const list = props.conversations ?? []

  return props.order === 'activity' ? sortConversationsByActivity(list) : list
})

const hasConversations = computed(() => conversations.value.length > 0)
const showLoading = computed(() => Boolean(props.loading) && !hasConversations.value)
const showError = computed(() => Boolean(props.error) && !hasConversations.value)

/** A filtered-empty list gets different copy than a genuinely empty inbox. */
const hasActiveFilters = computed(() => {
  const current = filters.value

  return Boolean(
    current.query ||
    current.unreadOnly ||
    current.status ||
    current.assigneeId !== undefined ||
    current.labels?.length,
  )
})

const showEmpty = computed(() => !showLoading.value && !showError.value && !hasConversations.value)

const canLoadMore = computed(
  () => Boolean(props.pagination?.hasMore) && !props.pagination?.loadingMore,
)

/** Guards against a burst of scroll events queueing several identical page requests. */
const loadMoreRequested = ref(false)

function requestMore() {
  if (!canLoadMore.value || loadMoreRequested.value) {
    return
  }

  loadMoreRequested.value = true
  emit('loadMore', { cursor: props.pagination?.cursor })
}

function handleScroll(position: { x: number; y: number }) {
  if (!props.withInfiniteScroll) {
    return
  }

  const viewport = scrollRoot.value?.querySelector<HTMLElement>(
    '[data-whatsapp-conversation-viewport]',
  )

  if (!viewport) {
    return
  }

  const distance = viewport.scrollHeight - position.y - viewport.clientHeight

  if (distance <= (props.loadMoreThreshold ?? defaultProps.loadMoreThreshold)) {
    requestMore()
  } else {
    loadMoreRequested.value = false
  }
}

const scrollRoot = ref<HTMLElement | null>(null)

const setScrollRoot = (node: Element | null) => {
  scrollRoot.value = node as HTMLElement | null
}

const viewportProps = { 'data-whatsapp-conversation-viewport': '' }

const [newConversationOpened, setNewConversationOpened] = useUncontrolled<boolean>({
  value: () => props.newConversationOpened,
  finalValue: false,
  onChange: (value) => emit('update:newConversationOpened', value),
})

const newPhoneNumber = ref('')
const newName = ref('')
const newPhoneError = ref<string | null>(null)

function openNewConversation() {
  newPhoneNumber.value = ''
  newName.value = ''
  newPhoneError.value = null
  setNewConversationOpened(true)
}

function submitNewConversation() {
  const phoneNumber = newPhoneNumber.value.trim()

  const error = props.validatePhoneNumber
    ? props.validatePhoneNumber(phoneNumber)
    : isValidPhoneNumber(phoneNumber)
      ? null
      : config.labels.newConversationInvalidPhone

  newPhoneError.value = error

  if (error) {
    return
  }

  emit('newConversation', {
    phoneNumber,
    normalizedPhoneNumber: normalizePhoneNumber(phoneNumber),
    name: newName.value.trim() || undefined,
  })
}

function select(conversation: WhatsAppConversationSummary) {
  setSelectedId(conversation.id)
  emit('select', conversation)
}
</script>

<template>
  <Box :root-ref="setScrollRoot" v-bind="{ ...attrs, ...getStyles('conversationListRoot') }">
    <Box v-if="props.withHeader" v-bind="getStyles('conversationListHeader')">
      <slot name="listHeader" />

      <Box v-bind="getStyles('conversationListTitleRow')">
        <Box v-bind="getStyles('conversationListTitle')">
          {{ props.title ?? config.labels.conversationsLabel }}
        </Box>

        <ActionIcon
          v-if="props.withNewConversation"
          v-bind="getStyles('conversationListNewButton')"
          variant="subtle"
          color="gray"
          :aria-label="config.labels.newConversation"
          @click="openNewConversation"
        >
          <WhatsAppIcon name="plus" size="20" />
        </ActionIcon>
      </Box>

      <TextInput
        v-if="withSearch"
        v-bind="getStyles('conversationListSearch')"
        size="sm"
        type="search"
        :model-value="filters.query ?? ''"
        :placeholder="config.labels.searchPlaceholder"
        :aria-label="config.labels.searchLabel"
        @update:model-value="patchFilters({ query: $event })"
      >
        <template #leftSection>
          <WhatsAppIcon name="search" size="16" />
        </template>
      </TextInput>

      <Box
        v-if="withUnread || assigneeOptions || statusOptions || slots.filters"
        v-bind="getStyles('conversationListFilters')"
      >
        <Switch
          v-if="withUnread"
          size="xs"
          :label="config.labels.unreadFilterLabel"
          :model-value="filters.unreadOnly ?? false"
          @update:model-value="patchFilters({ unreadOnly: $event })"
        />

        <Select
          v-if="statusOptions"
          size="xs"
          clearable
          :data="statusOptions"
          :placeholder="config.labels.statusFilterPlaceholder"
          :aria-label="config.labels.statusFilterLabel"
          :model-value="filters.status ?? null"
          @update:model-value="patchFilters({ status: $event })"
        />

        <Select
          v-if="assigneeOptions"
          size="xs"
          clearable
          :data="assigneeOptions"
          :placeholder="config.labels.assigneeFilterPlaceholder"
          :aria-label="config.labels.assigneeFilterLabel"
          :model-value="filters.assigneeId === null ? '' : (filters.assigneeId ?? null)"
          @update:model-value="patchFilters({ assigneeId: $event === '' ? null : $event })"
        />

        <slot name="filters" />
      </Box>
    </Box>

    <Center v-if="showLoading" v-bind="getStyles('conversationListState')">
      <slot v-if="slots.loadingInbox" name="loadingInbox" />
      <template v-else>
        <Loader size="sm" />
        <Text size="sm" c="dimmed">{{ config.labels.loadingConversations }}</Text>
      </template>
    </Center>

    <Box v-else-if="showError" v-bind="getStyles('conversationListState')">
      <slot v-if="slots.errorInbox" name="errorInbox" :error="props.error ?? ''" />
      <Alert v-else color="red" variant="light" :title="config.labels.conversationsError">
        <Text size="sm">{{ props.error }}</Text>
        <Button mt="sm" size="xs" variant="light" color="red" @click="emit('retryLoad')">
          {{ config.labels.retry }}
        </Button>
      </Alert>
    </Box>

    <Box v-else-if="showEmpty" v-bind="getStyles('conversationListState')">
      <slot v-if="slots.emptyInbox" name="emptyInbox" />
      <template v-else>
        <WhatsAppIcon name="inbox" size="40" :style="{ color: 'var(--mantine-color-dimmed)' }" />
        <Text size="sm" c="dimmed">
          {{ hasActiveFilters ? config.labels.emptySearch : config.labels.emptyInbox }}
        </Text>
        <Button v-if="hasActiveFilters" size="xs" variant="subtle" @click="setFilters({})">
          {{ config.labels.clearFilters }}
        </Button>
      </template>
    </Box>

    <ScrollArea
      v-else
      v-bind="getStyles('conversationListScrollArea')"
      type="auto"
      scrollbars="y"
      :viewport-props="viewportProps"
      @scroll-position-change="handleScroll"
    >
      <Box
        component="ul"
        v-bind="getStyles('conversationListItems')"
        :aria-label="config.labels.conversationsLabel"
      >
        <Box
          v-for="conversation in conversations"
          :key="conversation.id"
          component="li"
          v-bind="getStyles('conversationListItemWrapper')"
        >
          <slot
            v-if="slots.conversationItem"
            name="conversationItem"
            :conversation="conversation"
            :selected="conversation.id === selectedId"
          />

          <WhatsAppConversationListItem
            v-else
            :conversation="conversation"
            :selected="conversation.id === selectedId"
            :labels="props.labels"
            :class-names="props.classNames as any"
            :styles="props.styles as any"
            :unstyled="props.unstyled"
            @select="select"
          >
            <template v-if="slots.conversationAvatar" #conversationAvatar="avatarProps">
              <slot name="conversationAvatar" v-bind="avatarProps" />
            </template>
            <template v-if="slots.conversationPreview" #conversationPreview="previewProps">
              <slot name="conversationPreview" v-bind="previewProps" />
            </template>
          </WhatsAppConversationListItem>
        </Box>
      </Box>

      <Box
        v-if="canLoadMore || props.pagination?.loadingMore"
        v-bind="getStyles('conversationListLoadMore')"
      >
        <Group v-if="props.pagination?.loadingMore" gap="xs">
          <Loader size="xs" />
          <Text size="xs" c="dimmed">{{ config.labels.loading }}</Text>
        </Group>
        <Button v-else size="xs" variant="subtle" @click="requestMore">
          {{ config.labels.loadMoreConversations }}
        </Button>
      </Box>
    </ScrollArea>

    <Box v-if="slots.listFooter" v-bind="getStyles('conversationListFooter')">
      <slot name="listFooter" />
    </Box>

    <Modal
      :opened="newConversationOpened"
      :title="config.labels.newConversationTitle"
      size="md"
      @close="setNewConversationOpened(false)"
    >
      <Box
        component="form"
        v-bind="getStyles('newConversationForm')"
        @submit.prevent="submitNewConversation"
      >
        <Text size="sm" c="dimmed">{{ config.labels.newConversationDescription }}</Text>

        <TextInput
          v-model="newPhoneNumber"
          type="tel"
          required
          data-autofocus
          :label="config.labels.newConversationPhoneLabel"
          :placeholder="config.labels.newConversationPhonePlaceholder"
          :error="newPhoneError"
        />

        <TextInput
          v-model="newName"
          :label="config.labels.newConversationNameLabel"
          :placeholder="config.labels.newConversationNamePlaceholder"
        />

        <Alert v-if="props.newConversationError" color="red" variant="light" role="alert">
          {{ props.newConversationError }}
        </Alert>

        <Box v-bind="getStyles('newConversationActions')">
          <Button variant="default" @click="setNewConversationOpened(false)">
            {{ config.labels.cancel }}
          </Button>
          <Button type="submit" :loading="props.newConversationCreating">
            {{ config.labels.newConversationSubmit }}
          </Button>
        </Box>
      </Box>
    </Modal>
  </Box>
</template>
