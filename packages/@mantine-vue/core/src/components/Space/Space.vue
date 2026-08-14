<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps } from '../../core'
import type { SpaceOwnProps } from './Space.types'

defineOptions({ name: 'Space', inheritAttrs: false })
const rawProps = defineProps<SpaceOwnProps>()
const attrs = useAttrs()
const props = useProps('Space', null, rawProps)

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
    v-bind="attrs"
    :w="props.w"
    :h="props.h"
    :miw="props.miw ?? props.w"
    :mih="props.mih ?? props.h"
    ><slot
  /></Box>
</template>
