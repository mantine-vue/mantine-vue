import { defineComponent, h } from 'vue'
import { Anchor, Avatar, Group, HoverCard, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { Anchor, Avatar, Group, HoverCard, Stack, Text } from '@mantine-vue/core'
</script>

<template>
  <Group justify="center">
    <HoverCard :width="320" shadow="md" with-arrow :open-delay="200" :close-delay="400">
      <HoverCard.Target>
        <Avatar src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4" radius="xl" />
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Group>
          <Avatar src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4" radius="xl" />
          <Stack :gap="5">
            <Text size="sm" fw="700" :style="{ lineHeight: 1 }">Mantine</Text>
            <Anchor
              href="https://x.com/mantinedev"
              c="dimmed"
              size="xs"
              :style="{ lineHeight: 1 }"
            >
              @mantinedev
            </Anchor>
          </Stack>
        </Group>

        <Text size="sm" mt="md">
          Customizable Vue components and hooks library with focus on usability, accessibility
          and developer experience
        </Text>

        <Group mt="md" gap="xl">
          <Text size="sm"><b>0</b> Following</Text>
          <Text size="sm"><b>1,174</b> Followers</Text>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'HoverCardProfileDemo',
  setup() {
    const avatarSrc = 'https://avatars.githubusercontent.com/u/79146003?s=200&v=4'

    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(
              HoverCard,
              { width: 320, shadow: 'md', withArrow: true, openDelay: 200, closeDelay: 400 },
              {
                default: () => [
                  h(HoverCard.Target, null, {
                    default: () => h(Avatar, { src: avatarSrc, radius: 'xl' }),
                  }),
                  h(HoverCard.Dropdown, null, {
                    default: () => [
                      h(Group, null, {
                        default: () => [
                          h(Avatar, { src: avatarSrc, radius: 'xl' }),
                          h(
                            Stack,
                            { gap: 5 },
                            {
                              default: () => [
                                h(
                                  Text,
                                  { size: 'sm', fw: 700, style: { lineHeight: 1 } },
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
                          'Customizable Vue components and hooks library with focus on usability, accessibility and developer experience',
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
            ),
          ],
        },
      )
  },
})

export const profile: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
