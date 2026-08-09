<script setup lang="ts">
import { Anchor, Text } from '@mantine-vue/core'

defineProps<{ errorOf: string }>()

const ISSUE_LINK = 'https://github.com/mantine-vue/mantine-vue/issues/new'
</script>

<template>
  <Text>
    <Text span c="red">Error loading component {{ errorOf }} data. </Text>
    If you see this message please let us know by
    <Anchor :href="ISSUE_LINK" target="_blank" rel="noreferrer"> opening an issue on GitHub </Anchor
    >.
  </Text>
</template>
