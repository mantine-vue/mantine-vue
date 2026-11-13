<script setup lang="ts">
import { Mentions } from '@mantine-vue/core'

const users = [
  { id: 'walter', display: 'Walter White' },
  { id: 'jesse', display: 'Jesse Pinkman' },
  { id: 'saul', display: 'Saul Goodman' },
  { id: 'gus', display: 'Gustavo Fring' },
]
</script>

<template>
  <Mentions
    label="Inline suggestions"
    placeholder="Type @ and the beginning of a name"
    suggestions-display="inline"
    :min-rows="3"
  >
    <Mentions.Mention trigger="@" :data="users" />
  </Mentions>
</template>
