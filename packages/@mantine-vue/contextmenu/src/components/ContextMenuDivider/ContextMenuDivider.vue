<script setup lang="ts">
import { computed } from 'vue'
import { Box, useMantineTheme } from '@mantine-vue/core'
import { resolveContextMenuStyle } from '../../utils'
import type { ContextMenuDividerProps } from '../../types'
import '../../ContextMenuDivider.css'

defineOptions({ name: 'ContextMenuDivider' })
const props = defineProps<ContextMenuDividerProps>()
const theme = useMantineTheme()
const resolvedStyle = computed(() => resolveContextMenuStyle(props.style, theme.value))
</script>

<template>
  <Box :class="['mantine-contextmenu-divider', props.className]" :style="resolvedStyle" />
</template>
