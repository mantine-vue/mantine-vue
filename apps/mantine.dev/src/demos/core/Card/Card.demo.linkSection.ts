import { defineComponent, h } from 'vue'
import { Badge, Button, Card, Group, Image, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Card, Image, Text, Badge, Button, Group } from '@mantine-vue/core'
</script>

<template>
  <Card shadow="sm" padding="lg" withBorder>
    <Card.Section component="a" href="https://mantine-vue/">
      <Image
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
        :height="160"
        alt="Norway"
      />
    </Card.Section>

    <Group justify="space-between" mt="md" mb="xs">
      <Text :fw="500">Norway Fjord Adventures</Text>
      <Badge color="pink">On Sale</Badge>
    </Group>

    <Text size="sm" c="dimmed">
      With Fjord Tours you can explore more of the magical fjord landscapes with tours and
      activities on and around the fjords of Norway
    </Text>

    <Button color="blue" fullWidth mt="md">
      Book classic tour now
    </Button>
  </Card>
</template>
`

const Demo = defineComponent({
  name: 'CardLinkSectionDemo',
  setup() {
    return () =>
      h(
        Card,
        { shadow: 'sm', padding: 'lg', withBorder: true },
        {
          default: () => [
            h(
              Card.Section,
              { component: 'a', href: 'https://mantine-vue/' },
              {
                default: () =>
                  h(Image, {
                    src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png',
                    height: 160,
                    alt: 'Norway',
                  }),
              },
            ),
            h(
              Group,
              { justify: 'space-between', mt: 'md', mb: 'xs' },
              {
                default: () => [
                  h(Text, { fw: 500 }, { default: () => 'Norway Fjord Adventures' }),
                  h(Badge, { color: 'pink' }, { default: () => 'On Sale' }),
                ],
              },
            ),
            h(
              Text,
              { size: 'sm', c: 'dimmed' },
              {
                default: () =>
                  'With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway',
              },
            ),
            h(
              Button,
              { color: 'blue', fullWidth: true, mt: 'md' },
              { default: () => 'Book classic tour now' },
            ),
          ],
        },
      )
  },
})

export const linkSection: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  maxWidth: 340,
  dimmed: true,
  code,
}
