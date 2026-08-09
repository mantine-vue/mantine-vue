<script lang="ts">
const defaultProps = { timeout: 1000 } as const
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { useClipboard } from '@mantine-vue/hooks'
import { useProps } from '../../core'
import type { CopyButtonOwnProps, CopyButtonSlots } from './CopyButton.types'

defineOptions({ name: 'CopyButton', inheritAttrs: false })

const rawProps = withDefaults(defineProps<CopyButtonOwnProps>(), {
  timeout: undefined,
})
defineSlots<CopyButtonSlots>()

const attrs = useAttrs()
const props = useProps('CopyButton', defaultProps, rawProps)
const clipboard = useClipboard({ timeout: props.timeout })
const copy = () => clipboard.copy(props.value)
</script>

<template>
  <slot v-bind="{ ...attrs, copy, copied: clipboard.copied.value }" />
</template>
