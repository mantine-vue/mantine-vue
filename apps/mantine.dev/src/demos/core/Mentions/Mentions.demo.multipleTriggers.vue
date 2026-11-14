<script setup lang="ts">
import { Mentions } from '@mantine-vue/core'

const users = [
  { id: 'walter', display: 'Walter White' },
  { id: 'jesse', display: 'Jesse Pinkman' },
  { id: 'saul', display: 'Saul Goodman' },
]

const tags = [
  { id: '1', display: 'announcement' },
  { id: '2', display: 'question' },
  { id: '3', display: 'bug' },
]
</script>

<template>
  <Mentions label="Mention people with @ and tag topics with #" :min-rows="3">
    <Mentions.Mention trigger="@" :data="users" />
    <Mentions.Mention trigger="#" :data="tags" append-space-on-add />
  </Mentions>
</template>
