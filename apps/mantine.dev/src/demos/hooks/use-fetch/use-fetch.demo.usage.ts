import { defineComponent, h } from 'vue'
import { Box, Button, Code, Group, LoadingOverlay, Text } from '@mantine-vue/core'
import { useFetch } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Box, Button, Code, Group, LoadingOverlay, Text } from '@mantine-vue/core'
import { useFetch } from '@mantine-vue/hooks'

interface Item {
  userId: number
  id: number
  title: string
  completed: boolean
}

const { data, loading, error, refetch, abort } = useFetch<Item[]>(
  'https://jsonplaceholder.typicode.com/todos/'
)
</script>

<template>
  <div>
    <Text v-if="error" c="red">{{ error.message }}</Text>

    <Group>
      <Button @click="refetch" color="blue">Refetch</Button>
      <Button @click="abort" color="red">Abort</Button>
    </Group>
    <Box pos="relative" mt="md">
      <Code block>{{ data ? JSON.stringify(data.slice(0, 3), null, 2) : 'Fetching' }}</Code>
      <LoadingOverlay :visible="loading" />
    </Box>
  </div>
</template>
`

interface Item {
  userId: number
  id: number
  title: string
  completed: boolean
}

const Demo = defineComponent({
  name: 'UseFetchUsageDemo',
  setup() {
    const { data, loading, error, refetch, abort } = useFetch<Item[]>(
      'https://jsonplaceholder.typicode.com/todos/',
    )

    return () =>
      h('div', [
        error.value ? h(Text, { c: 'red' }, () => error.value!.message) : null,
        h(Group, () => [
          h(Button, { onClick: refetch, color: 'blue' }, { default: () => 'Refetch' }),
          h(Button, { onClick: abort, color: 'red' }, { default: () => 'Abort' }),
        ]),
        h(Box, { pos: 'relative', mt: 'md' }, () => [
          h(Code, { block: true }, () =>
            data.value ? JSON.stringify(data.value.slice(0, 3), null, 2) : 'Fetching',
          ),
          h(LoadingOverlay, { visible: loading.value }),
        ]),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
