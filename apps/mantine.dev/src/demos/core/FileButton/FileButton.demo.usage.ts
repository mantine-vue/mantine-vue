import { defineComponent, h, ref } from 'vue'
import { Button, FileButton, Group, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { FileButton, Button, Group, Text } from '@mantine-vue/core'

const file = ref<File | null>(null)
</script>

<template>
  <Group justify="center">
    <FileButton :onChange="(f) => file = f" accept="image/png,image/jpeg">
      <template #default="{ onClick }">
        <Button @click="onClick">Upload image</Button>
      </template>
    </FileButton>
  </Group>

  <Text v-if="file" size="sm" ta="center" mt="sm">
    Picked file: {{ file.name }}
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'FileButtonUsageDemo',
  setup() {
    const file = ref<File | null>(null)
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
                    file.value = Array.isArray(f) ? (f[0] ?? null) : f
                  },
                  accept: 'image/png,image/jpeg',
                },
                {
                  default: ({ onClick }: { onClick: () => void }) =>
                    h(Button, { onClick }, { default: () => 'Upload image' }),
                },
              ),
          },
        ),
        file.value
          ? h(
              Text,
              { size: 'sm', ta: 'center', mt: 'sm' },
              { default: () => `Picked file: ${file.value!.name}` },
            )
          : null,
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
