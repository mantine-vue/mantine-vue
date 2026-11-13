<script setup lang="ts">
import { Avatar, Group, Mentions, Text } from '@mantine-vue/core'

const users = [
  { id: 'walter', display: 'Walter White', email: 'walter@example.com' },
  { id: 'jesse', display: 'Jesse Pinkman', email: 'jesse@example.com' },
  { id: 'saul', display: 'Saul Goodman', email: 'saul@example.com' },
  { id: 'gus', display: 'Gustavo Fring', email: 'gus@example.com' },
]
</script>

<template>
  <Mentions label="Custom suggestions" placeholder="Type @ to mention someone" :min-rows="3">
    <Mentions.Mention trigger="@" :data="users">
      <template #suggestion="{ item }">
        <Group gap="sm" wrap="nowrap">
          <Avatar size="sm" radius="xl" :name="item.display" color="initials" />
          <div>
            <Text size="sm">{{ item.display }}</Text>
            <Text size="xs" c="dimmed">{{ item.email }}</Text>
          </div>
        </Group>
      </template>
    </Mentions.Mention>
  </Mentions>
</template>
