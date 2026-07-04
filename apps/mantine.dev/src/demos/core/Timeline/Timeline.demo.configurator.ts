import { defineComponent, h } from 'vue'
import { Box, Text, Timeline } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Timeline } from '@mantine-vue/core'
</script>

<template>
  <Timeline{{props}}>
    <!-- items -->
  </Timeline>
</template>
`

const Wrapper = defineComponent({
  name: 'TimelineConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => {
      const { ...timelineAttrs } = attrs as any
      return h(
        Box,
        { maw: 320, mx: 'auto' },
        {
          default: () =>
            h(
              Timeline,
              { active: 1, bulletSize: 25, lineWidth: 4, ...timelineAttrs },
              {
                default: () => [
                  h(
                    Timeline.Item,
                    { title: 'New branch' },
                    {
                      default: () => [
                        h(
                          Text,
                          { c: 'dimmed', size: 'sm' },
                          {
                            default: () =>
                              "You've created new branch fix-notifications from master",
                          },
                        ),
                        h(Text, { size: 'xs', mt: 4 }, { default: () => '2 hours ago' }),
                      ],
                    },
                  ),
                  h(
                    Timeline.Item,
                    { title: 'Commits' },
                    {
                      default: () => [
                        h(
                          Text,
                          { c: 'dimmed', size: 'sm' },
                          { default: () => "You've pushed 23 commits to fix-notifications branch" },
                        ),
                        h(Text, { size: 'xs', mt: 4 }, { default: () => '52 minutes ago' }),
                      ],
                    },
                  ),
                  h(
                    Timeline.Item,
                    { title: 'Pull request', lineVariant: 'dashed' },
                    {
                      default: () => [
                        h(
                          Text,
                          { c: 'dimmed', size: 'sm' },
                          {
                            default: () =>
                              "You've submitted a pull request Fix incorrect notification message (#187)",
                          },
                        ),
                        h(Text, { size: 'xs', mt: 4 }, { default: () => '34 minutes ago' }),
                      ],
                    },
                  ),
                  h(
                    Timeline.Item,
                    { title: 'Code review' },
                    {
                      default: () => [
                        h(
                          Text,
                          { c: 'dimmed', size: 'sm' },
                          {
                            default: () =>
                              'Robert Gluesticker left a code review on your pull request',
                          },
                        ),
                        h(Text, { size: 'xs', mt: 4 }, { default: () => '12 minutes ago' }),
                      ],
                    },
                  ),
                ],
              },
            ),
        },
      )
    }
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    { prop: 'radius', type: 'size', initialValue: 'xl', libraryValue: 'xl' },
    { prop: 'active', type: 'number', initialValue: 1, libraryValue: null, min: -1, max: 3 },
    { prop: 'reverseActive', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'lineWidth', type: 'number', initialValue: 4, libraryValue: 4, min: 1, max: 6 },
    {
      prop: 'bulletSize',
      type: 'number',
      initialValue: 25,
      libraryValue: 20,
      min: 18,
      max: 40,
      step: 1,
    },
    {
      prop: 'align',
      type: 'segmented',
      data: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      initialValue: 'left',
      libraryValue: 'left',
    },
  ],
}
