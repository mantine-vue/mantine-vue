<script setup lang="ts">
import { useClipboard } from '@mantine-vue/hooks'
import CodeHighlightControl from '../CodeHighlightControl/CodeHighlightControl.vue'
import CopyIcon from './CopyIcon.vue'

export interface CopyCodeButtonProps {
  code: string
  copiedLabel?: string
  copyLabel?: string
}

defineOptions({ name: 'CopyCodeButton' })
const props = withDefaults(defineProps<CopyCodeButtonProps>(), {
  copiedLabel: 'Copied',
  copyLabel: 'Copy',
})
const clipboard = useClipboard()
</script>

<template>
  <CodeHighlightControl
    variant="none"
    :tooltip-label="clipboard.copied.value ? props.copiedLabel : props.copyLabel"
    :aria-label="clipboard.copied.value ? props.copiedLabel : `${props.copyLabel} code`"
    @click="clipboard.copy(props.code.trim())"
  >
    <CopyIcon :copied="clipboard.copied.value" />
  </CodeHighlightControl>
</template>
