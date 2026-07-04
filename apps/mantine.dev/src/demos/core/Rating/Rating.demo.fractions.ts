import { defineComponent, h } from 'vue'
import { Group, Rating, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Rating, Group, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Group>
      <div>Fractions: 2</div>
      <Rating :fractions="2" :default-value="1.5" />
    </Group>
    <Group>
      <div>Fractions: 3</div>
      <Rating :fractions="3" :default-value="2.33333333" />
    </Group>
    <Group>
      <div>Fractions: 4</div>
      <Rating :fractions="4" :default-value="3.75" />
    </Group>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'RatingFractionsDemo',
  setup: () => () =>
    h(Stack, null, {
      default: () => [
        h(Group, null, {
          default: () => [
            h('div', null, 'Fractions: 2'),
            h(Rating, { fractions: 2, defaultValue: 1.5 }),
          ],
        }),
        h(Group, null, {
          default: () => [
            h('div', null, 'Fractions: 3'),
            h(Rating, { fractions: 3, defaultValue: 2.33333333 }),
          ],
        }),
        h(Group, null, {
          default: () => [
            h('div', null, 'Fractions: 4'),
            h(Rating, { fractions: 4, defaultValue: 3.75 }),
          ],
        }),
      ],
    }),
})

export const fractions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
