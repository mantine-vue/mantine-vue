<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import {
  ActionIcon,
  Anchor,
  AppShell,
  Badge,
  Burger,
  Group,
  ScrollArea,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine-vue/core'
import { Notifications } from '@mantine-vue/notifications'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { PhCube, PhGithubLogo, PhMoon, PhSun } from '@phosphor-icons/vue'
import { sections } from './sections'

const opened = ref(false)
const active = shallowRef(sections[0].id)

const activeSection = computed(
  () => sections.find((section) => section.id === active.value) ?? sections[0],
)

function select(id: string) {
  active.value = id
  opened.value = false
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 })
  }
}

const { setColorScheme } = useMantineColorScheme()
const computedScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

function toggleColorScheme() {
  setColorScheme(computedScheme.value === 'dark' ? 'light' : 'dark')
}
</script>

<template>
  <AppShell
    :header="{ height: 60 }"
    :navbar="{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }"
    padding="md"
  >
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap">
          <Burger :opened="opened" hiddenFrom="sm" size="sm" @click="opened = !opened" />
          <ThemeIcon variant="gradient" size="lg" radius="md">
            <PhCube :size="20" />
          </ThemeIcon>
          <div>
            <Title :order="5" style="line-height: 1.1">Mantine Vue</Title>
            <Text size="xs" c="dimmed">Component showcase</Text>
          </div>
        </Group>

        <Group gap="xs" wrap="nowrap">
          <Anchor href="/" size="sm" :fw="500" c="dimmed" me="xs">← Docs</Anchor>
          <Tooltip label="Toggle color scheme">
            <ActionIcon variant="default" size="lg" radius="md" @click="toggleColorScheme">
              <PhSun v-if="computedScheme === 'dark'" :size="18" />
              <PhMoon v-else :size="18" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Mantine on GitHub">
            <ActionIcon
              component="a"
              href="https://github.com/mantinedev/mantine"
              target="_blank"
              variant="default"
              size="lg"
              radius="md"
            >
              <PhGithubLogo :size="18" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </AppShell.Header>

    <AppShell.Navbar p="xs">
      <ScrollArea style="height: 100%">
        <div style="padding: 4px">
          <button
            v-for="section in sections"
            :key="section.id"
            type="button"
            class="showcase-nav-item"
            :data-active="section.id === active || undefined"
            @click="select(section.id)"
          >
            <component :is="section.icon" :size="18" />
            <span>{{ section.label }}</span>
          </button>
        </div>
      </ScrollArea>
    </AppShell.Navbar>

    <AppShell.Main>
      <div style="max-width: 960px; margin: 0 auto">
        <Group gap="sm" mb="xs" align="center">
          <Title :order="2">{{ activeSection.label }}</Title>
          <Badge variant="light" radius="sm">{{ activeSection.count }} components</Badge>
        </Group>
        <Text c="dimmed" mb="xl">{{ activeSection.description }}</Text>

        <component :is="activeSection.component" />

        <Text ta="center" c="dimmed" size="sm" :mt="40" py="xl">
          Built with Mantine Vue ·
          <Anchor href="https://mantine-vue.dev" target="_blank">mantine-vue.dev</Anchor>
        </Text>
      </div>
    </AppShell.Main>
  </AppShell>

  <Notifications position="top-right" />
  <SpeedInsights />
</template>

<style>
.showcase-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 2px;
  border: none;
  border-radius: var(--mantine-radius-sm);
  background: transparent;
  color: var(--mantine-color-text);
  font-size: var(--mantine-font-size-sm);
  text-align: left;
  cursor: pointer;
}
.showcase-nav-item:hover {
  background-color: light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5));
}
.showcase-nav-item[data-active] {
  background-color: var(--mantine-color-blue-light);
  color: var(--mantine-color-blue-light-color);
  font-weight: 600;
}
</style>
