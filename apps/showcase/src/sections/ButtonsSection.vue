<script setup lang="ts">
import { h, ref } from 'vue'
import {
  ActionIcon,
  Button,
  ButtonGroup,
  CloseButton,
  CopyButton,
  FileButton,
  Group,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine-vue/core'
import { PhCheck, PhCopy, PhDownloadSimple, PhHeart, PhImage, PhTrash } from '@phosphor-icons/vue'
import DemoCard from '../components/DemoCard.vue'

const file = ref<File | null>(null)
</script>

<template>
  <Stack gap="lg">
    <DemoCard name="Button" description="Primary action element with variants, sizes and sections.">
      <Stack gap="md">
        <Group>
          <Button>Filled</Button>
          <Button variant="light">Light</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="default">Default</Button>
          <Button variant="gradient" :gradient="{ from: 'indigo', to: 'cyan' }">Gradient</Button>
        </Group>
        <Group>
          <Button :left-section="h(PhImage, { size: 16 })">Gallery</Button>
          <Button :right-section="h(PhDownloadSimple, { size: 16 })" color="teal">Download</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </Group>
      </Stack>
    </DemoCard>

    <DemoCard name="Button.Group" description="Attaches related buttons into a single unit.">
      <ButtonGroup>
        <Button variant="default">Day</Button>
        <Button variant="default">Week</Button>
        <Button variant="default">Month</Button>
      </ButtonGroup>
    </DemoCard>

    <DemoCard name="ActionIcon" description="Icon-only button with the same variant system.">
      <Group>
        <ActionIcon variant="filled" aria-label="Like"><PhHeart :size="18" /></ActionIcon>
        <ActionIcon variant="light" color="red" aria-label="Delete"
          ><PhTrash :size="18"
        /></ActionIcon>
        <ActionIcon variant="outline" aria-label="Image"><PhImage :size="18" /></ActionIcon>
        <ActionIcon
          variant="gradient"
          :gradient="{ from: 'orange', to: 'red' }"
          size="lg"
          aria-label="Download"
        >
          <PhDownloadSimple :size="18" />
        </ActionIcon>
      </Group>
    </DemoCard>

    <DemoCard name="CopyButton" description="Copies content to clipboard with copied state.">
      <CopyButton value="https://mantine-vue.dev">
        <template #default="{ copied, copy }">
          <Tooltip :label="copied ? 'Copied' : 'Copy'" withArrow>
            <ActionIcon :color="copied ? 'teal' : 'gray'" variant="subtle" @click="copy">
              <PhCheck v-if="copied" :size="18" />
              <PhCopy v-else :size="18" />
            </ActionIcon>
          </Tooltip>
        </template>
      </CopyButton>
    </DemoCard>

    <DemoCard name="FileButton" description="Button that opens the native file picker.">
      <Group>
        <FileButton :onChange="(f) => (file = f)" accept="image/png,image/jpeg">
          <template #default="{ onClick }">
            <Button variant="light" @click="onClick">Upload image</Button>
          </template>
        </FileButton>
        <Text size="sm" c="dimmed">{{ file ? file.name : 'No file selected' }}</Text>
      </Group>
    </DemoCard>

    <DemoCard
      name="CloseButton & UnstyledButton"
      description="A dismiss control and a style-free button base."
    >
      <Group>
        <CloseButton aria-label="Close" />
        <CloseButton size="lg" variant="filled" aria-label="Close" />
        <UnstyledButton
          style="
            padding: 8px 16px;
            border-radius: var(--mantine-radius-md);
            background: var(--mantine-color-blue-light);
            color: var(--mantine-color-blue-light-color);
          "
        >
          Fully custom button
        </UnstyledButton>
      </Group>
    </DemoCard>
  </Stack>
</template>
