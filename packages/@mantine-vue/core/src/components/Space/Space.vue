<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../core'
import type { SpaceOwnProps } from './Space.types'

defineOptions({ name: 'Space', inheritAttrs: false })
const rawProps = defineProps<SpaceOwnProps>()
const attrs = useAttrs()
const props = useProps('Space', null, rawProps)
</script>

<template>
  <Box
    v-bind="attrs"
    :w="props.w"
    :h="props.h"
    :miw="props.miw ?? props.w"
    :mih="props.mih ?? props.h"
    ><slot
  /></Box>
</template>
