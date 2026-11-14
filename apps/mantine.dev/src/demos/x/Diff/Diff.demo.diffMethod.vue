<script setup lang="ts">
import { Stack, Text } from '@mantine-vue/core'
import { Diff } from '@mantine-vue/code-highlight'

const previousValue = 'The quick brown fox jumps over the lazy dog.'
const currentValue = 'The quick red cat leaps over the lazy dog.'
</script>

<template>
  <Stack>
    <div>
      <Text fw="500" mb="4">Characters</Text>
      <Diff :previous-value="previousValue" :current-value="currentValue" diff-method="chars" />
    </div>
    <div>
      <Text fw="500" mb="4">Words (default)</Text>
      <Diff :previous-value="previousValue" :current-value="currentValue" diff-method="words" />
    </div>
    <div>
      <Text fw="500" mb="4">Lines</Text>
      <Diff :previous-value="previousValue" :current-value="currentValue" diff-method="lines" />
    </div>
  </Stack>
</template>
