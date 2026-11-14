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
    label="Mentions with trigger"
    default-value="Hey @[Walter White](walter), are you there?"
    :min-rows="3"
  >
    <Mentions.Mention trigger="@" :data="users" with-trigger />
  </Mentions>
</template>
