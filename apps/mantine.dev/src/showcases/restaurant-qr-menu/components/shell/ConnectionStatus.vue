<script setup lang="ts">
import { computed, watch } from 'vue'
import { Alert, Button, Transition as MantineTransition } from '@mantine-vue/core'
import { useNetwork } from '@mantine-vue/hooks'
import { notifications } from '@mantine-vue/notifications'
import { PhCloudSlash, PhWifiSlash } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'

/** Offline banner and "showing cached menu" notice. */
const ctx = useQrMenu()
const { t, data } = ctx
const network = useNetwork()
const online = computed(() => network.value.online)

watch(online, (isOnline, wasOnline) => {
  if (isOnline && wasOnline === false) {
    notifications.show({ color: 'teal', message: t('app.backOnline'), autoClose: 2000 })
    void data.load(ctx.restaurantId.value)
  }
})

const cachedLabel = computed(() =>
  data.cachedAt.value
    ? t('app.cachedMenu', { time: ctx.format.dateTime(data.cachedAt.value) })
    : '',
)
</script>

<template>
  <div class="qrm-container" :class="$style.wrapper" aria-live="polite">
    <MantineTransition transition="slide-down" :mounted="!online">
      <template #default="style">
        <Alert
          :style="style"
          color="orange"
          variant="light"
          radius="md"
          :title="t('app.offlineTitle')"
          :class="$style.alert"
        >
          <template #icon><PhWifiSlash :size="20" /></template>
          {{ t('app.offlineMessage') }}
        </Alert>
      </template>
    </MantineTransition>
    <Alert
      v-if="online && cachedLabel"
      color="yellow"
      variant="light"
      radius="md"
      :class="$style.alert"
    >
      <template #icon><PhCloudSlash :size="20" /></template>
      {{ cachedLabel }}
      <Button size="compact-xs" variant="subtle" ms="xs" @click="data.load(ctx.restaurantId.value)">
        {{ t('app.retry') }}
      </Button>
    </Alert>
  </div>
</template>

<style module>
.wrapper:empty {
  display: none;
}

.alert {
  margin-top: var(--mantine-spacing-sm);
}
</style>
