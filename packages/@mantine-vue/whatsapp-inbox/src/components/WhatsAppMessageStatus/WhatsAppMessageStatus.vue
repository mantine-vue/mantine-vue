<script lang="ts">
import type { WhatsAppIconName } from '../../icons'
import type { WhatsAppInboxLabels } from '../../labels'
import type { WhatsAppDeliveryStatus as WhatsAppMessageStatusValue } from '../../types'

const defaultProps = {
  withLabel: false,
  size: '1em',
} as const

/**
 * Each state gets its own glyph, not only its own colour: WhatsApp's own single/double tick
 * distinction is the accessible part of the indicator, and the blue of `read` is decoration on
 * top of it.
 */
const STATUS_ICONS: Record<WhatsAppMessageStatusValue, WhatsAppIconName> = {
  pending: 'clock',
  sent: 'check',
  delivered: 'checks',
  read: 'checks',
  failed: 'alert',
}

const STATUS_LABEL_KEYS = {
  pending: 'statusPending',
  sent: 'statusSent',
  delivered: 'statusDelivered',
  read: 'statusRead',
  failed: 'statusFailed',
} as const satisfies Record<WhatsAppMessageStatusValue, keyof WhatsAppInboxLabels>

export { defaultProps, STATUS_ICONS, STATUS_LABEL_KEYS }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles, VisuallyHidden } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import type { WhatsAppMessageStatusOwnProps } from './WhatsAppMessageStatus.types'
import classes from './WhatsAppMessageStatus.module.css'

defineOptions({
  name: 'WhatsAppMessageStatus',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppMessageStatusOwnProps>(), {
  status: undefined,
  withLabel: undefined,
  size: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const attrs = useAttrs()
const props = useProps('WhatsAppMessageStatus', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppMessageStatus',
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
  rootSelector: 'statusRoot',
})

const icon = computed(() => (props.status ? STATUS_ICONS[props.status] : undefined))

const label = computed(() => (props.status ? config.labels[STATUS_LABEL_KEYS[props.status]] : ''))

/** Screen readers read the state as a sentence rather than the bare word. */
const accessibleLabel = computed(() =>
  props.status ? config.labels.messageStatusLabel(label.value) : '',
)
</script>

<template>
  <Box
    v-if="props.status && icon"
    component="span"
    v-bind="{ ...attrs, ...getStyles('statusRoot') }"
    :data-status="props.status"
  >
    <WhatsAppIcon
      :name="icon"
      :size="props.size"
      :stroke-width="props.status === 'pending' || props.status === 'failed' ? 2 : 3"
      v-bind="getStyles('statusIcon')"
    />

    <Box v-if="props.withLabel" component="span" v-bind="getStyles('statusLabel')">
      {{ label }}
    </Box>

    <VisuallyHidden v-else>{{ accessibleLabel }}</VisuallyHidden>
  </Box>
</template>
