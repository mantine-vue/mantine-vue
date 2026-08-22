<script setup lang="ts">
import { provideWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import type {
  WhatsAppInboxProviderProps,
  WhatsAppInboxProviderSlots,
} from './WhatsAppInboxProvider.types'

defineOptions({ name: 'WhatsAppInboxProvider' })

const props = withDefaults(defineProps<WhatsAppInboxProviderProps>(), {
  labels: undefined,
  locale: undefined,
  formatters: undefined,
})

defineSlots<WhatsAppInboxProviderSlots>()

/**
 * Getters rather than a snapshot: the provider is set up once during `setup`, and every
 * component below re-reads the current value when the props change.
 */
provideWhatsAppInboxConfig({
  get labels() {
    return props.labels
  },
  get locale() {
    return props.locale
  },
  get formatters() {
    return props.formatters
  },
})
</script>

<template>
  <slot />
</template>
