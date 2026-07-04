import { defineComponent, h } from 'vue'
import { Avatar, Text, ThemeIcon, Timeline } from '@mantine-vue/core'
import { PhSun, PhVideoCamera } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Text, ThemeIcon, Timeline } from '@mantine-vue/core'
import { PhSun, PhVideoCamera } from '@phosphor-icons/vue'
</script>

<template>
  <Timeline :bulletSize="24">
    <Timeline.Item title="Default bullet">
      <Text c="dimmed" size="sm">Default bullet without anything</Text>
    </Timeline.Item>

    <Timeline.Item
      title="Avatar"
      :bullet="h(Avatar, { size: 22, radius: 'xl', src: 'https://avatars0.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4' })"
    >
      <Text c="dimmed" size="sm">Timeline bullet as avatar image</Text>
    </Timeline.Item>

    <Timeline.Item title="Icon" :bullet="h(PhSun, { size: 13 })">
      <Text c="dimmed" size="sm">Timeline bullet as icon</Text>
    </Timeline.Item>

    <Timeline.Item
      title="ThemeIcon"
      :bullet="h(ThemeIcon, { size: 22, variant: 'gradient', gradient: { from: 'lime', to: 'cyan' }, radius: 'xl' }, { default: () => h(PhVideoCamera, { size: 13 }) })"
    >
      <Text c="dimmed" size="sm">Timeline bullet as ThemeIcon component</Text>
    </Timeline.Item>
  </Timeline>
</template>
`

const Demo = defineComponent({
  name: 'TimelineBulletDemo',
  setup() {
    return () =>
      h(
        Timeline,
        { bulletSize: 24 },
        {
          default: () => [
            h(
              Timeline.Item,
              { title: 'Default bullet' },
              {
                default: () =>
                  h(
                    Text,
                    { c: 'dimmed', size: 'sm' },
                    { default: () => 'Default bullet without anything' },
                  ),
              },
            ),
            h(
              Timeline.Item,
              {
                title: 'Avatar',
                bullet: h(Avatar, {
                  size: 22,
                  radius: 'xl',
                  src: 'https://avatars0.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4',
                }),
              },
              {
                default: () =>
                  h(
                    Text,
                    { c: 'dimmed', size: 'sm' },
                    { default: () => 'Timeline bullet as avatar image' },
                  ),
              },
            ),
            h(
              Timeline.Item,
              { title: 'Icon', bullet: h(PhSun, { size: 13 }) },
              {
                default: () =>
                  h(
                    Text,
                    { c: 'dimmed', size: 'sm' },
                    { default: () => 'Timeline bullet as icon' },
                  ),
              },
            ),
            h(
              Timeline.Item,
              {
                title: 'ThemeIcon',
                bullet: h(
                  ThemeIcon,
                  {
                    size: 22,
                    variant: 'gradient',
                    gradient: { from: 'lime', to: 'cyan' },
                    radius: 'xl',
                  },
                  {
                    default: () => h(PhVideoCamera, { size: 13 }),
                  },
                ),
              },
              {
                default: () =>
                  h(
                    Text,
                    { c: 'dimmed', size: 'sm' },
                    { default: () => 'Timeline bullet as ThemeIcon component' },
                  ),
              },
            ),
          ],
        },
      )
  },
})

export const bullet: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 320,
}
