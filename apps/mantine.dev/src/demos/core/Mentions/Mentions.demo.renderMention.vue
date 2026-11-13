<script setup lang="ts">
import { Avatar, Group, HoverCard, Mentions, Stack, Text } from '@mantine-vue/core'

const usersData: Record<string, { display: string; role: string; email: string }> = {
  walter: { display: 'Walter White', role: 'Chemistry teacher', email: 'walter@example.com' },
  jesse: { display: 'Jesse Pinkman', role: 'Associate', email: 'jesse@example.com' },
  saul: { display: 'Saul Goodman', role: 'Attorney', email: 'saul@example.com' },
}

const users = Object.entries(usersData).map(([id, user]) => ({ id, display: user.display }))
</script>

<template>
  <Mentions
    label="Hover a mention to see user details"
    default-value="Ping @[Walter White](walter) and @[Jesse Pinkman](jesse)"
    :min-rows="3"
  >
    <Mentions.Mention trigger="@" :data="users" />

    <template #mention="{ id, display }">
      <HoverCard with-arrow shadow="md" :open-delay="200" position="top" :width="220">
        <HoverCard.Target>
          <span>{{ display }}</span>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Group gap="sm" wrap="nowrap">
            <Avatar radius="xl" :name="usersData[id]?.display" color="initials" />
            <Stack :gap="0">
              <Text fw="500">{{ usersData[id]?.display }}</Text>
              <Text size="xs" c="dimmed">{{ usersData[id]?.role }}</Text>
              <Text size="xs">{{ usersData[id]?.email }}</Text>
            </Stack>
          </Group>
        </HoverCard.Dropdown>
      </HoverCard>
    </template>
  </Mentions>
</template>
