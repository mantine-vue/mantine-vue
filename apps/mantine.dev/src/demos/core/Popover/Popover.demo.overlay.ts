import { defineComponent, h } from 'vue'
import { Anchor, Avatar, Group, Popover, Stack, Text, UnstyledButton } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Avatar, Text, Group, Anchor, Stack, UnstyledButton } from '@mantine-vue/core'
</script>

<template>
  <Popover
    :width="320"
    shadow="md"
    with-arrow
    with-overlay
    :overlay-props="{ zIndex: 10000, blur: '8px' }"
    :z-index="10001"
  >
    <Popover.Target>
      <UnstyledButton :style="{ zIndex: 10001, position: 'relative' }">
        <Avatar src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4" radius="xl" />
      </UnstyledButton>
    </Popover.Target>
    <Popover.Dropdown>
      <Group>
        <Avatar src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4" radius="xl" />
        <Stack :gap="5">
          <Text size="sm" fw="700" :style="{ lineHeight: 1 }">Mantine</Text>
          <Anchor href="https://x.com/mantinedev" c="dimmed" size="xs" :style="{ lineHeight: 1 }">
            @mantinedev
          </Anchor>
        </Stack>
      </Group>
      <Text size="sm" mt="md">
        Customizable React components and hooks library with focus on usability, accessibility and
        developer experience
      </Text>
      <Group mt="md" gap="xl">
        <Text size="sm"><b>0</b> Following</Text>
        <Text size="sm"><b>1,174</b> Followers</Text>
      </Group>
    </Popover.Dropdown>
  </Popover>
</template>
`

const Demo = defineComponent({
  name: 'PopoverOverlayDemo',
  setup() {
    return () =>
      h(
        Popover,
        {
          width: 320,
          shadow: 'md',
          withArrow: true,
          withOverlay: true,
          overlayProps: { zIndex: 10000, blur: '8px' },
          zIndex: 10001,
        },
        {
          default: () => [
            h(Popover.Target, null, {
              default: () =>
                h(
                  UnstyledButton,
                  { style: { zIndex: 10001, position: 'relative' } },
                  {
                    default: () =>
                      h(Avatar, {
                        src: 'https://avatars.githubusercontent.com/u/79146003?s=200&v=4',
                        radius: 'xl',
                      }),
                  },
                ),
            }),
            h(Popover.Dropdown, null, {
              default: () => [
                h(Group, null, {
                  default: () => [
                    h(Avatar, {
                      src: 'https://avatars.githubusercontent.com/u/79146003?s=200&v=4',
                      radius: 'xl',
                    }),
                    h(
                      Stack,
                      { gap: 5 },
                      {
                        default: () => [
                          h(
                            Text,
                            { size: 'sm', fw: '700', style: { lineHeight: 1 } },
                            () => 'Mantine',
                          ),
                          h(
                            Anchor,
                            {
                              href: 'https://x.com/mantinedev',
                              c: 'dimmed',
                              size: 'xs',
                              style: { lineHeight: 1 },
                            },
                            () => '@mantinedev',
                          ),
                        ],
                      },
                    ),
                  ],
                }),
                h(
                  Text,
                  { size: 'sm', mt: 'md' },
                  () =>
                    'Customizable React components and hooks library with focus on usability, accessibility and developer experience',
                ),
                h(
                  Group,
                  { mt: 'md', gap: 'xl' },
                  {
                    default: () => [
                      h(Text, { size: 'sm' }, () => [h('b', null, '0'), ' Following']),
                      h(Text, { size: 'sm' }, () => [h('b', null, '1,174'), ' Followers']),
                    ],
                  },
                ),
              ],
            }),
          ],
        },
      )
  },
})

export const overlay: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
