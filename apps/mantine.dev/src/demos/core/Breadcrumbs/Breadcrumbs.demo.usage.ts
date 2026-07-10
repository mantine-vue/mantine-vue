import { defineComponent, h } from 'vue'
import { Breadcrumbs, Anchor } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Breadcrumbs, Anchor } from '@mantine-vue/core'

const items = [
  { title: 'Mantine', href: '#' },
  { title: 'Mantine hooks', href: '#' },
  { title: 'use-id', href: '#' },
]
</script>

<template>
  <Breadcrumbs>
    <Anchor v-for="(item, index) in items" :key="index" :href="item.href">
      {{ item.title }}
    </Anchor>
  </Breadcrumbs>

  <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
    <Anchor v-for="(item, index) in items" :key="index" :href="item.href">
      {{ item.title }}
    </Anchor>
  </Breadcrumbs>
</template>
`

const items = [
  { title: 'Mantine', href: 'https://mantine-vue' },
  { title: 'Mantine hooks', href: '#' },
  { title: 'use-id', href: '#' },
]

const Demo = defineComponent({
  name: 'BreadcrumbsUsageDemo',
  setup() {
    const anchors = () =>
      items.map((item, index) =>
        h(Anchor, { key: index, href: item.href }, { default: () => item.title }),
      )

    return () =>
      h('div', {}, [
        h(Breadcrumbs, {}, anchors),
        h(Breadcrumbs, { separator: '→', separatorMargin: 'md', mt: 'xs' }, anchors),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
