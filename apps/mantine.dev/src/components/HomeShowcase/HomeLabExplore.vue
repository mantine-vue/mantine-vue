<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Kbd,
  Modal,
  Paper,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import {
  PhBell,
  PhCalendarBlank,
  PhCheck,
  PhCommand,
  PhFolderOpen,
  PhMagnifyingGlass,
  PhRocketLaunch,
  PhSparkle,
  PhUsers,
} from '@phosphor-icons/vue'

const commandOpened = ref(false)
const commandQuery = ref('')

const slides = [
  {
    label: 'Analytics',
    title: 'Watch the signal, not the noise.',
    stat: '+18.4%',
    color: 'blue',
  },
  {
    label: 'Automation',
    title: 'Turn routine work into a workflow.',
    stat: '42h saved',
    color: 'violet',
  },
  {
    label: 'Collaboration',
    title: 'Move from feedback to shipped.',
    stat: '12 active',
    color: 'teal',
  },
]

const commands = [
  { label: 'Open project', description: 'Jump to a recent workspace', icon: PhFolderOpen },
  { label: 'Create event', description: 'Add something to the schedule', icon: PhCalendarBlank },
  { label: 'Invite teammate', description: 'Grow your project team', icon: PhUsers },
  { label: 'View notifications', description: 'Review recent activity', icon: PhBell },
]

const visibleCommands = computed(() => {
  const query = commandQuery.value.trim().toLowerCase()
  return query
    ? commands.filter((command) =>
        `${command.label} ${command.description}`.toLowerCase().includes(query),
      )
    : commands
})

function runCommand(label: string) {
  commandOpened.value = false
  commandQuery.value = ''
  notifications.show({
    title: label,
    message: 'Command executed from the live palette.',
    icon: h(PhCheck, { size: 16 }),
  })
}
</script>

<template>
  <div class="exploreGrid">
    <Card with-border radius="lg" padding="lg" class="exploreCard">
      <Group justify="space-between" mb="md">
        <div>
          <Text fw="700">Project playbook</Text>
          <Text size="xs" c="dimmed">Accordion · badges · progress states</Text>
        </div>
        <Badge variant="light">3 steps</Badge>
      </Group>

      <Accordion default-value="foundation" variant="separated" radius="md">
        <Accordion.Item value="foundation">
          <Accordion.Control>
            <template #icon>
              <ThemeIcon variant="light" radius="md" size="sm"><PhSparkle :size="14" /></ThemeIcon>
            </template>
            Foundation
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" c="dimmed">
              Connect theme tokens, typography, and layout primitives before product work begins.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="workflow">
          <Accordion.Control>
            <template #icon>
              <ThemeIcon variant="light" radius="md" size="sm"><PhCommand :size="14" /></ThemeIcon>
            </template>
            Product workflow
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" c="dimmed">
              Compose forms, overlays, navigation, and feedback into a focused working surface.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="launch">
          <Accordion.Control>
            <template #icon>
              <ThemeIcon variant="light" radius="md" size="sm"
                ><PhRocketLaunch :size="14"
              /></ThemeIcon>
            </template>
            Launch with confidence
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" c="dimmed">
              Responsive defaults and accessible interactions are already part of the system.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>

    <Card with-border radius="lg" padding="lg" class="exploreCard carouselCard">
      <Group justify="space-between" mb="md">
        <div>
          <Text fw="700">Story carousel</Text>
          <Text size="xs" c="dimmed">Drag, swipe, or use the controls</Text>
        </div>
        <ActionIcon variant="light" radius="xl" aria-label="Featured stories">
          <PhSparkle :size="16" />
        </ActionIcon>
      </Group>

      <Carousel with-indicators :height="206" :slide-gap="12" :embla-options="{ loop: true }">
        <Carousel.Slide v-for="slide in slides" :key="slide.label">
          <Paper class="storySlide" radius="md" :data-color="slide.color">
            <Badge variant="light" color="white">{{ slide.label }}</Badge>
            <div>
              <Text class="storyStat">{{ slide.stat }}</Text>
              <Text class="storyTitle">{{ slide.title }}</Text>
            </div>
          </Paper>
        </Carousel.Slide>
      </Carousel>

      <Button full-width variant="default" mt="md" @click="commandOpened = true">
        <template #leftSection><PhMagnifyingGlass :size="16" /></template>
        Open command palette
        <template #rightSection><Kbd size="xs">⌘ K</Kbd></template>
      </Button>
    </Card>
  </div>

  <Modal
    :opened="commandOpened"
    :with-close-button="false"
    centered
    size="md"
    radius="lg"
    padding="0"
    @close="commandOpened = false"
  >
    <div class="commandPalette">
      <TextInput
        v-model="commandQuery"
        placeholder="Search commands..."
        variant="unstyled"
        size="lg"
        autofocus
      >
        <template #leftSection><PhMagnifyingGlass :size="18" /></template>
        <template #rightSection><Kbd size="xs">ESC</Kbd></template>
      </TextInput>
      <div class="commandDivider" />
      <Text size="xs" c="dimmed" fw="700" tt="uppercase" px="md" py="xs">Quick actions</Text>
      <div class="commandList">
        <button
          v-for="command in visibleCommands"
          :key="command.label"
          type="button"
          class="commandItem"
          @click="runCommand(command.label)"
        >
          <ThemeIcon variant="light" radius="md"
            ><component :is="command.icon" :size="16"
          /></ThemeIcon>
          <span
            ><strong>{{ command.label }}</strong
            ><small>{{ command.description }}</small></span
          >
        </button>
        <Text v-if="visibleCommands.length === 0" c="dimmed" size="sm" ta="center" py="xl">
          No commands found
        </Text>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.exploreGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.exploreCard {
  min-width: 0;
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  box-shadow: 0 16px 45px alpha(var(--mantine-color-black), 0.07);
}

.storySlide {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 22px;
  color: white;
  background:
    radial-gradient(circle at 88% 12%, alpha(var(--mantine-color-white), 0.24), transparent 32%),
    linear-gradient(145deg, var(--mantine-primary-color-filled), var(--mantine-color-violet-7));
}

.storySlide[data-color='violet'] {
  background: linear-gradient(145deg, var(--mantine-color-violet-6), var(--mantine-color-grape-8));
}

.storySlide[data-color='teal'] {
  background: linear-gradient(145deg, var(--mantine-color-teal-6), var(--mantine-color-cyan-8));
}

.storySlide :deep(.mantine-Badge-root) {
  align-self: flex-start;
  background: alpha(var(--mantine-color-white), 0.16);
  color: white;
}

.storyStat {
  color: white;
  font-size: 30px;
  font-weight: 750;
  letter-spacing: -0.04em;
}

.storyTitle {
  max-width: 300px;
  margin-top: 4px;
  color: alpha(var(--mantine-color-white), 0.8);
  font-size: 14px;
}

.commandPalette {
  padding: 8px;
}

.commandDivider {
  height: 1px;
  background: var(--mantine-color-default-border);
}

.commandList {
  display: grid;
  gap: 4px;
  padding: 0 8px 8px;
}

.commandItem {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border: 0;
  border-radius: var(--mantine-radius-md);
  background: transparent;
  color: var(--mantine-color-text);
  text-align: left;
  cursor: pointer;
}

.commandItem:hover,
.commandItem:focus-visible {
  outline: none;
  background: var(--mantine-color-default-hover);
}

.commandItem span,
.commandItem strong,
.commandItem small {
  display: block;
}

.commandItem strong {
  font-size: 13px;
}

.commandItem small {
  margin-top: 2px;
  color: var(--mantine-color-dimmed);
  font-size: 11px;
}

@media (max-width: 860px) {
  .exploreGrid {
    grid-template-columns: 1fr;
  }
}
</style>
