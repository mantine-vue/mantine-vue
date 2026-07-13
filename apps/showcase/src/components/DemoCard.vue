<script setup lang="ts">
import { Badge, Group, Paper, Stack, Text, Title } from '@mantine-vue/core'

defineProps<{
  /** Component name, e.g. "Button" */
  name: string
  /** One-line description of what the component does */
  description?: string
  /** Optional package label, e.g. "@mantine-vue/dates" */
  pkg?: string
}>()
</script>

<template>
  <Paper withBorder radius="md" p="lg">
    <Stack gap="md">
      <div>
        <Group gap="xs" align="center" wrap="nowrap">
          <Title :order="4">{{ name }}</Title>
          <Badge v-if="pkg" variant="light" color="gray" size="sm" radius="sm">{{ pkg }}</Badge>
        </Group>
        <Text v-if="description" size="sm" c="dimmed" mt="4">{{ description }}</Text>
      </div>

      <div class="showcase-demo">
        <slot />
      </div>
    </Stack>
  </Paper>
</template>
