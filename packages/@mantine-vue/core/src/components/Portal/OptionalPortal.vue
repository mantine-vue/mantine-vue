<script setup lang="ts">
import { useAttrs } from 'vue'
import { useMantineEnv } from '../../core'
import { Portal } from './Portal'
import type { OptionalPortalOwnProps, OptionalPortalSlots } from './OptionalPortal.types'

defineOptions({ name: 'OptionalPortal', inheritAttrs: false })

const props = withDefaults(defineProps<OptionalPortalOwnProps>(), {
  withinPortal: true,
  target: undefined,
  reuseTargetNode: true,
})
defineSlots<OptionalPortalSlots>()

const attrs = useAttrs()
const env = useMantineEnv()
</script>

<template>
  <slot v-if="env === 'test' || !props.withinPortal" />
  <Portal v-else v-bind="attrs" :target="props.target" :reuse-target-node="props.reuseTargetNode">
    <slot />
  </Portal>
</template>
