import { defineComponent, h, ref } from 'vue'
import { Button, FileButton, Group, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { FileButton, Button, Group, Text } from '@mantine-vue/core'

const files = ref<File[]>([])
</script>

<template>
  <Group justify="center">
    <FileButton :onChange="(f) => files = f" accept="image/png,image/jpeg" multiple>
      <template #default="{ onClick }">
        <Button @click="onClick">Upload images</Button>
      </template>
    </FileButton>
  </Group>

  <Text v-if="files.length > 0" size="sm" mt="sm">Picked files:</Text>
  <ul>
    <li v-for="(f, i) in files" :key="i">{{ f.name }}</li>
  </ul>
</template>
`

const Demo = defineComponent({
  name: 'FileButtonMultipleDemo',
  setup() {
    const files = ref<File[]>([])
    return () =>
      h('div', [
        h(
          Group,
          { justify: 'center' },
          {
            default: () =>
              h(
                FileButton,
                {
                  onChange: (f: File | File[] | null) => {
                    files.value = Array.isArray(f) ? f : []
                  },
                  accept: 'image/png,image/jpeg',
                  multiple: true,
                },
                {
                  default: ({ onClick }: { onClick: () => void }) =>
                    h(Button, { onClick }, { default: () => 'Upload images' }),
                },
              ),
          },
        ),
        files.value.length > 0
          ? h(Text, { size: 'sm', mt: 'sm' }, { default: () => 'Picked files:' })
          : null,
        h(
          'ul',
          files.value.map((f, i) => h('li', { key: i }, f.name)),
        ),
      ])
  },
})

export const multiple: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
