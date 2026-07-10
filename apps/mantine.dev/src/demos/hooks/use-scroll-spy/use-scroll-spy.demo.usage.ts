import { defineComponent, h } from 'vue'
import { Text, UnstyledButton } from '@mantine-vue/core'
import { useScrollSpy } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, UnstyledButton } from '@mantine-vue/core'
import { useScrollSpy } from '@mantine-vue/hooks'

const spy = useScrollSpy({
  selector: '#mdx :is(h1, h2, h3, h4, h5, h6)',
})
</script>

<template>
  <div>
    <Text>Scroll to heading:</Text>
    <ul style="margin: 0; padding: 0;">
      <li
        v-for="(heading, index) in spy.data.value"
        :key="heading.id"
        :style="{
          listStylePosition: 'inside',
          paddingInlineStart: heading.depth * 20 + 'px',
          background: index === spy.active.value ? 'var(--mantine-color-blue-light)' : undefined,
        }"
      >
        <UnstyledButton @click="heading.getNode().scrollIntoView()">
          {{ heading.value }}
        </UnstyledButton>
      </li>
    </ul>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseScrollSpyUsageDemo',
  setup() {
    const spy = useScrollSpy({
      selector: '#mdx :is(h1, h2, h3, h4, h5, h6)',
    })

    return () =>
      h('div', [
        h(Text, () => 'Scroll to heading:'),
        h(
          'ul',
          { style: { margin: 0, padding: 0 } },
          spy.data.value.map((heading, index) =>
            h(
              'li',
              {
                key: heading.id,
                style: {
                  listStylePosition: 'inside',
                  paddingInlineStart: `${heading.depth * 20}px`,
                  background:
                    index === spy.active.value ? 'var(--mantine-color-blue-light)' : undefined,
                },
              },
              [
                h(
                  UnstyledButton,
                  { onClick: () => heading.getNode().scrollIntoView() },
                  { default: () => heading.value },
                ),
              ],
            ),
          ),
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
