<script setup lang="ts">
import { Mentions } from '@mantine-vue/core'

const database = [
  { id: 'walter', display: 'Walter White' },
  { id: 'jesse', display: 'Jesse Pinkman' },
  { id: 'saul', display: 'Saul Goodman' },
  { id: 'gus', display: 'Gustavo Fring' },
  { id: 'mike', display: 'Mike Ehrmantraut' },
]

async function searchUsers(query: string, { signal }: { signal: AbortSignal }) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  signal.throwIfAborted()
  return database.filter((user) => user.display.toLowerCase().includes(query.toLowerCase()))
}
</script>

<template>
  <Mentions
    label="Async data source"
    placeholder="Type @ to search users"
    nothing-found-message="No users found"
    :min-rows="3"
  >
    <Mentions.Mention trigger="@" :data="searchUsers" :debounce-ms="200" />
  </Mentions>
</template>
