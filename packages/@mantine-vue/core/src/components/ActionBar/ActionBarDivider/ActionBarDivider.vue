<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../../core'
import { useActionBarContext } from '../ActionBar.context'

defineOptions({ name: 'ActionBarDivider', inheritAttrs: false })
const attrs = useAttrs()
const ctx = useActionBarContext()
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...ctx.getStyles('divider') }"
    :role="(attrs.role as string) || 'separator'"
    :aria-orientation="(attrs['aria-orientation'] as string) || 'vertical'"
  />
</template>
