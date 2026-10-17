<script setup lang="ts">
import { DirectionProvider, MantineProvider } from '@mantine-vue/core'
import { Notifications } from '@mantine-vue/notifications'
import type { QrMenuContext } from '../../app/create-qr-menu-context'
import { provideQrMenu } from '../../app/use-qr-menu'
import QrMenuEnvironmentSync from './QrMenuEnvironmentSync.vue'

const props = defineProps<{ context: QrMenuContext }>()
provideQrMenu(props.context)
</script>

<template>
  <DirectionProvider :initial-direction="context.i18n.dir.value">
    <MantineProvider :theme="context.theme.value" default-color-scheme="auto">
      <QrMenuEnvironmentSync />
      <Notifications position="top-center" :limit="3" :z-index="1000" />
      <slot />
    </MantineProvider>
  </DirectionProvider>
</template>
