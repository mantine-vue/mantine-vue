import { defineComponent, h, ref } from 'vue'
import { Badge, Button, Code, Group, Stack, Text } from '@mantine-vue/core'
import { WhatsAppConversationList } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppInboxFilters } from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import { demoConversations } from './_data'
import { useInboxDemoState } from './_shared'

const LIST_HEIGHT = 460

const usageCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { WhatsAppConversationList } from '@mantine-vue/whatsapp-inbox'

const selectedConversationId = ref<string | null>(null)
</script>

<template>
  <WhatsAppConversationList
    v-model:selected-conversation-id="selectedConversationId"
    :conversations="conversations"
    style="height: 460px"
    @select="markRead"
  />
</template>
`

const Usage = defineComponent({
  name: 'WhatsAppConversationListUsageDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })

    return () =>
      h(WhatsAppConversationList, {
        conversations: state.conversations.value,
        selectedConversationId: state.selectedConversationId.value,
        'onUpdate:selectedConversationId': (value: string | null) => {
          state.selectedConversationId.value = value
        },
        onSelect: state.handleSelectConversation,
        style: { height: `${LIST_HEIGHT}px`, maxWidth: '360px' },
      })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Usage,
  code: usageCode,
  maxWidth: 420,
  withPadding: false,
}

const filtersCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { WhatsAppConversationList } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppInboxFilters } from '@mantine-vue/whatsapp-inbox'

const filters = ref<WhatsAppInboxFilters>({})

// The list never filters the array it is given: it reports the change and you
// answer with the next page of data.
watch(filters, (next) => refetchConversations(next))
</script>

<template>
  <WhatsAppConversationList
    v-model:filters="filters"
    :conversations="conversations"
    :filters-config="{
      search: true,
      unread: true,
      statuses: [
        { value: 'open', label: 'Open' },
        { value: 'pending', label: 'Pending' },
        { value: 'resolved', label: 'Resolved' },
      ],
      assignees: [
        { id: 'agent-sara', name: 'Sara Nasser' },
        { id: 'agent-omar', name: 'Omar Fadel' },
      ],
    }"
    style="height: 460px"
  />
</template>
`

const Filters = defineComponent({
  name: 'WhatsAppConversationListFiltersDemo',
  setup() {
    const filters = ref<WhatsAppInboxFilters>({})
    const selectedConversationId = ref<string | null>(null)

    const visible = () =>
      demoConversations.filter((conversation) => {
        const query = filters.value.query?.trim().toLowerCase()
        const name = (
          conversation.contact.name ??
          conversation.contact.phoneNumber ??
          ''
        ).toLowerCase()

        if (query && !name.includes(query)) {
          return false
        }

        if (filters.value.unreadOnly && !conversation.unreadCount) {
          return false
        }

        if (filters.value.status && conversation.status !== filters.value.status) {
          return false
        }

        if (filters.value.assigneeId === null && conversation.assignee) {
          return false
        }

        if (filters.value.assigneeId && conversation.assignee?.id !== filters.value.assigneeId) {
          return false
        }

        return true
      })

    return () =>
      h(Stack, { gap: 'xs' }, () => [
        h(Code, { block: true }, () => JSON.stringify(filters.value)),
        h(WhatsAppConversationList, {
          conversations: visible(),
          filters: filters.value,
          'onUpdate:filters': (value: WhatsAppInboxFilters) => {
            filters.value = value
          },
          selectedConversationId: selectedConversationId.value,
          'onUpdate:selectedConversationId': (value: string | null) => {
            selectedConversationId.value = value
          },
          filtersConfig: {
            search: true,
            unread: true,
            statuses: [
              { value: 'open', label: 'Open' },
              { value: 'pending', label: 'Pending' },
              { value: 'resolved', label: 'Resolved' },
            ],
            assignees: [
              { id: 'agent-sara', name: 'Sara Nasser' },
              { id: 'agent-omar', name: 'Omar Fadel' },
            ],
          },
          style: { height: `${LIST_HEIGHT}px` },
        }),
      ])
  },
})

export const filters: MantineDemo = {
  type: 'code',
  component: Filters,
  code: filtersCode,
  maxWidth: 460,
  withPadding: false,
}

const paginationCode = `
<template>
  <!--
    The list never paginates itself. It emits \`loadMore\` with the cursor you supplied,
    both when the user scrolls near the end and when the explicit control is used.
  -->
  <WhatsAppConversationList
    :conversations="conversations"
    :pagination="{ hasMore, loadingMore, cursor }"
    style="height: 460px"
    @load-more="({ cursor }) => fetchNextPage(cursor)"
  />
</template>
`

const Pagination = defineComponent({
  name: 'WhatsAppConversationListPaginationDemo',
  setup() {
    const loaded = ref(demoConversations.slice(0, 2))
    const loadingMore = ref(false)
    const page = ref(1)

    const loadMore = () => {
      loadingMore.value = true

      setTimeout(() => {
        page.value += 1
        loaded.value = demoConversations.slice(0, page.value * 2)
        loadingMore.value = false
      }, 700)
    }

    return () =>
      h(WhatsAppConversationList, {
        conversations: loaded.value,
        pagination: {
          hasMore: loaded.value.length < demoConversations.length,
          loadingMore: loadingMore.value,
          cursor: `page-${page.value}`,
        },
        onLoadMore: loadMore,
        style: { height: `${LIST_HEIGHT}px` },
      })
  },
})

export const pagination: MantineDemo = {
  type: 'code',
  component: Pagination,
  code: paginationCode,
  maxWidth: 420,
  withPadding: false,
}

const itemCode = `
<template>
  <!-- Use the primitive on its own, or replace parts of it with slots -->
  <WhatsAppConversationList :conversations="conversations">
    <template #conversationPreview="{ conversation }">
      <Badge size="xs" variant="light">{{ conversation.status }}</Badge>
      <Text size="xs" c="dimmed">{{ conversation.lastMessage?.text }}</Text>
    </template>
  </WhatsAppConversationList>
</template>
`

const Item = defineComponent({
  name: 'WhatsAppConversationListItemDemo',
  setup() {
    const selectedConversationId = ref<string | null>('amina')

    return () =>
      h(
        WhatsAppConversationList,
        {
          conversations: demoConversations,
          selectedConversationId: selectedConversationId.value,
          'onUpdate:selectedConversationId': (value: string | null) => {
            selectedConversationId.value = value
          },
          withHeader: false,
          style: { height: '360px' },
        },
        {
          conversationPreview: ({ conversation }: any) =>
            h(Group, { gap: 6, wrap: 'nowrap', style: { flex: 1, minWidth: 0 } }, () => [
              h(Badge, { size: 'xs', variant: 'light' }, () => conversation.status),
              h(
                Text,
                { size: 'xs', c: 'dimmed', truncate: true },
                () => conversation.lastMessage?.text ?? '',
              ),
            ]),
        },
      )
  },
})

export const item: MantineDemo = {
  type: 'code',
  component: Item,
  code: itemCode,
  maxWidth: 420,
  withPadding: false,
}

const statesCode = `
<template>
  <WhatsAppConversationList loading />
  <WhatsAppConversationList :conversations="[]" error="Network unavailable" @retry-load="refetch" />
  <WhatsAppConversationList :conversations="[]" />
</template>
`

const States = defineComponent({
  name: 'WhatsAppConversationListStatesDemo',
  setup() {
    const variant = ref<'loading' | 'error' | 'empty'>('loading')
    const options = ['loading', 'error', 'empty'] as const

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Group, { gap: 'xs' }, () =>
          options.map((value) =>
            h(
              Button,
              {
                key: value,
                size: 'xs',
                variant: variant.value === value ? 'filled' : 'default',
                onClick: () => {
                  variant.value = value
                },
              },
              () => value,
            ),
          ),
        ),
        h(WhatsAppConversationList, {
          conversations: [],
          loading: variant.value === 'loading',
          error: variant.value === 'error' ? 'Network unavailable' : null,
          style: { height: '320px' },
        }),
      ])
  },
})

export const states: MantineDemo = {
  type: 'code',
  component: States,
  code: statesCode,
  maxWidth: 460,
  withPadding: false,
}
