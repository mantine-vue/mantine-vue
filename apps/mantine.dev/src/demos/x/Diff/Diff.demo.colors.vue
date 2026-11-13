<script setup lang="ts">
import { Diff } from '@mantine-vue/code-highlight'
</script>

<template>
  <Diff
    previous-value="The quick brown fox"
    current-value="The quick red fox"
    add-color="blue"
    remove-color="orange"
  />
</template>
