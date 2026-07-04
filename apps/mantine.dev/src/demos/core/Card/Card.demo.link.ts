import { defineComponent, h } from 'vue'
import { Card, Image, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Card, Image, Text } from '@mantine-vue/core'
</script>

<template>
  <Card
    shadow="sm"
    padding="xl"
    component="a"
    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    target="_blank"
  >
    <Card.Section>
      <Image
        src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
        :h="160"
        alt="No way!"
      />
    </Card.Section>

    <Text :fw="500" size="lg" mt="md">
      You've won a million dollars in cash!
    </Text>

    <Text mt="xs" c="dimmed" size="sm">
      Please click anywhere on this card to claim your reward, this is not a fraud, trust us
    </Text>
  </Card>
</template>
`

const Demo = defineComponent({
  name: 'CardLinkDemo',
  setup() {
    return () =>
      h(
        Card,
        {
          shadow: 'sm',
          padding: 'lg',
          component: 'a',
          href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          target: '_blank',
        },
        {
          default: () => [
            h(
              Card.Section,
              {},
              {
                default: () =>
                  h(Image, {
                    src: 'https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80',
                    h: 160,
                    alt: 'No way!',
                  }),
              },
            ),
            h(
              Text,
              { fw: 500, size: 'lg', mt: 'md' },
              { default: () => "You've won a million dollars in cash!" },
            ),
            h(
              Text,
              { mt: 'xs', c: 'dimmed', size: 'sm' },
              {
                default: () =>
                  'Please click anywhere on this card to claim your reward, this is not a fraud, trust us',
              },
            ),
          ],
        },
      )
  },
})

export const link: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  maxWidth: 340,
  dimmed: true,
  code,
}
