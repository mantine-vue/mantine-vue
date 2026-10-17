<script setup lang="ts">
import { Group, SimpleGrid, Skeleton, Stack, VisuallyHidden } from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'

/** Placeholder shown while the menu loads for the first time. */
const { t, layout } = useQrMenu()
</script>

<template>
  <div aria-busy="true" role="status">
    <VisuallyHidden>{{ t('app.loading') }}</VisuallyHidden>
    <Skeleton :height="200" radius="0" />
    <div class="qrm-container">
      <Group :mt="-40" gap="md" align="flex-end">
        <Skeleton :height="84" circle />
        <Stack gap="xs" flex="1">
          <Skeleton :height="24" width="60%" radius="sm" />
          <Skeleton :height="14" width="40%" radius="sm" />
        </Stack>
      </Group>
      <Skeleton :height="72" radius="lg" mt="lg" />
      <Group gap="xs" mt="lg" wrap="nowrap">
        <Skeleton v-for="index in 5" :key="index" :height="32" :width="90" radius="xl" />
      </Group>
      <SimpleGrid :cols="layout.columns" spacing="md" mt="lg">
        <Stack v-for="index in 6" :key="index" gap="xs">
          <Skeleton :height="120" radius="md" />
          <Skeleton :height="14" width="80%" radius="sm" />
          <Skeleton :height="12" width="50%" radius="sm" />
        </Stack>
      </SimpleGrid>
    </div>
  </div>
</template>
