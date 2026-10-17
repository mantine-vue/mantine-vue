<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine-vue/core'
import { PhArrowRight, PhDeviceMobile, PhSquaresFour } from '@phosphor-icons/vue'
import PageHead from '@/components/PageHead/PageHead.vue'
import { KITCHEN_SINK_URL, SHOWCASES } from './registry'

const description =
  'Production-style applications built entirely with Mantine Vue core and extension components.'
</script>

<template>
  <PageHead title="Showcases" :description="description" />
  <Container size="lg" py="xl">
    <Stack gap="xs" mb="xl">
      <Badge variant="light" size="lg" w="fit-content" tt="none">
        <PhSquaresFour :size="14" :class="$style.icon" /> Showcases
      </Badge>
      <Title :order="1">Real applications, built with Mantine Vue</Title>
      <Text c="dimmed" :maw="720">
        {{ description }} Each showcase is a complete, self-contained app with mock data, its own
        theme and routing.
      </Text>
    </Stack>

    <SimpleGrid :cols="{ base: 1, sm: 2 }" spacing="lg">
      <Card v-for="showcase in SHOWCASES" :key="showcase.id" withBorder radius="lg" padding="lg">
        <Card.Section>
          <Image :src="showcase.cover" :alt="''" :height="220" fit="cover" loading="lazy" />
        </Card.Section>
        <Group justify="space-between" mt="md" mb="xs">
          <Title :order="2" size="h3">{{ showcase.title }}</Title>
          <Badge color="teal" variant="light" tt="none">
            <PhDeviceMobile :size="12" :class="$style.icon" /> Mobile first
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">{{ showcase.description }}</Text>
        <Group :gap="6" mt="md">
          <Badge v-for="tag in showcase.tags" :key="tag" variant="default" tt="none">{{
            tag
          }}</Badge>
        </Group>
        <Button :component="RouterLink" :to="showcase.path" radius="xl" mt="lg" fullWidth>
          Launch showcase
          <PhArrowRight :size="16" :class="$style.arrow" />
        </Button>
      </Card>

      <Card withBorder radius="lg" padding="lg" :class="$style.kitchenSink">
        <Stack justify="space-between" h="100%">
          <div>
            <Title :order="2" size="h3">Component kitchen sink</Title>
            <Text size="sm" c="dimmed" mt="xs">
              Every Mantine Vue component on a single page, grouped by category – useful as a visual
              reference while building your own showcase.
            </Text>
          </div>
          <Button component="a" :href="KITCHEN_SINK_URL" variant="light" radius="xl">
            Open kitchen sink
            <PhArrowRight :size="16" :class="$style.arrow" />
          </Button>
        </Stack>
      </Card>
    </SimpleGrid>
  </Container>
</template>

<style module>
.icon {
  vertical-align: -2px;
  margin-inline-end: 4px;
}

.arrow {
  margin-inline-start: 6px;
}

.kitchenSink {
  background: linear-gradient(160deg, var(--mantine-color-default-hover), transparent);
}
</style>
