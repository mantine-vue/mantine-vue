<script setup lang="ts">
import { Mentions } from '@mantine-vue/core'

const users = [
  { id: 'walter', display: 'Walter White' },
  { id: 'jesse', display: 'Jesse Pinkman' },
]
</script>

<template>
  <Mentions
    label="Move the caret over a mention to highlight it"
    default-value="Ping @[Walter White](walter) and @[Jesse Pinkman](jesse)"
    :class-names="{ highlight: $style.highlight }"
    :min-rows="3"
  >
    <Mentions.Mention trigger="@" :data="users" />
  </Mentions>
</template>

<style module>
.highlight {
  background-color: var(--mantine-color-blue-light);
  color: var(--mantine-color-blue-light-color);

  &[data-mention-selection='inside'],
  &[data-mention-selection='full'] {
    background-color: var(--mantine-color-blue-filled);
    color: var(--mantine-color-white);
  }
}
</style>
