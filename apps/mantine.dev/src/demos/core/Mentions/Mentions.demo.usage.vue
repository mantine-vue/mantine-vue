<script setup lang="ts">
import { ref } from 'vue'
import { Mentions } from '@mantine-vue/core'

const users = [
  { id: 'walter', display: 'Walter White' },
  { id: 'jesse', display: 'Jesse Pinkman' },
  { id: 'saul', display: 'Saul Goodman' },
  { id: 'gus', display: 'Gustavo Fring' },
]

const value = ref('Hey @[Walter White](walter), are you ready?')
</script>

<template>
  <Mentions v-model="value" label="Comment" placeholder="Type @ to mention someone" :min-rows="3">
    <Mentions.Mention trigger="@" :data="users" />
  </Mentions>
</template>
