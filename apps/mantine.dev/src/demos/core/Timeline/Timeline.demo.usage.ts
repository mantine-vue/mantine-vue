import { defineComponent, h } from 'vue'
import { Box, Text, Timeline } from '@mantine-vue/core'
import { PhChatCircleDots, PhGitBranch, PhGitCommit, PhGitPullRequest } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, Timeline } from '@mantine-vue/core'
import { PhGitBranch, PhGitCommit, PhGitPullRequest, PhChatCircleDots } from '@phosphor-icons/vue'
</script>

<template>
  <Timeline :active="1" :bulletSize="24" :lineWidth="2">
    <Timeline.Item :bullet="h(PhGitBranch, { size: 12 })" title="New branch">
      <Text c="dimmed" size="sm">
        You've created new branch
        <Text c="blue" component="span" inherit>fix-notifications</Text>
        from master
      </Text>
      <Text size="xs" :mt="4">2 hours ago</Text>
    </Timeline.Item>

    <Timeline.Item :bullet="h(PhGitCommit, { size: 12 })" title="Commits">
      <Text c="dimmed" size="sm">
        You've pushed 23 commits to
        <Text c="blue" component="span" inherit>fix-notifications</Text>
        branch
      </Text>
      <Text size="xs" :mt="4">52 minutes ago</Text>
    </Timeline.Item>

    <Timeline.Item title="Pull request" :bullet="h(PhGitPullRequest, { size: 12 })" lineVariant="dashed">
      <Text c="dimmed" size="sm">
        You've submitted a pull request
        <Text c="blue" component="span" inherit>Fix incorrect notification message (#187)</Text>
      </Text>
      <Text size="xs" :mt="4">34 minutes ago</Text>
    </Timeline.Item>

    <Timeline.Item title="Code review" :bullet="h(PhChatCircleDots, { size: 12 })">
      <Text c="dimmed" size="sm">
        <Text c="blue" component="span" inherit>Robert Gluesticker</Text>
        left a code review on your pull request
      </Text>
      <Text size="xs" :mt="4">12 minutes ago</Text>
    </Timeline.Item>
  </Timeline>
</template>
`

const Demo = defineComponent({
  name: 'TimelineUsageDemo',
  setup() {
    return () =>
      h(
        Box,
        { maw: 320, mx: 'auto' },
        {
          default: () =>
            h(
              Timeline,
              { active: 1, bulletSize: 24, lineWidth: 2 },
              {
                default: () => [
                  h(
                    Timeline.Item,
                    { bullet: h(PhGitBranch, { size: 12 }), title: 'New branch' },
                    {
                      default: () => [
                        h(
                          Text,
                          { c: 'dimmed', size: 'sm' },
                          {
                            default: () => [
                              "You've created new branch ",
                              h(
                                Text,
                                { c: 'blue', component: 'span', inherit: true },
                                { default: () => 'fix-notifications' },
                              ),
                              ' from master',
                            ],
                          },
                        ),
                        h(Text, { size: 'xs', mt: 4 }, { default: () => '2 hours ago' }),
                      ],
                    },
                  ),
                  h(
                    Timeline.Item,
                    { bullet: h(PhGitCommit, { size: 12 }), title: 'Commits' },
                    {
                      default: () => [
                        h(
                          Text,
                          { c: 'dimmed', size: 'sm' },
                          {
                            default: () => [
                              "You've pushed 23 commits to ",
                              h(
                                Text,
                                { c: 'blue', component: 'span', inherit: true },
                                { default: () => 'fix-notifications' },
                              ),
                              ' branch',
                            ],
                          },
                        ),
                        h(Text, { size: 'xs', mt: 4 }, { default: () => '52 minutes ago' }),
                      ],
                    },
                  ),
                  h(
                    Timeline.Item,
                    {
                      bullet: h(PhGitPullRequest, { size: 12 }),
                      title: 'Pull request',
                      lineVariant: 'dashed',
                    },
                    {
                      default: () => [
                        h(
                          Text,
                          { c: 'dimmed', size: 'sm' },
                          {
                            default: () => [
                              "You've submitted a pull request ",
                              h(
                                Text,
                                { c: 'blue', component: 'span', inherit: true },
                                { default: () => 'Fix incorrect notification message (#187)' },
                              ),
                            ],
                          },
                        ),
                        h(Text, { size: 'xs', mt: 4 }, { default: () => '34 minutes ago' }),
                      ],
                    },
                  ),
                  h(
                    Timeline.Item,
                    { bullet: h(PhChatCircleDots, { size: 12 }), title: 'Code review' },
                    {
                      default: () => [
                        h(
                          Text,
                          { c: 'dimmed', size: 'sm' },
                          {
                            default: () => [
                              h(
                                Text,
                                { c: 'blue', component: 'span', inherit: true },
                                { default: () => 'Robert Gluesticker' },
                              ),
                              ' left a code review on your pull request',
                            ],
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
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
