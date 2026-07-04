import { defineComponent, h } from 'vue'
import { SimpleGrid, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { makeItems } from './_demo-item'

const code = `
<script setup lang="ts">
import { SimpleGrid, Stack, Text } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <div>
      <Text mb="xs" fw="500">auto-fill</Text>
      <SimpleGrid minColWidth="200px" autoFlow="auto-fill">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </SimpleGrid>
    </div>
    <div>
      <Text mb="xs" fw="500">auto-fit</Text>
      <SimpleGrid minColWidth="200px" autoFlow="auto-fit">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </SimpleGrid>
    </div>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'SimpleGridAutoFlowDemo',
  setup() {
    const items = makeItems(3)
    return () =>
      h(Stack, {}, () => [
        h('div', {}, [
          h(Text, { mb: 'xs', fw: 500 }, { default: () => 'auto-fill' }),
          h(SimpleGrid, { minColWidth: '200px', autoFlow: 'auto-fill' }, () => items),
        ]),
        h('div', {}, [
          h(Text, { mb: 'xs', fw: 500 }, { default: () => 'auto-fit' }),
          h(SimpleGrid, { minColWidth: '200px', autoFlow: 'auto-fit' }, () => items),
        ]),
      ])
  },
})

export const autoFlow: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
