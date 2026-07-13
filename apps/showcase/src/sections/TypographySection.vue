<script setup lang="ts">
import {
  Anchor,
  Blockquote,
  Code,
  Group,
  Highlight,
  Mark,
  Stack,
  Text,
  Title,
  Typography,
} from '@mantine-vue/core'
import { PhInfo } from '@phosphor-icons/vue'
import { h } from 'vue'
import DemoCard from '../components/DemoCard.vue'
</script>

<template>
  <Stack gap="lg">
    <DemoCard name="Title" description="Semantic headings h1–h6 with theme sizing.">
      <Stack gap="xs">
        <Title :order="1">Heading level 1</Title>
        <Title :order="2">Heading level 2</Title>
        <Title :order="3">Heading level 3</Title>
        <Title :order="4" c="dimmed">Heading level 4 · dimmed</Title>
      </Stack>
    </DemoCard>

    <DemoCard name="Text" description="Body text with sizes, colors, weights and gradients.">
      <Stack gap="xs">
        <Text size="xl">Extra large body text</Text>
        <Text>Default paragraph text for reading comfort.</Text>
        <Text size="sm" c="dimmed">Small dimmed helper text.</Text>
        <Text :fw="700" c="blue">Bold and colored</Text>
        <Text variant="gradient" :gradient="{ from: 'grape', to: 'indigo' }" :fw="700" :fz="24">
          Gradient text
        </Text>
        <Text truncate style="max-width: 260px">
          This very long line will be truncated with an ellipsis when it exceeds its container
          width.
        </Text>
      </Stack>
    </DemoCard>

    <DemoCard name="Anchor" description="Styled, theme-aware link element.">
      <Group>
        <Anchor href="https://mantine-vue.dev" target="_blank">Default link</Anchor>
        <Anchor href="#" c="teal" underline="always">Always underlined</Anchor>
        <Anchor href="#" underline="never" :fw="600">Never underlined</Anchor>
      </Group>
    </DemoCard>

    <DemoCard name="Highlight & Mark" description="Emphasize substrings within text.">
      <Stack gap="xs">
        <Highlight :highlight="['Vue', 'accessible']">
          Mantine Vue is an accessible, fully featured Vue components library.
        </Highlight>
        <Text>
          You can also <Mark color="yellow">manually mark</Mark> or
          <Mark color="teal">colorize</Mark> specific words.
        </Text>
      </Stack>
    </DemoCard>

    <DemoCard name="Code" description="Inline and block code snippets.">
      <Stack gap="sm">
        <Text>Install with <Code>yarn add @mantine-vue/core</Code> to get started.</Text>
        <Code block
          >{{ "import { Button } from '@mantine-vue/core'\n\n<Button>Click me</Button>" }}</Code
        >
      </Stack>
    </DemoCard>

    <DemoCard name="Blockquote" description="Callout for quotations with optional citation.">
      <Blockquote color="blue" :icon="h(PhInfo, { size: 20 })" cite="– Mantine docs" radius="md">
        A great components library gets out of your way and lets you focus on building your product.
      </Blockquote>
    </DemoCard>

    <DemoCard name="Typography" description="Applies coherent styles to raw HTML content.">
      <Typography>
        <h3>Article heading</h3>
        <p>
          The Typography component styles nested HTML — headings, paragraphs,
          <a href="#">links</a>, lists and more — so rendered markup looks consistent.
        </p>
        <ul>
          <li>Automatically styled list item</li>
          <li>Another styled list item</li>
        </ul>
      </Typography>
    </DemoCard>
  </Stack>
</template>
