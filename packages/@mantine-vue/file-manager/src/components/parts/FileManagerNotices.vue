<script setup lang="ts">
import { computed } from 'vue'
import { Notification } from '@mantine-vue/core'
import { useFileManagerContext } from '../../FileManager.context'

defineOptions({ name: 'FileManagerNotices' })

const { ui, labels, getStyles } = useFileManagerContext()

const COLORS = { success: 'teal', info: 'gray', warning: 'yellow', error: 'red' } as const

const closeButtonProps = computed(() => ({ 'aria-label': labels.value.close }) as any)
</script>

<template>
  <div v-bind="getStyles('notices')" aria-live="polite">
    <Notification
      v-for="notice in ui.notices.value"
      :key="notice.id"
      :title="notice.title"
      :color="COLORS[notice.status]"
      :close-button-props="closeButtonProps"
      :role="notice.status === 'error' ? 'alert' : 'status'"
      :data-status="notice.status"
      @close="ui.dismissNotice(notice.id)"
    >
      <span v-if="notice.message" style="white-space: pre-line">{{ notice.message }}</span>
    </Notification>
  </div>
</template>
