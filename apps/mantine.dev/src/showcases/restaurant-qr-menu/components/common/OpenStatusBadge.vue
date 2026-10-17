<script setup lang="ts">
import { Badge } from '@mantine-vue/core'
import { useOpenStatusLabel } from '../../composables/use-open-status-label'

withDefaults(defineProps<{ withDetail?: boolean; size?: string }>(), {
  withDetail: true,
  size: 'md',
})

const status = useOpenStatusLabel()
</script>

<template>
  <Badge
    :size="size"
    variant="light"
    :color="status.open ? (status.closingSoon ? 'orange' : 'teal') : 'red'"
    radius="xl"
    tt="none"
    :class="$style.badge"
  >
    <span :class="$style.dot" :data-open="status.open || undefined" aria-hidden="true" />
    {{ status.label }}<template v-if="withDetail && status.detail"> · {{ status.detail }}</template>
  </Badge>
</template>

<style module>
.badge {
  font-weight: 600;
}

.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-inline-end: 6px;
  border-radius: 50%;
  background: currentColor;
  vertical-align: middle;

  &[data-open] {
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.35;
  }
}
</style>
