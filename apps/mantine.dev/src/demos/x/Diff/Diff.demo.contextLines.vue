<script setup lang="ts">
import { Diff } from '@mantine-vue/code-highlight'

const previousValue = Array.from({ length: 20 }, (_, index) =>
  index === 5 ? 'old line 6' : index === 15 ? 'old line 16' : `line ${index + 1}`,
).join('\n')

const currentValue = Array.from({ length: 20 }, (_, index) =>
  index === 5 ? 'new line 6' : index === 15 ? 'new line 16' : `line ${index + 1}`,
).join('\n')
</script>

<template>
  <Diff :previous-value="previousValue" :current-value="currentValue" :context-lines="2" />
</template>
